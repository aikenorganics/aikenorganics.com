'use strict'

const User = require('../db/user')
const {get, post} = require('koa-route')

module.exports = [

  get('/signup', async (_) => { _.render() }),

  post('/signup', async (_) => {
    const {email} = _.request.body
    let user = await User.where('trim(lower(email)) = trim(lower(?))', email).find()

    if (user) {
      _.status = 422
      _.body = {email: ['That user already exists! Is it you?']}
      return
    }

    user = await User.create(_.permit(
      'first', 'last', 'phone', 'password', 'email'
    ))

    await _.signIn(user)
    _.body = {}
  })

]
