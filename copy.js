#!/usr/bin/env node

'use strict'

const db = require('./db')
const aws = require('aws-sdk')
const mime = require('mime')
const s3 = new aws.S3({apiVersion: '2006-03-01'})
const BUCKET = process.env.BUCKET

Promise.all([
  db.Grower.not({image_updated_at: null}).all(),
  db.Product.not({image_updated_at: null}).all(),
  db.User.not({image_updated_at: null}).all()
]).then(([growers, products, users]) => {
  const models = growers.concat(products).concat(users)

  const move = () => {
    const model = models.pop()
    if (!model) return console.log('DONE!')

    Promise.all(['small', 'medium', 'original'].map((size) => (
      new Promise((resolve, reject) => {
        const {id, image_ext, tableName} = model
        const source = `${BUCKET}/${tableName}/${id}/image/${size}.${image_ext}`
        const key = `${tableName}/${id}/image/${size}`

        console.log(`${source} => ${key}`)

        s3.copyObject({
          Bucket: BUCKET,
          CopySource: source,
          Key: key,
          ACL: 'public-read',
          CacheControl: `max-age=${60 * 60 * 24 * 7},public`,
          ContentType: mime.lookup(image_ext)
        }, (error) => {
          if (error) return reject(error)
          resolve()
        })
      })
    ))).then(move).catch((error) => {
      console.log(error)
    })
  }

  move()
})
