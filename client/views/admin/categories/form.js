import React from 'react'
import {createCategory, navigate, updateCategory} from '../../../actions'

export default ({busy, category}) => {
  let meat = null
  let name = null
  let position = null

  const submit = (event) => {
    event.preventDefault()

    const values = {
      meat: meat.checked,
      name: name.value,
      position: +position.value
    }

    if (category) {
      const {id} = category
      updateCategory(id, values).then(() => {
        navigate('/admin/categories')
      }).catch(() => {})
    } else {
      createCategory(values).then(() => {
        navigate('/admin/categories')
      }).catch(() => {})
    }
  }

  return <form onSubmit={submit}>
    <div className='form-group'>
      <label htmlFor='name'>Name</label>
      <input autoFocus type='text' id='name' className='form-control' disabled={busy}
        required defaultValue={category ? category.name : ''}
        ref={(input) => { name = input }} />
    </div>
    <div className='form-group'>
      <label htmlFor='position'>Position</label>
      <input type='number' id='position' className='form-control' disabled={busy}
        required defaultValue={category ? category.position : ''}
        ref={(input) => { position = input }} />
    </div>
    <div className='form-check'>
      <label className='form-check-label'>
        <input id='meat' className='form-check-input' type='checkbox' disabled={busy}
          defaultChecked={category ? category.meat : false}
          ref={(input) => { meat = input }} />
        <span> Meat</span>
      </label>
    </div>
    <p className='text-xs-right'>
      <button type='submit' className='btn btn-success' disabled={busy}>
        Save
      </button>
    </p>
  </form>
}
