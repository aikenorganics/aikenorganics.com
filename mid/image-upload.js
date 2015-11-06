'use strict'

const fs = require('fs')
const gm = require('gm')
const aws = require('aws-sdk')

const TMP = './tmp/uploads/'
const BUCKET = process.env.BUCKET

const s3 = new aws.S3({apiVersion: '2006-03-01'})

module.exports = function (name) {
  return (req, res) => {
    new Upload(req.files.image[0], req[name]).process().then(() => {
      res.flash('Image Uploaded.')
      res.redirect(req.body.return_to)
    }).catch(res.error)
  }
}

class Upload {

  constructor (file, model) {
    this.file = file
    this.model = model
  }

  s3Key (size) {
    return `${this.model.tableName}/${this.model.id}/${size}.jpg`
  }

  tmpPath (size) {
    if (size === 'original') return this.file.path
    return `${TMP}${this.file.name}-${size}.jpg`
  }

  process () {
    return Promise.all([
      this.resize(100, 'small'),
      this.resize(250, 'medium')
    ]).then(this.upload.bind(this))
  }

  resize (width, size) {
    return new Promise((resolve, reject) => {
      gm(this.file.path)
      .options({imageMagick: true})
      .resize(width, width)
      .noProfile()
      .write(this.tmpPath(size), (e) => { e ? reject(e) : resolve() })
    })
  }

  upload () {
    return Promise.all([
      this.put('small'),
      this.put('medium'),
      this.put('original')
    ]).then(this.remove.bind(this))
  }

  remove () {
    return Promise.all([
      this.rm('small'),
      this.rm('medium'),
      this.rm('original')
    ]).then(this.update.bind(this))
  }

  rm (size) {
    return new Promise((resolve, reject) => {
      fs.unlink(this.tmpPath(size), (e) => { e ? reject(e) : resolve() })
    })
  }

  put (size) {
    return new Promise((resolve, reject) => {
      s3.putObject({
        ACL: 'public-read',
        Body: fs.createReadStream(this.tmpPath(size)),
        Bucket: BUCKET,
        CacheControl: `max-age=${60 * 60 * 24}, public`,
        ContentType: 'image/jpeg',
        Key: this.s3Key(size)
      }, (e) => { e ? reject(e) : resolve() })
    })
  }

  update () {
    return this.model.update({imaged_at: new Date()})
  }

}
