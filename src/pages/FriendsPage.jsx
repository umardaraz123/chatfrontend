// pages/FriendsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, UserPlus, MessageCircle, Check, X, Loader, ChevronLeft, User, Compass, ThumbsUp, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import './FriendsPage.css';
import bdImage from '../images/bd.png';

const FriendsPage = () => {
  const { 
    getFriends, 
    getFriendRequests, 
    respondToFriendRequest,
    setSelectedUser
  } = useAuthStore();
  
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [activeTab, setActiveTab] = useState('friends');
  const [isLoading, setIsLoading] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [friendsData, requestsData] = await Promise.all([
        getFriends(),
        getFriendRequests()
      ]);
      setFriends(friendsData);
      setRequests(requestsData);
    } catch (error) {
      toast.error('Failed to load friends data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    setProcessingRequest(requestId);
    try {
      await respondToFriendRequest(requestId, action);
      toast.success(action === 'accept' ? 'Friend request accepted!' : 'Friend request declined');
      loadData(); // Reload data
    } catch (error) {
      toast.error('Failed to respond to request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleMessage = (friend) => {
    // Set the selected user in the store
    setSelectedUser(friend);
    // Navigate to chat page
    navigate('/dashboard/chat');
  };

  if (isLoading) {
    return (
      <div className="friends-loading">
        <Loader className="animate-spin" size={40} />
        <p>Loading...</p>
      </div>
    );
  }

  const getCurrentData = () => {
    if (activeTab === 'friends') return friends;
    if (activeTab === 'incoming') return requests.incoming || [];
    return requests.outgoing || [];
  };

  const currentData = getCurrentData();

  return (
    <div className="friends-page">
      {/* Header */}
      <div className="friends-header">
        <button className="friends-back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Friends & Requests</h1>
        <p>Connect and chat with your friends</p>
      </div>

      {/* Tabs */}
      <div className="friends-tabs">
        <button 
          className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button 
          className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Received
        </button>
        <button 
          className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Sent
        </button>
      </div>

      {/* Cards Grid */}
      <div className="friends-cards-grid">
        {currentData.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'friends' && <Users size={48} />}
            {activeTab === 'incoming' && <ThumbsUp size={48} />}
            {activeTab === 'outgoing' && <Heart size={48} />}
            <p>
              {activeTab === 'friends' && 'No friends yet. Start connecting!'}
              {activeTab === 'incoming' && 'No incoming requests'}
              {activeTab === 'outgoing' && 'No outgoing requests'}
            </p>
          </div>
        ) : (
          currentData.map((person) => {
            // Handle different data structures for friends vs requests
            const userData = activeTab === 'friends' 
              ? person 
              : activeTab === 'incoming' 
                ? person.requester 
                : person.recipient;

            return (
              <div key={person._id} className="friend-card">
                {/* Background Image */}
                <div 
                  className="friend-background-image"
                  style={{
                    backgroundImage: `url(${userData.profilePic || '/avatar.png'})`
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="friend-gradient-overlay" />
                
                {/* Badge (for verified users) */}
                {userData.verified && (
                  <div className="friend-badge">
                    <Check size={14} />
                  </div>
                )}
                
                {/* Message Button (for friends tab) */}
                {activeTab === 'friends' && (
                  <button 
                    className="friend-message-button"
                    onClick={() => handleMessage(person)}
                  >
                    <MessageCircle size={20} />
                  </button>
                )}
                
                {/* Bottom Content */}
                <div className="friend-bottom-content">
                  <div className="friend-name-row">
                    <h3>
                      {userData.fullName || 
                       `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
                       'No Name'}
                    </h3>
                    {userData.dateOfBirth && (
                      <div className="friend-age-badge">
                        <img src={bdImage} alt="birthday" />
                        <span>{getAge(userData.dateOfBirth)}</span>
                      </div>
                    )}
                  </div>
                  
                  {userData.bio && (
                    <p className="friend-bio">{userData.bio.slice(0, 80)}...</p>
                  )}
                  
                  {userData.interests && userData.interests.length > 0 && (
                    <div className="friend-interests">
                      {userData.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="interest-chip">
                          {interest}
                        </span>
                      ))}
                      {userData.interests.length > 3 && (
                        <span className="interest-chip">+{userData.interests.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons (for requests) */}
                  {activeTab === 'incoming' && (
                    <div className="friend-action-buttons">
                      <button 
                        className="accept-button"
                        onClick={() => handleRequestResponse(person._id, 'accept')}
                        disabled={processingRequest === person._id}
                      >
                        {processingRequest === person._id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Check size={16} />
                            Accept
                          </>
                        )}
                      </button>
                      <button 
                        className="decline-button"
                        onClick={() => handleRequestResponse(person._id, 'decline')}
                        disabled={processingRequest === person._id}
                      >
                        <X size={16} />
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {/* Pending Status (for outgoing requests) */}
                  {activeTab === 'outgoing' && (
                    <div className="pending-status">
                      <MessageCircle size={16} />
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="friends-bottom-nav">
        <button 
          className={isActiveRoute('/dashboard/profile') ? 'active' : ''}
          onClick={() => navigate('/dashboard/profile')}
        >
          <User size={24} />
          <span>Profile</span>
        </button>
        <button 
          className={isActiveRoute('/dashboard/swipe') ? 'active' : ''}
          onClick={() => navigate('/dashboard/swipe')}
        >
          <Compass size={24} />
          <span>Discover</span>
        </button>
        <button 
          className={isActiveRoute('/dashboard/likes') ? 'active' : ''}
          onClick={() => navigate('/dashboard/likes')}
        >
          <ThumbsUp size={24} />
          <span>Likes</span>
        </button>
        <button 
          className={isActiveRoute('/dashboard/matches') ? 'active' : ''}
          onClick={() => navigate('/dashboard/matches')}
        >
          <Heart size={24} />
          <span>Matches</span>
        </button>
      </div>
    </div>
  );
};

export default FriendsPage;