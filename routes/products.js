'use strict'

const db = require('../db')
const json = require('../json/products')
const upload = require('multer')({dest: 'tmp/uploads'})
const router = module.exports = require('ozymandias').Router()

// Find
router.find('product', () => db.Product.include('grower', 'category'))

// Authorize
router.param('product_id', require('../mid/products/authorize'))

// Index
router.get('/', (req, res) => {
  let products = db.Product
    .include('grower').join('grower')
    .where({active: true, grower: {active: true}})

  // Search
  if (req.query.search) products.search(req.query.search)

  // Category
  if (req.query.category_id) {
    products = products.where({category_id: req.query.category_id})
  }

  // Grower
  if (req.query.grower_id) {
    products = products.where({grower_id: req.query.grower_id})
  }

  // Pagination
  const page = res.locals.page = +(req.query.page || 1)

  Promise.all([
    products.order('name').paginate(page, 30),
    db.Category.where(`exists(
      select 1 from products
      inner join growers on growers.id = products.grower_id
      where category_id = categories.id and products.active and growers.active
    )`).order('position').all()
  ]).then(([products, categories]) => {
    res.react(json.index, {page, products, categories})
  }).catch(res.error)
})

// Show
router.get('/:product_id', (req, res) => {
  res.react(json.show, {product: req.product})
})

// Edit
router.get('/:product_id/edit', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  db.Category.order('position').all().then((categories) => {
    res.react(json.edit, {categories, product: req.product})
  }).catch(res.error)
})

// Update
router.post('/:product_id', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  req.product.update(req.permit(
    'active', 'category_id', 'cost', 'description', 'name', 'supply', 'unit'
  )).then(() => {
    res.json(req.product)
  }).catch(res.error)
})

// Image
router.post('/:product_id/image', upload.single('image'), (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  req.product.uploadImage(req.file).then(() => {
    res.json(req.product)
  }).catch(res.error)
})
