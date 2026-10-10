import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import { connectDB, disconnectDB, getPool } from './config/mysql.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
// ...existing code...



// ...existing code...
//app config
const app = express()
const port = process.env.PORT || 4000
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.resolve(currentDirectory, 'uploads')
let httpServer
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static(uploadDirectory))

app.use('/api', (req, res, next) => {
    try {
        getPool()
    } catch {
        return res.status(503).json({
            success: false,
            message: 'The local MySQL database is unavailable. Restart the backend and try again.'
        })
    }

    next()
})

//api enpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

//localhost:4000/api/admin/add-doctor
app.get('/', (req, res) => {
    res.send('API WORKING')
})

const startServer = async () => {
    try {
        await connectDB()
        httpServer = app.listen(port, ()=> console.log("Server Started", port))
    } catch (error) {
        console.error("Unable to start the local database:", error.message)
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
