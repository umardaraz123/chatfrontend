import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft, MoreVertical, Mail, Phone, MapPin, Users, Heart, Calendar } from 'lucide-react';
import bdImage from '../images/bd.png';
import './Profile.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { getUserDetail, isFetchingUserDetails, userDetails } = useAuthStore();

  useEffect(() => {
    getUserDetail();
  }, [getUserDetail]);

  if (isFetchingUserDetails) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>Loading...</div>;
  }

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

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button-profile" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="profile-title">Profile</h1>
      </div>

      <div className="profile-image-section">
        <div className="profile-image-container">
          {userDetails?.profilePic ? (
            <img src={userDetails.profilePic} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">
              <img src={bdImage} alt="Default Profile" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          )}
        </div>
      </div>

      <div className="profile-section first-section">
        <div className="profile-detail-header">
          <h2 className="section-title">Personal Detail</h2>
          <button className="more-button" onClick={() => navigate('/dashboard/profile/edit')}>
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="profile-name-row">
          <h3 className="profile-name">{userDetails?.fullName || userDetails?.firstName || 'User'}</h3>
          <div className="profile-badges">
            <img src={bdImage} alt="Birthday" style={{ width: '16px', height: '16px' }} />
            <span className="profile-age">{getAge()}</span>
          </div>
        </div>

        <p className="profile-profession">{userDetails?.profession || 'Professional model'}</p>

        <div style={{ position: 'relative' }}>
          <p className="profile-bio">
            {userDetails?.bio || 'Hopeless romantic who believes in long walks, stargazing, and meaningful conversations. I value kindness, laughter.'}
          </p>
          {userDetails?.bio && (
            <span className="bio-char-count">
              {userDetails.bio.length} Fill × 39
            </span>
          )}
        </div>

        <h3 className="subsection-title">Interests</h3>
        <div className="interests-container">
          {userDetails?.interests && userDetails.interests.length > 0 ? (
            userDetails.interests.slice(0, 4).map((interest, index) => (
              <div key={index} className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                {interest}
              </div>
            ))
          ) : (
            <>
              <div className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                Travel
              </div>
              <div className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                  <polyline points="17 2 12 7 7 2"/>
                </svg>
                Movies
              </div>
              <div className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 0 0 20"/>
                </svg>
                Sports
              </div>
              <div className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Reading
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contact & Location Info */}
      {(userDetails?.email || userDetails?.phoneNumber || userDetails?.location) && (
        <div className="profile-section separate-section">
          <h2 className="section-title">Contact & Location</h2>
          <div className="profile-info-grid">
            {userDetails?.email && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Mail size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{userDetails.email}</span>
                </div>
              </div>
            )}
            {userDetails?.phoneNumber && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Phone size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Phone</span>
                  <span className="profile-info-value">{userDetails.phoneNumber}</span>
                </div>
              </div>
            )}
            {userDetails?.location && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <MapPin size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Location</span>
                  <span className="profile-info-value">{userDetails.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences */}
      {(userDetails?.gender || userDetails?.lookingFor || userDetails?.preferredAgeRange) && (
        <div className="profile-section separate-section">
          <h2 className="section-title">Preferences</h2>
          <div className="profile-info-grid">
            {userDetails?.gender && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Users size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Gender</span>
                  <span className="profile-info-value">{userDetails.gender}</span>
                </div>
              </div>
            )}
            {userDetails?.lookingFor && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Heart size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Looking For</span>
                  <span className="profile-info-value">{userDetails.lookingFor}</span>
                </div>
              </div>
            )}
            {userDetails?.preferredAgeRange && (
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Calendar size={18} color="#DA0271" />
                </div>
                <div className="profile-info-content">
                  <span className="profile-info-label">Preferred Age</span>
                  <span className="profile-info-value">
                    {typeof userDetails.preferredAgeRange === 'string' 
                      ? userDetails.preferredAgeRange 
                      : `${userDetails.preferredAgeRange.min}-${userDetails.preferredAgeRange.max}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-section separate-section">
        <h2 className="section-title">Physical Attributes</h2>
        <div className="lifestyle-traits-grid">
          {userDetails?.height && (
            <div className="lifestyle-trait-item">
              <span className="lifestyle-trait-label">Height</span>
              <span className="lifestyle-trait-value">{userDetails.height} cm</span>
            </div>
          )}
          {userDetails?.weight && (
            <div className="lifestyle-trait-item">
              <span className="lifestyle-trait-label">Weight</span>
              <span className="lifestyle-trait-value">{userDetails.weight} kg</span>
            </div>
          )}
          {userDetails?.eyes && (
            <div className="lifestyle-trait-item">
              <span className="lifestyle-trait-label">Eye Color</span>
              <span className="lifestyle-trait-value">{userDetails.eyes}</span>
            </div>
          )}
          {userDetails?.hairs && (
            <div className="lifestyle-trait-item">
              <span className="lifestyle-trait-label">Hair Color</span>
              <span className="lifestyle-trait-value">{userDetails.hairs}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lifestyle & Habits */}
      {(userDetails?.sociability || userDetails?.relationship || userDetails?.orientation || userDetails?.smoking || userDetails?.alcohol) && (
        <div className="profile-section separate-section">
          <h2 className="section-title">Lifestyle & Habits</h2>
          <div className="lifestyle-traits-grid">
            {userDetails?.sociability && (
              <div className="lifestyle-trait-item">
                <span className="lifestyle-trait-label">Sociability</span>
                <span className="lifestyle-trait-value">{userDetails.sociability}</span>
              </div>
            )}
            {userDetails?.relationship && (
              <div className="lifestyle-trait-item">
                <span className="lifestyle-trait-label">Relationship</span>
                <span className="lifestyle-trait-value">{userDetails.relationship}</span>
              </div>
            )}
            {userDetails?.orientation && (
              <div className="lifestyle-trait-item">
                <span className="lifestyle-trait-label">Orientation</span>
                <span className="lifestyle-trait-value">{userDetails.orientation}</span>
              </div>
            )}
            {userDetails?.smoking && (
              <div className="lifestyle-trait-item">
                <span className="lifestyle-trait-label">Smoking</span>
                <span className="lifestyle-trait-value">{userDetails.smoking}</span>
              </div>
            )}
            {userDetails?.alcohol && (
              <div className="lifestyle-trait-item">
                <span className="lifestyle-trait-label">Alcohol</span>
                <span className="lifestyle-trait-value">{userDetails.alcohol}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {userDetails?.lifeGoal && (
        <div className="profile-section separate-section">
          <h2 className="section-title">Life goal of mine</h2>
          <p className="life-goal-text">
            {userDetails.lifeGoal}
          </p>
        </div>
      )}

      <div className="profile-section separate-section">
        <h2 className="section-title">Photos</h2>
        <div className="photos-grid">
          {userDetails?.photos && userDetails.photos.length > 0 ? (
            userDetails.photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img src={photo} alt={`Photo ${index + 1}`} />
              </div>
            ))
          ) : (
            <>
              <div className="photo-item photo-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="photo-item photo-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="photo-item photo-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="profile-section separate-section">
        <h2 className="section-title">Video</h2>
        <div className="video-container">
          {userDetails?.videos && userDetails.videos.length > 0 ? (
            <video 
              className="profile-video" 
              controls 
              poster={userDetails.profilePic}
            >
              <source src={userDetails.videos[0]} type="video/mp4" />
            </video>
          ) : (
            <div className="video-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;