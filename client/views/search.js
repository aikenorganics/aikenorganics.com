import React, {Component} from 'react'
import {navigate} from '../actions/index'
import {params} from '../url'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps (props) {
    if (props.value !== this.props.value) {
      this.setState({
        value: props.value
      })
    }
  }

  submit (e) {
    e.preventDefault()
    const {url} = this.props
    const {value} = this.state
    navigate(params(url, {search: value}))
  }

  render () {
    const {url} = this.props
    const {value} = this.state

    return <form className='form-inline' action={url} onSubmit={(e) => this.submit(e)}>
      <input type='search' value={value || ''} placeholder='Search…' className='form-control'
        onChange={(e) => this.setState({value: e.target.value})}/>
    </form>
  }
}
