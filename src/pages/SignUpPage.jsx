import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleEmailSignup = () => {
    navigate('/signup/step1');
  };

  const handleGoogleSignup = () => {
    console.log('Google signup');
  };

  const handleAppleSignup = () => {
    console.log('Apple signup');
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <ChevronLeft />
      </button>

      <div className="container">
        <h1 className="title">Sign up to BonBon</h1>
        <p className="subtitle">Date Better</p>

        <div>
          <button type="button" className="button-white" onClick={handleEmailSignup}>
            <img src="/src/images/email.svg" alt="Email" />
            Continue with Email
          </button>

          <button type="button" className="button-white" onClick={handleGoogleSignup}>
            <img src="/src/images/google.svg" alt="Google" />
            Continue with Google
          </button>

          <button type="button" className="button-white" onClick={handleAppleSignup}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.7857 10.7344C14.7679 8.72656 16.4107 7.75 16.4911 7.70313C15.5804 6.35938 14.1429 6.1875 13.6429 6.17188C12.4821 6.04688 11.3571 6.875 10.7679 6.875C10.1607 6.875 9.23214 6.1875 8.25 6.20313C6.98214 6.21875 5.80357 6.95313 5.16071 8.10938C3.83929 10.4531 4.82143 13.9219 6.10714 15.8281C6.75 16.7656 7.5 17.8125 8.48214 17.7656C9.44643 17.7188 9.80357 17.1406 10.9464 17.1406C12.0714 17.1406 12.4107 17.7656 13.4107 17.75C14.4464 17.7344 15.0893 16.8125 15.7143 15.8594C16.4464 14.7656 16.7321 13.6875 16.75 13.625C16.7321 13.6094 14.8036 12.8594 14.7857 10.7344ZM12.9464 5C13.4643 4.375 13.8214 3.51563 13.7321 2.64063C12.9821 2.67188 12.0536 3.17188 11.5179 3.78125C11.0357 4.3125 10.6071 5.1875 10.7143 6.03125C11.5536 6.09375 12.4107 5.60938 12.9464 5Z" fill="currentColor"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>

        <div className="privacy-policy-wrapper">
          <input type="checkbox" id="privacy" />
          <label htmlFor="privacy">
            By continuing you agree to the <a href="#">Term of Service</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;