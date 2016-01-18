import React from 'react'
import {imageUser} from '../../../actions'

export default ({busy, user: {id, mediumImage}}) => {
  const upload = (e) => {
    imageUser(id, e.target.files[0]).then(() => e.target.value = '')
  }

  return <div>
    <div className='form-group text-center'>
      <img className='img-rounded' src={mediumImage}/>
    </div>
    <div className='form-group'>
      <input type='file' className='form-control' onChange={upload} disabled={busy}/>
    </div>
  </div>
}
