import React from 'react'
import Link from './link'
import assets from 'ozymandias/assets'

export default () => {
  return <div>
    <div className='jumbotron covered'>
      <div className='cover' style={{backgroundImage: `url(${assets.path('img/field-one.jpg')})`}}></div>
      <div className='container content slide-in'>
        <img src={assets.path('img/logo-small.png')}/>
        <h1>Making Local Easy</h1>
        <p className='lead'>
          <strong>
          Aiken’s Online Farmer’s Market
          </strong>
        </p>
        <p>
          <Link href='/products' className='btn btn-success btn-lg' role='button'>
            Start Shopping
          </Link>
        </p>
      </div>
    </div>
    <section className='container' id='how-it-works-container'>
      <a id='how-it-works' className='anchor'></a>
      <h1 className='text-center'>How it Works</h1>
      <div className='row'>
        <div className='col-md-6 text-center'>
          <img src={assets.path('img/vegetables-square.jpg')} className='img-circle'/>
          <h2>1. Farmers post available products</h2>
        </div>
        <div className='col-md-6 text-center'>
          <img src={assets.path('img/pen-and-pad-square.jpg')} className='img-circle'/>
          <h2>2. Customers place their order</h2>
          <p>Sunday 8am - Wednesday 12pm</p>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6 text-center'>
          <img src={assets.path('img/veggies-in-boxes-square.jpg')} className='img-circle'/>
          <h2>3. Sellers deliver order</h2>
        </div>
        <div className='col-md-6 text-center'>
          <img src={assets.path('img/food-basket-square.jpg')} className='img-circle'/>
          <h2>4. Customer picks up order</h2>
          <p>
            Aiken Yoga, Thursday 4:00pm-6:30pm
          </p>
          <p>
            116 B Pendleton St SW<br/>
            Aiken, SC 29801
          </p>
          <p>
            <span className='label label-info'>NOW AVAILABLE</span>
            &nbsp;Home/Office Delivery
          </p>
        </div>
      </div>
    </section>
    <div className='covered hero-secondary'>
      <div className='cover' style={{backgroundImage: `url(${assets.path('img/field-two.jpg')})`}}></div>
      <div className='container content'>
        <div className='row'>
          <h2>Visit the Market</h2>
          <p>
            <Link href='/products' className='btn btn-success btn-lg' role='button'>
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
          <hr/>
          <p>
            Our mission is to connect local farmers to the community and
            conveniently improve lives through food.  Aiken Organics will educate
            about the importance of local, fresh, and organic food. We strive to be
            the most trusted food market where healthy decisions are easy.
          </p>
        </div>
        <div className='col-md-6'>
          <p className='text-center'>
            <img className='img-rounded' src={assets.path('img/alex-small.jpg')}/>
          </p>
        </div>
      </div>
    </section>
  </div>
}
