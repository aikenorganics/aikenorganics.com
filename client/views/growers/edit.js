import React from 'react'
import Nav from './nav'
import Form from './form'
import {imageGrower} from '../../actions/index'

export default ({busy, canEdit, errors, grower, path}) => {
  const {id, mediumImage} = grower

  const upload = ({target}) => {
    imageGrower(id, target.files[0]).catch(() => {})
    target.value = ''
  }

  return <div className='row'>
    <div className='col-md-3 text-center'>
      <p>
        <img className='img-rounded' src={mediumImage}/>
      </p>
      <p>
        <input type='file' className='form-control' disabled={busy} onChange={upload}/>
      </p>
      <Nav canEdit={canEdit} grower={grower} path={path}/>
    </div>
    <div className='col-md-9'>
      <h1>Edit Grower</h1>
      <hr/>
      <Form busy={busy} errors={errors} grower={grower}/>
    </div>
  </div>
}
