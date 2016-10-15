'use strict'

const {Location} = require('../../db')
const {del, get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/locations', function *() {
    const locations = yield Location
      .select(`not exists(
        select 1 from orders where location_id = locations.id
      ) as removable`)
      .order('name').all()
    this.react({locations})
  }),

  // New
  get('/admin/locations/new', function *() { this.react() }),

  // Edit
  get('/admin/locations/:id/edit', function *(id) {
    const location = yield Location.find(id)
    if (!location) return this.notfound()
    this.react({location})
  }),

  // Create
  post('/admin/locations', function *() {
    const location = yield Location.create(this.permit('name'))
    this.body = {location}
  }),

  // Update
  post('/admin/locations/:id', function *(id) {
    const location = yield Location.find(id)
    if (!location) return this.notfound()
    yield location.update(this.permit('name', 'active'))
    this.body = {location}
  }),

  // Destroy
  del('/admin/locations/:id', function *(id) {
    const location = yield Location.find(id)
    if (!location) return this.notfound()
    yield location.destroy()
    this.body = {}
  })

]
