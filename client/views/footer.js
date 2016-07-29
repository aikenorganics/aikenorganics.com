import React from 'react'
import assets from 'ozymandias/assets'

export default () => {
  return <div className='footer hidden-print'>
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
          <h2>
            <img src={assets.path('img/logo-small.png')}/>
          </h2>
        </div>
        <div className='col-md-4'>
          <h2>Contact</h2>
          <p>
            <strong>Phone:</strong> (803) 920-7153
            <br/>
            <strong>Email:</strong> <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>
          </p>
        </div>
        <div className='col-md-4'>
          <h2>Social</h2>
          <p>
            <a href='https://twitter.com/aikenorganics'>
              <img src={assets.path('img/twitter-32.png')}/> @aikenorganics
            </a>
          </p>
          <p>
            <a href='https://www.facebook.com/aikenorganics'>
              <img src={assets.path('img/facebook-3-32.png')}/> @aikenorganics
            </a>
          </p>
          <p>
            <a href='https://instagram.com/aikenorganics'>
              <img src={assets.path('img/instagram-32.png')}/> @aikenorganics
            </a>
          </p>
        </div>
      </div>
      <hr/>
      <div className='colophon'>
        <p>© Aiken Organics</p>
      </div>
    </div>
  </div>
}
