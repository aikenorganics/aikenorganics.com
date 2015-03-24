var express = require('express')
var find = require('../mid/find')
var models = require('../models')
var router = module.exports = express.Router()

router.use(function (req, res, next) {
  if (req.admin) return next()
  res.status(401).render('401')
})

router.param('post_id', find(models.Post))

router.get('/', function (req, res) {
  models.Post.findAll().then(function (posts) {
    res.render('posts/index', {
      posts: posts
    })
  })
})

router.get('/new', function (req, res) {
  res.render('posts/new')
})

router.post('/', function (req, res) {
  models.Post.create({
    title: req.body.title,
    content: req.body.content,
    author_id: req.user.id
  }).then(function (post) {
    res.redirect('/posts/' + post.id + '/edit')
  })
})

router.get('/:post_id/edit', function (req, res) {
  res.render('posts/edit')
})

router.post('/:post_id', function (req, res) {
  req.post.update(req.body, {
    fields: ['title', 'content']
  }).then(function () {
    res.redirect('/posts/' + req.post.id + '/edit')
  })
})
