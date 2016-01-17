import qs from 'querystring'

export const withParams = (url, params) => {
  return url.replace(/(?:\?([\s\S]*))?$/, (match, search) => {
    return '?' + qs.stringify(Object.assign(qs.parse(search), params))
  })
}
