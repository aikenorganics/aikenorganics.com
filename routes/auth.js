var bcrypt = require('bcrypt');
var User = require('../models').User;

module.exports = function(app) {

  app.get('/signout', function(req, res) {
    res.clearCookie('aikenorganics-user-id');
    res.redirect('/');
  });

  app.get('/signin', function(req, res) {
    res.render('signin');
  });

  app.post('/signin', function(req, res) {
    var email = (req.body.email || '').trim();
    var password = (req.body.password || '').trim();

    User.find({where: {email: email}}).then(function(user) {

      // Does the user exist?
      if (!user) {
        res.render('signin', {
          flash: 'Sorry! We can’t find a user with that email. Have you already registered?'
        });
        return;
      }

      bcrypt.compare(password, user.password, function(e, match) {
        if (e) throw e;

        // Is the password correct?
        if (!match) {
          res.render('signin', {
            email: email,
            flash: 'Sorry! That password is incorrect.'
          });
          return;
        }

        res.cookie('aikenorganics-user-id', user.id, {signed: true});
        res.redirect('/');

      });

    });
  });

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', function(req, res) {
    var email = (req.body.email || '').trim();
    var password = (req.body.password || '').trim();

    // Validate the password.
    if (password.length < 8) {
      res.render('signup', {
        email: email,
        flash: 'Password must be at least eight characters long.'
      });
      return;
    }

    // Validate the email.
    if (!/\S+@\S+\.\S+/.test(email)) {
      res.render('signup', {
        flash: 'Please enter a valid email address.'
      });
      return;
    }

    User.find({where: {email: email}}).then(function(user) {

      // Does this user already exist?
      if (user) {
        res.render('signup', {
          email: email,
          flash: 'That user already exists! Is it you?'
        });
        return;
      }

      // Hash the password and store the user.
      bcrypt.hash(password, 12, function(e, hash) {
        if (e) throw e;
        User.create({
          email: email,
          password: hash
        }).then(function(user) {
          res.cookie('aikenorganics-user-id', user.id, {signed: true});
          res.redirect('/');
        });
      });

    });
  });

};
