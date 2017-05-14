import React, {PureComponent} from 'react'
import {navigate} from '../actions'
import {setParams} from 'ozymandias/client/querystring'

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
    const {url} = this.props
    const {value} = this.state
    navigate(value ? setParams(url, {search: value}) : url)
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
