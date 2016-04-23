import React from 'react'
import Link from '../link'
import Search from '../search'
import Product from './product'
import {params} from '../../url'

export default ({busy, cart, category_id, categories, page, products, market: {open}, more, search, url, currentUser}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <Search url='/products' value={search}/>
      <hr/>
      <ul className='nav nav-pills nav-stacked'>
        {categories.map((category) => {
          return <li key={category.id} className={+category_id === category.id ? 'active' : ''}>
            <Link href={`/products?category_id=${category.id}`}>
              {category.name}
            </Link>
          </li>
        })}
      </ul>
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
