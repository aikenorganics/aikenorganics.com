import 'es6-promise'
import fetch from 'isomorphic-fetch'
import message from './message'
import {setErrors} from './actions'

const json = (url, options) => {
  if (!options) options = {}
  if (!options.headers) options.headers = {}

  // Include credentials.
  options.credentials = 'include'

  // Set Accept header.
  options.headers.Accept = 'application/json'

  // Let the user know we're doing something.
  message('info', 'Working…')

  return fetch(url, options).then((res) => {
    if (res.ok) {
      message('success', 'Done.')
      setErrors(null)
      return res.json()
    } else if (res.status === 422) {
      return res.json().then((errors) => {
        setErrors(errors)
        message('error', 'There was a problem saving your data…')
        throw new Error(res.statusText)
      })
    }
    message('error', res.statusText)
    throw new Error(res.statusText)
  })
}

const withMethod = (method) => (url, options) => {
  if (!options) options = {}
  if (!options.headers) options.headers = {}

  // Set method
  options.method = method

  // Stringify the body if necessary.
  const {body, headers} = options
  const multipart = body instanceof window.FormData
  if (!multipart && body && typeof body !== 'string') {
    options.body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  return json(url, options)
}

export const GET = json
export const POST = withMethod('post')
export const PUT = withMethod('put')
export const DELETE = withMethod('delete')
