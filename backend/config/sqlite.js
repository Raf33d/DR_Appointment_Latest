import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const databasePath = path.resolve(directory, '..', process.env.DATABASE_FILE || 'data/medbook.db')
mkdirSync(path.dirname(databasePath), { recursive: true })

const database = new Database(databasePath, { timeout: 5000 })
database.pragma('journal_mode = DELETE')
database.pragma('foreign_keys = ON')

const tables = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '00000000000',
    address TEXT NOT NULL DEFAULT '{}',
    gender TEXT NOT NULL DEFAULT 'Not Selected',
    dob TEXT NOT NULL DEFAULT 'Not Selected',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    speciality TEXT NOT NULL,
    degree TEXT NOT NULL,
    experience TEXT NOT NULL,
    about TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,
    fees NUMERIC NOT NULL,
    address TEXT NOT NULL DEFAULT '{}',
    date INTEGER NOT NULL,
    slots_booked TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    docId TEXT NOT NULL,
    slotDate TEXT NOT NULL,
    slotTime TEXT NOT NULL,
    userData TEXT NOT NULL,
    docData TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date INTEGER NOT NULL,
    cancelled INTEGER NOT NULL DEFAULT 0,
    payment INTEGER NOT NULL DEFAULT 0,
    paymentMethod TEXT NOT NULL DEFAULT '',
    paymentDate INTEGER NOT NULL DEFAULT 0,
    paymentReference TEXT NOT NULL DEFAULT '',
    isCompleted INTEGER NOT NULL DEFAULT 0,
    active_slot_key TEXT GENERATED ALWAYS AS (
      CASE WHEN cancelled = 0 THEN docId || '|' || slotDate || '|' || slotTime ELSE NULL END
    ) STORED
  )`
]

for (const table of tables) database.exec(table)
if (database.pragma('table_info(doctors)').some((column) => column.name === 'image')) {
  database.exec('ALTER TABLE doctors DROP COLUMN image')
}
database.exec(`
  UPDATE appointments
  SET docData = json_remove(docData, '$.image')
  WHERE json_valid(docData) AND json_type(docData, '$.image') IS NOT NULL;
`)
database.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_idx ON appointments(active_slot_key);
  CREATE INDEX IF NOT EXISTS appointments_user_idx ON appointments(userId);
  CREATE INDEX IF NOT EXISTS appointments_doctor_idx ON appointments(docId);
  CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments(date);
`)

const connectDB = async () => {
  if (!database.open) throw new Error('SQLite database is closed; restart the backend.')
  console.log(`SQLite connected (${databasePath})`)
}

const getDatabase = () => {
  if (!database.open) throw new Error('SQLite is not connected')
  return database
}

const disconnectDB = async () => {
  if (database.open) database.close()
}

export { connectDB, disconnectDB, getDatabase, databasePath }
