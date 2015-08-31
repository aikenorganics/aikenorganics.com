'use strict'

let fs = require('fs')
let gm = require('gm')
let aws = require('aws-sdk')
let async = require('async')
let mkdirp = require('mkdirp')

const TMP = './tmp/uploads/'
const ASSETS = './public/assets/'
const BUCKET = process.env.BUCKET

let s3 = new aws.S3({apiVersion: '2006-03-01'})

module.exports = function (name) {
  return function (req, res) {
    new Upload(req, res, req[name]).process()
  }
}

class Upload {

  constructor (req, res, model) {
    this.req = req
    this.res = res
    this.file = req.files.image[0]
    this.model = model
    // TODO: Remove old style
    this.tableName = model.tableName || model.Model.tableName
    this.path = `${this.tableName}/${model.id}`
  }

  s3Key (size) {
    return `${this.path}/${size}.jpg`
  }

  assetPath (size) {
    return `${ASSETS}${this.path}/${size}.jpg`
  }

  tmpPath (size) {
    if (size === 'original') return this.file.path
    return `${TMP}${size}-${this.file.name}.jpg`
  }

  error (e) {
    console.log(e)
    this.res.status(500).render('500')
  }

  process () {
    async.parallel([
      this.resize.bind(this, 100, 'small'),
      this.resize.bind(this, 250, 'medium')
    ], (BUCKET ? this.upload : this.store).bind(this))
  }

  resize (width, size, next) {
    gm(this.file.path)
    .options({imageMagick: true})
    .resize(width, width)
    .noProfile()
    .write(this.tmpPath(size), next)
  }

  upload (e) {
    if (e) return this.error(e)
    async.parallel([
      this.put.bind(this, 'small'),
      this.put.bind(this, 'medium'),
      this.put.bind(this, 'original')
    ], this.remove.bind(this))
  }

  remove (e) {
    if (e) return this.error(e)
    async.parallel([
      fs.unlink.bind(fs, this.tmpPath('small')),
      fs.unlink.bind(fs, this.tmpPath('medium')),
      fs.unlink.bind(fs, this.tmpPath('original'))
    ], this.update.bind(this))
  }

  put (size, next) {
    s3.putObject({
      ACL: 'public-read',
      Body: fs.createReadStream(this.tmpPath(size)),
      Bucket: BUCKET,
      CacheControl: 'max-age=' + 60 * 60 * 24 + ', public',
      ContentType: 'image/jpeg',
      Key: this.s3Key(size)
    }, next)
  }

  store (e) {
    if (e) return this.error(e)
    mkdirp(ASSETS + this.path, function (e) {
      if (e) return this.error(e)
      async.parallel([
        this.rename.bind(this, 'small'),
        this.rename.bind(this, 'medium'),
        this.rename.bind(this, 'original')
      ], this.update.bind(this))
    }.bind(this))
  }

  rename (size, next) {
    fs.rename(this.tmpPath(size), this.assetPath(size), next)
  }

  update (e) {
    if (e) return this.error(e)
    this.model.update({imaged_at: new Date()}).then(this.finish.bind(this))
  }

  finish () {
    this.res.flash('Image Uploaded.')
    this.res.redirect(this.req.body.return_to)
  }

}
