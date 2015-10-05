let message = require('./message')
require('es6-promise')
require('whatwg-fetch')

module.exports = (url, options) => {
  if (!options) options = {}

  // Include credentials.
  options.credentials = 'include'

  // Grab the headers
  let headers = options.headers
  if (!headers) headers = options.headers = {}

  // Set Accept and Content-Type
  headers['Accept'] = headers['Content-Type'] = 'application/json'

  // Stringify the body if necessary
  if (typeof options.body !== 'string') {
    options.body = JSON.stringify(options.body)
  }

  message('info', 'Working…')

  return fetch(url, options).then((res) => {
    if (res.ok) return res.json()
    message('error', res.statusText)
    throw new Error(res.statusText)
  }).then((data) => {
    if (data && data.message) message('success', data.message)
    return data
  })
}
