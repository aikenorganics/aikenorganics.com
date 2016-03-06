'use strict'

const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user) return next()
  res.status(404).render('404')
})

router.get('/', (req, res) => res.react())

router.post('/', (req, res) => {
  req.user.update(req.permit(
    'first', 'last', 'phone'
  )).then(() => res.json(req.user))
})
