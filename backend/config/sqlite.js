import { createClient } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Two ways to run the database, same SQL either way:
// - TURSO_DATABASE_URL set   -> hosted libSQL/SQLite database on Turso (used in production)
// - TURSO_DATABASE_URL unset -> local SQLite file (DATABASE_FILE, default data/medbook.db)
const remoteUrl = process.env.TURSO_DATABASE_URL?.trim()
let url
let databaseLocation

if (remoteUrl) {
  url = remoteUrl
  databaseLocation = new URL(remoteUrl.replace(/^libsql:/, 'https:')).host
} else {
  const directory = path.dirname(fileURLToPath(import.meta.url))
  const databasePath = path.resolve(directory, '..', process.env.DATABASE_FILE || 'data/medbook.db')
  mkdirSync(path.dirname(databasePath), { recursive: true })
  url = pathToFileURL(databasePath).href
  databaseLocation = databasePath
}

const database = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined })
let ready = false

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
  )`,
  // Uploaded images (patient profile photos). Kept in the database because
  // free hosting has no permanent disk: files written to disk vanish on restart.
  `CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    mime TEXT NOT NULL,
    data BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`
]

const indexes = [
  'CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_idx ON appointments(active_slot_key)',
  'CREATE INDEX IF NOT EXISTS appointments_user_idx ON appointments(userId)',
  'CREATE INDEX IF NOT EXISTS appointments_doctor_idx ON appointments(docId)',
  'CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments(date)'
]

const migrate = async () => {
  for (const statement of tables) await database.execute(statement)

  const doctorColumns = await database.execute(`SELECT name FROM pragma_table_info('doctors')`)
  if (doctorColumns.rows.some((column) => column.name === 'image')) {
    await database.execute('ALTER TABLE doctors DROP COLUMN image')
  }
  await database.execute(`
    UPDATE appointments
    SET docData = json_remove(docData, '$.image')
    WHERE json_valid(docData) AND json_type(docData, '$.image') IS NOT NULL
  `)

  for (const statement of indexes) await database.execute(statement)
}

const connectDB = async () => {
  if (database.closed) throw new Error('Database client is closed; restart the backend.')
  if (!ready) {
    await migrate()
    ready = true
  }
  console.log(`Database connected (${remoteUrl ? 'Turso: ' : 'local file: '}${databaseLocation})`)
}

const getDatabase = () => {
  if (!ready || database.closed) throw new Error('Database is not connected')
  return database
}

const disconnectDB = async () => {
  if (!database.closed) database.close()
  ready = false
}

export { connectDB, disconnectDB, getDatabase, databaseLocation }
