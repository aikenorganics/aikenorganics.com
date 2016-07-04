import React from 'react'
import Link from '../link'
import Input from '../input'
import {updateProduct} from '../../actions/index'

export default ({busy, product: {id, active, name, supply}}) => {
  const save = (values) => updateProduct(id, values).catch((e) => {})

  return <tr>
    <td>
      <Link href={`/products/${id}`}>{name}</Link>
    </td>
    <td>
      <Input className='form-control' type='number' value={supply || 0} min='0' required
        onUpdate={(value) => save({supply: value || 0})}/>
    </td>
    <td>
      <div className='btn-group'>
        <button type='button' disabled={busy}
          className={`btn ${active ? 'btn-success' : 'btn-default'}`}
          onClick={() => this.save({active: true})}>
          Active
        </button>
        <button type='button' disabled={busy}
          className={`btn ${active ? 'btn-default' : 'btn-danger'}`}
          onClick={() => this.save({active: false})}>
          Inactive
        </button>
      </div>
    </td>
  </tr>
}
