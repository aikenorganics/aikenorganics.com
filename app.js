// Vendor
var marked = require('marked');
var express = require('express');
var compression = require('compression');
var body = require('body-parser');
var multer = require('multer');
var session = require('cookie-session');

// The App!
var app = module.exports = express();
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.locals = require('./helpers');

// Middleware
app.use(session({
  signed: true,
  // secure: true,
  name: 'aikenorganics',
  secret: process.env.SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 7
}));
app.use(body.urlencoded({extended: false}));
app.use(multer({dest: './tmp/uploads/', putSingleFilesInArray: true}));
app.use(compression());
app.use(express.static('public'));
app.use(require('./mid/user'));
app.use(require('./mid/flash'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/growers', require('./routes/growers'));
app.use('/products', require('./routes/products'));
app.use('/settings', require('./routes/settings'));
app.use('/categories', require('./routes/categories'));

app.get('/', function(req, res) {
  res.render('index');
});

// 404
app.get('*', function(req, res) {
  res.status(404).render('404');
});

// 500
app.use(function(e, req, res, next) {
  console.log(e);
  res.status(500).render('500');
});
