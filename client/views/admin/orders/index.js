import React from 'react'
import Pagination from '../../pagination'
import Row from './row'
import Order from './order'
import {navigate} from '../../../actions'
import {params} from '../../../url'

export default ({full, locationId, locations, more, orders, page, product, products, status, url}) => {
  const toggleFull = () => {
    navigate(params(url, {full: full ? null : '1'}))
  }

  const toggleStatus = (name) => {
    if (~status.indexOf(name)) {
      navigate(params(url, {page: null, status: status.filter((status) => status !== name)}))
    } else {
      navigate(params(url, {page: null, status: status.concat([name])}))
    }
  }

  const changeLocation = (event) => {
    navigate(params(url, {page: null, locationId: event.target.value || null}))
  }

  const changeProduct = (event) => {
    navigate(params(url, {page: null, productId: event.target.value || null}))
  }

  return <div>
    <h1>Orders</h1>
    <form className='form-inline hidden-print' method='get' action='/admin/orders'>
      <label className='form-check-inline'>
        <input className='form-check-input' type='checkbox' checked={full} onChange={toggleFull} />
        <span> Full</span>
      </label>
      {['open', 'complete', 'canceled'].map((name) => {
        return <label key={name} className='form-check-inline'>
          <input className='form-check-input' type='checkbox' checked={~status.indexOf(name)} onChange={() => toggleStatus(name)} />
          <span> {name.slice(0, 1).toUpperCase() + name.slice(1)}</span>
        </label>
      })} <div className='form-group'>
        <select className='form-control' style={{maxWidth: 300}} value={locationId} onChange={changeLocation}>
          <option value=''>All Locations</option>
          <option value='delivery'>Delivery</option>
          {locations.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      </div> <div className='form-group'>
        <select className='form-control' style={{maxWidth: 300}} onChange={changeProduct}>
          <option value=''>All Products</option>
          {products.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      </div> <a className='btn btn-secondary' href={params(url, {csv: '1'})}>
        Export CSV
      </a>
    </form>
    <hr />
    {full
      ? <div>
        {orders.map((order) => <Order key={order.id} order={order} />)}
      </div>
      : <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Member</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => <Row key={order.id} order={order} />)}
          </tbody>
        </table>
      </div>
    }
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
