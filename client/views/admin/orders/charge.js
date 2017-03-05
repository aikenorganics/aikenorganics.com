import React, {PureComponent} from 'react'
import {createPayment} from '../../../actions'

export default class Charge extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      amount: ''
    }
  }

  changeAmount (event) {
    this.setState({amount: event.target.value})
  }

  submit (event) {
    event.preventDefault()
    const {id} = this.props.order
    const {amount} = this.state
    createPayment(id, amount).then(() => {
      this.setState({amount: ''})
    }).catch(() => {})
  }

  render () {
    const {amount} = this.state

    return <form onSubmit={(event) => this.submit(event)}>
      <div className='input-group'>
        <span className='input-group-addon'>$</span>
        <input type='number' className='form-control' step='.01' min='0.50'
          required value={amount} onChange={(event) => this.changeAmount(event)} />
        <span className='input-group-btn'>
          <button className='btn btn-primary'>Charge</button>
        </span>
      </div>
    </form>
  }
}
