var express = require('express');
var find = require('../mid/find');
var adminOnly = require('../mid/admin-only');
var Post = require('../models').Post;
var router = module.exports = express.Router();

router.use(adminOnly);
router.param('post_id', find('post', Post));

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
