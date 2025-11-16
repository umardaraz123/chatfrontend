import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft, ChevronRight, Camera, User, Mail, Users, Calendar, Phone, MapPin, Heart, Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { getUserDetail, updateProfile, isUpdatingProfile, userDetails } = useAuthStore();
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    getUserDetail();
  }, [getUserDetail]);

  useEffect(() => {
    if (userDetails) {
      setInterests(userDetails.interests || []);
      setBio(userDetails.bio || '');
      setProfilePic(userDetails.profilePic || '');
    }
  }, [userDetails]);

  const getAge = () => {
    if (!userDetails?.dateOfBirth) return '22';
    const dob = new Date(userDetails.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handlePhotoEdit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            await updateProfile({ profilePic: reader.result });
            setProfilePic(reader.result);
            toast.success('Profile photo updated!');
          } catch (error) {
            toast.error('Failed to update photo');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const availableInterests = [
    'Travel',
    'Movies',
    'Sports',
    'Reading',
    'Music',
    'Cooking',
    'Photography',
    'Gaming',
    'Art',
    'Dancing',
    'Fitness',
    'Fashion',
  ];

  const toggleInterest = (interest) => {
    let newInterests;
    if (interests.includes(interest)) {
      newInterests = interests.filter(i => i !== interest);
    } else {
      newInterests = [...interests, interest];
    }
    setInterests(newInterests);
  };

  const saveInterests = async () => {
    try {
      await updateProfile({ interests });
      toast.success('Interests updated!');
    } catch (error) {
      toast.error('Failed to update interests');
    }
  };

  const saveBio = async () => {
    try {
      await updateProfile({ bio });
      toast.success('Bio updated!');
    } catch (error) {
      toast.error('Failed to update bio');
    }
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setNewInterest('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  return (
    <div className="edit-profile-page">
      {/* Header */}
      <div className="edit-profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="edit-profile-title">Edit Profile</h1>
      </div>

      {/* Profile Image Section */}
      <div className="edit-profile-image-section">
        <div className="edit-profile-image-container">
          {profilePic || userDetails?.profilePic ? (
            <img src={profilePic || userDetails?.profilePic} alt="Profile" className="edit-profile-image" />
          ) : (
            <div className="edit-profile-image-placeholder">
              <User size={60} color="#999" />
            </div>
          )}
          <button className="edit-photo-badge" onClick={handlePhotoEdit}>
            <Camera size={14} />
            Edit Photo
          </button>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="edit-section">
        <h2 className="edit-section-title">Personal Detail</h2>
        
        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=name')}>
          <div className="edit-item-content">
            <User size={20} color="#DA0271" />
            <span className="edit-item-label">
              {userDetails?.firstName && userDetails?.lastName 
                ? `${userDetails.firstName} ${userDetails.lastName}` 
                : 'Elvira Collier'}
            </span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=email')}>
          <div className="edit-item-content">
            <Mail size={20} color="#DA0271" />
            <span className="edit-item-label">{userDetails?.email || 'ElviraCollier@gmail.com'}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=gender')}>
          <div className="edit-item-content">
            <Users size={20} color="#DA0271" />
            <span className="edit-item-label">{userDetails?.gender || 'Female'}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=dob')}>
          <div className="edit-item-content">
            <Calendar size={20} color="#DA0271" />
            <span className="edit-item-label">{getAge()}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=phone')}>
          <div className="edit-item-content">
            <Phone size={20} color="#DA0271" />
            <span className="edit-item-label">{userDetails?.phoneNumber || '+92 | 3001234567'}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=location')}>
          <div className="edit-item-content">
            <MapPin size={20} color="#DA0271" />
            <span className="edit-item-label">{userDetails?.location || 'Lahore, Pakistan'}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=lifeGoal')}>
          <div className="edit-item-content">
            <Heart size={20} color="#DA0271" />
            <span className="edit-item-label">{userDetails?.lifeGoal || 'Add your life goal'}</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-text">Edit</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=lookingFor')}>
          <div className="edit-item-content">
            <Heart size={20} color="#DA0271" />
            <span className="edit-item-label">Looking for</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-value">{userDetails?.lookingFor || 'Male'}</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>

        <div className="edit-item" onClick={() => navigate('/dashboard/profile/edit-flow?field=preferredAge')}>
          <div className="edit-item-content">
            <Calendar size={20} color="#DA0271" />
            <span className="edit-item-label">Preferred Age</span>
          </div>
          <div className="edit-item-action">
            <span className="edit-value">{userDetails?.preferredAgeRange || 'Male'}</span>
            <ChevronRight size={18} color="#999" />
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="edit-section separate">
        <div className="edit-section-header">
          <h2 className="edit-section-title">Interests</h2>
          <button className="edit-icon-button" onClick={saveInterests}>
            <Save size={18} color="#DA0271" />
          </button>
        </div>
        
        <div className="interests-edit-grid">
          {availableInterests.map((interest) => (
            <div
              key={interest}
              className={`interest-chip ${interests.includes(interest) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest)}
            >
              <div className="interest-chip-checkbox">
                {interests.includes(interest) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="interest-name">{interest}</span>
            </div>
          ))}
          
          {/* Show custom interests that are not in the predefined list */}
          {interests.filter(interest => !availableInterests.includes(interest)).map((interest) => (
            <div
              key={interest}
              className="interest-chip selected"
              onClick={() => toggleInterest(interest)}
            >
              <div className="interest-chip-checkbox">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="interest-name">{interest}</span>
            </div>
          ))}
        </div>

        {/* Add custom interest input */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="bio-textarea-edit"
            style={{ minHeight: 'auto', padding: '12px 16px' }}
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add custom interest..."
          />
          <button
            onClick={addCustomInterest}
            style={{
              background: '#DA0271',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '0 20px',
              fontFamily: 'Karla, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Bio Section */}
      <div className="edit-section separate">
        <div className="edit-section-header">
          <h2 className="edit-section-title">Bio</h2>
          <button className="edit-icon-button" onClick={saveBio}>
            <Save size={18} color="#DA0271" />
          </button>
        </div>
        
        <textarea
          className="bio-textarea-edit"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Hopeless romantic who believes in long walks, stargazing, and meaningful conversations. I value kindness, laughter, and good company."
          maxLength={500}
        />
        <div className="bio-char-count-edit">{bio.length}/500</div>
      </div>

      {/* Lifestyle & Traits Section */}
      <div className="edit-section separate">
        <div className="edit-section-header">
          <h2 className="edit-section-title">Lifestyle & Traits</h2>
          <button 
            className="edit-icon-button"
            onClick={() => navigate('/dashboard/profile/edit-flow?field=lifestyle')}
          >
            <Edit2 size={18} color="#DA0271" />
          </button>
        </div>
        
        <div className="lifestyle-preview">
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Hair Color</span>
            <span className="lifestyle-preview-value">{userDetails?.hairs || 'Gray'}</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Eye Color</span>
            <span className="lifestyle-preview-value">{userDetails?.eyes || 'Gray'}</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Weight</span>
            <span className="lifestyle-preview-value">{userDetails?.weight || '65'} kg</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Height</span>
            <span className="lifestyle-preview-value">{userDetails?.height || '170'} cm</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Sociability</span>
            <span className="lifestyle-preview-value">{userDetails?.sociability || 'Social'}</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Relationship</span>
            <span className="lifestyle-preview-value">{userDetails?.relationship || 'Open relationships'}</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Orientation</span>
            <span className="lifestyle-preview-value">{userDetails?.orientation || 'Hetero'}</span>
          </div>
          <div className="lifestyle-preview-item">
            <span className="lifestyle-preview-label">Smoking</span>
            <span className="lifestyle-preview-value">{userDetails?.smoking || 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
