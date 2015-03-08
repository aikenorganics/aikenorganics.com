var fs = require('fs');
var gm = require('gm');
var async = require('async');
var mkdirp = require('mkdirp');

var TMP = './tmp/uploads/';
var ASSETS = './public/assets/';

module.exports = function(name) {
  return function(req, res) {
    new Upload(req, res, req[name]).process();
  }
};

var Upload = function(req, res, model) {
  this.req = req;
  this.res = res;
  this.file = req.files.image[0];
  this.model = model;
  this.tableName = model.Model.tableName;
  this.path = this.tableName + '/' + model.id;
};

Upload.prototype.assetPath = function(size) {
  return ASSETS + this.path + '/' + size + '.jpg';
};

Upload.prototype.tmpPath = function(size) {
  if (size === 'original') return this.file.path;
  return TMP + size + '-' + this.file.name + '.jpg';
};

Upload.prototype.error = function(e) {
  console.log(e);
  this.res.status(500).render('500');
};

Upload.prototype.process = function() {
  async.parallel([
    this.resize.bind(this, 100, 'small'),
    this.resize.bind(this, 250, 'medium')
  ], this.store.bind(this));
};

Upload.prototype.resize = function(width, size, next) {
  gm(this.file.path)
  .options({imageMagick: true})
  .resize(width, width)
  .noProfile()
  .write(this.tmpPath(size), next);
};

Upload.prototype.store = function(e) {
  if (e) return this.error(e);
  mkdirp(ASSETS + this.path, function(e) {
    if (e) return this.error(e);
    async.parallel([
      this.rename.bind(this, 'small'),
      this.rename.bind(this, 'medium'),
      this.rename.bind(this, 'original'),
    ], this.update.bind(this));
  }.bind(this));
};

Upload.prototype.rename = function(size, next) {
  fs.rename(this.tmpPath(size), this.assetPath(size), next);
};

Upload.prototype.update = function(e) {
  if (e) return this.error(e);
  this.model.updateAttributes({
    imaged_at: new Date
  }, ['imaged_at']).then(this.finish.bind(this));
};

Upload.prototype.finish = function() {
  this.res.flash('Image Uploaded.');
  this.res.redirect(this.req.body.return_to);
};
