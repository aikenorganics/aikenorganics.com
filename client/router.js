import React, {Children, Component} from 'react'

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

export default ({state, children}) => {
  const {path} = state

  children = Children.toArray(children)

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (toRegExp(child.props.path).test(path)) {
      return <child.props.Component state={state}/>
    }
  }
}
