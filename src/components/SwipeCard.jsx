// components/SwipeCard.jsx
import React, { useState, useRef, useCallback } from 'react';
import { Heart, X } from 'lucide-react';
import girlImage from '../images/girl.jpg'
import boyImage from '../images/boy.jpg'
const SwipeCard = ({ user, onSwipe, isActive = true }) => {
  const [dragStyle, setDragStyle] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX, clientY) => {
    if (!isActive) return;
    
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: 0, y: 0 };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !isActive) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    currentPos.current = { x: deltaX, y: deltaY };
    
    const rotation = deltaX * 0.1;
    const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 300);
    
    setDragStyle({
      transform: `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`,
      opacity: opacity,
      transition: 'none'
    });
  };

  const handleEnd = () => {
    if (!isDragging || !isActive) return;
    
    setIsDragging(false);
    const deltaX = currentPos.current.x;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      // Determine swipe direction
      const action = deltaX > 0 ? 'like' : 'dislike';
      
      // Always animate card off screen first
      setDragStyle({
        transform: `translate(${deltaX > 0 ? '100vw' : '-100vw'}, ${currentPos.current.y}px) rotate(${deltaX > 0 ? '30deg' : '-30deg'})`,
        opacity: 0,
        transition: 'all 0.3s ease-out'
      });
      
      // Call onSwipe after animation - this should handle the removal regardless of backend response
      setTimeout(() => {
        onSwipe(user._id, action);
        setDragStyle({});
      }, 300);
    } else {
      // Snap back to center
      setDragStyle({
        transform: 'translate(0px, 0px) rotate(0deg)',
        opacity: 1,
        transition: 'all 0.3s ease-out'
      });
      
      setTimeout(() => setDragStyle({}), 300);
    }
  };

  // Update button click handlers to always remove the card
  const handleButtonSwipe = (action) => {
    if (!isActive) return;
    
    // Animate off screen
    setDragStyle({
      transform: `translate(${action === 'like' ? '100vw' : '-100vw'}, 0px) rotate(${action === 'like' ? '30deg' : '-30deg'})`,
      opacity: 0,
      transition: 'all 0.3s ease-out'
    });
    
    // Always call onSwipe to remove card
    setTimeout(() => {
      onSwipe(user._id, action);
      setDragStyle({});
    }, 300);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY);
  }, [isDragging, isActive]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [isDragging, isActive]);

  // Touch events - Fixed to prevent passive event listener issues
  const handleTouchStart = (e) => {
    // Don't preventDefault here for passive events
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    // Only preventDefault if we're actually dragging
    if (isDragging) {
      e.preventDefault();
    }
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
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Add touch event listeners with proper options
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const touchMoveHandler = (e) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    // Add touch move listener with passive: false to allow preventDefault
    card.addEventListener('touchmove', touchMoveHandler, { passive: false });

    return () => {
      card.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [isDragging]);

  return (
    <div 
      ref={cardRef}
      className={`swipe-card ${isActive ? 'active' : 'inactive'}`}
      style={dragStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicators */}
      {isDragging && (
        <>
          <div className={`swipe-indicator like ${currentPos.current.x > 50 ? 'visible' : ''}`}>
            <Heart size={40} />
            <span>LIKE</span>
          </div>
          <div className={`swipe-indicator nope ${currentPos.current.x < -50 ? 'visible' : ''}`}>
            <X size={40} />
            <span>NOPE</span>
          </div>
        </>
      )}
      
      <div className="card-image">
         {user?.profilePic ? (
                              <img src={user?.profilePic} alt={user?.firstName} />
                            ) : user?.gender === 'male' ? (
                              <img src={boyImage} alt={user?.firstName} />
                            ) : (
                              <img src={girlImage} alt={user?.firstName} />
                            )}
      </div>
      
      <div className="card-content">
        <h3>{user.fullName}, {user.age}</h3>
        {/* <p>{user.bio}</p> */}
        <p>📍 {user.location}</p>
        
        {user.interests && user.interests.length > 0 && (
          <div className="interests">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="interest-tag">{interest}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="card-actions">
        <button 
          className="dislike-btn"
          onClick={() => handleButtonSwipe('dislike')}
          disabled={!isActive}
        >
          <X size={24} />
        </button>
        
        <button 
          className="like-btn"
          onClick={() => handleButtonSwipe('like')}
          disabled={!isActive}
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;