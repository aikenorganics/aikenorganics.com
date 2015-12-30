'use strict'

const db = require('../db')
const upload = require('multer')({dest: 'tmp/uploads'})
const ozymandias = require('ozymandias')
const router = module.exports = ozymandias.Router()

// Find
router.find('grower', () => db.Grower)

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

// Index
router.get('/', (req, res) => {
  db.Grower.where({active: true}).order('name').all().then((growers) => {
    res.render('growers/index', {growers: growers})
  })
})

// New Grower
router.get('/new', (req, res) => {
  if (!req.admin) return res.status(401).render('401')
  res.render('growers/new')
})

router.post('/', (req, res) => {
  if (!req.admin) return res.status(401).render('401')

  db.Grower.create(req.permit(
    'url', 'name', 'email', 'location', 'description'
  )).then((grower) => {
    res.flash('success', 'Saved')
    res.redirect(`/growers/${grower.id}`)
  }).catch(res.error)
})

// Show
router.get('/:grower_id', (req, res) => {
  let products = db.Product.where({grower_id: req.grower.id})
  if (!req.canEdit) products.where({active: true})

  products.order('name').all().then((products) => {
    // Stupid, but necessary.
    for (let product of products) product.grower = req.grower
    res.render('growers/show', {products: products})
  }).catch(res.error)
})

// Edit Grower
router.get('/:grower_id/edit', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  res.render('growers/edit')
})

router.post('/:grower_id', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  req.grower.update(req.permit(
    'name', 'email', 'url', 'location', 'description'
  )).then(() => {
    res.flash('success', 'Saved')
    res.redirect(`/growers/${req.grower.id}`)
  }).catch(res.error)
})

// New Product
router.get('/:grower_id/products/new', newProduct)

const newProduct = (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  db.Category.all().then((categories) => {
    res.render('products/new', {categories: categories})
  })
}

router.post('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  let props = req.permit(
    'name', 'cost', 'unit', 'supply', 'category_id', 'description'
  )
  props.grower_id = req.grower.id

  db.Product.create(props).then((product) => {
    res.flash('success', 'Saved')
    res.redirect(`/products/${product.id}`)
  }).catch((e) => {
    if (e.message !== 'invalid') throw e
    res.status(422)
    res.locals.errors = e.model.errors
    res.locals.product = e.model
    newProduct(req, res)
  }).catch(res.error)
})

// Orders
router.get('/:grower_id/orders', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  let total = `(
    select sum(quantity * cost) from product_orders
    inner join orders on orders.id = product_orders.order_id
    where product_id = products.id and orders.status = 'open'
  ) as total`

  db.Product
  .select('*', total)
  .where({grower_id: req.grower.id})
  .where('reserved > 0')
  .all().then((products) => {
    res.render('growers/orders', {products: products})
  }).catch(res.error)
})

// Products
router.get('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  db.Product.where({grower_id: req.grower.id}).order('name').all()
  .then((products) => {
    res.render('growers/products', {products: products})
  }).catch(res.error)
})

router.post('/:grower_id/image', upload.single('image'), (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  req.grower.uploadImage(req.file).then(() => {
    res.flash('Image Uploaded.')
    res.redirect(req.body.return_to)
  }).catch(res.error)
})
