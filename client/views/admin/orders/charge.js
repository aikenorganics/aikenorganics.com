import React, {PureComponent} from 'react'
import {createPayment} from '../../../actions/index'

export default class Charge extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      amount: ''
    }
  }

  changeAmount (e) {
    this.setState({amount: e.target.value})
  }

  submit (e) {
    e.preventDefault()
    const {id} = this.props.order
    const {amount} = this.state
    createPayment(id, amount).then(() => {
      this.setState({amount: ''})
    }).catch(() => {})
  }

  render () {
    const {amount} = this.state

    return <form onSubmit={(e) => this.submit(e)}>
      <div className='input-group'>
        <span className='input-group-addon'>$</span>
        <input type='number' className='form-control' step='.01' min='0.50'
          required value={amount} onChange={(e) => this.changeAmount(e)}/>
        <span className='input-group-btn'>
          <button className='btn btn-primary'>Charge</button>
        </span>
      </div>
    </form>
  }

}
