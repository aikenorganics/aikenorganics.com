'use strict'

const db = require('../../db')
const json = require('../../json/admin/user-growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('userGrower', () => db.UserGrower.include('user', 'grower'))

// Create
router.post('/', (req, res) => {
  const {userId, growerId} = req.body
  db.UserGrower.create({userId, growerId}).then((userGrower) => (
    db.UserGrower.include('user', 'grower').find(userGrower.id).then((userGrower) => {
      res.json(json.create, {userGrower})
    })
  )).catch(res.error)
})

// Destroy
router.delete('/:userGrowerId', (req, res) => {
  req.userGrower.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
