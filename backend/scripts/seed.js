// Adds a set of sample doctors so a fresh deployment isn't empty.
// Safe to run more than once: doctors whose email already exists are skipped.
//
//   SEED_DOCTOR_PASSWORD=some-password npm run seed
//
// Works against whichever database the backend is configured for
// (local file, or Turso when TURSO_DATABASE_URL is set).
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { connectDB, disconnectDB } from '../config/sqlite.js'
import doctorModel from '../models/doctorModel.js'

const password = process.env.SEED_DOCTOR_PASSWORD
if (!password || password.length < 8) {
    console.error('Set SEED_DOCTOR_PASSWORD (at least 8 characters) before running the seed.')
    process.exit(1)
}

const sampleDoctors = [
    {
        name: 'Dr. Nadia Rahman', email: 'nadia.rahman@medbook.demo', speciality: 'General physician',
        degree: 'MBBS', experience: '6 Years', fees: 600,
        about: 'Focuses on preventive care, routine check-ups and managing long-term conditions such as diabetes and hypertension.',
        address: { line1: 'House 12, Road 5, Dhanmondi', line2: 'Dhaka' }
    },
    {
        name: 'Dr. Farhana Akter', email: 'farhana.akter@medbook.demo', speciality: 'Gynecologist',
        degree: 'MBBS, FCPS', experience: '9 Years', fees: 1000,
        about: 'Provides prenatal care, family planning advice and treatment for common gynaecological conditions.',
        address: { line1: 'Green Road', line2: 'Dhaka' }
    },
    {
        name: 'Dr. Tanvir Hasan', email: 'tanvir.hasan@medbook.demo', speciality: 'Dermatologist',
        degree: 'MBBS, DDV', experience: '5 Years', fees: 800,
        about: 'Treats acne, eczema, allergies and other skin, hair and nail problems for patients of all ages.',
        address: { line1: 'Gulshan Avenue', line2: 'Dhaka' }
    },
    {
        name: 'Dr. Sabrina Chowdhury', email: 'sabrina.chowdhury@medbook.demo', speciality: 'Pediatricians',
        degree: 'MBBS, DCH', experience: '7 Years', fees: 700,
        about: 'Cares for newborns, children and teenagers, including vaccinations, growth checks and common childhood illnesses.',
        address: { line1: 'Mirpur Road', line2: 'Dhaka' }
    },
    {
        name: 'Dr. Imran Kabir', email: 'imran.kabir@medbook.demo', speciality: 'Neurologist',
        degree: 'MBBS, MD (Neurology)', experience: '11 Years', fees: 1200,
        about: 'Diagnoses and treats headaches, epilepsy, stroke recovery and other conditions of the brain and nerves.',
        address: { line1: 'Panthapath', line2: 'Dhaka' }
    },
    {
        name: 'Dr. Mahmudul Islam', email: 'mahmudul.islam@medbook.demo', speciality: 'Gastroenterologist',
        degree: 'MBBS, MD (Gastro)', experience: '8 Years', fees: 1000,
        about: 'Treats digestive problems including acid reflux, IBS, liver disease and stomach pain.',
        address: { line1: 'Agrabad', line2: 'Chattogram' }
    }
]

await connectDB()
try {
    const hashedPassword = await bcrypt.hash(password, 10)
    let added = 0
    for (const doctor of sampleDoctors) {
        if (await doctorModel.findOne({ email: doctor.email })) {
            console.log(`skip  ${doctor.email} (already exists)`)
            continue
        }
        await new doctorModel({ ...doctor, password: hashedPassword, date: Date.now() }).save()
        console.log(`added ${doctor.name} (${doctor.speciality})`)
        added += 1
    }
    console.log(`\nDone: ${added} doctor(s) added. They log in to the staff panel with SEED_DOCTOR_PASSWORD.`)
} finally {
    await disconnectDB()
}
