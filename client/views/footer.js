import React from 'react'
import logoPath from '../../public/img/logo-small.png'
import twitterPath from '../../public/img/twitter-32.png'
import facebookPath from '../../public/img/facebook-3-32.png'
import instagramPath from '../../public/img/instagram-32.png'

export default () => {
  return <footer className='hidden-print'>
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
          <h2>
            <img className='img-fluid' src={logoPath} />
          </h2>
        </div>
        <div className='col-md-4'>
          <h2>Contact</h2>
          <p>
            <strong>Phone:</strong> (803) 920-7153
            <br />
            <strong>Email:</strong> <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>
          </p>
        </div>
        <div className='col-md-4'>
          <h2>Social</h2>
          <p>
            <a href='https://twitter.com/aikenorganics'>
              <img src={twitterPath} /> @aikenorganics
            </a>
          </p>
          <p>
            <a href='https://www.facebook.com/aikenorganics'>
              <img src={facebookPath} /> @aikenorganics
            </a>
          </p>
          <p>
            <a href='https://instagram.com/aikenorganics'>
              <img src={instagramPath} /> @aikenorganics
            </a>
          </p>
        </div>
      </div>
      <hr />
      <p>© Aiken Organics</p>
    </div>
  </footer>
}
