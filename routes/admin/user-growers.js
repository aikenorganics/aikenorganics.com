'use strict'

const db = require('../../db')
const json = require('../../json/admin/user-growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('userGrower', () => db.UserGrower.include('user', 'grower'))

// Create
router.post('/', (request, response) => {
  const {userId, growerId} = request.body
  db.UserGrower.create({userId, growerId}).then((userGrower) => (
    db.UserGrower.include('user', 'grower').find(userGrower.id).then((userGrower) => {
      response.json(json.create, {userGrower})
    })
  )).catch(response.error)
})

// Destroy
router.delete('/:userGrowerId', (request, response) => {
  request.userGrower.destroy().then(() => {
    response.json({})
  }).catch(response.error)
})
