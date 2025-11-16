import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Users, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const SignUpDetails = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    password: ''
  });
  const { completeSignup, isSigningUp } = useAuthStore();
  const email = localStorage.getItem('signupEmail');

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      // Complete signup with all data
      await completeSignup({
        email,
        password: formData.password,
        fullName: formData.fullName,
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      });
      
      // Clear localStorage
      localStorage.removeItem('signupEmail');
      localStorage.removeItem('signupDetails');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing signup:', error);
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData({ ...formData, gender });
  };

  const isFormValid = () => {
    return formData.fullName && 
           formData.userName && 
           formData.phoneNumber && 
           formData.dateOfBirth && 
           formData.gender &&
           formData.password &&
           formData.password.length >= 6;
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/signup/verify')}>
        <ChevronLeft />
      </button>

      <div className="container">
        <h1 className="title">Sign up</h1>

        <form onSubmit={handleContinue}>
          {/* Full Name */}
          <div className="input-wrapper">
            <label>Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          {/* User Name */}
          <div className="input-wrapper">
            <label>User Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter User Name"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <label>Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="input-wrapper">
            <label>Phone Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input"
                value="+92"
                readOnly
                style={{ width: '80px', flexShrink: 0 }}
              />
              <input
                type="tel"
                className="input"
                placeholder="554 9462"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="input-wrapper">
            <label>Date of Birth</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="input small"
                value={formData.dateOfBirth.split('-')[2] || ''}
                onChange={(e) => {
                  const parts = formData.dateOfBirth.split('-');
                  const newDate = `${parts[0] || '2001'}-${parts[1] || 'January'}-${e.target.value}`;
                  setFormData({ ...formData, dateOfBirth: newDate });
                }}
                style={{ flex: 1 }}
                required
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <select
                className="input"
                value={formData.dateOfBirth.split('-')[1] || ''}
                onChange={(e) => {
                  const parts = formData.dateOfBirth.split('-');
                  const newDate = `${parts[0] || '2001'}-${e.target.value}-${parts[2] || '1'}`;
                  setFormData({ ...formData, dateOfBirth: newDate });
                }}
                style={{ flex: 1 }}
                required
              >
                <option value="">Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>

              <select
                className="input"
                value={formData.dateOfBirth.split('-')[0] || ''}
                onChange={(e) => {
                  const parts = formData.dateOfBirth.split('-');
                  const newDate = `${e.target.value}-${parts[1] || 'January'}-${parts[2] || '1'}`;
                  setFormData({ ...formData, dateOfBirth: newDate });
                }}
                style={{ flex: 1 }}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 80 }, (_, i) => 2010 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className="input-wrapper">
            <label>Gender</label>
            <div className="gender-options">
              <button
                type="button"
                className={`gender-option ${formData.gender === 'female' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('female')}
              >
                <User size={16} />
                Female
              </button>
              <button
                type="button"
                className={`gender-option ${formData.gender === 'male' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('male')}
              >
                <User size={16} />
                Male
              </button>
              <button
                type="button"
                className={`gender-option ${formData.gender === 'others' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('others')}
              >
                <Users size={16} />
                Others
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={!isFormValid() || isSigningUp}
          >
            {isSigningUp ? 'Creating Account...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpDetails;
