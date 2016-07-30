#!/usr/bin/env node

'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3({apiVersion: '2006-03-01'})
const Bucket = process.env.BUCKET

const clean = (ContinuationToken) => {
  s3.listObjectsV2({Bucket, ContinuationToken}, (error, data) => {
    if (error) return console.log(error)
    const keys = data.Contents
      .map(({Key}) => Key)
      .filter((Key) => !/(small|medium|original)$/.test(Key))
    console.log(keys)
    if (data.IsTruncated) clean(data.NextContinuationToken)
  })
}

clean()
