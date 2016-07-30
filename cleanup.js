#!/usr/bin/env node

'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3({apiVersion: '2006-03-01'})
const Bucket = process.env.BUCKET

const all = () => (
  new Promise((resolve, reject) => {
    let all = []
    const fetch = (ContinuationToken) => {
      s3.listObjectsV2({Bucket, ContinuationToken}, (error, data) => {
        if (error) return reject(error)
        all = all.concat(data)
        if (data.IsTruncated) fetch(data.NextContinuationToken)
        else resolve(all)
      })
    }
    fetch()
  })
)

all().then((objects) => {
  console.log(objects)
}).catch((error) => {
  console.log(error)
})
