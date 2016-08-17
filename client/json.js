import {setErrors, setMessage, clearMessage} from './actions'

const json = (url, options = {}) => new Promise((resolve, reject) => {
  const request = new window.XMLHttpRequest()
  const headers = options.headers || {}
  let {body} = options

  // Display an error, optionally with state.
  const error = (text, responseText = null) => {
    setMessage('error', text)
    const error = new Error('xhr error')
    try {
      error.state = JSON.parse(responseText)
    } catch (error) {}
    reject(error)
  }

  // Stringify the body if necessary.
  if (typeof body === 'object' && !(body instanceof window.FormData)) {
    body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  // Set Accept header.
  headers.Accept = 'application/json'

  // Include credentials.
  request.withCredentials = true

  // Open the request.
  request.open(options.method || 'get', url)

  // Set headers.
  for (const key in headers) request.setRequestHeader(key, headers[key])

  // Send it!
  request.send(body)

  // Complete
  request.addEventListener('load', () => {
    const {status, responseText} = request

    if (status === 200) {
      clearMessage()
      setErrors(null)
      resolve(JSON.parse(responseText))
    } else if (status === 422) {
      const errors = JSON.parse(responseText)
      setErrors(errors)
      error('Whoops! Can you try that again?')
    } else {
      error('Whoops! Something went wrong…', responseText)
    }
  })

  // Error
  request.addEventListener('error', (event) => {
    error('Whoops! Something went wrong…')
  })

  // Timeout
  request.addEventListener('timeout', (event) => {
    error('Whoops! Something went wrong…')
  })

  // Let the user know we're doing something.
  setMessage('info', 'Working…')
})

export const GET = json

export const POST = (url, options = {}) => {
  options.method = 'post'
  return json(url, options)
}

export const DELETE = (url, options = {}) => {
  options.method = 'delete'
  return json(url, options)
}
