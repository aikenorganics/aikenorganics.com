// Vendor
var express = require('express');
var compression = require('compression');

// The App!
var app = express();
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

// Middleware
app.use(compression());
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3333);
