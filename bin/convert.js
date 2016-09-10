#!/usr/bin/env node

'use strict'

const db = require('../db')

Promise.all([
  db.Grower.not({imageUpdatedAt: null}).all(),
  db.Product.not({imageUpdatedAt: null}).all(),
  db.User.not({imageUpdatedAt: null}).all()
]).then(([growers, products, users]) => {
  const models = [].concat(growers, products, users)
  const convert = () => {
    if (!models.length) return
    const model = models.pop()
    console.log(`Converting ${model.tableName}:${model.id}`)
    return model.convertImage().then(() => convert())
  }
  return Promise.all([convert(), convert(), convert()])
})
.then(() => db.close())
.catch((error) => console.log(error))
