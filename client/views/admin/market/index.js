import React, {Component, PropTypes} from 'react'
import {updateMarket} from '../../../actions/index'

export default class Index extends Component {

  static get propTypes () {
    return {
      busy: PropTypes.bool,
      market: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    const {message} = props.market
    this.state = {
      message
    }
  }

  save (e) {
    e.preventDefault()
    updateMarket(this.state).catch((e) => {})
  }

  render () {
    const {busy, market: {open}} = this.props
    const {message} = this.state

    return <div>
      <h1>Market</h1>
      <p>
        <strong>The market is {open ? 'open' : 'closed'}. </strong>
        <button type='button' disabled={busy}
          className={`btn ${open ? 'btn-danger' : 'btn-success'}`}
          onClick={() => updateMarket({open: !open}).catch((e) => {})}>
          {open ? 'Close' : 'Open'} It
        </button>
      </p>
      <hr/>
      <form onSubmit={(e) => this.save(e)}>
        <div className='form-group'>
          <label htmlFor='message'>Message</label>
          <textarea id='message' className='form-control' value={message} rows='5'
            onChange={(e) => this.setState({message: e.target.value})}/>
        </div>
        <p>
          <button className='btn btn-primary' disabled={busy}>
            Save
          </button>
        </p>
      </form>
    </div>
  }

}
