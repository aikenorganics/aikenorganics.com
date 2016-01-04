'use strict'

module.exports = (config) => {
  config.set({
    browsers: ['Chrome'],
    files: ['public/js/test.js'],
    frameworks: ['tap'],
    singleRun: true
  })
}
