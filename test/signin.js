'use strict'

let db = require('../db')
let Cookie = require('cookies').Cookie

let users = null

function findUser (email) {
  return new Promise(function (resolve, reject) {
    if (users) return resolve(users[email])
    return db.User.all().then(function (all) {
      users = all.reduce(function (users, user) {
        users[user.email] = user
        return users
      }, {})
      return resolve(users[email])
    }).catch(reject)
  })
}

module.exports = function (agent, email) {
  return findUser(email).then(function (user) {
    if (!user) return agent

    let value = new Buffer(JSON.stringify({
      userId: user.id
    })).toString('base64')

    agent.saveCookies({
      headers: {
        'set-cookie': new Cookie('aikenorganics', value).toHeader()
      }
    })

    return agent
  })
}
