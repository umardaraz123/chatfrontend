import HomeImage from '../../src/images/home-banner.png'
const AuthImagePattern = ({ title, subtitle }) => {

    return (
      <div className="auth-main-wrapper">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
          <div className="image-auth">
            <img src={HomeImage} />
          </div>
          
        
      </div>
    );
  };
  
  export default AuthImagePattern;