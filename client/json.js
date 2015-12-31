import 'es6-promise'
import 'whatwg-fetch'
import message from './message'

export default (url, options) => {
  if (!options) options = {}

  // Include credentials.
  options.credentials = 'include'

  // Grab the headers
  const headers = options.headers || (options.headers = {})

  // Set Accept and Content-Type
  headers.Accept = headers['Content-Type'] = 'application/json'

  // Stringify the body if necessary
  if (typeof options.body !== 'string') {
    options.body = JSON.stringify(options.body)
  }

  // Let the user know we're doing something.
  message('info', 'Working…')

  return window.fetch(url, options).then((res) => {
    if (res.ok) {
      message('success', 'Done.')
      return res.json()
    }
    message('error', res.statusText)
    throw new Error(res.statusText)
  })
}
