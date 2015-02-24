// Vendor
var express = require('express');
var app = express();

// Middleware
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3333);
