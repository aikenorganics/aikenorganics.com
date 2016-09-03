import React from 'react'
import {updateGrower} from '../../../actions'

export default ({busy, grower}) => {
  const update = (values) => {
    updateGrower(grower.id, values).catch(() => {})
  }

  return <div>
    {grower.active
      ? <button disabled={busy} className='btn btn-secondary btn-sm pull-xs-right' onClick={() => update({active: false})}>
        Deactivate
      </button>
      : <button disabled={busy} className='btn btn-success btn-sm pull-xs-right' onClick={() => update({active: true})}>
        Activate
      </button>
    }
    <h1>
      {grower.name} <small>
        {grower.active
          ? <span className='tag tag-primary'>Active</span>
          : <span className='tag tag-default'>Inactive</span>
        }
      </small>
    </h1>
    <hr />
  </div>
}
