import React from 'react'
import {navigate} from '../actions'

export default (props) => {
  const click = (e) => {
    if (e.metaKey) return
    e.preventDefault()
    navigate(props.href)
  }

  return <a {...props} onClick={(e) => click(e)}>{props.children}</a>
}
