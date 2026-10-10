import validator from 'validator';
import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';


//API to register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please fill all fields' });
        }

        //validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email format' });
        }


        //validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: 'Weak password. Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.' });
        }

        //hashing user password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ success: true, message: 'User registered successfully', token });

    } catch (error) {

        res.status(500).json({ success: false, message: error.message });

    }
};

//API for user login

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bycrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, message: 'User logged in successfully', token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }



}


//API to get user profile data

const getProfile = async (req, res) => {
    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

//API to update user profile

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        // Validate input
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Please fill all fields" });
        }

        // Update user data
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });


        if (imageFile) {
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }
        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

//API to book appointment
const bookAppointment = async (req, res) => {
    try {

        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: 'Please select an appointment date and time' });
        }

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor is not available' });
        }

        let slots_booked = docData.slots_booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot already booked' });
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password');

        const doctorSnapshot = docData.toObject();
        delete doctorSnapshot.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: doctorSnapshot,
            amount: docData.fees,
            slotTime,
            slotDate,
            amount: docData.fees,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        res.json({ success: true, message: 'Appointment booked successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId; // Use userId from auth middleware
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId; // Get from auth middleware, not req.body
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
            doctorData.markModified('slots_booked');
            await doctorData.save();
        }

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const paymentDemo = async (req, res) => {
    const { appointmentId, paymentMethod } = req.body;
    try {
        const supportedMethods = ['bkash', 'nagad', 'card'];
        if (!supportedMethods.includes(paymentMethod)) {
            return res.json({ success: false, message: 'Please select a valid payment method' });
        }

        const appointment = await appointmentModel.findOne({ _id: appointmentId, userId: req.userId });

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }
        if (appointment.cancelled) {
            return res.json({ success: false, message: 'Cancelled appointments cannot be paid' });
        }
        if (appointment.payment) {
            return res.json({ success: false, message: 'This appointment is already paid' });
        }

        const paymentReference = `DEMO-${Date.now()}-${appointment._id.toString().slice(-6).toUpperCase()}`;

        const paidAppointment = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId, userId: req.userId, cancelled: false, payment: false },
            {
                $set: {
                    payment: true,
                    paymentMethod,
                    paymentDate: Date.now(),
                    paymentReference
                }
            },
            { new: true }
        );
        if (!paidAppointment?.payment) {
            return res.json({ success: false, message: 'Unable to record payment' });
        }
        res.json({
            success: true,
            message: 'Demo payment completed successfully',
            reference: paymentReference
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

   



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentDemo }; 
