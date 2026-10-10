import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { connectDB, disconnectDB, getPool } from '../config/mysql.js'

const mongoUri = process.env.MONGO_IMPORT_URI || 'mongodb://127.0.0.1:27018/MedBook'
const client = new MongoClient(mongoUri)
const mappings = {
  users: ['id', 'name', 'email', 'password', 'image', 'phone', 'address', 'gender', 'dob'],
  doctors: ['id', 'name', 'email', 'password', 'image', 'speciality', 'degree', 'experience', 'about', 'available', 'fees', 'address', 'date', 'slots_booked'],
  appointments: ['id', 'userId', 'docId', 'slotDate', 'slotTime', 'userData', 'docData', 'amount', 'date', 'cancelled', 'payment', 'paymentMethod', 'paymentDate', 'paymentReference', 'isCompleted']
}
const jsonFields = new Set(['address', 'slots_booked', 'userData', 'docData'])

const valueFor = (record, field) => {
  if (field === 'id') return String(record._id)
  const value = record[field]
  if (jsonFields.has(field)) return JSON.stringify(value ?? {})
  if (field === 'image') return value ?? ''
  if (field === 'available') return value ?? true
  if (field === 'slots_booked') return JSON.stringify(value ?? {})
  if (field === 'phone') return value ?? '00000000000'
  if (field === 'gender' || field === 'dob') return value ?? 'Not Selected'
  if (field === 'cancelled' || field === 'payment' || field === 'isCompleted') return value ?? false
  if (field === 'paymentMethod' || field === 'paymentReference') return value ?? ''
  if (field === 'paymentDate') return value ?? 0
  return value ?? null
}

try {
  await connectDB()
  await client.connect()
  const database = client.db()
  const pool = getPool()
  const totals = {}

  for (const [collectionName, columns] of Object.entries(mappings)) {
    const records = await database.collection(collectionName).find({}).toArray()
    let imported = 0
    for (const record of records) {
      const values = columns.map(field => valueFor(record, field))
      const insertColumns = columns.map(column => `\`${column}\``).join(', ')
      await pool.execute(
        `INSERT INTO \`${collectionName}\` (${insertColumns}) VALUES (${columns.map(() => '?').join(', ')}) ON DUPLICATE KEY UPDATE id = id`,
        values
      )
      imported += 1
    }
    totals[collectionName] = imported
  }

  console.log(`Mongo import complete: ${totals.users} patients, ${totals.doctors} doctors, ${totals.appointments} appointments`)
} finally {
  await client.close()
  await disconnectDB()
}
