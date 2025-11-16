import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import bdImage from '../images/bd.png';
import './Profile.css';
import './DashboardEdit.css';

const DashboardEdit = () => {
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

  const handleEditField = (field) => {
    navigate(`/dashboard/profile/edit-flow?field=${field}`);
  };

  const handleEditPhoto = () => {
    // Navigate to photo edit page
    navigate('/dashboard/profile/edit-photo');
  };

  return (
    <div className="dashboard-edit-page">
      <div className="profile-header">
        <button className="back-button-profile" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="profile-title">Profile</h1>
      </div>

      {/* Profile Image with Edit Button */}
      <div className="profile-image-section-editable">
        <div className="profile-image-container">
          {userDetails?.profilePic ? (
            <img src={userDetails.profilePic} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">
              <img src={bdImage} alt="Default Profile" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          )}
          <button className="edit-photo-overlay-button" onClick={handleEditPhoto}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Edit Photo
          </button>
        </div>
      </div>

      {/* Personal Detail Section */}
      <div className="profile-section first-section">
        <div className="section-header-dashboard">
          <h2 className="section-title">Personal Detail</h2>
        </div>

        {/* Name Field */}
        <div className="dashboard-field" onClick={() => handleEditField('name')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{userDetails?.fullName || userDetails?.firstName || 'Add name'}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Email Field */}
        <div className="dashboard-field" onClick={() => handleEditField('email')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M22 7l-10 7L2 7"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{userDetails?.email || 'Add email'}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Gender Field */}
        <div className="dashboard-field" onClick={() => handleEditField('gender')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{userDetails?.gender || 'Add gender'}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Age Field */}
        <div className="dashboard-field" onClick={() => handleEditField('dob')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{getAge()}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Phone Field */}
        <div className="dashboard-field" onClick={() => handleEditField('phone')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{userDetails?.phoneNumber || 'Add phone'}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Location Field */}
        <div className="dashboard-field" onClick={() => handleEditField('location')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-value">{userDetails?.location || 'Add location'}</span>
          </div>
          <button className="dashboard-field-edit">
            <span>Edit</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Looking For Field */}
        <div className="dashboard-field" onClick={() => handleEditField('lookingFor')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-label">Looking for</span>
            <span className="dashboard-field-value">{userDetails?.lookingFor || 'Male'}</span>
          </div>
          <button className="dashboard-field-edit">
            <ChevronRight size={20} color="#999" />
          </button>
        </div>

        {/* Preferred Age Field */}
        <div className="dashboard-field" onClick={() => handleEditField('preferredAge')}>
          <div className="dashboard-field-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA0271" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 12l-4-4-4 4"/>
            </svg>
          </div>
          <div className="dashboard-field-content">
            <span className="dashboard-field-label">Preferred Age</span>
            <span className="dashboard-field-value">{userDetails?.preferredAgeRange || 'Male'}</span>
          </div>
          <button className="dashboard-field-edit">
            <ChevronRight size={20} color="#999" />
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div className="profile-section separate-section">
        <div className="section-header-with-edit">
          <h2 className="section-title">Interests</h2>
          <button className="section-edit-icon" onClick={() => navigate('/dashboard/profile/edit-interests')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
        <div className="interests-container">
          {userDetails?.interests && userDetails.interests.length > 0 ? (
            userDetails.interests.map((interest, index) => (
              <div key={index} className="interest-tag-new">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                {interest}
              </div>
            ))
          ) : (
            <>
              <div className="interest-tag-new">Travel</div>
              <div className="interest-tag-new">Movies</div>
              <div className="interest-tag-new">Sports</div>
              <div className="interest-tag-new">Reading</div>
            </>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="profile-section separate-section">
        <div className="section-header-with-edit">
          <h2 className="section-title">Bio</h2>
          <button className="section-edit-icon" onClick={() => navigate('/dashboard/profile/edit-bio')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
        <p className="profile-bio">
          {userDetails?.bio || 'Hopeless romantic who believes in long walks, stargazing, and meaningful conversations. I value kindness, laughter, and good company.'}
        </p>
      </div>

      {/* Lifestyle & Traits Section */}
      <div className="profile-section separate-section">
        <div className="section-header-with-edit">
          <h2 className="section-title">Lifestyle & Traits</h2>
          <button className="section-edit-icon" onClick={() => handleEditField('lifestyle')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
        <div className="lifestyle-grid">
          {userDetails?.hairs && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Hair Color</span>
              <span className="lifestyle-value">{userDetails.hairs}</span>
            </div>
          )}
          {userDetails?.eyes && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Eye Color</span>
              <span className="lifestyle-value">{userDetails.eyes}</span>
            </div>
          )}
          {userDetails?.weight && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Weight</span>
              <span className="lifestyle-value">{userDetails.weight} kg</span>
            </div>
          )}
          {userDetails?.height && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Height</span>
              <span className="lifestyle-value">{userDetails.height} cm</span>
            </div>
          )}
          {userDetails?.sociability && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Sociability</span>
              <span className="lifestyle-value">{userDetails.sociability}</span>
            </div>
          )}
          {userDetails?.relationship && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Relationship</span>
              <span className="lifestyle-value">{userDetails.relationship}</span>
            </div>
          )}
          {userDetails?.orientation && (
            <div className="lifestyle-item">
              <span className="lifestyle-label">Orientation</span>
              <span className="lifestyle-value">{userDetails.orientation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEdit;
