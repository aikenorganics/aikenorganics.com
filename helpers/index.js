'use strict'

const marked = require('marked')
marked.setOptions({sanitize: true})
exports.marked = marked
exports.moment = require('moment')
exports.assets = require('ozymandias/assets')
