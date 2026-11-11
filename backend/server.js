import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import { connectDB, disconnectDB, getDatabase } from './config/sqlite.js'
import { getFile } from './models/fileStore.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const requiredSettings = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missingSettings = requiredSettings.filter((name) => !process.env[name])
if (missingSettings.length) {
    console.error(`Missing required environment variables: ${missingSettings.join(', ')}`)
    process.exit(1)
}

//app config
const app = express()
const port = process.env.PORT || 4000
let httpServer

// Behind Render/other proxies, trust X-Forwarded-Proto so image URLs are built with https.
app.set('trust proxy', 1)

// CORS_ORIGINS: comma-separated list of allowed sites (e.g. your two Netlify URLs).
// Leave it empty to allow every origin.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Uploaded profile photos are stored in the database.
app.get('/uploads/:id', async (req, res) => {
    try {
        const file = await getFile(req.params.id)
        if (!file) return res.status(404).end()
        res.set('Content-Type', file.mime)
        res.set('Cache-Control', 'public, max-age=31536000, immutable')
        res.send(file.data)
    } catch (error) {
        console.error('Error serving upload:', error)
        res.status(500).end()
    }
})

app.use('/api', (req, res, next) => {
    try {
        getDatabase()
    } catch {
        return res.status(503).json({
            success: false,
            message: 'The database is unavailable. Restart the backend and try again.'
        })
    }

    next()
})

//api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Used by Render's health check.
app.get('/health', (req, res) => {
    try {
        getDatabase()
        res.json({ ok: true })
    } catch {
        res.status(503).json({ ok: false })
    }
})

// One link for everything: when the websites have been built (npm run build),
// the API also serves them. Patient website at "/", staff panel at "/admin/".
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const patientSite = path.join(projectRoot, 'frontend', 'dist')
const staffSite = path.join(projectRoot, 'admin', 'dist')
const servesSites = existsSync(path.join(patientSite, 'index.html')) && existsSync(path.join(staffSite, 'index.html'))

if (servesSites) {
    app.use('/admin', express.static(staffSite, { index: false }))
    app.use(express.static(patientSite, { index: false }))

    // Single-page apps: any other page address gets the app's index.html,
    // so links like /my-appointments or /admin/doctor-dashboard work when refreshed.
    app.get(/^\/admin(\/.*)?$/, (req, res) => res.sendFile(path.join(staffSite, 'index.html')))
    app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => res.sendFile(path.join(patientSite, 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API WORKING')
    })
}

// Turn upload and other unexpected errors into JSON the web apps can show.
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2 MB or smaller' : error.message
        return res.status(400).json({ success: false, message })
    }
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
})

const startServer = async () => {
    try {
        await connectDB()
        httpServer = app.listen(port, () => console.log("Server Started", port))
    } catch (error) {
        console.error("Unable to start the database:", error.message)
        process.exitCode = 1
    }
}

startServer()

const shutdown = async () => {
    if (httpServer) {
        httpServer.closeAllConnections()
        await new Promise((resolve) => httpServer.close(resolve))
    }
    await disconnectDB()
    process.exit(0)
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
