import React, { useState, useRef, useCallback } from 'react';
import { Heart, X } from 'lucide-react';
import bdImage from '../images/bd.png';

const SwipeListItem = ({ user, onSwipe, isActive = true }) => {
  const [dragStyle, setDragStyle] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showLikeOptions, setShowLikeOptions] = useState(false);
  const itemRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const likeOptions = [
    { id: 'curious', emoji: '🤔', label: 'Curious', description: "It Sparks Curiosity — A Feeling That's Exciting You!", color: '#8b5cf6' },
    { id: 'crush', emoji: '😍', label: 'Crush', description: 'Feeling Nervous Or Totally When You See Or Think About Them!', color: '#ec4899' },
    { id: 'fun', emoji: '😂', label: 'Looks fun', description: "It's A Connection That Makes Smiling Come Naturally!", color: '#10b981' }
  ];

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

  const handleStart = (clientX, clientY) => {
    if (!isActive || isRemoving) return;
    
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: 0, y: 0 };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !isActive || isRemoving) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    // Only allow horizontal movement and slight vertical
    const limitedDeltaY = Math.max(-20, Math.min(20, deltaY));
    
    currentPos.current = { x: deltaX, y: limitedDeltaY };
    
    const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 200);
    
    setDragStyle({
      transform: `translateX(${deltaX}px) translateY(${limitedDeltaY}px)`,
      opacity: opacity,
      transition: 'none'
    });
  };

  const handleEnd = () => {
    if (!isDragging || !isActive || isRemoving) return;
    
    setIsDragging(false);
    const deltaX = currentPos.current.x;
    const threshold = 80;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        // Swipe left - direct dislike
        handleDirectSwipe('dislike');
      } else {
        // Swipe right - show like options
        setShowLikeOptions(true);
        setDragStyle({
          transform: 'translateX(0px) translateY(0px)',
          opacity: 1,
          transition: 'all 0.3s ease-out'
        });
        setTimeout(() => setDragStyle({}), 300);
      }
    } else {
      // Snap back to center
      setDragStyle({
        transform: 'translateX(0px) translateY(0px)',
        opacity: 1,
        transition: 'all 0.3s ease-out'
      });
      
      setTimeout(() => setDragStyle({}), 300);
    }
  };

  const handleDirectSwipe = (action, likeType = null) => {
    if (!isActive || isRemoving) return;
    
    console.log('handleDirectSwipe called:', { userId: user._id, action, likeType }); // Debug log
    
    setIsRemoving(true);
    setShowLikeOptions(false);
    
    // Animate off screen based on action
    const direction = action === 'like' ? '100%' : '-100%';
    
    setDragStyle({
      transform: `translateX(${direction})`,
      opacity: 0,
      transition: 'all 0.3s ease-out'
    });
    
    // Call onSwipe after animation
    setTimeout(() => {
      console.log('Calling onSwipe:', { userId: user._id, action, likeType }); // Debug log
      onSwipe(user._id, action, likeType);
      setDragStyle({});
      setIsRemoving(false);
    }, 300);
  };

  const handleLikeOptionSelect = (likeType) => {
    console.log('Like option selected:', likeType); // Debug log
    handleDirectSwipe('like', likeType);
  };

  const handleReject = () => {
    setShowLikeOptions(false);
    handleDirectSwipe('dislike');
  };

  const handleShowLikeOptions = () => {
    setShowLikeOptions(true);
  };

  const handleCloseLikeOptions = () => {
    setShowLikeOptions(false);
  };

  const handleLikeClick = (likeType) => {
    console.log('Like clicked:', { userId: user._id, likeType, isActive });
    if (onSwipe) {
      onSwipe(user._id, 'like', likeType);
    } else {
      console.error('onSwipe function not available');
    }
  };

  const handlePassClick = () => {
    console.log('Pass clicked:', { userId: user._id, isActive });
    if (onSwipe) {
      onSwipe(user._id, 'dislike');
    } else {
      console.error('onSwipe function not available');
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    // Allow clicks on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return; // Don't start drag on button clicks
    }
    
    if (!isActive) return;
    
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY);
  }, [isDragging, isActive, isRemoving]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [isDragging, isActive, isRemoving]);

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    handleEnd();
  };

  // Add event listeners for mouse
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Add touch event listeners
  React.useEffect(() => {
    const item = itemRef.current;
    if (!item || !isDragging) return;

    const touchMoveHandler = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    item.addEventListener('touchmove', touchMoveHandler, { passive: false });

    return () => {
      item.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [isDragging]);

  // Add this test to SwipeListItem to see if clicks work
  const testClick = () => {
    console.log('Card clicked!', user.firstName);
 
  };

  return (
    <div className="swipe-card-wrapper">
      {showLikeOptions && (
        <div className="swipe-like-options-overlay" onClick={handleCloseLikeOptions}>
          <div className="swipe-like-options-content" onClick={(e) => e.stopPropagation()}>
            <div className="swipe-like-options-grid">
              {likeOptions.map((option) => (
                <div
                  key={option.id}
                  className="swipe-like-option-card"
                  onClick={() => handleLikeOptionSelect(option.id)}
                >
                  <div className="swipe-emoji-large">{option.emoji}</div>
                  <h4 className="swipe-option-label">{option.label}</h4>
                  <p className="swipe-option-description">{option.description}</p>
                  <button className="swipe-send-button">Send</button>
                </div>
              ))}
            </div>
            <button className="swipe-close-modal" onClick={handleCloseLikeOptions}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={itemRef}
        className={`swipe-profile-card ${isActive ? 'active' : 'inactive'} ${isRemoving ? 'removing' : ''}`}
        style={dragStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        <img 
          src={user.profilePic || user.image || 'https://via.placeholder.com/400x600/B8578D/ffffff?text=No+Photo'} 
          alt={user.fullName || user.firstName}
          className="swipe-background-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x600/B8578D/ffffff?text=No+Photo';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="swipe-gradient-overlay"></div>
        
        {/* Action Buttons - Top Right */}
        <div className="swipe-action-buttons">
          <button 
            className="swipe-reject-btn"
            onClick={handleReject}
            disabled={!isActive || isRemoving}
            title="Pass"
          >
            <X size={24} />
          </button>
          
          <button 
            className="swipe-approve-btn"
            onClick={handleShowLikeOptions}
            disabled={!isActive || isRemoving}
            title="Like"
          >
            <Heart size={24} />
          </button>
        </div>
        
        {/* Bottom Content - User Info */}
        <div className="swipe-bottom-content">
          <div className="swipe-name-row">
            <h3 className="swipe-name">{user.fullName || user.firstName}</h3>
            <svg className="swipe-verified-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FF6B9D"/>
            </svg>
            <div className="swipe-age">
              <img src={bdImage} alt="Birthday" style={{ width: '16px', height: '16px' }} />
              <span>{getAge(user.dateOfBirth) || 22}</span>
            </div>
          </div>

          {user.profession && (
            <p className="swipe-profession">{user.profession}</p>
          )}

          {user.bio && (
            <p className="swipe-bio">{user.bio}</p>
          )}

          {user.lifeGoal && (
            <p className="swipe-quote">"{user.lifeGoal}"</p>
          )}

          {user.interests && user.interests.length > 0 && (
            <>
              <p className="swipe-interests-title">Interests</p>
              <div className="swipe-interests">
                {user.interests.slice(0, 4).map((interest, index) => (
                  <div key={index} className="swipe-interest-chip">
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
    </div>
  );
};

export default SwipeListItem;