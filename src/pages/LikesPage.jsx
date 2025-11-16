// pages/LikesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Loader, ChevronLeft, User, Compass, ThumbsUp, MessageCircle, X, UserPlus, UserCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import './LikesPage.css';
import bdImage from '../images/bd.png';

const LikesPage = () => {
  const { 
    getLikedUsers, 
    setSelectedUser,
    sendFriendRequest,
    getFriendRequests,
    getFriends
  } = useAuthStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('liked-you'); // 'liked-you' or 'your-likes'
  const [yourLikes, setYourLikes] = useState([]);
  const [likedYou, setLikedYou] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState(new Set());
  const [sentRequests, setSentRequests] = useState(new Set());
  const [processingRequest, setProcessingRequest] = useState(new Set());

  useEffect(() => {
    loadLikes();
    loadFriends();
    loadSentRequests();
  }, []);

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const likesData = await getLikedUsers();
      // Mock data for likedYou - you'll need to create backend endpoint
      setYourLikes(likesData);
      setLikedYou([]); // TODO: Add backend endpoint for people who liked you
    } catch (error) {
      console.error('Failed to load likes:', error);
      toast.error('Failed to load likes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const friendsData = await getFriends();
      const friendIds = friendsData.map(friend => friend._id);
      setFriends(new Set(friendIds));
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadSentRequests = async () => {
    try {
      const requestsData = await getFriendRequests();
      const sentRequestIds = requestsData.outgoing?.map(request => request.recipient._id) || [];
      setSentRequests(new Set(sentRequestIds));
    } catch (error) {
      console.error('Failed to load sent requests:', error);
    }
  };

  const handleSendFriendRequest = async (userId, userName) => {
    if (processingRequest.has(userId)) return;
    
    try {
      setProcessingRequest(prev => new Set([...prev, userId]));
      await sendFriendRequest(userId);
      setSentRequests(prev => new Set([...prev, userId]));
    } catch (error) {
      const errorMessage = error.response?.data?.message || '';
      
      if (errorMessage.includes('already friends')) {
        setFriends(prev => new Set([...prev, userId]));
      } else if (errorMessage.includes('already exists')) {
        setSentRequests(prev => new Set([...prev, userId]));
      }
    } finally {
      setProcessingRequest(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleCrushBack = async (userId) => {
    // TODO: Implement crush back functionality
    toast.success('Crushed back!');
  };

  const handlePass = async (userId) => {
    // TODO: Implement pass functionality
    toast.success('Passed');
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

  const currentData = activeTab === 'liked-you' ? likedYou : yourLikes;

  if (isLoading) {
    return (
      <div className="likes-loading">
        <Loader className="animate-spin" size={40} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="likes-page">
      {/* Header */}
      <div className="likes-header">
        <button className="likes-back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>People who likes you</h1>
        <p>Respond to Create matches or pass to remove them</p>
      </div>

      {/* Tabs */}
      <div className="likes-tabs">
        <button 
          className={`tab ${activeTab === 'your-likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('your-likes')}
        >
          Your Likes
        </button>
        <button 
          className={`tab ${activeTab === 'liked-you' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked-you')}
        >
          Like You
        </button>
      </div>

      {/* Cards List */}
      {currentData.length === 0 ? (
        <div className="no-likes">
          <Heart size={80} className="no-likes-icon" />
          <h2>No likes yet</h2>
          <p>Keep swiping to find your perfect match!</p>
        </div>
      ) : (
        <div className="likes-container">
          {currentData.map((user) => {
            const age = getAge(user.dateOfBirth);
            
            return (
              <div key={user._id} className="like-card">
                {/* Background Image */}
                <img 
                  src={user.profilePic || user.image || 'https://via.placeholder.com/400x500/B8578D/ffffff?text=No+Photo'} 
                  alt={user.fullName || user.firstName}
                  className="like-background-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x500/B8578D/ffffff?text=No+Photo';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="like-overlay"></div>
                
                {/* Top Content - Badge */}
                <div className="like-top-content">
                  <div className="like-badge">
                    <Heart size={14} fill="white" />
                    <span>Your Crush</span>
                  </div>
                </div>
                
                {/* Bottom Content - User Info */}
                <div className="like-bottom-content">
                  <div className="like-name-row">
                    <h3 className="like-name">{user.fullName || user.firstName}</h3>
                    <svg className="like-verified-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FF6B9D"/>
                    </svg>
                    <div className="like-age">
                      <img src={bdImage} alt="Birthday" style={{ width: '16px', height: '16px' }} />
                      <span>{age || 22}</span>
                    </div>
                  </div>

                  {user.profession && (
                    <p className="like-profession">{user.profession}</p>
                  )}

                  {user.bio && (
                    <p className="like-bio">{user.bio}</p>
                  )}

                  {user.lifeGoal && (
                    <p className="like-quote">"{user.lifeGoal}"</p>
                  )}

                  {user.interests && user.interests.length > 0 && (
                    <>
                      <p className="like-interests-title">Interests</p>
                      <div className="like-interests">
                        {user.interests.slice(0, 4).map((interest, index) => (
                          <div key={index} className="like-interest-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                            <span>{interest}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Action Buttons - Only for "Liked You" tab */}
                  {activeTab === 'liked-you' && (
                    <div className="like-action-buttons">
                      <button 
                        className="crush-back-button"
                        onClick={() => handleCrushBack(user._id)}
                      >
                        <Heart size={18} fill="white" />
                        Crush Back
                      </button>
                      <button 
                        className="pass-button"
                        onClick={() => handlePass(user._id)}
                      >
                        Pass
                      </button>
                    </div>
                  )}
                </div>

                {/* Floating Add Friend Button */}
                <div className="like-floating-friend-btn-wrapper">
                  {friends.has(user._id) ? (
                    <button className="like-floating-friend-btn friends">
                      <UserCheck size={20} />
                      <span>Friends</span>
                    </button>
                  ) : sentRequests.has(user._id) ? (
                    <button className="like-floating-friend-btn pending" disabled>
                      <Clock size={20} />
                      <span>Pending</span>
                    </button>
                  ) : (
                    <button 
                      className="like-floating-friend-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendFriendRequest(user._id, user.fullName || user.firstName);
                      }}
                      disabled={processingRequest.has(user._id)}
                    >
                      {processingRequest.has(user._id) ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} />
                          <span>Add Friend</span>
                        </>
                      )}
                    </button>
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

export default LikesPage;