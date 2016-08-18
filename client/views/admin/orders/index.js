import React from 'react'
import Link from '../../link'
import Pagination from '../../pagination'
import Row from './row'
import Order from './order'
import {navigate} from '../../../actions'
import {params} from '../../../url'

export default ({full, locationId, locations, more, orders, page, product, products, status, url}) => {
  const toggleFull = (e) => {
    navigate(params(url, {full: full ? null : '1'}))
  }

  const toggleStatus = (name) => {
    if (~status.indexOf(name)) {
      navigate(params(url, {page: null, status: status.filter((status) => status !== name)}))
    } else {
      navigate(params(url, {page: null, status: status.concat([name])}))
    }
  }

  const changeLocation = (e) => {
    navigate(params(url, {page: null, locationId: e.target.value || null}))
  }

  const changeProduct = (e) => {
    navigate(params(url, {page: null, productId: e.target.value || null}))
  }

  return <div>
    <h1>
      Orders
      {product
        ? <span> for <Link href={`/products/${product.id}`}>{product.name}</Link></span>
        : ''
      }
    </h1>
    <form className='form-inline hidden-print' method='get' action='/admin/orders'>
      <div className='btn-group'>
        <label className={`btn ${full ? 'btn-success' : 'btn-default'}`}>
          <input type='checkbox' checked={full} onChange={toggleFull} />
          <span> Full</span>
        </label>
      </div> <div className='btn-group'>
        {['open', 'complete', 'canceled'].map((name) => {
          return <label key={name} className={`btn ${~status.indexOf(name) ? 'btn-success' : 'btn-default'}`}>
            <input type='checkbox' checked={~status.indexOf(name)} onChange={(e) => toggleStatus(name)} />
            <span> {name.slice(0, 1).toUpperCase() + name.slice(1)}</span>
          </label>
        })}
      </div> <div className='form-group'>
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
      </div>
    </form>
    <hr />
    {full
      ? <div>
        {orders.map((order) => <Order key={order.id} order={order} />)}
      </div>
      : <table className='table'>
        <thead>
          <tr>
            <th></th>
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
    }
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
