import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuthStore();
  
  const email = location.state?.email;
  const otp = location.state?.otp;

  // Redirect if no email or OTP in state
  useEffect(() => {
    if (!email || !otp) {
      toast.error('Please complete the verification process first');
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const validatePassword = () => {
    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setIsLoading(true);
      await resetPassword(email, otp, formData.newPassword);
      
      toast.success('Password reset successful! Please login with your new password');
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/forgot-password')}>
        <ChevronLeft />
      </button>

      <div className="container">
        {/* Lock Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          border: '2px solid var(--primary-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Lock size={40} color="var(--primary-color)" />
        </div>

        <h1 className="title">Set New Password</h1>
        <p className="info-text">
          Your new password must be different from previously used passwords.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="input-wrapper">
            <label>New Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-wrapper">
            <label>Confirm New Password</label>
            <div className="input-password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--link-color)'
          }}>
            <p style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Password must contain:</p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li style={{ 
                color: formData.newPassword.length >= 6 ? '#4ade80' : 'var(--link-color)',
                marginBottom: '4px'
              }}>
                At least 6 characters
              </li>
              <li style={{ 
                color: (formData.newPassword === formData.confirmPassword && formData.newPassword) ? '#4ade80' : 'var(--link-color)' 
              }}>
                Passwords must match
              </li>
            </ul>
          </div>

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
