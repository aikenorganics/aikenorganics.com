import React from 'react'
import Nav from './nav'
import Form from './form'
import {imageProduct, updateProduct} from '../../actions'

export default ({busy, categories, canEdit, currentUser, errors, path, product}) => {
  const {active, id, grower, mediumImage} = product

  const upload = ({target}) => {
    imageProduct(id, target.files[0]).catch(() => {})
    target.value = ''
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
            onClick={() => updateProduct(id, {active: false}).catch(() => {})}>
            Deactivate
          </button>
          : <button className='btn btn-success btn-sm' disabled={busy}
            onClick={() => updateProduct(id, {active: true}).catch(() => {})}>
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
      <Form busy={busy} categories={categories} currentUser={currentUser} errors={errors} product={product}/>
    </div>
  </div>
}
