import React from 'react'
import Link from '../link'

export default ({grower}) => {
  const {id, name, mediumImage, url} = grower

  return <div className='card'>
    <Link href={`/growers/${id}`}>
      <img className='card-img-top img-fluid' src={mediumImage} />
    </Link>
    <div className='card-block'>
      <h4 className='card-title text-truncate'>
        <Link href={`/growers/${id}`}>
          {name}
        </Link>
      </h4>
      {url ? <h6 className='card-subtitle text-muted text-truncate'>
        <a target='_blank' href={url}>{url}</a>
      </h6> : null}
    </div>
  </div>
}
