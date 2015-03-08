var express = require('express');
var request = require('request');
var router = module.exports = express.Router();

var BUCKET = process.env.BUCKET;

if (BUCKET) {
  router.get('*', function(req, res) {
    request('https://s3.amazonaws.com/' + BUCKET + req.url).pipe(res);
  });
}
