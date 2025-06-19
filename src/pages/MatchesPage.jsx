// pages/MatchesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Heart, MessageCircle, UserPlus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MatchesPage = () => {
  const { getMatches, sendFriendRequest, setSelectedUser, getFriendRequests } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState(new Set()); // Track sent requests
  const [existingRequests, setExistingRequests] = useState(new Set()); // Track existing requests
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
    loadExistingRequests();
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

  const loadExistingRequests = async () => {
    try {
      const { outgoing } = await getFriendRequests();
      const existingRequestIds = new Set(outgoing.map(req => req.recipient._id));
      setExistingRequests(existingRequestIds);
    } catch (error) {
      console.error('Failed to load friend requests:', error);
    }
  };

  const handleSendFriendRequest = async (userId, userName) => {
    // Check if request already sent in this session
    if (sentRequests.has(userId)) {
      toast.error('Friend request already sent!');
      return;
    }

    // Check if request already exists from backend
    if (existingRequests.has(userId)) {
      toast.error('Friend request already exists!');
      return;
    }

    try {
      await sendFriendRequest(userId);
      setSentRequests(prev => new Set([...prev, userId]));
      setExistingRequests(prev => new Set([...prev, userId])); // Also add to existing requests
      toast.success(`Friend request sent to ${userName}!`);
    } catch (error) {
      // Handle backend error messages
      const errorMessage = error.response?.data?.message || 'Failed to send friend request';
      toast.error(errorMessage);
      
      // If it's an "already exists" error, add to existing requests
      if (errorMessage.includes('already exists') || errorMessage.includes('Already friends')) {
        setExistingRequests(prev => new Set([...prev, userId]));
      }
    }
  };

  const handleMessage = (match) => {
    setSelectedUser(match);
    navigate('/dashboard/chat');
  };

  const isRequestSent = (userId) => {
    return sentRequests.has(userId) || existingRequests.has(userId);
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
        <h1>Your Matches</h1>
        <p>People who liked you back</p>
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <Heart size={80} className="text-gray-400" />
          <h2>No matches yet</h2>
          <p>Keep swiping to find your perfect match!</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match._id} className="match-card">
              <div className="match-image">
                <img 
                  src={match.profilePic || '/default-avatar.png'} 
                  alt={match.fullName}
                />
                <div className="match-badge">
                  <Heart size={16} fill="white" />
                  Match!
                </div>
              </div>
              
              <div className="match-info">
                <h3>{match.fullName}</h3>
                <p>{match.age && `${match.age} years old`}</p>
                <p>📍 {match.location}</p>
                {match.bio && <p className="bio">{match.bio}</p>}
                
                {match.interests && match.interests.length > 0 && (
                  <div className="interests">
                    {match.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                )}
                
                <p className="match-date">
                  Matched on {new Date(match.matchedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="match-actions">
                <button 
                  className="chat-btn"
                  onClick={() => handleMessage(match)}
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
                
                <button 
                  className={`friend-request-btn ${isRequestSent(match._id) ? 'request-sent' : ''}`}
                  onClick={() => handleSendFriendRequest(match._id, match.fullName)}
                  disabled={isRequestSent(match._id)}
                >
                  <UserPlus size={16} />
                  {isRequestSent(match._id) ? 'Request Sent' : 'Add Friend'}
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