import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Loader, ChevronLeft, User, Compass, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './MatchesPage.css';
import bdImage from '../images/bd.png';

const MatchesPage = () => {
  const { getMatches, setSelectedUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const matchesData = await getMatches();
      setMatches(matchesData);
    } catch (error) {
      console.error('Failed to load matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = (user) => {
    setSelectedUser(user);
    navigate('/dashboard/chat');
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  if (isLoading) {
    return (
      <div className="matches-loading">
        <Loader className="animate-spin" size={40} />
        <p>Loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="matches-page">
      {/* Header */}
      <div className="matches-header">
        <button className="matches-back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Your Matches</h1>
        <p>People Who Liked You Back</p>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="no-matches">
          <Heart size={80} className="no-matches-icon" />
          <h2>No matches yet</h2>
          <p>Keep swiping to find your perfect match!</p>
        </div>
      ) : (
        <div className="matches-container">
          {matches.map((match) => {
            const user = match.user;
            const age = getAge(user.dateOfBirth);
            
            // Debug logging
            console.log('Match user data:', {
              fullName: user.fullName,
              profilePic: user.profilePic,
              image: user.image
            });
            
            return (
              <div key={match._id} className="match-card">
                {/* Background Image */}
                <img 
                  src={user.profilePic || user.image || 'https://via.placeholder.com/400x500/B8578D/ffffff?text=No+Photo'} 
                  alt={user.fullName || user.firstName}
                  className="match-background-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x500/B8578D/ffffff?text=No+Photo';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="match-overlay"></div>
                
                {/* Top Content - Badge and Chat Icon */}
                <div className="match-top-content">
                  <div className="match-badge">
                    <Heart size={14} fill="white" />
                    <span>Mutual Crush</span>
                  </div>
                  <div className="match-chat-icon" onClick={() => handleMessage(user)}>
                    <MessageCircle size={20} color="white" />
                  </div>
                </div>
                
                {/* Bottom Content - User Info */}
                <div className="match-bottom-content">
                  <div className="match-name-row">
                    <h3 className="match-name">{user.fullName || user.firstName}</h3>
                    <svg className="match-verified-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FF6B9D"/>
                    </svg>
                    <div className="match-age">
                      <img src={bdImage} alt="Birthday" style={{ width: '16px', height: '16px' }} />
                      <span>{age || 22}</span>
                    </div>
                  </div>

                  {user.profession && (
                    <p className="match-profession">{user.profession}</p>
                  )}

                  {user.bio && (
                    <p className="match-bio">{user.bio}</p>
                  )}

                  {user.lifeGoal && (
                    <p className="match-quote">"{user.lifeGoal}"</p>
                  )}

                  {user.interests && user.interests.length > 0 && (
                    <>
                      <p className="match-interests-title">Interests</p>
                      <div className="match-interests">
                        {user.interests.slice(0, 4).map((interest, index) => (
                          <div key={index} className="match-interest-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                            <span>{interest}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${isActiveRoute('/dashboard/swipe') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/swipe')}
        >
          <Compass size={24} className="nav-item-icon" />
          <span className="nav-item-label">Discovery</span>
        </button>
        
        <button 
          className={`nav-item ${isActiveRoute('/dashboard/matches') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/matches')}
        >
          <Heart size={24} className="nav-item-icon" fill={isActiveRoute('/dashboard/matches') ? '#DA0271' : 'none'} />
          <span className="nav-item-label">Matches</span>
        </button>
        
        <button 
          className={`nav-item ${isActiveRoute('/dashboard/likes') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/likes')}
        >
          <ThumbsUp size={24} className="nav-item-icon" />
          <span className="nav-item-label">Like</span>
        </button>
        
        <button 
          className={`nav-item ${isActiveRoute('/dashboard/profile') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/profile')}
        >
          <User size={24} className="nav-item-icon" />
          <span className="nav-item-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default MatchesPage;
