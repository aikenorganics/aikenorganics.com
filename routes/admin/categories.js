var ozymandias = require('ozymandias')
var find = require('../../mid/find')
var models = require('../../models')
var router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (req.admin) return next()
  res.status(401).render('401')
})

router.param('category_id', find(models.Category))

router.get('/', function (req, res) {
  models.Category.findAll({
    order: [['position', 'ASC']]
  }).then(function (categories) {
    res.render('admin/categories/index', {
      categories: categories
    })
  })
})

router.get('/new', function (req, res) {
  res.render('admin/categories/new')
})

router.get('/:category_id/edit', function (req, res) {
  res.render('admin/categories/edit')
})

router.post('/', function (req, res) {
  req.transaction(function (t) {
    return models.Category.create(req.body, {
      transaction: t,
      fields: ['name', 'position']
    }).then(function () {
      res.flash('success', 'Created')
      res.redirect('/admin/categories')
    })
  })
})

router.post('/:category_id', function (req, res) {
  req.transaction(function (t) {
    return req.category.update(req.body, {
      transaction: t,
      fields: ['name', 'position']
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/admin/categories')
    })
  })
})
