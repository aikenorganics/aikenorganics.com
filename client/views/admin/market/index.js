import React from 'react'
import {updateMarket} from '../../../actions'

const days = () => {
  return [
    <option key={0} value='0'>Sunday</option>,
    <option key={1} value='1'>Monday</option>,
    <option key={2} value='2'>Tuesday</option>,
    <option key={3} value='3'>Wednesday</option>,
    <option key={4} value='4'>Thursday</option>,
    <option key={5} value='5'>Friday</option>,
    <option key={6} value='6'>Saturday</option>
  ]
}

const hours = () => {
  const options = []
  for (let i = 1; i < 13; i++) {
    options.push(<option key={i} value={i % 12}>{i}</option>)
  }
  return options
}

const minutes = () => {
  const options = []
  for (let i = 0; i < 60; i++) {
    options.push(<option key={i} value={i}>{i < 10 ? '0' + i : i}</option>)
  }
  return options
}

export default ({busy, market}) => {
  let closeDayInput
  let closeHoursInput
  let closeMinutesInput
  let closeMeridiemInput
  let messageInput
  let newsInput
  let openDayInput
  let openHoursInput
  let openMinutesInput
  let openMeridiemInput

  const {
    closeDay,
    closeHours,
    closeMinutes,
    message,
    news,
    open,
    openDay,
    openHours,
    openMinutes
  } = market

  const save = (event) => {
    event.preventDefault()
    updateMarket({
      closeDay: +closeDayInput.value,
      closeHours: (closeMeridiemInput.value === 'am' ? +closeHoursInput.value : +closeHoursInput.value + 12),
      closeMinutes: +closeMinutesInput.value,
      message: messageInput.value,
      news: newsInput.value,
      openDay: +openDayInput.value,
      openHours: (openMeridiemInput.value === 'am' ? +openHoursInput.value : +openHoursInput.value + 12),
      openMinutes: +openMinutesInput.value
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
      <div className='form-group form-inline'>
        <label htmlFor='openDay'>Opens on</label>
        {' '}
        <select defaultValue={openDay} ref={(input) => {openDayInput = input}} className='form-control'>
          {days()}
        </select>
        {' at '}
        <select defaultValue={openHours % 12} ref={(input) => {openHoursInput = input}} className='form-control'>
          {hours()}
        </select>
        {' : '}
        <select defaultValue={openMinutes} ref={(input) => {openMinutesInput = input}} className='form-control'>
          {minutes()}
        </select>
        {' '}
        <select defaultValue={openHours < 12 ? 'am' : 'pm'} ref={(input) => {openMeridiemInput = input}} className='form-control'>
          <option value='am'>am</option>
          <option value='pm'>pm</option>
        </select>
      </div>
      <div className='form-group form-inline'>
        <label htmlFor='openDay'>Closes on</label>
        {' '}
        <select defaultValue={closeDay} ref={(input) => {closeDayInput = input}} className='form-control'>
          {days()}
        </select>
        {' at '}
        <select defaultValue={closeHours % 12} ref={(input) => {closeHoursInput = input}} className='form-control'>
          {hours()}
        </select>
        {' : '}
        <select defaultValue={closeMinutes} ref={(input) => {closeMinutesInput = input}} className='form-control'>
          {minutes()}
        </select>
        {' '}
        <select defaultValue={closeHours < 12 ? 'am' : 'pm'} ref={(input) => {closeMeridiemInput = input}} className='form-control'>
          <option value='am'>am</option>
          <option value='pm'>pm</option>
        </select>
      </div>
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
