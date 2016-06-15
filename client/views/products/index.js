import React from 'react'
import Link from '../link'
import Search from '../search'
import Product from './product'
import {params} from '../../url'
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
        <select className='form-control' value={category_id}
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
          return <div key={product.id} className='col-md-6'>
            <Product busy={busy} cart={cart} open={open} product={product} currentUser={currentUser}/>
          </div>
        })}
      </div>
      <hr/>
      {more
        ? <Link href={params(url, {page: page + 1})} className='pull-right'>
          Next Page →
        </Link>
        : ''
      }
      {page > 1
        ? <Link href={params(url, {page: page - 1})}>
          ← Previous Page
        </Link>
        : ''
      }
    </div>
  </div>
}
