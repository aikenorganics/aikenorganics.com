import xhr from 'ozymandias/client/xhr'
import {setErrors, setMessage, clearMessage} from './actions'

const json = (url, options) => {
  // Let the user know we're doing something.
  setMessage('info', 'Working…')

  return xhr(url, options).then((response) => {
    clearMessage()
    setErrors(null)
    return response
  }).catch((error) => {
    if (error.status === 422) {
      setErrors(error.response)
      setMessage('error', 'Whoops! Can you try that again?')
    } else {
      setMessage('error', 'Whoops! Something went wrong…')
    }
    throw error
  })
}

export const GET = json

export const POST = (url, options = {}) => {
  options.method = 'post'
  return json(url, options)
}

export const DELETE = (url, options = {}) => {
  options.method = 'delete'
  return json(url, options)
}
