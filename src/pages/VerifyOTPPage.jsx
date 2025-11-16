import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, requestPasswordReset } = useAuthStore();
  
  const email = location.state?.email;

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      toast.error('Please enter your email first');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste numbers only');
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastFilledIndex}`);
    if (lastInput) lastInput.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(email, otpCode);
      
      // Navigate to reset password page
      navigate('/reset-password', { state: { email, otp: otpCode } });
    } catch (error) {
      console.error('OTP verification error:', error);
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await requestPasswordReset(email);
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Left Side Form */}
          <div className="col-lg-6 d-flex">
            <div className="w-100">
              <Link to="/forgot-password" className="back-link">
                <ArrowLeft size={20} />
                Back
              </Link>

              <div className="text-center mb-4 mt-4">
                <div className="verification-icon">
                  <ShieldCheck size={64} className="text-primary" />
                </div>
                <h1 className="title mt-3">Verify Your Email</h1>
                <p className="subtitle">
                  We've sent a 6-digit verification code to<br />
                  <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="text-center d-block mb-3">Enter Verification Code</label>
                    <div className="otp-inputs">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          className="otp-input"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button type="submit" className="button w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                {canResend ? (
                  <button 
                    onClick={handleResend} 
                    className="resend-link"
                    disabled={resendLoading}
                  >
                    {resendLoading ? 'Sending...' : "Didn't receive code? Resend"}
                  </button>
                ) : (
                  <p className="text-muted">
                    Resend code in {countdown}s
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="col-lg-6 mt-4 mt-lg-0 d-lg-block">
            <AuthImagePattern
              title="Secure Verification"
              subtitle="Enter the 6-digit code we sent to your email to verify your identity."
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .verification-icon {
          display: flex;
          justify-content: center;
        }

        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .otp-input {
          width: 50px;
          height: 50px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .otp-input:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }

        .otp-input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #ec4899;
        }

        .resend-link {
          background: none;
          border: none;
          color: #ec4899;
          cursor: pointer;
          font-size: 14px;
          text-decoration: underline;
        }

        .resend-link:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default VerifyOTPPage;
