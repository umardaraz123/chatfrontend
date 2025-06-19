// pages/LikesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Heart, Clock, Loader, Eye, X, UserPlus, MessageCircle, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LikesPage = () => {
  const { 
    getLikedUsers, 
    sendFriendRequest, 
    getFriendRequests,
    getFriends,
    setSelectedUser // Add this to set the selected user for chat
  } = useAuthStore();
  
  const navigate = useNavigate(); // Add this
  
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState(new Set());
  const [sentRequests, setSentRequests] = useState(new Set());
  const [processingRequest, setProcessingRequest] = useState(new Set());

  useEffect(() => {
    loadLikes();
    loadFriends();
    loadSentRequests(); // Add this
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

  // Add this new function to load sent requests
  const loadSentRequests = async () => {
    try {
      const requestsData = await getFriendRequests();
      // Get outgoing request recipient IDs
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
    // Set the selected user in the store
    setSelectedUser(user);
    // Navigate to chat page
    navigate('/dashboard/chat');
  };

  const getStatusBadge = (user) => {
    switch (user.status) {
      case 'matched':
        return (
          <div className="match-badge">
            <Heart size={16} fill="white" />
            Matched!
          </div>
        );
      
      case 'rejected':
        return (
          <div className="rejected-badge">
            <X size={16} />
            Passed
          </div>
        );
      
      case 'viewed':
        return (
          <div className="viewed-badge">
            <Eye size={16} />
            Viewed
          </div>
        );
      
      default:
        return (
          <div className="pending-badge">
            <Clock size={16} />
            Pending
          </div>
        );
    }
  };

  const getStatusMessage = (user) => {
    switch (user.status) {
      case 'matched':
        return 'You matched!';
      case 'rejected':
        return 'They passed on you';
      case 'viewed':
        return 'They saw your profile';
      default:
        return `Liked on ${new Date(user.likedAt).toLocaleDateString()}`;
    }
  };

  const getFriendButton = (user) => {
    const userId = user._id;
    const isProcessing = processingRequest.has(userId);
    const isFriend = friends.has(userId);
    const requestSent = sentRequests.has(userId);

    // If already friends
    if (isFriend) {
      return (
        <button className="friend-status-btn friend">
          <UserCheck size={16} />
          Friends
        </button>
      );
    }

    // If request already sent
    if (requestSent) {
      return (
        <button className="friend-status-btn sent" disabled>
          <Clock size={16} />
          Request Sent
        </button>
      );
    }

    // If can send request
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
        <p>Waiting for them to like you back</p>
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
            <div key={user._id} className="like-card">
              <div className="like-image">
                <img 
                  src={user.profilePic || '/default-avatar.png'} 
                  alt={user.fullName}
                />
                {getStatusBadge(user)}
              </div>
              
              <div className="like-info">
                <h3>{user.fullName}</h3>
                <p>{user.age && `${user.age} years old`}</p>
                <p>📍 {user.location}</p>
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

              {/* Friend Actions */}
              <div className="like-actions">
                {getFriendButton(user)}
                
                <button 
                  className="message-btn"
                  onClick={() => handleMessage(user)} // Updated this line
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