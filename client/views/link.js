import React from 'react'
import {navigate} from '../actions'

export default (props) => {
  const click = (event) => {
    if (event.metaKey) return
    event.preventDefault()
    navigate(props.href)
  }

  return <a {...props} onClick={(event) => click(event)}>{props.children}</a>
}
