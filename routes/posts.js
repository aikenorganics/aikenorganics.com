var express = require('express');
var Post = require('../models').Post;

var router = module.exports = express.Router();

// Find a post.
router.param('post_id', function(req, res, next, id) {
  if (!id) return next();
  Post.find(id).then(function(post) {
    if (!post) {
      res.status(404).render('404')
      return;
    }
    req.post = res.locals.post = post;
    next();
  });
});

// Admin only
router.use(function(req, res, next) {
  if (req.user && req.user.isAdmin()) return next();
  res.status(401).end();
});

router.get('/', function(req, res) {
  Post.findAll().then(function(posts) {
    res.render('posts/index', {
      posts: posts
    });
  });
});

router.get('/new', function(req, res) {
  res.render('posts/new');
});

router.post('/', function(req, res) {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    author_id: req.user.id
  }).then(function(post) {
    res.redirect('/posts/' + post.id + '/edit');
  });
});

router.get('/:post_id/edit', function(req, res) {
  res.render('posts/edit');
});

router.post('/:post_id', function(req, res) {
  req.post.updateAttributes(req.body, {
    fields: ['title', 'content']
  }).then(function() {
    res.redirect('/posts/' + req.post.id + '/edit');
  });
});
