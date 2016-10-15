'use strict'

const {Category} = require('../../db')
const {del, get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/categories', function *() {
    const categories = yield Category
      .select(`not exists(
        select 1 from products where category_id = categories.id
      ) as removable`)
      .order('position').all()

    this.react({categories})
  }),

  // New
  get('/admin/categories/new', function *() { this.react() }),

  // Edit
  get('/admin/categories/:id/edit', function *(id) {
    const category = yield Category.find(id)
    if (!category) return this.notfound()
    this.react({category})
  }),

  // Create
  post('/admin/categories', function *() {
    const category = yield Category.create(this.permit(
      'meat', 'name', 'position'
    ))
    this.body = {category}
  }),

  // Update
  post('/admin/categories/:id', function *(id) {
    const category = yield Category.find(id)
    if (!category) return this.notfound()
    yield category.update(this.permit('meat', 'name', 'position'))
    this.body = {category}
  }),

  // Delete
  del('/admin/categories/:id', function *(id) {
    const category = yield Category.find(id)
    if (!category) return this.notfound()
    yield category.destroy()
    this.body = {}
  })

]
