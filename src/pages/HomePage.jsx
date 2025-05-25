import React from 'react'
import {Link} from 'react-router-dom'
import TopImage from '../images/chat1.png'
import Clients from '../components/Clients'
import Plans from '../components/Plans'
import NewsLetter from '../components/NewsLetter'

const HomePage = () => {
  return (
   <div className='home-section'>
     <div className='home-banner custom-margin'>
     <div className="data">
       <h2 className="title">
        Discover,chat, <br />
        and find yout Spark.
      </h2>
      <p className="text">
        Join a community built for meaningful connections. Whether you're looking for love, friendship, or something in between—start your journey today.
      </p>
      <div className="text-center">
        <Link className="button"> Get Started</Link>
      </div>
     </div>
    </div>
    <div className="container">
      <div className="top-section">
       <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <div className="image">
            <img src={TopImage} alt="image" />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="right">
            <div className="title-small">
            Feature
          </div>
          <h2 className="title">
            The Bone&Bone Works Instantly.
          </h2>
          <p className="text">
No lag, no delays—just smooth, real-time messaging designed to keep the conversation flowing and the connection growing.
          </p>
          <Link className='button'>Join Today</Link>
          </div>
        </div>
       </div>
      </div>

    </div>
    <Clients />
    <Plans />
    <NewsLetter />
   </div>
  )
}

export default HomePage