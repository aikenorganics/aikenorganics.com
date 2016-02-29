'use strict'

const db = require('../db')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('user_id', '_user', () => db.User)

router.use((req, res, next) => {
  if (!req.admin && req.user.id !== req._user.id) {
    return res.status(401).render('401')
  }
  next()
})

router.post('/:user_id/card', (req, res) => {
  req._user.updateCard(req.body.token).then(() => {
    res.json(req._user)
  }).catch(res.error)
})
