#!/usr/bin/env node

'use strict'

const db = require('../db')
const {Grower, Product, User} = db

const queue = (job, concurrency = 1) => {
  const enqueue = () => {
    const result = job()
    if (result) return result.then(enqueue)
  }

  const workers = []
  for (let i = 0; i < concurrency; i++) workers.push(enqueue())
  return Promise.all(workers)
}

Promise.all([Grower, Product, User].map((Model) =>
  Model.not({imageUpdatedAt: null}).all()
)).then((result) => {
  const models = [].concat(...result)
  return queue(() => {
    if (!models.length) return
    const model = models.pop()
    console.log(`Converting ${model.tableName}:${model.id}`)
    return model.convertImage()
  }, 3)
})
.then(() => db.close())
.catch((error) => console.log(error))
