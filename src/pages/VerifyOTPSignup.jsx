import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const VerifyOTPSignup = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const email = localStorage.getItem('signupEmail') || 'user@email.com';
  const { verifySignupOTP, sendSignupOTP } = useAuthStore();

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setIsVerifying(true);
      try {
        // Verify OTP with backend
        await verifySignupOTP(email, otpCode);
        // Navigate to next step
        navigate('/signup/details');
      } catch (error) {
        console.error('Error verifying OTP:', error);
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await sendSignupOTP(email);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/signup/step1')}>
        <ChevronLeft />
      </button>

      <div className="container">
        {/* Email Icon */}
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
          <Mail size={40} color="var(--primary-color)" />
        </div>

        <h2 className="subheading">Verify Email</h2>
        
        <p className="info-text">
          We've just sent a 6-digit code to your email: {email}. Please check your inbox and enter the OTP below.
        </p>

        <p style={{
          fontSize: '12px',
          color: 'var(--primary-color)',
          textAlign: 'center',
          marginBottom: '16px',
          fontWeight: '500'
        }}>
          Enter Code
        </p>

        <form onSubmit={handleVerify}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="resend-link">
            <span>Don't get the code?</span><br />
            <span>You can resend code again in </span>
            <button type="button" onClick={handleResend}>1m</button>
          </div>

          <button 
            type="button"
            className="button"
            style={{
              background: 'var(--button-background-color)',
              marginBottom: '16px'
            }}
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend'}
          </button>

          <button 
            type="submit" 
            className="button"
            disabled={otp.join('').length !== 6 || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPSignup;
