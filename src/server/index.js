const express = require('express')
const cookieParser = require('cookie-parser')
const { initDB } = require('./db')
const authRouter = require('./auth')

const app = express()
const PORT = process.env.API_PORT || 5001

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

async function start() {
  try {
    await initDB()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Auth API server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
