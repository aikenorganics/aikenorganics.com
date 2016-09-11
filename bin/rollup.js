#!/usr/bin/env node

const rollup = require('rollup').rollup
const buble = require('rollup-plugin-buble')

rollup({
  entry: process.argv[2],
  onwarn: () => {},
  plugins: [
    buble({objectAssign: "require('object-assign')"}),
    require('./assets')
  ]
}).then((code) => {
  console.log(code.generate({format: 'cjs'}).code)
}).catch((error) => {
  console.error(error.stack)
})
