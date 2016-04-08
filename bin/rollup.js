#!/usr/bin/env node

const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')

rollup({
  entry: process.argv[2],
  onwarn: () => {},
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: [
        'transform-object-assign'
      ],
      presets: [
        'react',
        'es2015-rollup'
      ]
    })
  ]
}).then((code) => {
  console.log(code.generate({format: 'cjs'}).code)
}).catch((e) => {
  console.error(e.stack)
})
