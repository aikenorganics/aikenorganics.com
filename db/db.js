'use strict'

let DB = require('ozymandias/db')
let db = new DB(process.env.DATABASE_URL)

db.log = function (value) {
  if (process.env.NODE_ENV === 'development') {
    console.log(value)
  }
}

module.exports = db
