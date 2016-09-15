'use strict'

const escape = (value) => {
  if (value == null) return '""'
  value = value + ''
  if (/\S/.test(value) && !/[,"\r\n]/.test(value)) return value
  return `"${value.replace(/"/g, '""')}"`
}

exports.row = (...values) => values.map(escape).join(',') + '\n'
