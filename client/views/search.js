import React, {PureComponent} from 'react'
import {navigate} from '../actions'

export default class Search extends PureComponent {
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

  submit (event) {
    event.preventDefault()
    const {value} = this.state
    const url = new window.URL(this.props.url, window.location.origin)
    if (value) url.searchParams.set('search', value)
    navigate(url.toString())
  }

  render () {
    const {url, inline} = this.props
    const {value} = this.state

    return <form className={inline ? 'form-inline' : ''} action={url} onSubmit={(event) => this.submit(event)}>
      <input type='search' value={value || ''} placeholder='Search…' className='form-control'
        onChange={(event) => this.setState({value: event.target.value})} />
    </form>
  }
}
