'use strict'

const db = require('../db')
const Cookie = require('cookies').Cookie

let users = null

function findUser (email) {
  if (users) return Promise.resolve(users[email])
  return db.User.all().then((all) => {
    users = all.reduce((users, user) => {
      users[user.email] = user
      return users
    }, {})
    return users[email]
  })
}

module.exports = function (agent, email) {
  return findUser(email).then(function (user) {
    if (!user) return agent

    const value = new Buffer(JSON.stringify({
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
