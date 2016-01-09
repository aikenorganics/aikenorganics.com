'use strict'

const db = require('../db')
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
  if (req.query.search) {
    products.where(
      "search @@ to_tsquery('simple', ?)", `${req.query.search}:*`
    )
  }

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

  res.format({
    html: () => {
      Promise.all([
        products.order('name').paginate(page, 30),
        db.Category.order('position').all()
      ]).then((results) => {
        res.render('products/index', {
          products: results[0],
          categories: results[1]
        })
      }).catch(res.error)
    },
    json: () => {
      products.order('name').all().then((products) => {
        res.json(products)
      })
    }
  })
})

// Show
router.get('/:product_id', (req, res) => {
  res.render('products/show')
})

// Edit
router.get('/:product_id/edit', editProduct)

function editProduct (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.Category.order('position').all().then((categories) => {
    res.render('products/edit', {categories: categories})
  }).catch(res.error)
}

// Update
router.post('/:product_id', (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')

  req.product.update(req.permit(
    'active', 'category_id', 'cost', 'description', 'name', 'supply', 'unit'
  )).then(() => {
    res.format({
      html: () => {
        res.flash('success', 'Saved')
        res.redirect(req.body.return_to || `/products/${req.product.id}`)
      },
      json: () => {
        res.json({})
      }
    })
  }).catch((e) => {
    if (e.message !== 'invalid') throw e
    res.status(422)
    res.locals.errors = req.product.errors
    editProduct(req, res)
  }).catch(res.error)
})

// Image
router.post('/:product_id/image', upload.single('image'), (req, res) => {
  if (!req.canEdit) return res.status(401).render('401')
  req.product.uploadImage(req.file).then(() => {
    res.flash('Image Uploaded.')
    res.redirect(req.body.return_to)
  }).catch(res.error)
})
