var Post = require('../models').Post;

// Find the post if it's in the params.
function findPost(req, res, next) {
  if (!req.params.post_id) return next();
  Post.find(req.params.post_id).then(function(post) {
    if (!post) {
      res.status(404).render('404')
      return;
    }
    req.post = res.locals.post = post;
    next();
  });
}

module.exports = function(app) {

  app.get('/posts/new', function(req, res) {
    res.render('posts/new');
  });

  app.post('/posts/new', function(req, res) {
    Post.create({
      title: req.body.title,
      content: req.body.content,
      author_id: req.user.id
    }).then(function(post) {
      res.redirect('/posts/' + post.id + '/edit');
    });
  });

  app.get('/posts/:post_id/edit', findPost, function(req, res) {
    res.render('posts/edit');
  });

  app.post('/posts/:post_id', findPost, function(req, res) {
    req.post.updateAttributes(req.body, {
      fields: [
        'title',
        'content'
      ]
    }).then(function() {
      res.redirect('/posts/' + req.post.id + '/edit');
    });
  });

};
