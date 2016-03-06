'use strict'

const test = require('../test')

test('acme test', (t) => {
  t.agent
  .get('/.well-known/acme-challenge/HPvHWWOX7N2nItb5RAwhZIUYTD2wSfnf4DBwM7qz9RM')
  .expect('Content-Type', /text/)
  .expect(200)
  .expect('HPvHWWOX7N2nItb5RAwhZIUYTD2wSfnf4DBwM7qz9RM.ceWqF_4Sc8ECFdbNG-K06eUghznPWnSMud9vYlAafe0')
  .end(t.end)
})
