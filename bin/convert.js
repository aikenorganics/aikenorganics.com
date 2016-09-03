#!/usr/bin/env node

'use strict'

const db = require('./db')

Promise.all([
  db.Grower.not({imageUpdatedAt: null}).all(),
  db.Product.not({imageUpdatedAt: null}).all(),
  db.User.not({imageUpdatedAt: null}).all()
]).then(([growers, products, users]) => (
  Promise.all([].concat(growers, products, users).map((model) => (
    model.convertImage().then(() => {
      console.log(`Converted ${model.tableName}:${model.id}`)
    })
  )))
))
.then(() => db.close())
.catch((error) => console.log(error))
