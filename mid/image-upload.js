'use strict'

const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true})
const aws = require('aws-sdk')
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
    this.sizes = {
      small: 100,
      medium: 250,
      original: null
    }
  }

  get ext () {
    return this.file.extension
  }

  get path () {
    return this.file.path
  }

  get mimetype () {
    return this.file.mimetype
  }

  s3Key (size) {
    return `${this.model.tableName}/${this.model.id}/${size}.${this.ext}`
  }

  cleanup () {
    fs.unlink(this.path)
  }

  process () {
    return Promise.all(
      Object.keys(this.sizes).map(this.put.bind(this))
    ).then(() => {
      this.cleanup()
      return this.model.update({imaged_at: new Date(), image_ext: this.ext})
    }).catch((e) => {
      this.cleanup()
      throw e
    })
  }

  stream (size) {
    if (size === 'original') return fs.createReadStream(this.path)
    let width = this.sizes[size]
    return gm(this.path).resize(width, width).noProfile().stream(this.ext)
  }

  put (size) {
    return new Promise((resolve, reject) => {
      s3.upload({
        ACL: 'public-read',
        Body: this.stream(size),
        Bucket: BUCKET,
        CacheControl: `max-age=${60 * 60 * 24}, public`,
        ContentType: this.mimetype,
        Key: this.s3Key(size)
      }, e => e ? reject(e) : resolve())
    })
  }

}
