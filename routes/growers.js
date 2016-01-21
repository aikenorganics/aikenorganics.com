'use strict'

const db = require('../db')
const upload = require('multer')({dest: 'tmp/uploads'})
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower)

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

// Index
router.get('/', (req, res) => {
  db.Grower.where({active: true}).order('name').all().then((growers) => {
    res.react({growers: growers})
  })
})

// New Grower
router.get('/new', (req, res) => {
  if (!req.admin) return res.status(401).render('401')
  res.react()
})

router.post('/', (req, res) => {
  if (!req.admin) return res.status(401).render('401')

  db.Grower.create(req.permit(
    'url', 'name', 'email', 'location', 'description'
  )).then((grower) => {
    res.json(grower)
  }).catch(res.error)
})

// Show
router.get('/:grower_id', (req, res) => {
  let products = db.Product.where({grower_id: req.grower.id})
  if (!req.canEdit) products.where({active: true})

  products.order('name').all().then((products) => {
    // Stupid, but necessary.
    for (let product of products) product.grower = req.grower
    res.react({
      grower: req.grower,
      products: products
    })
  }).catch(res.error)
})

// Edit Grower
router.get('/:grower_id/edit', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  res.react({grower: req.grower})
})

router.post('/:grower_id', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  req.grower.update(req.permit(
    'name', 'email', 'url', 'location', 'description'
  )).then(() => {
    res.json(true)
  }).catch(res.error)
})

// New Product
router.get('/:grower_id/products/new', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  db.Category.all().then((categories) => {
    res.react({
      grower: req.grower,
      categories: categories
    })
  }).catch(res.error)
})

router.post('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  const props = req.permit(
    'name', 'cost', 'unit', 'supply', 'category_id', 'description'
  )
  props.grower_id = req.grower.id

  db.Product.create(props).then((product) => {
    res.json(product)
  }).catch((e) => {
    if (e.message !== 'invalid') throw e
    res.status(422)
    res.json(e.model.errors)
  }).catch(res.error)
})

// Orders
router.get('/:grower_id/orders', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  const total = `(
    select sum(quantity * cost) from product_orders
    inner join orders on orders.id = product_orders.order_id
    where product_id = products.id and orders.status = 'open'
  ) as total`

  db.Product
  .select('*', total)
  .where({grower_id: req.grower.id})
  .where('reserved > 0')
  .all().then((products) => {
    res.react({
      grower: req.grower,
      products: products
    })
  }).catch(res.error)
})

// Products
router.get('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  db.Product.where({grower_id: req.grower.id}).order('name').all()
  .then((products) => {
    res.react({
      grower: req.grower,
      products: products
    })
  }).catch(res.error)
})

router.post('/:grower_id/image', upload.single('image'), (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  req.grower.uploadImage(req.file).then(() => {
    res.json(req.grower)
  }).catch(res.error)
})
