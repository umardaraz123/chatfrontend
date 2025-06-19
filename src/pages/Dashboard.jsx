import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import girlImage from '../images/girl.jpg'
import boyImage from '../images/boy.jpg'
import { TfiEmail } from "react-icons/tfi";
import { FaUserTie } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
import { Locate, Phone,Ruler,PersonStanding, Mails, Cake, LocateFixed, HeartHandshake, Dribbble } from 'lucide-react';
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
                  <div className="item-wrapper">
                    
<div className="item">
 <PersonStanding />  <span>{userDetails?.firstName} {userDetails?.lastName}</span>

                    </div>
                    
<div className="item">
 <Mails /> {userDetails?.email}
</div>
                   
                    
<div className="item">
  <Cake /> {userDetails?.createdAt?.substring(0, 10)}
</div>
                 
                     
<div className="item">
  <BsGenderMale /> {userDetails?.gender}
</div>
                   
                     
<div className="item">
   <LocateFixed /> {userDetails?.location}
</div>
                   
                     
<div className="item">
  <Phone /> {userDetails?.phoneNumber}
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
                   {/* Additional Profile Information */}
          {(userDetails?.height || userDetails?.weight || userDetails?.eyes || userDetails?.hairs) && (
            <>
              <h4 className='title'>Physical Attributes</h4>
              <div className="item-wrapper">
                {userDetails?.height && (
                 
                    <div className="item"><Ruler /> Height: {userDetails.height} cm</div>
                 
                )}
                {userDetails?.weight && (
                  
                    <div className="item">⚖️ Weight: {userDetails.weight} kg</div>
                 
                )}
                {userDetails?.eyes && (
                  
                    <div className="item">👁️ Eyes: {userDetails.eyes}</div>
                 
                )}
                {userDetails?.hairs && (
                  
                    <div className="item">💇 Hair: {userDetails.hairs}</div>
                
                )}
              </div>
            </>
          )}

          {(userDetails?.relationship || userDetails?.orientation || userDetails?.smoking || userDetails?.alcohol) && (
            <>
              <h4 className='title'>Lifestyle</h4>
              <div className="item-wrapper">
                {userDetails?.relationship && (
                 
                    <div className="item">💕 Status: {userDetails.relationship}</div>
                 
                )}
                {userDetails?.orientation && (
                
                    <div className="item">🌈 Orientation: {userDetails.orientation}</div>
                
                )}
                {userDetails?.smoking && (
                 
                    <div className="item">🚬 Smoking: {userDetails.smoking}</div>
                
                )}
                {userDetails?.alcohol && (
                  
                    <div className="item">🍷 Drinking: {userDetails.alcohol}</div>
                
                )}
                 {userDetails?.lookingFor && (
                  
                    <div className="item"> 
                    <HeartHandshake />
                     Looking For: {userDetails.lookingFor}</div>
                
                )}
                {userDetails?.sociability && (
                  
                    <div className="item"> 
                    <Dribbble />
                     Sociability: {userDetails.sociability}</div>
                
                )}
                
              </div>
            </>
          )}
                 
                  
    </div>
  </div>
  
    {console.log(userDetails)}
    </div>
  )
}

export default Dashboard