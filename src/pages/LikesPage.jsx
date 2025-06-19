// pages/LikesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Loader, Eye, X, UserPlus, MessageCircle, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LikesPage = () => {
  const { 
    getLikedUsers, 
    sendFriendRequest, 
    getFriendRequests,
    getFriends,
    setSelectedUser
  } = useAuthStore();
  
  const navigate = useNavigate();
  
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState(new Set());
  const [sentRequests, setSentRequests] = useState(new Set());
  const [processingRequest, setProcessingRequest] = useState(new Set());

  // Like type configurations
  const likeTypeConfig = {
    crush: { emoji: '💘', label: 'Crush', color: '#ec4899', bgColor: '#fdf2f8' },
    intrigued: { emoji: '😍', label: 'Intrigued', color: '#f59e0b', bgColor: '#fffbeb' },
    curious: { emoji: '🤔', label: 'Curious', color: '#8b5cf6', bgColor: '#faf5ff' },
    fun: { emoji: '😂', label: 'Looks Fun', color: '#10b981', bgColor: '#f0fdf4' }
  };

  useEffect(() => {
    loadLikes();
    loadFriends();
    loadSentRequests();
  }, []);

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const likesData = await getLikedUsers();
      setLikes(likesData);
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
      toast.success(`Friend request sent to ${userName}!`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send friend request';
      
      if (errorMessage.includes('already friends')) {
        toast.error('You are already friends with this person');
        setFriends(prev => new Set([...prev, userId]));
      } else if (errorMessage.includes('already exists')) {
        toast.error('Friend request already sent');
        setSentRequests(prev => new Set([...prev, userId]));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setProcessingRequest(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleMessage = (user) => {
    setSelectedUser(user);
    navigate('/dashboard/chat');
  };

  // Updated function to show YOUR like type prominently
  const getYourLikeTypeBadge = (user) => {
    const likeType = user.likeType; // YOUR like type
    
    if (likeType && likeTypeConfig[likeType]) {
      const config = likeTypeConfig[likeType];
      return (
        <div 
          className="your-like-type-badge"
          style={{ 
            backgroundColor: config.color,
            color: 'white'
          }}
        >
          <span className="like-emoji">{config.emoji}</span>
          <span className="like-label">You felt: {config.label}</span>
        </div>
      );
    }
    
    // Fallback for regular likes without specific type
    return (
      <div className="your-like-type-badge default-like">
        <span className="like-emoji">❤️</span>
        <span className="like-label">You liked them</span>
      </div>
    );
  };

  // Function to show their response if matched
  const getTheirResponseBadge = (user) => {
    if (user.isMatch && user.theirLikeType) {
      const config = likeTypeConfig[user.theirLikeType];
      return (
        <div 
          className="their-response-badge your-like-type-badge"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color,
            border: `1px solid ${config.color}`
          }}
        >
          <span className="like-emoji">{config.emoji}</span>
          <span className="like-label">They felt: {config.label}</span>
        </div>
      );
    }
    
    if (user.isMatch) {
      return (
        <div className="their-response-badge match">
          <span className="like-emoji">❤️</span>
          <span className="like-label">They liked you back!</span>
        </div>
      );
    }
    
    return null;
  };

  const getStatusMessage = (user) => {
    const likeDate = new Date(user.likedAt).toLocaleDateString();
    
    if (user.isMatch) {
      return `Matched on ${likeDate} 🎉`;
    }
    
    return `You liked them on ${likeDate}`;
  };

  const getFriendButton = (user) => {
    const userId = user._id;
    const isProcessing = processingRequest.has(userId);
    const isFriend = friends.has(userId);
    const requestSent = sentRequests.has(userId);

    if (isFriend) {
      return (
        <button className="friend-status-btn friend">
          <UserCheck size={16} />
          Friends
        </button>
      );
    }

    if (requestSent) {
      return (
        <button className="friend-status-btn sent" disabled>
          <Clock size={16} />
          Request Sent
        </button>
      );
    }

    return (
      <button 
        className="friend-request-btn"
        onClick={() => handleSendFriendRequest(userId, user.fullName)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader size={16} className="animate-spin" />
        ) : (
          <UserPlus size={16} />
        )}
        {isProcessing ? 'Sending...' : 'Add Friend'}
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="likes-loading">
        <Loader className="animate-spin" size={40} />
        <p>Loading your likes...</p>
      </div>
    );
  }

  return (
    <div className="likes-page">
      <div className="likes-header">
        <h1>People You Liked</h1>
        <p>See how you felt about each person and their responses</p>
      </div>

      {likes.length === 0 ? (
        <div className="no-likes">
          <Heart size={80} className="text-gray-400" />
          <h2>No likes yet</h2>
          <p>Start swiping to like people!</p>
        </div>
      ) : (
        <div className="likes-grid">
          {likes.map((user) => (
            <div key={user._id} className={`like-card ${user.isMatch ? 'matched' : ''}`}>
              <div className="like-image">
                <img 
                  src={user.profilePic || (user.gender === 'male' ? '/default-male-avatar.png' : '/default-female-avatar.png')} 
                  alt={user.fullName}
                />
                
                {/* Match indicator */}
                {user.isMatch && (
                  <div className="match-indicator">
                    <Heart size={16} fill="white" />
                    MATCH!
                  </div>
                )}
              </div>
              
              <div className="like-info">
                <h3>{user.fullName}</h3>
                <p>{user.age && `${user.age} years old`}</p>
                {user.location && <p>📍 {user.location}</p>}
                
                {/* YOUR like type - prominently displayed */}
                <div className="like-actions-section">
                  {getYourLikeTypeBadge(user)}
                  
                  {/* Their response if matched */}
                  {getTheirResponseBadge(user)}
                </div>
                
                {user.bio && <p className="bio">{user.bio}</p>}
                
                {user.interests && user.interests.length > 0 && (
                  <div className="interests">
                    {user.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                )}
                
                <p className="status-date">
                  {getStatusMessage(user)}
                </p>
              </div>

              <div className="like-actions">
                {getFriendButton(user)}
                
                <button 
                  className="message-btn"
                  onClick={() => handleMessage(user)}
                >
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikesPage;