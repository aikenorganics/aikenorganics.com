import React from 'react'

export default ({cart, products}) => {
  const unavailable = products.filter(({active, available, grower, id}) => {
    return !active || !grower.active || available < (+cart[id] || 0)
  })

  if (!unavailable.length) return null

  return <div className='alert alert-warning'>
    <p>
      <strong>Whoops! </strong>
      Some of the items in your cart are no longer available.
      Sorry about that!
    </p>
    <ul>
      {unavailable.map(({active, available, grower, id, name}) => {
        return <li key={id}>
          <a href={`/products/${id}`}>{name}</a>
          <span> - </span>
          <span> There {+cart[id] > 1 ? 'are' : 'is'} {+cart[id]} in your cart, but </span>
          {!active || !grower.active
            ? 'it is not currently offered by the grower.'
            : available === 0
            ? 'none are available.'
            : available === 1
            ? 'only one is available.'
            : `only ${available} are available.`
          }
        </li>
      })}
    </ul>
  </div>
}
