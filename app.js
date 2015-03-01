// Vendor
var express = require('express');
var compression = require('compression');
var body = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');

// The App!
var app = module.exports = express();
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

// Middleware
app.use(cookieParser(process.env.SECRET));
app.use(body.urlencoded({extended: false}));
app.use(multer());
app.use(compression());
app.use(express.static('public'));

// Info Router
app.use('/', require('./routers/info'));

// Auth router
app.use('/', require('./routers/auth'));
