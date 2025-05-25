import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import girlImage from '../images/girl.jpg'
import boyImage from '../images/boy.jpg'
import { TfiEmail } from "react-icons/tfi";
import { FaUserTie } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
import { Locate, Phone } from 'lucide-react';
const Dashboard = () => {
  const {getUserDetail,isFetchingUserDetails,userDetails} = useAuthStore();
  useEffect(()=>{
    getUserDetail();
  },[getUserDetail])
  return (
    <div className='dashboard-container'>
  <div className="dashboard-user">
    <div className="user-image">
    
       
                    {userDetails?.profilePic ? (
                      <img src={userDetails?.profilePic} alt={userDetails?.firstName} />
                    ) : userDetails?.gender === 'male' ? (
                      <img src={boyImage} alt={userDetails?.firstName} />
                    ) : (
                      <img src={girlImage} alt={userDetails?.firstName} />
                    )}
                    
                    
                  
                 </div> 
    <div className="inner">
      <div className="name">
                   
                  </div>
                  <div className="title">
                    Profile Details
                  </div>
                  <div className="row">
                    <div className="col-6">
<div className="item">
 <FaUserTie />  <span>{userDetails?.firstName} {userDetails?.lastName}</span>
</div>
                    </div>
                    <div className="col-6">
<div className="item">
  <TfiEmail /> {userDetails?.email}
</div>
                    </div>
                    <div className="col-6">
<div className="item">
  <FaUserShield /> {userDetails?.createdAt?.substring(0, 10)}
</div>
                    </div>
                     <div className="col-6">
<div className="item">
  <BsGenderMale /> {userDetails?.gender}
</div>
                    </div>
                     <div className="col-6">
<div className="item">
  <Locate/> {userDetails?.location}
</div>
                    </div>
                     <div className="col-6">
<div className="item">
  <Phone /> {userDetails?.phoneNumber}
</div>
                    </div>
                  </div>
                     <h4 className='title'>Bio</h4>
                     <p className="text">
                      {userDetails?.bio ? userDetails?.bio : "No bio available"}
                     </p>
                  <h4 className='title'>Interests</h4>
                  <div className="intrests">
                    
                    
                      {userDetails?.interests?.length > 0 ? (
                        userDetails?.interests.map((interest, index) => (
                          <div className='intrest' key={index}>{interest}</div>
                        ))
                      ) : (
                        <li>No interests added</li>
                      )}
                    
                  </div>
                 
                 
                  
    </div>
  </div>
  
    {console.log(userDetails)}
    </div>
  )
}

export default Dashboard