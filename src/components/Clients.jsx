import React from 'react'
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { CiStar } from "react-icons/ci";
import User1 from '../images/user1.jpg'
import User2 from '../images/user2.jpg'
import User3 from '../images/user3.jpg'
import User4 from '../images/user4.jpg'
import User5 from '../images/user5.jpg'
import User6 from '../images/user6.jpg'
import Slider from "react-slick";
const Clients = () => {
    var reviews = [
        {
        image:User1,
        name:"Emma",
        date:'27-05-2024',
        review:"Finally found someone special—this app truly makes real connections happen fast!"

        },
         {
        image:User2,
        name:"James",
        date:'13-04-2024',
        review:"The messaging is smooth and instant—feels like chatting with someone in real life."

        },
         {
        image:User3,
        name:"Ethan",
        date:'21-02-2024',
        review:"Best dating app experience so far—clean design and real, genuine people."

        },
         {
        image:User4,
        name:"Noah",
        date:'13-08-2024',
        review:"Love how easy it is to meet like-minded people. Highly recommended!"

        },
          {
        image:User5,
        name:"Olivia",
        date:'12-06-2023',
        review:"Matches are surprisingly accurate. I actually enjoy chatting and getting to know people here"

        },
         {
        image:User6,
        name:"Grace",
        date:'12-06-2024',
        review:"Great interface, fast messaging, and safe environment—everything I wanted in a dating app."

        },
    ]
 var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,   
  autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      
    ]
  }
  return (
    <div className='clients-section'>
        <div className="max-900">
            <p className="title-small text-center">
                Testimonials
            </p>
            <h2 className="title text-center mb-5">
                Real Stories, Real Connections
            </h2>
        
            <Slider {...settings}>
      {reviews?.map((review)=><div className='reviews-wrapper'>
             <div className="image">
                <img src={review?.image} alt='img' />
             </div>
             <p className="date">{review?.date}</p>
             <div className="rating">
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
             </div>
             <p className="name">{review?.name}</p>
              <p className="text">{review?.review}</p>
      </div>)}
    </Slider>
        </div>
    </div>
  )
}

export default Clients