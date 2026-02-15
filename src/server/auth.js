const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('./db')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'chatbox-dev-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'

router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少6位' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: '该邮箱已注册' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname, created_at',
      [email.toLowerCase(), passwordHash, nickname || email.split('@')[0]]
    )

    const user = result.rows[0]
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      user: { id: user.id, email: user.email, nickname: user.nickname, createdAt: user.created_at },
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: '注册失败，请稍后重试' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }

    const result = await pool.query('SELECT id, email, password_hash, nickname, created_at FROM users WHERE email = $1', [
      email.toLowerCase(),
    ])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({
      user: { id: user.id, email: user.email, nickname: user.nickname, createdAt: user.created_at },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: '登录失败，请稍后重试' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'ok' })
})

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ error: '未登录' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const result = await pool.query('SELECT id, email, nickname, created_at FROM users WHERE id = $1', [decoded.userId])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '用户不存在' })
    }

    const user = result.rows[0]
    return res.json({
      user: { id: user.id, email: user.email, nickname: user.nickname, createdAt: user.created_at },
    })
  } catch (err) {
    res.clearCookie('token')
    return res.status(401).json({ error: '登录已过期' })
  }
})

module.exports = router
