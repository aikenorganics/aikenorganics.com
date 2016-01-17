import React from 'react'
import Product from './product'
import {withParams} from '../../url'

export default ({busy, cart, category_id, categories, page, products, market: {open}, more, search, url, user}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <form>
        <input className='form-control' type='search' name='search' placeholder='Search…' defaultValue={search || ''}/>
      </form>
      <hr/>
      <ul className='nav nav-pills nav-stacked'>
        {categories.map((category) => {
          return <li key={category.id} className={+category_id === category.id ? 'active' : ''}>
            <a href={`/products?category_id=${category.id}`}>
              {category.name}
            </a>
          </li>
        })}
      </ul>
    </div>
    <div className='col-md-10'>
      <div className='row'>
        {products.map((product) => {
          return <div key={product.id} className='col-md-6'>
            <Product busy={busy} cart={cart} open={open} product={product} user={user}/>
          </div>
        })}
      </div>
      <hr/>
      {more
        ? <a href={withParams(url, {page: page + 1})} className='pull-right'>
          Next Page →
        </a>
        : ''
      }
      {page > 1
        ? <a href={withParams(url, {page: page - 1})}>
          ← Previous Page
        </a>
        : ''
      }
    </div>
  </div>
}
