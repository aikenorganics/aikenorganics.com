import React, {Children, Component, PropTypes} from 'react'

const optionalParam = /\((.*?)\)/g
const namedParam = /(\(\?)?:\w+/g
const splatParam = /\*\w+/g
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g

const toRegExp = (path) => {
  return new RegExp('^' + path
    .replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, (match, optional) => optional ? match : '([^/?]+)')
    .replace(splatParam, '([^/]*?)') +
  '(?:\\?([\\s\\S]*))?$')
}

export class Route extends Component { }

export default class Router extends Component {

  static propTypes () {
    return {
      state: PropTypes.object,
      children: PropTypes.object
    }
  }

  match (route, prefix = '') {
    const {state} = this.props
    const {children, Component, path} = route.props
    prefix = prefix + path

    if (children) {
      for (let child of Children.toArray(children)) {
        const match = this.match(child, prefix)
        if (match) return <Component {...state}>{match}</Component>
      }
      return null
    }

    if (toRegExp(prefix).test(state.path)) {
      return <Component {...state}/>
    }

    return null
  }

  render () {
    const {children} = this.props

    for (let child of Children.toArray(children)) {
      const match = this.match(child)
      if (match) return match
    }

    return ''
  }
}
