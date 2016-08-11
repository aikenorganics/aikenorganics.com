'use strict'

const db = require('../../db')
const json = require('../../json/admin/user-growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('user_grower', () => db.UserGrower.include('user', 'grower'))

// Create
router.post('/', (req, res) => {
  const {user_id, grower_id} = req.body
  db.UserGrower.create({user_id, grower_id}).then((userGrower) => (
    db.UserGrower.include('user', 'grower').find(userGrower.id).then((userGrower) => {
      res.json(json.create, {userGrower})
    })
  )).catch(res.error)
})

// Destroy
router.delete('/:user_grower_id', (req, res) => {
  req.user_grower.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
