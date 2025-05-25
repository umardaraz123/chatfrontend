import React from 'react'
import { Link } from 'react-router-dom';
import LoveImage from '../images/love.jpg'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <div className="max-900">
                    
                    <div className="row align-items-center">
                        
                        <div className="col-12 col-md-6">
                            <p className="title-small">
                       Newsletter
                    </p>
                    <h2 className="title mb-3">
                        Are Your <br />
                        Ready To Start !
                    </h2>
                    <p className="text mb-4">
                        Discover meaningful connections, exciting conversations, and real relationships. Whether you're looking for friendship, love, or something in between — your journey starts now. Join a community that values authenticity and lets you be you.
                    </p>
                    <div className="buttons">
                        <Link className='button'>Join Today</Link>
                         <Link className='button-blue'>Contact Us</Link>
                    </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="image">
                            <img src={LoveImage} alt="img" />
                          </div>
                        </div>
                    </div>
                
                </div>
    </div>
  )
}

export default NewsLetter