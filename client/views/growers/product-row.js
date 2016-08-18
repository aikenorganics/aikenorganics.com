import React from 'react'
import Link from '../link'
import Form from '../form'
import {updateProduct} from '../../actions'

export default ({busy, product: {id, active, name, supply}}) => {
  const save = (values) => updateProduct(id, values).catch((e) => {})

  return <tr>
    <td>
      <Link href={`/products/${id}`}>{name}</Link>
    </td>
    <td>
      <Form onUpdate={(value) => save({supply: value || 0})}>
        <input className='form-control' type='number' defaultValue={supply || 0} min='0' required />
      </Form>
    </td>
    <td>
      <div className='btn-group'>
        <button type='button' disabled={busy}
          className={`btn ${active ? 'btn-success' : 'btn-default'}`}
          onClick={() => save({active: true})}>
          Active
        </button>
        <button type='button' disabled={busy}
          className={`btn ${active ? 'btn-default' : 'btn-danger'}`}
          onClick={() => save({active: false})}>
          Inactive
        </button>
      </div>
    </td>
  </tr>
}
