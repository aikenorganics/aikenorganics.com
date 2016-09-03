import React from 'react'
import Link from '../link'
import Pagination from '../pagination'
import Search from '../search'
import Product from './product'
import {navigate} from '../../actions'

export default ({busy, cart, categoryId, categories, page, products, market: {open}, more, search, url, currentUser}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <Search url='/products' value={search} />
      <hr />
      <ul className='nav nav-pills nav-stacked hidden-sm-down'>
        {categories.map(({id, name}) => {
          return <li key={id} className='nav-item'>
            <Link className={`nav-link${+categoryId === id ? ' active' : ''}`} href={`/products?categoryId=${id}`}>
              {name}
            </Link>
          </li>
        })}
      </ul>
      <div className='hidden-md-up'>
        <select className='form-control' value={categoryId || ''}
          onChange={(event) => navigate(`/products?categoryId=${event.target.value}`)}>
          <option value=''>Pick a Category</option>
          {categories.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
        <hr />
      </div>
    </div>
    <div className='col-md-10'>
      <div className='row'>
        {products.map((product) => {
          const {id} = product
          const props = {busy, cart, currentUser, open, product}
          return <div key={id} className='col-xs-6 col-md-6 col-lg-4'>
            <Product {...props} />
          </div>
        })}
      </div>
      <hr />
      <Pagination more={more} page={page} url={url} />
    </div>
  </div>
}
