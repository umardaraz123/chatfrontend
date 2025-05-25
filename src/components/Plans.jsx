import React from 'react'
import { GiStaryu } from "react-icons/gi";
import { GiChainedHeart } from "react-icons/gi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { GiFireZone } from "react-icons/gi";
const Plans = () => {
  return (
    <div className='plans-section'>
        <div className="max-900">
                    <p className="title-small text-center">
                        Pricing
                    </p>
                    <h2 className="title text-center mb-5">
                        Find the Right Match for Your Needs
                    </h2>
                     <div className="row">
                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                            <div className="plan-wrapper">
                                <div className="header">
                                    <div className="left">
                                        <span className="price">
                                            $12 <span>/month</span>
                                        </span>
                                    </div>
                                    <div className="icon">
                                        <GiChainedHeart />
                                    </div>
                                </div>
                                <p className="title-small">
                                    All Monthly Plans Include
                                </p>
                                <div className="includes">
                                  <IoCheckmarkDoneOutline />  Create and customize your profile
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Browse profiles and send likes
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Limited daily matches
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  In-app chat with mutual matches
                                </div>
                                
                                <div className="text-center mt-4">
                                    <button className="button">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                         <div className="col-12 col-md-6 col-lg-4 mb-3">
                            <div className="plan-wrapper">
                                <div className="header">
                                    <div className="left">
                                        <span className="price">
                                            $20 <span>/month</span>
                                        </span>
                                    </div>
                                    <div className="icon">
                                        <GiStaryu />
                                    </div>
                                </div>
                                <p className="title-small">
                                    All Monthly Plans Include
                                </p>
                                <div className="includes">
                                  <IoCheckmarkDoneOutline />  Unlimited profile swipes & likes
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  See who viewed or liked you
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Boost your profile weekly
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Priority customer support
                                </div>
                                
                                <div className="text-center mt-4">
                                    <button className="button">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                           <div className="col-12 col-md-6 col-lg-4 mb-3">
                            <div className="plan-wrapper">
                                <div className="header">
                                    <div className="left">
                                        <span className="price">
                                            $30 <span>/month</span>
                                        </span>
                                    </div>
                                    <div className="icon">
                                        <GiFireZone />
                                    </div>
                                </div>
                                <p className="title-small">
                                    All Monthly Plans Include
                                </p>
                                <div className="includes">
                                  <IoCheckmarkDoneOutline />  Top visibility across all searches
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Message anyone without waiting
                                </div>
                                 <div className="includes">
                                  <IoCheckmarkDoneOutline />  Access to verified profiles only
                                </div>
                                 <div className="includes">
                                <IoCheckmarkDoneOutline />  Get priority access to new features 
                                </div>
                                
                                <div className="text-center mt-4">
                                    <button className="button">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                     </div>
                
                </div>
    </div>
  )
}

export default Plans