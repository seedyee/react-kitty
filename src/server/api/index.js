import express from 'express'

const router = express.Router() // eslint-disable-line new-cap

const emailMap = {
  'seedyee@mail.com': 'aaaaaaa1',
  'jundo@mail.com': 'aaaaaaa1',
}

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!emailMap[email]) {
    res.json({ error: { text: `${email} doesn't exisit !` } })
  } else if (emailMap[email] !== password) {
    res.json({ error: { text: 'password incorrect' } })
  } else {
    res.json({ email })
  }
})

router.post('/register', (req, res) => {
  const { email, password } = req.body
  if (emailMap[email]) {
    res.json({ error: { text: `${email} already exisits !` } })
  } else {
    emailMap[email] = password
    res.json({ email })
  }
})

router.get('/logout', (req, res) => {
  res.json({})
})

router.get('/users', (req, res) => {
  res.json(Object.keys(emailMap))
})

export default router

