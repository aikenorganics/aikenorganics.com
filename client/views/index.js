import React from 'react'
import Link from './link'
import alexPath from 'public/img/alex-small.jpg'
import logoPath from 'public/img/logo-small.png'
import vegetablesPath from 'public/img/vegetables-square.jpg'
import penAndPadPath from 'public/img/pen-and-pad-square.jpg'
import veggiesPath from 'public/img/veggies-in-boxes-square.jpg'
import foodBasketPath from 'public/img/food-basket-square.jpg'

export default ({market: {nextClose, nextOpen}}) => {
  return <div>
    <div className='hero jumbotron covered'>
      <div className='cover' />
      <div className='container content slide-in'>
        <img src={logoPath} />
        <h1>Making Local Easy</h1>
        <p className='lead'>
          <strong>
          Aiken’s Online Farmer’s Market
          </strong>
        </p>
        <p>
          <Link href='/market' className='btn btn-success btn-lg' role='button'>
            Start Shopping
          </Link>
        </p>
      </div>
    </div>
    <section className='container' id='how-it-works-container'>
      <a id='how-it-works' className='anchor' />
      <h1 className='text-xs-center'>How it Works</h1>
      <div className='row'>
        <div className='col-md-6 text-xs-center'>
          <img src={vegetablesPath} className='rounded-circle img-fluid mx-auto' />
          <h2>1. Farmers post available products</h2>
        </div>
        <div className='col-md-6 text-xs-center'>
          <img src={penAndPadPath} className='rounded-circle img-fluid mx-auto' />
          <h2>2. Customers place their order</h2>
          <p>
            {new Date(nextOpen).toLocaleString('en-US', {
              timeZone: 'America/New_York',
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric'
            })}
            -
            {new Date(nextClose).toLocaleString('en-US', {
              timeZone: 'America/New_York',
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6 text-xs-center'>
          <img src={veggiesPath} className='rounded-circle img-fluid mx-auto' />
          <h2>3. Sellers deliver order</h2>
        </div>
        <div className='col-md-6 text-xs-center'>
          <img src={foodBasketPath} className='rounded-circle img-fluid mx-auto' />
          <h2>4. Customer picks up order</h2>
          <p>
            The Alley Downtown Taproom
          </p>
          <p>
            214 The Alley<br />
            Aiken, SC 29801
          </p>
          <p>
            <span className='tag tag-info'>NOW AVAILABLE</span> Home/Office Delivery
          </p>
        </div>
      </div>
    </section>
    <div className='covered hero-secondary'>
      <div className='cover' />
      <div className='container content'>
        <div className='row'>
          <h2>Visit the Market</h2>
          <p>
            <Link href='/market' className='btn btn-success btn-lg' role='button'>
              View Products
            </Link>
          </p>
        </div>
      </div>
    </div>
    <section className='container' id='about'>
      <div className='row'>
        <div className='col-md-6'>
          <h2>Making Local Easy</h2>
          <hr />
          <p>
            Our mission is to connect local farmers to the community and
            conveniently improve lives through food.  Aiken Organics will educate
            about the importance of local, fresh, and organic food. We strive to be
            the most trusted food market where healthy decisions are easy.
          </p>
        </div>
        <div className='col-md-6'>
          <p className='text-xs-center'>
            <img className='rounded' src={alexPath} />
          </p>
        </div>
      </div>
    </section>
  </div>
}
