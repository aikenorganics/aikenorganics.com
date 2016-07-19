'use strict'

const json = require('../json/settings')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user) return next()
  res.format({
    html: () => res.status(401).render('401'),
    json: () => res.status(401).json({})
  })
})

router.get('/', (req, res) => res.react(json.index))

router.post('/', (req, res) => {
  req.user.update(req.permit(
    'first', 'last', 'phone', 'street', 'city', 'state', 'zip'
  )).then(() => {
    res.json(req.user)
  }).catch(res.error)
})

router.post('/card', (req, res) => {
  req.user.updateCard(req.body.token).then(() => {
    res.json(req.user)
  }).catch(res.error)
})
