import React from 'react'
import Pagination from '../../pagination'
import Row from './row'
import Order from './order'
import {navigate} from '../../../actions'
import {setParams} from 'ozymandias/client/querystring'

export default ({full, locationId, locations, more, orders, page, productId, products, status, url}) => {
  const toggleFull = () => {
    navigate(setParams(url, {full: full ? null : '1'}))
  }

  const toggleStatus = (name) => {
    if (~status.indexOf(name)) {
      navigate(setParams(url, {page: null, status: status.filter((status) => status !== name)}))
    } else {
      navigate(setParams(url, {page: null, status: status.concat([name])}))
    }
  }

  const changeLocation = (event) => {
    navigate(setParams(url, {page: null, locationId: event.target.value || null}))
  }

  const changeProduct = (event) => {
    navigate(setParams(url, {page: null, productId: event.target.value || null}))
  }

  return <div>
    <h1>Orders</h1>
    <form className='hidden-print'>
      <div className='form-group'>
        <label className='form-check-inline'>
          <input className='form-check-input' type='checkbox' checked={full} onChange={toggleFull} />
          <span> Full</span>
        </label>
        {['open', 'complete', 'canceled'].map((name) => {
          return <label key={name} className='form-check-inline'>
            <input className='form-check-input' type='checkbox' checked={~status.indexOf(name)} onChange={() => toggleStatus(name)} />
            <span> {name.slice(0, 1).toUpperCase() + name.slice(1)}</span>
          </label>
        })}
      </div>
      <div className='form-group'>
        <label htmlFor='locationId'>Location</label>
        <select id='locationId' className='form-control' value={locationId || ''} onChange={changeLocation}>
          <option value=''>All Locations</option>
          <option value='delivery'>Delivery</option>
          {locations.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='productId'>Product</label>
        <select id='productId' className='form-control' onChange={changeProduct} value={productId || ''}>
          <option value=''>All Products</option>
          {products.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      </div>
      <a className='btn btn-secondary' href={setParams(url, {csv: '1'})}>
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
