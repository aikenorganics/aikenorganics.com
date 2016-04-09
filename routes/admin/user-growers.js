'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('user_grower', () => db.UserGrower.include('user', 'grower'))

// Create
router.post('/', (req, res) => {
  db.UserGrower.create({
    user_id: req.body.user_id,
    grower_id: req.body.grower_id
  }).then((userGrower) => {
    return db.UserGrower.include('user', 'grower').find(userGrower.id).then((userGrower) => {
      res.json(userGrower)
    })
  }).catch(res.error)
})

// Destroy
router.delete('/:user_grower_id', (req, res) => {
  req.user_grower.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
