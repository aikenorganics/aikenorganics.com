// Vendor
var express = require('express');
var compression = require('compression');
var body = require('body-parser');
var multer = require('multer');

// The App!
var app = express();
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

// Middleware
app.use(body.urlencoded());
app.use(multer());
app.use(compression());
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

// Auth router
app.use('/', require('./auth'));

app.listen(process.env.PORT || 3333);
