import 'es6-promise'
import 'whatwg-fetch'
import {setErrors, setMessage, clearMessage} from './actions/index'

const json = (url, options) => {
  if (!options) options = {}
  if (!options.headers) options.headers = {}

  // Include credentials.
  options.credentials = 'include'

  // Set Accept header.
  options.headers.Accept = 'application/json'

  // Let the user know we're doing something.
  setMessage('info', 'Working…')

  return window.fetch(url, options).then((response) => {
    const error = (text) => {
      setMessage('error', text)
      const e = new Error(response.statusText)
      e.response = response
      throw e
    }

    if (response.ok) {
      return response.json().then((result) => {
        clearMessage()
        setErrors(null)
        return result
      }).catch((e) => {
        error('Uh oh! Something went wrong. :(')
      })
    }

    if (response.status === 422) {
      return response.json().then((errors) => {
        setErrors(errors)
        error('Whoops! Can you try that again?')
      })
    }

    return response.json().then((result) => {
      clearMessage()
      return result
    }).catch((e) => {
      error('Uh oh! Something went wrong. :(')
    })
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
