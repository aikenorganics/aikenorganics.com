import React from 'react'

export default ({order}) => {
  switch (order.status) {
    case 'complete':
      return <span className='label label-success'>Complete</span>
    case 'open':
      return <span className='label label-info'>Open</span>
    case 'canceled':
      return <span className='label label-danger'>Canceled</span>
    default:
      return ''
  }
}
