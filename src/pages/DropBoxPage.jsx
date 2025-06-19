import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Heart, X, MapPin, Calendar, Loader, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const DropBoxPage = () => {
  const { getReceivedSwipes, swipeUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [receivedSwipes, setReceivedSwipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingSwipe, setProcessingSwipe] = useState(new Set());

  // Like type configurations
  const likeTypeConfig = {
    crush: { 
      emoji: '💘', 
      label: 'has a crush on you', 
      actionText: 'Crush Back',
      color: '#ec4899', 
      bgColor: '#fdf2f8' 
    },
    intrigued: { 
      emoji: '😍', 
      label: 'is intrigued by you', 
      actionText: 'Be Intrigued Back',
      color: '#f59e0b', 
      bgColor: '#fffbeb' 
    },
    curious: { 
      emoji: '🤔', 
      label: 'is curious about you', 
      actionText: 'Be Curious Back',
      color: '#8b5cf6', 
      bgColor: '#faf5ff' 
    },
    fun: { 
      emoji: '😂', 
      label: 'thinks you look fun', 
      actionText: 'Think They\'re Fun Too',
      color: '#10b981', 
      bgColor: '#f0fdf4' 
    }
  };

  useEffect(() => {
    loadReceivedSwipes();
  }, []);

  const loadReceivedSwipes = async () => {
    try {
      setIsLoading(true);
      const swipes = await getReceivedSwipes();
      console.log('Loaded received swipes:', swipes.length);
      setReceivedSwipes(swipes);
    } catch (error) {
      console.error('Failed to load received swipes:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (userId, action, theirLikeType, userName) => {
    if (processingSwipe.has(userId)) return;

    try {
      setProcessingSwipe(prev => new Set([...prev, userId]));
      
      console.log('=== DROPBOX RESPONSE ===');
      console.log('Target user ID:', userId);
      console.log('Action:', action);
      console.log('Their like type:', theirLikeType);
      
      if (action === 'like') {
        const result = await swipeUser(userId, action, theirLikeType);
        console.log('Swipe result:', result);
        
        if (result.success) {
          if (result.isMatch) {
            const config = likeTypeConfig[theirLikeType];
            toast.success(`🎉 MUTUAL ${config.actionText.toUpperCase()}!`, {
              duration: 4000,
              style: {
                background: config.color,
                color: 'white',
                fontWeight: 'bold',
              }
            });
            
            setTimeout(() => {
              navigate('/dashboard/matches');
            }, 2000);
          } else {
            toast.success(`You responded to ${userName}!`);
          }
          
          // Remove from DropBox list
          setReceivedSwipes(prev => prev.filter(swipe => swipe.user._id !== userId));
        } else if (result.alreadySwiped) {
          toast('You already responded to this person');
          // Still remove from DropBox if already swiped
          setReceivedSwipes(prev => prev.filter(swipe => swipe.user._id !== userId));
        }
      } else {
        // Pass action
        const result = await swipeUser(userId, action);
        toast(`You passed on ${userName}`);
        
        // Remove from DropBox
        setReceivedSwipes(prev => prev.filter(swipe => swipe.user._id !== userId));
      }
      
      // After successful response, refresh the entire list
      setTimeout(async () => {
        await loadReceivedSwipes();
      }, 500);
      
    } catch (error) {
      console.error('Error responding:', error);
      
      if (error.response?.data?.alreadySwiped || 
          error.response?.data?.message?.includes('Already swiped')) {
        // Remove from DropBox even if already swiped
        setReceivedSwipes(prev => prev.filter(swipe => swipe.user._id !== userId));
        toast('Already responded to this person');
      } else {
        toast.error('Failed to respond');
      }
    } finally {
      setProcessingSwipe(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getLikeTypeMessage = (swipe) => {  // Changed parameter from 'user' to 'swipe'
    const likeType = swipe.likeType;  // Access likeType from swipe object
    if (likeType && likeTypeConfig[likeType]) {
      const config = likeTypeConfig[likeType];
      return {
        message: `${swipe.user.firstName} ${config.label}`,  // Access firstName from swipe.user
        emoji: config.emoji,
        color: config.color,
        bgColor: config.bgColor,
        actionText: config.actionText
      };
    }
    return {
      message: `${swipe.user.firstName} liked you`,  // Access firstName from swipe.user
      emoji: '❤️',
      color: '#dc2626',
      bgColor: '#fef2f2',
      actionText: 'Like back'
    };
  };

  if (isLoading) {
    return (
      <div className="dropbox-loading">
        <Loader className="animate-spin" size={40} />
        <p>Loading who likes you...</p>
      </div>
    );
  }

  return (
    <div className="dropbox-page">
      <div className="dropbox-header">
        <h1>People Who Like You</h1>
        <p>Respond to create matches or pass to remove them</p>
      </div>

      {receivedSwipes.length === 0 ? (
        <div className="no-swipes">
          <Users size={80} className="text-gray-400" />
          <h2>No one has liked you yet</h2>
          <p>Keep being awesome! Someone will notice you soon.</p>
        </div>
      ) : (
        <div className="swipes-container">
          <div className="swipes-count">
            <span>{receivedSwipes.length} people are interested in you!</span>
          </div>
          
          <div className="likes-grid">
            {receivedSwipes.map((swipe) => {
              const likeInfo = getLikeTypeMessage(swipe);  // Pass the entire swipe object
              const isProcessing = processingSwipe.has(swipe.user._id);
              
              return (
                <div key={swipe.user._id} className="like-card">
                  <div className="swipe-user-info">
                    <div className="like-image">
                           <div className="action-buttons">
                    <button 
                      className="pass-btn btnn"
                      onClick={() => handleResponse(swipe.user._id, 'dislike', null, swipe.user.firstName)}
                      disabled={isProcessing}
                    >
                      <X size={18} />
                      Pass
                    </button>
                    
                    <button 
                      className="same-emotion-btn btnn"
                      onClick={() => handleResponse(swipe.user._id, 'like', swipe.likeType, swipe.user.firstName)}
                      disabled={isProcessing}
                      style={{ 
                        backgroundColor: likeInfo.color
                      }}
                    >
                      {isProcessing ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <>
                          <span className="action-emoji">{likeInfo.emoji}</span>
                          {likeInfo.actionText}
                        </>
                      )}
                    </button>
                  </div>
                      <img 
                        src={swipe.user.profilePic || (swipe.user.gender === 'male' ? '/default-male-avatar.png' : '/default-female-avatar.png')} 
                        alt={swipe.user.fullName}
                        className="user-avatar"
                      />
                      
                      {/* Like type badge */}
                      {/* <div 
                        className="your-like-type"
                        style={{ 
                          backgroundColor: likeInfo.bgColor,
                          color: likeInfo.color,
                          border: `1px solid ${likeInfo.color}30`
                        }}
                      >
                        <span className="like-emoji">{likeInfo.emoji}</span>
                      </div> */}
                    </div>
                    
                    <div className="like-info">
                        <div 
                        className="like-message"
                        style={{ backgroundColor: likeInfo.color }}
                      >
                        <strong>{likeInfo.message}</strong>
                      </div>
                      <h3>{swipe.user.fullName}</h3>
                      <div className="user-meta">
                        {swipe.user.age && (
                          <span className="user-details">
                            <Calendar size={14} />
                            {swipe.user.age} years old
                          </span>
                        )}
                        {swipe.user.location && (
                          <span className="user-details">
                            <MapPin size={14} />
                            {swipe.user.location}
                          </span>
                        )}
                      </div>
                      
                      {/* Like message */}
                      
                      
                      {swipe.user.bio && (
                        <p className="bio">{swipe.user.bio}</p>
                      )}
                      
                      {swipe.user.interests && swipe.user.interests.length > 0 && (
                        <div className="interests">
                          {swipe.user.interests.slice(0, 4).map((interest, index) => (
                            <span key={index} className="interest-tag">{interest}</span>
                          ))}
                        </div>
                      )}
                      
                      {/* <span className="time-ago">
                        {new Date(swipe.createdAt).toLocaleDateString()}
                      </span> */}
                    </div>
                  </div>

               
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropBoxPage;