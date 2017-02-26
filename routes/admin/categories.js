'use strict'

const {Category} = require('../../db')
const {del, get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/categories', async (_) => {
    const categories = await Category
      .select(`not exists(
        select 1 from products where category_id = categories.id
      ) as removable`)
      .order('position').all()

    _.react({categories})
  }),

  // New
  get('/admin/categories/new', async (_) => { _.react() }),

  // Edit
  get('/admin/categories/:id/edit', async (_, id) => {
    const category = await Category.find(id)
    if (!category) return _.notfound()
    _.react({category})
  }),

  // Create
  post('/admin/categories', async (_) => {
    const category = await Category.create(_.permit(
      'meat', 'name', 'position'
    ))
    _.body = {category}
  }),

  // Update
  post('/admin/categories/:id', async (_, id) => {
    const category = await Category.find(id)
    if (!category) return _.notfound()
    await category.update(_.permit('meat', 'name', 'position'))
    _.body = {category}
  }),

  // Delete
  del('/admin/categories/:id', async (_, id) => {
    const category = await Category.find(id)
    if (!category) return _.notfound()
    await category.destroy()
    _.body = {}
  })

]
