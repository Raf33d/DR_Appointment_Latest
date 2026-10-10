import 'dotenv/config'
import { connectDB, disconnectDB } from '../config/sqlite.js'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'

const apiUrl = 'http://127.0.0.1:4000'
const runId = Date.now()
const doctorEmail = `smoke.doctor.${runId}@example.com`
const patientEmail = `smoke.patient.${runId}@example.com`
const password = 'SmokeTest123!'

const check = (condition, message) => {
    if (!condition) throw new Error(message)
}

const request = async (pathname, { method = 'GET', body, headers = {} } = {}) => {
    const response = await fetch(`${apiUrl}${pathname}`, {
        method,
        headers: body instanceof FormData ? headers : { 'Content-Type': 'application/json', ...headers },
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    })
    const data = await response.json()
    check(response.ok && data.success, `${method} ${pathname}: ${data.message || response.status}`)
    return data
}

await connectDB()

try {
    const admin = await request('/api/admin/login', {
        method: 'POST',
        body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
    })

    const doctorData = {
        name: `Smoke Doctor ${runId}`,
        email: doctorEmail,
        password,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Automated local system verification',
        fees: 500,
        address: JSON.stringify({ line1: 'Dhaka', line2: 'Bangladesh' })
    }
    await request('/api/admin/add-doctor', {
        method: 'POST',
        body: doctorData,
        headers: { atoken: admin.token }
    })

    const adminDoctors = await request('/api/admin/all-doctors', {
        method: 'POST',
        body: {},
        headers: { atoken: admin.token }
    })
    const doctor = adminDoctors.doctors.find((item) => item.email === doctorEmail)
    check(doctor, 'New doctor was not returned to the admin panel')
    const publicDoctors = await request('/api/doctor/list')
    check(publicDoctors.doctors.some((item) => item._id === doctor._id), 'New doctor was not returned to patients')

    const patient = await request('/api/user/register', {
        method: 'POST',
        body: { name: 'Smoke Patient', email: patientEmail, password }
    })

    const profileForm = new FormData()
    profileForm.append('name', 'Smoke Patient Updated')
    profileForm.append('phone', '01700000000')
    profileForm.append('address', JSON.stringify({ line1: 'Dhaka', line2: 'Bangladesh' }))
    profileForm.append('dob', '1990-01-01')
    profileForm.append('gender', 'Male')
    await request('/api/user/update-profile', {
        method: 'POST',
        body: profileForm,
        headers: { token: patient.token }
    })

    const slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
    for (const slotTime of slots) {
        await request('/api/user/book-appointment', {
            method: 'POST',
            body: { docId: doctor._id, slotDate: '31-12-2099', slotTime },
            headers: { token: patient.token }
        })
    }

    let patientAppointments = await request('/api/user/appointments', { headers: { token: patient.token } })
    check(patientAppointments.appointments.length === 4, 'Patient appointment list is incomplete')
    const appointmentsByTime = Object.fromEntries(
        patientAppointments.appointments.map((appointment) => [appointment.slotTime, appointment])
    )
    const paidAppointmentId = appointmentsByTime['10:00 AM']._id

    await request('/api/user/payment-demo', {
        method: 'POST',
        body: { appointmentId: paidAppointmentId, paymentMethod: 'bkash' },
        headers: { token: patient.token }
    })
    const paymentCheck = await request('/api/user/appointments', { headers: { token: patient.token } })
    check(
        paymentCheck.appointments.find((item) => item._id === paidAppointmentId)?.payment,
        `Local payment status was not saved immediately: ${JSON.stringify(
            paymentCheck.appointments.map(({ _id, slotTime, payment }) => ({ _id, slotTime, payment }))
        )}`
    )

    const doctorLogin = await request('/api/doctor/login', {
        method: 'POST',
        body: { email: doctorEmail, password }
    })
    const doctorAppointments = await request('/api/doctor/appointments', {
        headers: { dtoken: doctorLogin.token }
    })
    check(doctorAppointments.appointments.length === 4, 'Doctor appointment list is incomplete')

    await request('/api/doctor/complete-appointment', {
        method: 'POST',
        body: { appointmentId: paidAppointmentId },
        headers: { dtoken: doctorLogin.token }
    })
    await request('/api/doctor/cancel-appointment', {
        method: 'POST',
        body: { appointmentId: appointmentsByTime['10:30 AM']._id },
        headers: { dtoken: doctorLogin.token }
    })
    await request('/api/user/cancel-appointment', {
        method: 'POST',
        body: { appointmentId: appointmentsByTime['11:00 AM']._id },
        headers: { token: patient.token }
    })
    await request('/api/admin/cancel-appointment', {
        method: 'POST',
        body: { appointmentId: appointmentsByTime['11:30 AM']._id },
        headers: { atoken: admin.token }
    })

    const doctorDashboard = await request('/api/doctor/dashboard', { headers: { dtoken: doctorLogin.token } })
    const adminDashboard = await request('/api/admin/dashboard', { headers: { atoken: admin.token } })
    check(doctorDashboard.dashData.appointments === 4, 'Doctor dashboard count is incorrect')
    check(adminDashboard.dashData.doctors >= 1, 'Admin dashboard count is incorrect')

    patientAppointments = await request('/api/user/appointments', { headers: { token: patient.token } })
    const finalAppointmentsById = Object.fromEntries(
        patientAppointments.appointments.map((appointment) => [appointment._id, appointment])
    )
    check(finalAppointmentsById[paidAppointmentId].payment, 'Local payment status was not saved')
    check(finalAppointmentsById[paidAppointmentId].paymentMethod === 'bkash', 'Payment method was not saved')
    check(finalAppointmentsById[paidAppointmentId].paymentReference, 'Payment reference was not saved')
    check(finalAppointmentsById[paidAppointmentId].isCompleted, 'Completion status was not saved')
    check(
        Object.values(finalAppointmentsById)
            .filter((item) => item._id !== paidAppointmentId)
            .every((item) => item.cancelled),
        'Cancellation status was not saved'
    )

    const updatedDoctor = await doctorModel.findById(doctor._id)
    check(updatedDoctor.slots_booked['31-12-2099'].length === 1, 'Cancelled slots were not released')

    console.log('Smoke test passed: SQLite, admin, doctor, patient, booking, demo payment, cancellation, and dashboards')
} finally {
    const doctor = await doctorModel.findOne({ email: doctorEmail })
    const patient = await userModel.findOne({ email: patientEmail })
    if (doctor) await appointmentModel.deleteMany({ docId: doctor._id.toString() })
    if (patient) await appointmentModel.deleteMany({ userId: patient._id.toString() })
    await doctorModel.deleteOne({ email: doctorEmail })
    await userModel.deleteOne({ email: patientEmail })
    await disconnectDB()
}
