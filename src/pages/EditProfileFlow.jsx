import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './EditProfileFlow.css';

const EditProfileFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserDetail, updateProfile, isUpdatingProfile, userDetails } = useAuthStore();
  
  // Get the field to edit from the query parameter
  const queryParams = new URLSearchParams(location.search);
  const field = queryParams.get('field') || 'name';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    dateOfBirth: '',
    phoneNumber: '',
    location: '',
    lifeGoal: '',
    lookingFor: '',
    preferredAgeRange: '',
    // Lifestyle & Traits
    hairs: '',
    eyes: '',
    weight: '',
    height: '',
    sociability: '',
    relationship: '',
    orientation: '',
    smoking: '',
  });

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    if (userDetails) {
      const dob = userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : null;
      setFormData({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        email: userDetails.email || '',
        gender: userDetails.gender || '',
        day: dob ? String(dob.getDate()).padStart(2, '0') : '',
        month: dob ? String(dob.getMonth() + 1).padStart(2, '0') : '',
        year: dob ? String(dob.getFullYear()) : '',
        dateOfBirth: userDetails.dateOfBirth ? userDetails.dateOfBirth.substring(0, 10) : '',
        phoneNumber: userDetails.phoneNumber || '',
        location: userDetails.location || '',
        lifeGoal: userDetails.lifeGoal || '',
        lookingFor: userDetails.lookingFor || '',
        preferredAgeRange: userDetails.preferredAgeRange || '',
        hairs: userDetails.hairs || '',
        eyes: userDetails.eyes || '',
        weight: userDetails.weight || '',
        height: userDetails.height || '',
        sociability: userDetails.sociability || '',
        relationship: userDetails.relationship || '',
        orientation: userDetails.orientation || '',
        smoking: userDetails.smoking || '',
      });
    }
  }, [userDetails]);

  const handleSave = async () => {
    try {
      // Build the date from day, month, year if editing DOB
      let dateToSave = formData.dateOfBirth;
      if (field === 'dob' && formData.day && formData.month && formData.year) {
        dateToSave = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
      }

      // Update fullName when firstName or lastName changes
      const updatedData = {
        ...formData,
        dateOfBirth: dateToSave,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };
      
      await updateProfile(updatedData);
      toast.success('Profile updated successfully!');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const renderField = () => {
    switch (field) {
      case 'name':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">First name</h1>
            <input
              type="text"
              className="edit-flow-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Laraib Mumtaz"
            />
          </div>
        );

      case 'email':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Email</h1>
            <input
              type="email"
              className="edit-flow-input"
              value={formData.email}
              readOnly
              placeholder="abs@gmail.com"
            />
          </div>
        );

      case 'gender':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">How would you describe your identity?</h1>
            <div className="edit-flow-options">
              <div
                className={`edit-flow-option ${formData.gender === 'female' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                <span>Female</span>
                <div className="radio-circle">
                  {formData.gender === 'female' && <div className="radio-dot" />}
                </div>
              </div>
              <div
                className={`edit-flow-option ${formData.gender === 'male' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                <span>Male</span>
                <div className="radio-circle">
                  {formData.gender === 'male' && <div className="radio-dot" />}
                </div>
              </div>
              <div
                className={`edit-flow-option ${formData.gender === 'other' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'other' })}
              >
                <span>Other</span>
                <div className="radio-circle">
                  {formData.gender === 'other' && <div className="radio-dot" />}
                </div>
              </div>
            </div>
          </div>
        );

      case 'dob':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Date of Birth</h1>
            <div className="dob-inputs">
              <input
                type="text"
                className="edit-flow-input dob-input"
                placeholder="Day"
                maxLength="2"
                value={formData.day}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                    setFormData({ ...formData, day: value });
                  }
                }}
              />
              <input
                type="text"
                className="edit-flow-input dob-input"
                placeholder="Month"
                maxLength="2"
                value={formData.month}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                    setFormData({ ...formData, month: value });
                  }
                }}
              />
              <input
                type="text"
                className="edit-flow-input dob-input"
                placeholder="Year"
                maxLength="4"
                value={formData.year}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, year: value });
                }}
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Phone Number</h1>
            <div className="phone-input-container">
              <div className="country-code">
                <img src="https://flagcdn.com/w40/pk.png" alt="Pakistan" className="flag-icon" />
                <span>+92</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <input
                type="tel"
                className="edit-flow-input phone-input"
                value={formData.phoneNumber?.replace('+92', '') || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: '+92' + e.target.value })}
                placeholder="3001234567"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Location</h1>
            <input
              type="text"
              className="edit-flow-input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Lahore, Pakistan"
            />
          </div>
        );

      case 'lifeGoal':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Life Goal</h1>
            <textarea
              className="edit-flow-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
              value={formData.lifeGoal}
              onChange={(e) => setFormData({ ...formData, lifeGoal: e.target.value })}
              placeholder="What's your life goal or motto?"
            />
          </div>
        );

      case 'lookingFor':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Looking for</h1>
            <select
              className="edit-flow-input"
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Others</option>
            </select>
          </div>
        );

      case 'preferredAge':
        return (
          <div className="edit-flow-container">
            <h1 className="edit-flow-title">Preferred Age</h1>
            <select
              className="edit-flow-input"
              value={formData.preferredAgeRange}
              onChange={(e) => setFormData({ ...formData, preferredAgeRange: e.target.value })}
            >
              <option value="">Select</option>
              <option value="18-25">18-25</option>
              <option value="25-35">25-35</option>
              <option value="35-45">35-45</option>
              <option value="45+">45+</option>
            </select>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="edit-flow-container lifestyle-container">
            <h1 className="edit-flow-title">Lifestyle & Traits</h1>
            
            <div className="lifestyle-field">
              <label className="lifestyle-label">Hair Color</label>
              <input
                type="text"
                className="edit-flow-input"
                value={formData.hairs}
                onChange={(e) => setFormData({ ...formData, hairs: e.target.value })}
                placeholder="Gray"
              />
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Eye Color</label>
              <input
                type="text"
                className="edit-flow-input"
                value={formData.eyes}
                onChange={(e) => setFormData({ ...formData, eyes: e.target.value })}
                placeholder="Gray"
              />
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Weight (kg)</label>
              <input
                type="number"
                className="edit-flow-input"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="65"
              />
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Height (cm)</label>
              <input
                type="number"
                className="edit-flow-input"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="56"
              />
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Sociability</label>
              <select
                className="edit-flow-input"
                value={formData.sociability}
                onChange={(e) => setFormData({ ...formData, sociability: e.target.value })}
              >
                <option value="">Social</option>
                <option value="Very social">Very social</option>
                <option value="Social">Social</option>
                <option value="Selective">Selective</option>
                <option value="Introverted">Introverted</option>
              </select>
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Relationship</label>
              <select
                className="edit-flow-input"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              >
                <option value="">Open relationships</option>
                <option value="Single">Single</option>
                <option value="Open relationships">Open relationships</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Orientation</label>
              <select
                className="edit-flow-input"
                value={formData.orientation}
                onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
              >
                <option value="">Hetero</option>
                <option value="Hetero">Hetero</option>
                <option value="Homo">Homo</option>
                <option value="Bi">Bi</option>
                <option value="Pansexual">Pansexual</option>
              </select>
            </div>

            <div className="lifestyle-field">
              <label className="lifestyle-label">Smoking</label>
              <select
                className="edit-flow-input"
                value={formData.smoking}
                onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
              >
                <option value="">No</option>
                <option value="No">No</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Socially">Socially</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="edit-flow-page">
      {/* Header */}
      <div className="edit-flow-header">
        <button className="edit-flow-back" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </button>
        <button 
          className="edit-flow-save" 
          onClick={handleSave}
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      {renderField()}
    </div>
  );
};

export default EditProfileFlow;
