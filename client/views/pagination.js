import React from 'react'
import Link from './link'
import {params} from '../url'

export default ({more, page, url}) => {
  return <div>
    {more
      ? <Link href={params(url, {page: page + 1})} className='float-xs-right'>
        Next Page →
      </Link>
      : ''
    }
    {page > 1
      ? <Link href={params(url, {page: page - 1})}>
        ← Previous Page
      </Link>
      : ''
    }
  </div>
}
