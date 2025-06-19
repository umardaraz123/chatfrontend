import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import girlImage from '../images/girl.jpg'
import boyImage from '../images/boy.jpg'
import { TfiEmail } from "react-icons/tfi";
import { FaUserTie } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa";
import { Locate, Phone,Ruler,PersonStanding, Mails, Cake, LocateFixed, HeartHandshake, Dribbble } from 'lucide-react';
import { CiEdit } from "react-icons/ci";
import { Upload } from 'lucide-react';
import { IoClose } from "react-icons/io5";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, userDetails, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    location: "",
    interests: [],
    lookingFor: "",
    preferredAgeRange: "",
    phoneNumber: "",
    profilePic: "",
    hairs: "",
    eyes: "",
    height: "",
    weight: "",
    sociability: "",
    relationship: "",
    orientation: "",
    smoking: "",
    alcohol: "",
  });

  const { updateProfile, isUpdatingProfile } = useAuthStore();

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && userDetails) {
      setFormData({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        email: userDetails.email || "",
        dateOfBirth: userDetails.dateOfBirth ? userDetails.dateOfBirth.substring(0, 10) : "",
        gender: userDetails.gender || "",
        bio: userDetails.bio || "",
        location: userDetails.location || "",
        interests: userDetails.interests || [],
        lookingFor: userDetails.lookingFor || "",
        preferredAgeRange: userDetails.preferredAgeRange || "",
        phoneNumber: userDetails.phoneNumber || "",
        profilePic: userDetails.profilePic || "",
        hairs: userDetails.hairs || "",
        eyes: userDetails.eyes || "",
        height: userDetails.height || "",
        weight: userDetails.weight || "",
        sociability: userDetails.sociability || "",
        relationship: userDetails.relationship || "",
        orientation: userDetails.orientation || "",
        smoking: userDetails.smoking || "",
        alcohol: userDetails.alcohol || "",
      });
    }
  }, [isOpen, userDetails]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.firstName.trim())
      return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.dateOfBirth) return toast.error("Date of birth is required");
    if (!formData.gender) return toast.error("Gender is required");
    if (!formData.bio.trim()) return toast.error("Bio is required");
    if (!formData.location.trim()) return toast.error("Location is required");
    if (formData.interests.length === 0)
      return toast.error("Select at least one interest");
    if (!formData.lookingFor.trim())
      return toast.error("Looking for is required");
    if (!formData.phoneNumber.trim())
      return toast.error("Phone number is required");

    return true;
  };

  const interestsOptions = [
    { value: "Music", label: "Music" },
    { value: "Travel", label: "Travel" },
    { value: "Sports", label: "Sports" },
    { value: "Movies", label: "Movies" },
    { value: "Art", label: "Art" },
    { value: "Reading", label: "Reading" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      try {
        await updateProfile(formData);
        toast.success("Profile updated successfully!");
        onClose();
        onUpdateProfile(); // Refresh profile data
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content signup-container" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <button onClick={onClose} className="close-button">
            <IoClose />
          </button>
          
          <div className="header-content">
            
            
            <div className='title'>
              Update your information
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="container py-3">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* First Name */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Last Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Email</label>
                    <input
                      type="email"
                      readOnly
                      className="input"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Date of Birth</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Gender</label>
                    <select
                      className="input"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Looking for */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Looking for</label>
                    <select
                      className="input"
                      value={formData.lookingFor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lookingFor: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Location</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Preferred Age Range */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Preferred Age Range</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.preferredAgeRange}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredAgeRange: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Phone Number</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Interests */}
                <div className="col-12">
                  <div className="input-wrapper">
                    <label className="">Interests</label>
                    <CreatableSelect
                      isMulti
                      options={interestsOptions}
                      value={formData.interests.map((interest) => ({
                        value: interest,
                        label: interest,
                      }))}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          interests: selected.map((opt) => opt.value),
                        })
                      }
                      placeholder="Type or select interests"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="col-12">
                  <div className="input-wrapper">
                    <label className="">Bio</label>
                    <textarea
                      className="input"
                      rows="3"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* Lifestyle & Traits Section */}
                <div className="col-12">
                  <h3 className="subtitle">Lifestyle & Traits</h3>
                </div>

                {/* Hair Color */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Hair Color</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.hairs}
                      onChange={(e) =>
                        setFormData({ ...formData, hairs: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Eye Color */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Eye Color</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.eyes}
                      onChange={(e) =>
                        setFormData({ ...formData, eyes: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Height (in cm)</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Weight (in kgs)</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Sociability */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Sociability</label>
                    <select
                      className="input"
                      value={formData.sociability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sociability: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Very social">Very social</option>
                      <option value="Social">Social</option>
                      <option value="Selective">Selective</option>
                      <option value="Introverted">Introverted</option>
                      <option value="Shy">Shy</option>
                      <option value="Depends on mood">Depends on mood</option>
                    </select>
                  </div>
                </div>

                {/* Relationship */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Relationship</label>
                    <select
                      className="input"
                      value={formData.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationship: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="In a relationship">In a relationship</option>
                      <option value="Married">Married</option>
                      <option value="Engaged">Engaged</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="It's complicated">It's complicated</option>
                      <option value="Separated">Separated</option>
                      <option value="Open relationship">Open relationship</option>
                      <option value="Free">Free</option>
                      <option value="Looking for something serious">Looking for something serious</option>
                    </select>
                  </div>
                </div>

                {/* Orientation */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Orientation</label>
                    <select
                      className="input"
                      value={formData.orientation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orientation: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Hetero">Hetero</option>
                      <option value="Homo">Homo</option>
                      <option value="Bi">Bi</option>
                      <option value="Pansexual">Pansexual</option>
                      <option value="Asexual">Asexual</option>
                    </select>
                  </div>
                </div>

                {/* Smoking */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Smoking</label>
                    <select
                      className="input"
                      value={formData.smoking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          smoking: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="No">No</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Socially">Socially</option>
                      <option value="Regularly">Regularly</option>
                      <option value="Trying to quit">Trying to quit</option>
                      <option value="Yes">Yes</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Alcohol */}
                <div className="col-12 col-md-4">
                  <div className="input-wrapper">
                    <label className="">Alcohol</label>
                    <select
                      className="input"
                      value={formData.alcohol}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alcohol: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="No">No</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Socially">Socially</option>
                      <option value="Regularly">Regularly</option>
                      <option value="Trying to quit">Trying to quit</option>
                      <option value="Yes">Yes</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="col-12">
                  <div className="input-wrapper">
                    <label className="">Profile Picture</label>
                    <div className="profile">
                      <Upload />
                      <input
                      type="file"
                      className="input"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                    />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-1 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const { getUserDetail, isFetchingUserDetails, userDetails } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getUserDetail();
  }, [getUserDetail]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateProfile = () => {
    // Refresh profile data after update
    getUserDetail();
  };

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
  };

  if (isFetchingUserDetails) {
    return (
      <div className='dashboard-container'>
        <div className="loading-message">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className='dashboard-container'>
      <div className="dashboard-user">
        <div className="user-image">
          <div className="edit" onClick={handleEditClick}>
            <CiEdit />
          </div> 
          <div className="user-image">

          
         
            {userDetails?.profilePic ? (
              <img src={userDetails?.profilePic} alt={userDetails?.firstName} />
            ) : userDetails?.gender === 'male' ? (
              <img src={boyImage} alt={userDetails?.firstName} />
            ) : (
              <img src={girlImage} alt={userDetails?.firstName} />
            )}
          
          </div>
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
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        userDetails={userDetails}
        onUpdateProfile={handleUpdateProfile}
      />

      {console.log(userDetails)}
    </div>
  )
}

export default Profile