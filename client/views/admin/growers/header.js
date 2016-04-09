import React from 'react'
import {updateGrower} from '../../../actions/index'

export default ({busy, grower}) => {
  const update = (values) => {
    updateGrower(grower.id, values).catch((e) => {})
  }

  return <div>
    {grower.active
      ? <button disabled={busy} className='btn btn-default btn-sm pull-right' onClick={(e) => update({active: false})}>
        Deactivate
      </button>
      : <button disabled={busy} className='btn btn-primary btn-sm pull-right' onClick={(e) => update({active: true})}>
        Activate
      </button>
    }
    <h1>
      {grower.name}&nbsp;
      <small>
        {grower.active
          ? <span className='label label-primary'>Active</span>
          : <span className='label label-default'>Inactive</span>
        }
      </small>
    </h1>
    <hr/>
  </div>
}
