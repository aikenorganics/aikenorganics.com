import React, {PureComponent, PropTypes} from 'react'
import {updateMarket} from '../../../actions'

export default class Index extends PureComponent {

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

  save (event) {
    event.preventDefault()
    updateMarket(this.state).catch(() => {})
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
          onClick={() => updateMarket({open: !open}).catch(() => {})}>
          {open ? 'Close' : 'Open'} It
        </button>
      </p>
      <hr />
      <form onSubmit={(event) => this.save(event)}>
        <div className='form-group'>
          <label htmlFor='message'>Message</label>
          <textarea id='message' className='form-control' value={message} rows='5'
            onChange={(event) => this.setState({message: event.target.value})} />
        </div>
        <p>
          <button className='btn btn-success' disabled={busy}>
            Save
          </button>
        </p>
      </form>
    </div>
  }

}
