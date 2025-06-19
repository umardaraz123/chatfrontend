// pages/FriendsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, UserPlus, MessageCircle, Check, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  const navigate = useNavigate();

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
    try {
      await respondToFriendRequest(requestId, action);
      toast.success(action === 'accept' ? 'Friend request accepted!' : 'Friend request declined');
      loadData(); // Reload data
    } catch (error) {
      toast.error('Failed to respond to request');
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
        <p>Loading friends data...</p>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="friends-header">
        <h1>Friends & Requests</h1>
        
        <div className="friends-tabs">
          <button 
            className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <Users size={16} />
            Friends ({friends.length})
          </button>
          
          <button 
            className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            <UserPlus size={16} />
            Received ({requests.incoming?.length || 0})
          </button>
          
          <button 
            className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('outgoing')}
          >
            <MessageCircle size={16} />
            Sent ({requests.outgoing?.length || 0})
          </button>
        </div>
      </div>

      <div className="friends-content">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="empty-state">
                <Users size={60} />
                <h3>No friends yet</h3>
                <p>Start connecting with people you've matched with!</p>
              </div>
            ) : (
              <div className="friends-grid">
                {friends.map((friend) => (
                  <div key={friend._id} className="friend-card">
                    <div className="friend-image">
                      <img 
                        src={friend.profilePic || '/default-avatar.png'} 
                        alt={friend.fullName} 
                      />
                    </div>
                    
                    <div className="friend-info">
                      <h4>{friend.fullName}</h4>
                      <p>📍 {friend.location}</p>
                      {friend.bio && <p className="bio">{friend.bio}</p>}
                    </div>
                    
                    <div className="friend-actions">
                      <button 
                        className="message-friend-btn"
                        onClick={() => handleMessage(friend)}
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
        )}

        {/* Incoming Requests Tab */}
        {activeTab === 'incoming' && (
          <div className="incoming-requests">
            {requests.incoming?.length === 0 ? (
              <div className="empty-state">
                <UserPlus size={60} />
                <h3>No friend requests</h3>
                <p>You'll see friend requests here when people want to connect with you.</p>
              </div>
            ) : (
              <div className="requests-grid">
                {requests.incoming?.map((request) => (
                  <div key={request._id} className="request-card incoming">
                    <div className="request-image">
                      <img 
                        src={request.requester.profilePic || '/default-avatar.png'} 
                        alt={request.requester.firstName}
                      />
                    </div>
                    
                    <div className="request-info">
                      <h4>{request.requester.firstName} {request.requester.lastName}</h4>
                      {request.requester.bio && <p className="bio">{request.requester.bio}</p>}
                      <p className="request-date">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="request-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleRequestResponse(request._id, 'accept')}
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      
                      <button 
                        className="decline-btn"
                        onClick={() => handleRequestResponse(request._id, 'decline')}
                      >
                        <X size={16} />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outgoing Requests Tab */}
        {activeTab === 'outgoing' && (
          <div className="outgoing-requests">
            {requests.outgoing?.length === 0 ? (
              <div className="empty-state">
                <MessageCircle size={60} />
                <h3>No sent requests</h3>
                <p>Friend requests you send will appear here.</p>
              </div>
            ) : (
              <div className="requests-grid">
                {requests.outgoing?.map((request) => (
                  <div key={request._id} className="request-card outgoing">
                    <div className="request-image">
                      <img 
                        src={request.recipient.profilePic || '/default-avatar.png'} 
                        alt={request.recipient.firstName}
                      />
                    </div>
                    
                    <div className="request-info">
                      <h4>{request.recipient.firstName} {request.recipient.lastName}</h4>
                      {request.recipient.bio && <p className="bio">{request.recipient.bio}</p>}
                      <p className="request-date">
                        Sent on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="pending-status">
                      <MessageCircle size={16} />
                      Pending
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;