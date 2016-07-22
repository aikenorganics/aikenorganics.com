import React from 'react'
import Link from '../link'
import Pagination from '../pagination'
import Search from '../search'
import Product from './product'
import {navigate} from '../../actions/index'

export default ({busy, cart, category_id, categories, page, products, market: {open}, more, search, url, currentUser}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <Search url='/products' value={search}/>
      <hr/>
      <ul className='nav nav-pills nav-stacked hidden-sm hidden-xs'>
        {categories.map((category) => {
          return <li key={category.id} className={+category_id === category.id ? 'active' : ''}>
            <Link href={`/products?category_id=${category.id}`}>
              {category.name}
            </Link>
          </li>
        })}
      </ul>
      <div className='visible-sm-block visible-xs-block'>
        <select className='form-control' value={category_id || ''}
          onChange={(e) => navigate(`/products?category_id=${e.target.value}`)}>
          <option value=''>Pick a Category</option>
          {categories.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
        <hr/>
      </div>
    </div>
    <div className='col-md-10'>
      <div className='row'>
        {products.map((product) => {
          const {id, grower} = product
          const props = {busy, cart, currentUser, grower, open, product}
          return <div key={id} className='col-md-6'>
            <Product {...props}/>
          </div>
        })}
      </div>
      <hr/>
      <Pagination more={more} page={page} url={url}/>
    </div>
  </div>
}
