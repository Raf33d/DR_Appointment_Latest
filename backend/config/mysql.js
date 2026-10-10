import mysql from 'mysql2/promise'
import { spawn } from 'node:child_process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const runFile = promisify(execFile)
const directory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.resolve(directory, '../.mysql-active-data')
const mysqlBase = process.env.MYSQL_BASEDIR || 'C:/Program Files/MySQL/MySQL Server 8.0'
const mysqlBinary = process.env.MYSQLD_PATH || path.join(mysqlBase, 'bin', 'mysqld.exe')
const settings = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3307),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'medbook',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  dateStrings: false
}

let serverProcess
let pool

const canConnect = () => new Promise((resolve) => {
  const socket = net.createConnection({ host: settings.host, port: settings.port })
  socket.once('connect', () => { socket.destroy(); resolve(true) })
  socket.once('error', () => resolve(false))
})

const waitForServer = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await canConnect()) return
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`MySQL did not start on ${settings.host}:${settings.port}`)
}

const ensureLocalServer = async () => {
  if (await canConnect()) return

  if (process.env.MYSQL_EXTERNAL === 'true') {
    throw new Error(`Cannot reach MySQL at ${settings.host}:${settings.port}`)
  }

  await mkdir(dataDirectory, { recursive: true })
  if (!existsSync(path.join(dataDirectory, 'auto.cnf'))) {
    await runFile(mysqlBinary, [
      '--no-defaults', '--initialize-insecure', `--basedir=${mysqlBase}`,
      `--datadir=${dataDirectory}`
    ], { windowsHide: true, cwd: dataDirectory })
  }

  serverProcess = spawn(mysqlBinary, [
    '--no-defaults',
    `--basedir=${mysqlBase}`,
    `--datadir=${dataDirectory}`,
    '--innodb-undo-tablespaces=2',
    `--port=${settings.port}`,
    `--bind-address=${settings.host}`,
    '--mysqlx=0',
    `--log-error=${path.join(dataDirectory, 'mysql.err')}`
  ], { stdio: 'ignore', windowsHide: true, detached: true, cwd: dataDirectory })
  serverProcess.unref()
  await new Promise((resolve, reject) => {
    serverProcess.once('spawn', resolve)
    serverProcess.once('error', reject)
  })
  serverProcess.once('exit', (code) => {
    if (code !== null && code !== 0) console.error(`Local MySQL stopped with code ${code}`)
  })
  await waitForServer()
}

const tables = [
  `CREATE TABLE IF NOT EXISTS users (
    id CHAR(24) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image LONGTEXT NOT NULL,
    phone VARCHAR(40) NOT NULL DEFAULT '00000000000',
    address JSON NOT NULL,
    gender VARCHAR(40) NOT NULL DEFAULT 'Not Selected',
    dob VARCHAR(40) NOT NULL DEFAULT 'Not Selected',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
  `CREATE TABLE IF NOT EXISTS doctors (
    id CHAR(24) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image LONGTEXT NOT NULL,
    speciality VARCHAR(120) NOT NULL,
    degree VARCHAR(160) NOT NULL,
    experience VARCHAR(80) NOT NULL,
    about TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    fees DECIMAL(10,2) NOT NULL,
    address JSON NOT NULL,
    date BIGINT NOT NULL,
    slots_booked JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(24) PRIMARY KEY,
    userId CHAR(24) NOT NULL,
    docId CHAR(24) NOT NULL,
    slotDate VARCHAR(20) NOT NULL,
    slotTime VARCHAR(30) NOT NULL,
    userData JSON NOT NULL,
    docData JSON NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date BIGINT NOT NULL,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    payment BOOLEAN NOT NULL DEFAULT FALSE,
    paymentMethod VARCHAR(24) NOT NULL DEFAULT '',
    paymentDate BIGINT NOT NULL DEFAULT 0,
    paymentReference VARCHAR(100) NOT NULL DEFAULT '',
    isCompleted BOOLEAN NOT NULL DEFAULT FALSE,
    active_slot_key VARCHAR(128) GENERATED ALWAYS AS (
      CASE WHEN cancelled = FALSE THEN CONCAT(docId, '|', slotDate, '|', slotTime) ELSE NULL END
    ) STORED,
    UNIQUE KEY unique_active_booking (active_slot_key),
    KEY appointments_user_idx (userId),
    KEY appointments_doctor_idx (docId),
    KEY appointments_date_idx (date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
]

const connectDB = async () => {
  await ensureLocalServer()

  const bootstrap = await mysql.createConnection({
    host: settings.host,
    port: settings.port,
    user: settings.user,
    password: settings.password
  })
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${settings.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`)
  await bootstrap.end()

  pool = mysql.createPool(settings)
  for (const statement of tables) await pool.query(statement)
  console.log(`MySQL connected (${settings.database} at ${settings.host}:${settings.port})`)
}

const getPool = () => {
  if (!pool) throw new Error('MySQL is not connected')
  return pool
}

const disconnectDB = async () => {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}

export { connectDB, disconnectDB, getPool }
