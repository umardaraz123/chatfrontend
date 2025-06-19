import React, { useState, useRef, useCallback } from 'react';
import { Heart, X, MapPin, Calendar } from 'lucide-react';

const SwipeListItem = ({ user, onSwipe, isActive = true }) => {
  const [dragStyle, setDragStyle] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showLikeOptions, setShowLikeOptions] = useState(false);
  const itemRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const likeOptions = [
    { id: 'crush', emoji: '💘', label: 'Crush', color: '#ec4899' },
    { id: 'intrigued', emoji: '😍', label: 'Intrigued', color: '#f59e0b' },
    { id: 'curious', emoji: '🤔', label: 'Curious', color: '#8b5cf6' },
    { id: 'fun', emoji: '😂', label: 'Looks fun', color: '#10b981' }
  ];

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
    <div className="like-card">
      {showLikeOptions && (
        <div className="like-options-overlay" onClick={handleCloseLikeOptions}>
          <div className="like-options-modal" onClick={(e) => e.stopPropagation()}>
            <div className="like-options-header">
              <h3>How do you feel about {user.firstName}?</h3>
              <button className="close-btn" onClick={handleCloseLikeOptions}>
                <X size={20} />
              </button>
            </div>
            
            <div className="like-options-grid">
              {likeOptions.map((option) => (
                <button
                  key={option.id}
                  className="like-option-btn"
                  style={{ '--option-color': option.color }}
                  onClick={() => handleLikeOptionSelect(option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
            
            
          </div>
        </div>
      )}
      <div 
        ref={itemRef}
        className={`swipe-list-item ${isActive ? 'active' : 'inactive'} ${isRemoving ? 'removing' : ''}`}
        style={dragStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={testClick}
      >
        

        <div className="like-image">
           
        <div className="action-buttons">
          <button 
            className="reject-btn action"
            onClick={handleReject}
            disabled={!isActive || isRemoving}
            title="Pass (Swipe Left)"
          >
            <X size={20} />
          </button>
          
          <button 
            className="approve-btn action"
            onClick={handleShowLikeOptions}
            disabled={!isActive || isRemoving}
            title="Like (Swipe Right)"
          >
            <Heart size={20} />
          </button>
        </div>
          <img 
            src={user.profilePic || (user.gender === 'male' ? '/default-male-avatar.png' : '/default-female-avatar.png')} 
            alt={user.fullName}
            className="profile-pic"
          />
        </div>
        
        <div className="like-info">
          <div className="user-basic">
            <h3>{user.fullName}</h3>
          
              {user.age && (
                  <div className="user-details">
                  <Calendar size={14} />
                  {user.age} years old
                </div>
              )}
             
           
            
              
              {user.location && (
               <div className="user-details">
                  <MapPin size={14} />
                  {user.location}
                </div>
              )}
            
          </div>
          
          {user.bio && (
            <p className="bio">{user.bio}</p>
          )}
          
          {user.interests && user.interests.length > 0 && (
            <div className="interests">
              {user.interests.slice(0, 4).map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
            </div>
          )}
        </div>
       
      </div>

      {/* Like Options Modal */}
     
    </div>
  );
};

export default SwipeListItem;