import React, {Component} from 'react'
import Link from '../../link'
import {navigate} from '../../../actions'

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
  }

  submit (e) {
    e.preventDefault()
    navigate(`/admin/users?search=${encodeURIComponent(this.state.query)}`)
  }

  render () {
    const {query} = this.state

    return <form className='form-inline' action='/admin/users' onSubmit={(e) => this.submit(e)}>
      <input type='search' className='form-control' value={query} onChange={(e) => this.setState({query: e.target.value})} placeholder='Search…'/>
      &nbsp;
      <Link href='/admin/users/emails'>Email List</Link>
    </form>
  }
}
