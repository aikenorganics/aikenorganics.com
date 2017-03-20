import React from 'react'
import Link from '../link'

export default ({grower}) => {
  const {id, name, mediumImage} = grower

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
    </div>
  </div>
}
