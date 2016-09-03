import React from 'react'

export default ({order}) => {
  switch (order.status) {
    case 'complete':
      return <span className='tag tag-success'>Complete</span>
    case 'open':
      return <span className='tag tag-info'>Open</span>
    case 'canceled':
      return <span className='tag tag-danger'>Canceled</span>
    default:
      return ''
  }
}
