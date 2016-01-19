import React from 'react'
import Nav from './nav'
import Form from './form'
import {imageProduct, updateProduct} from '../../actions'

export default ({busy, categories, canEdit, errors, path, product}) => {
  const {active, id, grower, mediumImage} = product

  const upload = (e) => {
    imageProduct(id, e.target.files[0]).then(() => e.target.value = '')
  }

  return <div className='row'>
    <div className='col-md-3'>
      <p className='text-center'>
        <img className='img-rounded' src={mediumImage}/>
      </p>
      <p>
        <input type='file' className='form-control' onChange={upload} disabled={busy}/>
      </p>
      <Nav canEdit={canEdit} path={path} product={product}/>
    </div>
    <div className='col-md-9'>
      <h1>Edit Product</h1>
      <div className='pull-right'>
        {active
          ? <button className='btn btn-default btn-sm' disabled={busy}
            onClick={() => updateProduct(id, {active: false})}>
            Deactivate
          </button>
          : <button className='btn btn-primary btn-sm' disabled={busy}
            onClick={() => updateProduct(id, {active: true})}>
            Activate
          </button>
        }
      </div>
      <h4>
        <span>{grower.name} </span>
        {active
          ? <span className='label label-primary'>Active</span>
          : <span className='label label-default'>Inactive</span>
        }
      </h4>
      <hr/>
      <Form busy={busy} categories={categories} errors={errors} product={product}/>
    </div>
  </div>
}
