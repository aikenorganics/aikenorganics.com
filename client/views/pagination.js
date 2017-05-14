import React from 'react'
import Link from './link'
import {setParams} from 'ozymandias/client/querystring'

export default ({more, page, url}) => {
  return <div>
    {more
      ? <Link href={setParams(url, {page: page + 1})} className='float-xs-right'>
        Next Page →
      </Link>
      : ''
    }
    {page > 1
      ? <Link href={setParams(url, {page: page - 1})}>
        ← Previous Page
      </Link>
      : ''
    }
  </div>
}
