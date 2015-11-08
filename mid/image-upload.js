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

  s3Key (size) {
    return `${this.model.tableName}/${this.model.id}/${size}.jpg`
  }

  tmpPath (size) {
    if (size === 'original') return this.file.path
    return `tmp/uploads/${this.file.name}-${size}.jpg`
  }

  process () {
    return Promise.all(
      Object.keys(this.sizes).map(this.resize.bind(this))
    ).then(() => {
      for (let size in this.sizes) fs.unlink(this.tmpPath(size))
      return this.model.update({imaged_at: new Date()})
    })
  }

  resize (size) {
    if (size === 'original') return this.put(size)
    let width = this.sizes[size]
    return new Promise((resolve, reject) => {
      gm(this.file.path)
      .resize(width, width)
      .noProfile()
      .write(this.tmpPath(size), e => e ? reject(e) : resolve())
    }).then(this.put.bind(this, size))
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
      }, e => e ? reject(e) : resolve())
    })
  }

}
