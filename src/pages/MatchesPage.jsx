// pages/MatchesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Loader, Calendar, MapPin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const { getMatches, setSelectedUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Like type configurations
  const likeTypeConfig = {
    crush: { emoji: '💘', label: 'Crush', color: '#ec4899', bgColor: '#fdf2f8' },
    intrigued: { emoji: '😍', label: 'Intrigued', color: '#f59e0b', bgColor: '#fffbeb' },
    curious: { emoji: '🤔', label: 'Curious', color: '#8b5cf6', bgColor: '#faf5ff' },
    fun: { emoji: '😂', label: 'Looks Fun', color: '#10b981', bgColor: '#f0fdf4' }
  };

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

  const getMatchTypeDisplay = (match) => {
    const yourType = match.yourLikeType;
    const theirType = match.theirLikeType;
    
    if (yourType === theirType && yourType && likeTypeConfig[yourType]) {
      const config = likeTypeConfig[yourType];
      return (
        <div className="mutual-feeling" style={{ backgroundColor: config.bgColor, color: config.color }}>
          <span className="feeling-emoji">{config.emoji}</span>
          <span>Mutual {config.label}!</span>
        </div>
      );
    }
    
    return (
      <div className="different-feelings">
        {yourType && likeTypeConfig[yourType] && (
          <div className="your-feeling" style={{ color: likeTypeConfig[yourType].color }}>
            {likeTypeConfig[yourType].emoji} You: {likeTypeConfig[yourType].label}
          </div>
        )}
        {theirType && likeTypeConfig[theirType] && (
          <div className="their-feeling" style={{ color: likeTypeConfig[theirType].color }}>
            {likeTypeConfig[theirType].emoji} Them: {likeTypeConfig[theirType].label}
          </div>
        )}
      </div>
    );
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
      <div className="matches-header">
        <div className="header-title">
          <Sparkles size={24} className="sparkle-icon" />
          <h1>Your Matches</h1>
          <Sparkles size={24} className="sparkle-icon" />
        </div>
        <p>People who liked you back!</p>
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <Heart size={80} className="text-pink-400" />
          <h2>No matches yet</h2>
          <p>Keep swiping to find your perfect match!</p>
        </div>
      ) : (
        <div className="likes-grid">
          {matches.map((match) => (
            <div key={match._id} className="like-card">
              {/* <div className="match-header">
                <span className="match-date">
                  <Calendar size={14} />
                  Matched {new Date(match.matchedAt).toLocaleDateString()}
                </span>
                <div className="match-indicator">
                  <Heart size={16} fill="white" />
                  MATCH
                </div>
              </div> */}

              <div className="user-info">
                <div className="like-image">
                  <img 
                  src={match.user.profilePic || '/default-avatar.png'} 
                  alt={match.user.fullName}
                  className="match-avatar"
                />
                </div>
                <div className="like-info">
                  <h3>{match.user.fullName}</h3>
                  {match.user.age && (
                    <p className="user-details">
                      {match.user.age} years old
                     
                    </p>
                  )}
                  {match.user.location && (
                    <p className="user-details">{match.user.location}</p>
                    )}

                  {/* Show how you both felt */}
                  <div className="match-feelings">
                    {getMatchTypeDisplay(match)}
                  </div>

                  {match.user.bio && (
                    <p className="bio">{match.user.bio}</p>
                  )}

                  {match.user.interests && match.user.interests.length > 0 && (
                    <div className="interests">
                      {match.user.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="match-actions">
                <button 
                  className="message-btn"
                  onClick={() => handleMessage(match.user)}
                >
                  <MessageCircle size={18} />
                  Start Chatting
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;