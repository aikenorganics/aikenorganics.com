import React, {Component} from 'react'
import {navigate} from '../actions'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  submit (e) {
    e.preventDefault()
    const {url} = this.props
    const {search} = this.state
    navigate(`${url}?search=${encodeURIComponent(search)}`)
  }

  render () {
    const {search} = this.state

    return <form className='form-inline' action='/admin/users' onSubmit={(e) => this.submit(e)}>
      <input type='search' className='form-control' value={search}
        onChange={(e) => this.setState({search: e.target.value})} placeholder='Search…'/>
    </form>
  }
}
