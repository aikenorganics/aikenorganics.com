import React from 'react'
import {updateMarket} from '../../../actions'

export default ({busy, market: {message, news, open}}) => {
  let messageInput
  let newsInput

  const save = (event) => {
    event.preventDefault()
    updateMarket({
      news: newsInput.value,
      message: messageInput.value
    }).catch(() => {})
  }

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
    <form onSubmit={save}>
      <div className='form-group'>
        <label htmlFor='market-message'>Message</label>
        <textarea id='market-message' className='form-control' defaultValue={message} rows='5'
          ref={(input) => { messageInput = input }} />
      </div>
      <div className='form-group'>
        <label htmlFor='news'>News</label>
        <textarea id='news' className='form-control' defaultValue={news} rows='5'
          ref={(input) => { newsInput = input }} />
      </div>
      <p>
        <button className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  </div>
}
