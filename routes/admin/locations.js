'use strict'

const {Location} = require('../../db')
const {del, get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/locations', async (_) => {
    const locations = await Location
      .select(`not exists(
        select 1 from orders where location_id = locations.id
      ) as removable`)
      .order('name').all()
    _.render({locations})
  }),

  // New
  get('/admin/locations/new', async (_) => { _.render() }),

  // Edit
  get('/admin/locations/:id/edit', async (_, id) => {
    const location = await Location.find(id)
    if (!location) return _.notfound()
    _.render({location})
  }),

  // Create
  post('/admin/locations', async (_) => {
    const location = await Location.create(_.permit('name'))
    _.body = {location}
  }),

  // Update
  post('/admin/locations/:id', async (_, id) => {
    const location = await Location.find(id)
    if (!location) return _.notfound()
    await location.update(_.permit('name', 'active'))
    _.body = {location}
  }),

  // Destroy
  del('/admin/locations/:id', async (_, id) => {
    const location = await Location.find(id)
    if (!location) return _.notfound()
    await location.destroy()
    _.body = {}
  })

]
