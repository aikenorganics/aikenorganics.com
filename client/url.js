import url from 'url'
import qs from 'querystring'

export const params = (s, values) => {
  const location = url.parse(s)
  values = Object.assign(qs.parse(location.query), values)
  for (const key in values) if (values[key] == null) delete values[key]
  location.search = qs.stringify(values)
  return url.format(location)
}
