// MedBook demo mode: a fake API that runs entirely in the browser.
//
// When the websites are built with VITE_DEMO_MODE=true, every axios request to
// /api/... is answered here instead of by the real backend. Data lives in the
// visitor's localStorage, so each visitor gets their own sandbox, and the patient
// website and the staff panel (same site, /admin) share it.
//
// No passwords here are real: they are public demo logins shown on the page.

const STORAGE_KEY = 'medbook-demo-db-v1'
export const DEMO_PASSWORD = 'demo1234'
export const DEMO_ADMIN_EMAIL = 'admin@medbook.demo'
export const DEMO_PATIENT_EMAIL = 'patient@medbook.demo'
export const DEMO_DOCTOR_EMAIL = 'nadia.rahman@medbook.demo'

// ---------- helpers ----------

const id = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join('')
const clone = (value) => JSON.parse(JSON.stringify(value))
const slotDateOf = (date) => `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
const slotTimeOf = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const avatar = (name) => {
  const initials = name.replace(/^Dr\.?\s+/i, '').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#e8f2ef"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="36" font-weight="600" fill="#0f766e" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// ---------- sample data ----------

const sampleDoctors = [
  ['Dr. Nadia Rahman', DEMO_DOCTOR_EMAIL, 'General physician', 'MBBS', '6 Years', 600, 'Focuses on preventive care, routine check-ups and managing long-term conditions such as diabetes and hypertension.', 'House 12, Road 5, Dhanmondi', 'Dhaka'],
  ['Dr. Farhana Akter', 'farhana.akter@medbook.demo', 'Gynecologist', 'MBBS, FCPS', '9 Years', 1000, 'Provides prenatal care, family planning advice and treatment for common gynaecological conditions.', 'Green Road', 'Dhaka'],
  ['Dr. Tanvir Hasan', 'tanvir.hasan@medbook.demo', 'Dermatologist', 'MBBS, DDV', '5 Years', 800, 'Treats acne, eczema, allergies and other skin, hair and nail problems for patients of all ages.', 'Gulshan Avenue', 'Dhaka'],
  ['Dr. Sabrina Chowdhury', 'sabrina.chowdhury@medbook.demo', 'Pediatricians', 'MBBS, DCH', '7 Years', 700, 'Cares for newborns, children and teenagers, including vaccinations, growth checks and common childhood illnesses.', 'Mirpur Road', 'Dhaka'],
  ['Dr. Imran Kabir', 'imran.kabir@medbook.demo', 'Neurologist', 'MBBS, MD (Neurology)', '11 Years', 1200, 'Diagnoses and treats headaches, epilepsy, stroke recovery and other conditions of the brain and nerves.', 'Panthapath', 'Dhaka'],
  ['Dr. Mahmudul Islam', 'mahmudul.islam@medbook.demo', 'Gastroenterologist', 'MBBS, MD (Gastro)', '8 Years', 1000, 'Treats digestive problems including acid reflux, IBS, liver disease and stomach pain.', 'Agrabad', 'Chattogram'],
  ['Dr. Rafiq Ahmed', 'rafiq.ahmed@medbook.demo', 'General physician', 'MBBS, FCPS (Medicine)', '14 Years', 900, 'Experienced in adult medicine, fevers, infections and long-term care for older patients.', 'Zindabazar', 'Sylhet'],
  ['Dr. Shirin Sultana', 'shirin.sultana@medbook.demo', 'Dermatologist', 'MBBS, MD (Dermatology)', '10 Years', 1100, 'Specialises in cosmetic dermatology, hair loss and long-term skin conditions such as psoriasis.', 'Banani', 'Dhaka']
]

const createSeed = () => {
  const now = Date.now()
  const doctors = sampleDoctors.map(([name, email, speciality, degree, experience, fees, about, line1, line2], index) => ({
    _id: id(), name, email, password: DEMO_PASSWORD, speciality, degree, experience, fees, about,
    available: index !== 6, address: { line1, line2 }, date: now - index * 86400000, slots_booked: {}
  }))

  const patient = {
    _id: id(), name: 'Ayesha Karim', email: DEMO_PATIENT_EMAIL, password: DEMO_PASSWORD,
    image: avatar('Ayesha Karim'), phone: '01712345678',
    address: { line1: 'Road 7, Uttara', line2: 'Dhaka' }, gender: 'Female', dob: '1994-03-18'
  }
  const otherPatients = ['Karim Uddin', 'Mitu Das', 'Sajid Hossain'].map((name, index) => ({
    _id: id(), name, email: `patient${index + 2}@medbook.demo`, password: DEMO_PASSWORD,
    image: avatar(name), phone: `0181234567${index}`,
    address: { line1: 'Mohammadpur', line2: 'Dhaka' }, gender: index === 1 ? 'Female' : 'Male', dob: `19${85 + index * 4}-0${index + 4}-12`
  }))
  const users = [patient, ...otherPatients]

  const appointments = []
  const book = (user, doctor, dayOffset, hour, minute, extra = {}) => {
    const when = new Date()
    when.setDate(when.getDate() + dayOffset)
    when.setHours(hour, minute, 0, 0)
    const slotDate = slotDateOf(when)
    const slotTime = slotTimeOf(when)
    const { password, slots_booked, email, ...docData } = doctor
    const { password: _p, ...userData } = user
    if (!extra.cancelled) doctor.slots_booked[slotDate] = [...(doctor.slots_booked[slotDate] || []), slotTime]
    appointments.push({
      _id: id(), userId: user._id, docId: doctor._id, slotDate, slotTime,
      userData: clone(userData), docData: clone(docData), amount: doctor.fees,
      date: now + dayOffset * 1000, cancelled: false, payment: false, paymentMethod: '',
      paymentDate: 0, paymentReference: '', isCompleted: false, ...extra
    })
  }

  const [nadia, farhana, tanvir, sabrina, imran] = doctors
  book(patient, nadia, -6, 11, 0, { isCompleted: true, payment: true, paymentMethod: 'bkash', paymentDate: now, paymentReference: 'DEMO-1001' })
  book(otherPatients[0], nadia, -3, 15, 30, { isCompleted: true })
  book(otherPatients[1], nadia, -1, 12, 0, { cancelled: true })
  book(patient, tanvir, 2, 10, 30)
  book(patient, sabrina, 4, 17, 0, { payment: true, paymentMethod: 'card', paymentDate: now, paymentReference: 'DEMO-1002' })
  book(otherPatients[2], nadia, 1, 16, 0)
  book(otherPatients[1], farhana, 3, 11, 30)
  book(otherPatients[0], imran, 5, 18, 0)

  return { users, doctors, appointments }
}

// ---------- storage ----------

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* storage blocked or corrupt: start fresh */ }
  const seed = createSeed()
  save(seed)
  return seed
}
const save = (db) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) } catch { /* ignore */ }
}

export const resetDemo = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    for (const key of ['token', 'aToken', 'dToken']) localStorage.removeItem(key)
  } catch { /* ignore */ }
}

// ---------- the fake API ----------

const ok = (data = {}) => ({ success: true, ...data })
const fail = (message) => ({ success: false, message })
const publicUser = ({ password, ...user }) => user
const doctorForList = ({ password, email, ...doctor }) => doctor
const doctorForAdmin = ({ password, ...doctor }) => doctor

const releaseSlot = (db, appointment) => {
  const doctor = db.doctors.find((d) => d._id === appointment.docId)
  const day = doctor?.slots_booked?.[appointment.slotDate]
  if (day) doctor.slots_booked[appointment.slotDate] = day.filter((time) => time !== appointment.slotTime)
}

const dashboardFor = (appointments) => ({
  appointments: appointments.length,
  latestAppointments: clone(appointments).reverse().slice(0, 5)
})

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const routes = {
  // ----- patients -----
  'POST /api/user/register': (db, { body }) => {
    const { name, email, password } = body
    if (!name || !email || !password) return fail('Please fill all fields')
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Invalid email format')
    if (password.length < 8) return fail('Weak password. Password must be at least 8 characters long.')
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return fail('An account with this email already exists')
    const user = { _id: id(), name, email, password, image: avatar(name), phone: '00000000000', address: { line1: 'Not Selected', line2: 'Not Selected' }, gender: 'Not Selected', dob: 'Not Selected' }
    db.users.push(user)
    return ok({ message: 'User registered successfully', token: `demo-user:${user._id}` })
  },
  'POST /api/user/login': (db, { body }) => {
    const user = db.users.find((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase())
    if (!user) return fail('User not found')
    if (user.password !== body.password) return fail('Invalid credentials')
    return ok({ message: 'User logged in successfully', token: `demo-user:${user._id}` })
  },
  'GET /api/user/get-profile': (db, { user }) => ok({ userData: publicUser(user) }),
  'POST /api/user/update-profile': async (db, { user, body }) => {
    const { name, phone, address, dob, gender, image } = body
    if (!name || !phone || !dob || !gender) return fail('Please fill all fields')
    Object.assign(user, { name, phone, dob, gender, address: typeof address === 'string' ? JSON.parse(address) : address })
    if (image instanceof File) {
      if (image.size > 2 * 1024 * 1024) return fail('Image must be 2 MB or smaller')
      user.image = await readFile(image)
    }
    return ok({ message: 'Profile updated successfully' })
  },
  'POST /api/user/book-appointment': (db, { user, body }) => {
    const { docId, slotDate, slotTime } = body
    if (!docId || !slotDate || !slotTime) return fail('Please select an appointment date and time')
    const doctor = db.doctors.find((d) => d._id === docId)
    if (!doctor) return fail('Doctor not found')
    if (!doctor.available) return fail('Doctor is not available')
    const day = doctor.slots_booked[slotDate] || []
    if (day.includes(slotTime)) return fail('Slot already booked')
    doctor.slots_booked[slotDate] = [...day, slotTime]
    const { password, slots_booked, email, ...docData } = doctor
    db.appointments.push({
      _id: id(), userId: user._id, docId, slotDate, slotTime,
      userData: clone(publicUser(user)), docData: clone(docData), amount: doctor.fees,
      date: Date.now(), cancelled: false, payment: false, paymentMethod: '', paymentDate: 0,
      paymentReference: '', isCompleted: false
    })
    return ok({ message: 'Appointment booked successfully' })
  },
  'GET /api/user/appointments': (db, { user }) => ok({ appointments: db.appointments.filter((a) => a.userId === user._id) }),
  'POST /api/user/cancel-appointment': (db, { user, body }) => {
    const appointment = db.appointments.find((a) => a._id === body.appointmentId)
    if (!appointment) return fail('Appointment not found')
    if (appointment.userId !== user._id) return fail('You are not authorized to cancel this appointment')
    appointment.cancelled = true
    releaseSlot(db, appointment)
    return ok({ message: 'Appointment cancelled successfully' })
  },
  'POST /api/user/payment-demo': (db, { user, body }) => {
    const { appointmentId, paymentMethod } = body
    if (!['bkash', 'nagad', 'card'].includes(paymentMethod)) return fail('Please select a valid payment method')
    const appointment = db.appointments.find((a) => a._id === appointmentId && a.userId === user._id)
    if (!appointment) return fail('Appointment not found')
    if (appointment.cancelled) return fail('Cancelled appointments cannot be paid')
    if (appointment.payment) return fail('This appointment is already paid')
    const reference = `DEMO-${Date.now()}-${appointment._id.slice(-6).toUpperCase()}`
    Object.assign(appointment, { payment: true, paymentMethod, paymentDate: Date.now(), paymentReference: reference })
    return ok({ message: 'Demo payment completed successfully', reference })
  },

  // ----- doctors -----
  'GET /api/doctor/list': (db) => ok({ doctors: db.doctors.map(doctorForList) }),
  'POST /api/doctor/login': (db, { body }) => {
    const doctor = db.doctors.find((d) => d.email.toLowerCase() === String(body.email || '').toLowerCase())
    if (!doctor || doctor.password !== body.password) return fail('Invalid Credentials')
    return ok({ token: `demo-doctor:${doctor._id}` })
  },
  'GET /api/doctor/appointments': (db, { doctor }) => ok({ appointments: db.appointments.filter((a) => a.docId === doctor._id) }),
  'POST /api/doctor/complete-appointment': (db, { doctor, body }) => {
    const appointment = db.appointments.find((a) => a._id === body.appointmentId && a.docId === doctor._id)
    if (!appointment) return fail('Appointment not found')
    if (appointment.cancelled) return fail('Cancelled appointments cannot be completed')
    appointment.isCompleted = true
    return ok({ message: 'Marked as completed' })
  },
  'POST /api/doctor/cancel-appointment': (db, { doctor, body }) => {
    const appointment = db.appointments.find((a) => a._id === body.appointmentId && a.docId === doctor._id)
    if (!appointment) return fail('Cancellation Failed')
    appointment.cancelled = true
    releaseSlot(db, appointment)
    return ok({ message: 'Appointment Cancelled' })
  },
  'GET /api/doctor/dashboard': (db, { doctor }) => {
    const mine = db.appointments.filter((a) => a.docId === doctor._id)
    const earnings = mine.reduce((sum, a) => sum + (a.isCompleted || a.payment ? Number(a.amount) || 0 : 0), 0)
    return ok({ dashData: { earnings, patients: new Set(mine.map((a) => a.userId)).size, ...dashboardFor(mine) } })
  },
  'GET /api/doctor/profile': (db, { doctor }) => ok({ profileData: doctorForAdmin(doctor) }),
  'POST /api/doctor/update-profile': (db, { doctor, body }) => {
    const { address, fees, available } = body
    doctor.address = { ...doctor.address, ...(address || {}) }
    if (fees !== undefined) doctor.fees = Number(fees)
    if (available !== undefined) doctor.available = Boolean(available)
    return ok({ message: 'Profile updated successfully' })
  },

  // ----- admin -----
  'POST /api/admin/login': (db, { body }) => {
    if (String(body.email || '').toLowerCase() === DEMO_ADMIN_EMAIL && body.password === DEMO_PASSWORD) {
      return ok({ token: 'demo-admin' })
    }
    return fail('Invalid email or password')
  },
  'POST /api/admin/add-doctor': (db, { body }) => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = body
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) return fail('Missing required fields')
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Please enter a valid email')
    if (password.length < 8) return fail('Password must be at least 8 characters long')
    if (db.doctors.some((d) => d.email.toLowerCase() === email.toLowerCase())) return fail('A doctor with this email already exists')
    db.doctors.push({
      _id: id(), name, email, password, speciality, degree, experience, about, fees: Number(fees),
      available: true, address: typeof address === 'string' ? JSON.parse(address) : address, date: Date.now(), slots_booked: {}
    })
    return ok({ message: 'Doctor added successfully' })
  },
  'POST /api/admin/all-doctors': (db) => ok({ doctors: db.doctors.map(doctorForAdmin) }),
  'POST /api/admin/change-availability': (db, { body }) => {
    const doctor = db.doctors.find((d) => d._id === body.docId)
    if (!doctor) return fail('Doctor not found')
    doctor.available = !doctor.available
    return ok({ message: 'Doctor availability updated' })
  },
  'GET /api/admin/appointments': (db) => ok({ appointments: db.appointments }),
  'POST /api/admin/cancel-appointment': (db, { body }) => {
    const appointment = db.appointments.find((a) => a._id === body.appointmentId)
    if (!appointment) return fail('Appointment not found')
    appointment.cancelled = true
    releaseSlot(db, appointment)
    return ok({ message: 'Appointment cancelled successfully' })
  },
  'GET /api/admin/dashboard': (db) => ok({
    dashData: { doctors: db.doctors.length, patients: db.users.length, ...dashboardFor(db.appointments) }
  })
}

const header = (config, name) => {
  const headers = config.headers || {}
  if (typeof headers.get === 'function') return headers.get(name) ?? undefined
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase())
  return key ? headers[key] : undefined
}

const parseBody = (data) => {
  if (!data) return {}
  if (data instanceof FormData) return Object.fromEntries(data.entries())
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return {} }
  }
  return data
}

const handle = async (config) => {
  const url = new URL(config.url, window.location.origin)
  const key = `${(config.method || 'get').toUpperCase()} ${url.pathname}`
  const route = routes[key]
  if (!route) return { status: 404, data: fail(`Demo mode has no handler for ${key}`) }

  const db = load()
  const context = { body: parseBody(config.data) }

  if (url.pathname.startsWith('/api/user/') && !/\/(register|login)$/.test(url.pathname)) {
    const userId = String(header(config, 'token') || '').replace('demo-user:', '')
    context.user = db.users.find((u) => u._id === userId)
    if (!context.user) return { status: 200, data: fail('Not Authorized Login Again') }
  }
  if (url.pathname.startsWith('/api/doctor/') && !/\/(list|login)$/.test(url.pathname)) {
    const doctorId = String(header(config, 'dToken') || '').replace('demo-doctor:', '')
    context.doctor = db.doctors.find((d) => d._id === doctorId)
    if (!context.doctor) return { status: 200, data: fail('Not Authorized Login Again') }
  }
  if (url.pathname.startsWith('/api/admin/') && !url.pathname.endsWith('/login')) {
    if (header(config, 'aToken') !== 'demo-admin') return { status: 200, data: fail('Not Authorized Login Again') }
  }

  const data = await route(db, context)
  save(db)
  return { status: 200, data: clone(data) }
}

// Point axios at the fake API. Call once, before the app renders.
export const installMockApi = (axios) => {
  axios.defaults.adapter = async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 200))
    const { status, data } = await handle(config)
    const response = { data, status, statusText: status === 200 ? 'OK' : 'Not Found', headers: {}, config, request: {} }
    if (status >= 400) {
      const error = new Error(`Request failed with status code ${status}`)
      error.response = response
      error.config = config
      throw error
    }
    return response
  }
}
