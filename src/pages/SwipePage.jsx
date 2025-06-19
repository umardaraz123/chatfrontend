// pages/SwipePage.jsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import SwipeCard from '../components/SwipeCard';
import { Loader, Users, Heart, RotateCcw,X } from 'lucide-react';
import toast from 'react-hot-toast';

const SwipePage = () => {
  const { 
    swipeableUsers, 
    getSwipeableUsers, 
    swipeUser, 
    isLoadingUsers,
    authUser 
  } = useAuthStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      await getSwipeableUsers();
      setCurrentIndex(0);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (userId, action) => {
    try {
      const currentUserName = swipeableUsers[currentIndex]?.firstName || 'User';
      
      // Move to next card immediately
      setCurrentIndex(prevIndex => prevIndex + 1);
      
      // Add to swipe history for undo functionality
      setSwipeHistory(prev => [...prev, { 
        userId, 
        action, 
        index: currentIndex 
      }]);
      
      // Show immediate feedback for the swipe action
      if (action === 'like') {
        toast.success(`❤️ You liked ${currentUserName}!`, { duration: 1500 });
      } else {
        toast(`👋 You passed on ${currentUserName}`, { 
          duration: 1000,
          style: {
            background: '#6b7280',
            color: 'white',
          }
        });
      }
      
      // Try to save to backend
      const result = await swipeUser(userId, action);
      
      // Check if it's a match
      if (result.isMatch && !result.alreadySwiped) {
        setTimeout(() => {
          toast.success(`🎉 It's a match with ${currentUserName}! Start chatting now!`, { 
            duration: 4000,
            style: {
              background: '#10b981',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }
          });
        }, 800);
      }
      
    } catch (error) {
      console.error('Error swiping user:', error);
      const errorMessage = error.response?.data?.message;
      
      // Only show toast for real errors, not already swiped scenarios
      if (errorMessage && !errorMessage.includes('Already swiped')) {
        toast.error(errorMessage);
      }
    }
  };

  const handleUndo = () => {
    if (swipeHistory.length > 0) {
      const lastSwipe = swipeHistory[swipeHistory.length - 1];
      setSwipeHistory(prev => prev.slice(0, -1));
      setCurrentIndex(lastSwipe.index);
      toast.success('Undo successful!');
    }
  };

  if (isLoading) {
    return (
      <div className="swipe-page-loading">
        <Loader className="animate-spin" size={40} />
        <p>Finding people for you...</p>
      </div>
    );
  }

  if (!swipeableUsers || swipeableUsers.length === 0) {
    return (
      <div className="no-users-container">
        <Users size={80} className="text-gray-400" />
        <h2>No more users to show</h2>
        <p>Come back later for more profiles!</p>
        <button 
          onClick={loadUsers}
          className="refresh-btn"
        >
          <RotateCcw size={20} />
          Refresh
        </button>
      </div>
    );
  }

  const currentUser = swipeableUsers[currentIndex];
  const nextUser = swipeableUsers[currentIndex + 1];
  const thirdUser = swipeableUsers[currentIndex + 2]; // Add third user

  if (!currentUser) {
    return (
      <div className="no-users-container">
        <Heart size={80} className="text-pink-400" />
        <h2>You've seen everyone!</h2>
        <p>Check back later for new profiles</p>
        <button 
          onClick={loadUsers}
          className="refresh-btn"
        >
          <RotateCcw size={20} />
          Find More
        </button>
      </div>
    );
  }

  return (
    <div className="swipe-page">
      <div className="swipe-header">
        {/* <h1>Discover</h1> */}
        <div className="swipe-instructions">
        <div className="instruction-item">
          <div className="instruction-icon dislike">
            <X size={20} />
          </div>
          <span>Swipe left or tap ✕ to pass</span>
        </div>
        
        <div className="instruction-item">
          <div className="instruction-icon like">
            <Heart size={20} />
          </div>
          <span>Swipe right or tap ❤️ to like</span>
        </div>
      </div>
        <div className="header-info">
          <span className="remaining-count">
          <span>  {swipeableUsers.length - currentIndex}</span> profiles remaining
          </span>
          {swipeHistory.length > 0 && (
            <button 
              onClick={handleUndo}
              className="undo-btn"
            >
              <RotateCcw size={16} />
              Undo
            </button>
          )}
        </div>
      </div>

      <div className="swipe-container">
        {/* Third card (furthest background) */}
        {thirdUser && (
          <div className="swipe-card-wrapper third-card">
            <SwipeCard 
              user={thirdUser} 
              onSwipe={() => {}} 
              isActive={false}
            />
          </div>
        )}
        
        {/* Second card (middle background) */}
        {nextUser && (
          <div className="swipe-card-wrapper next-card">
            <SwipeCard 
              user={nextUser} 
              onSwipe={() => {}} 
              isActive={false}
            />
          </div>
        )}
        
        {/* Current card (foreground) */}
        <div className="swipe-card-wrapper current-card">
          <SwipeCard 
            user={currentUser} 
            onSwipe={handleSwipe}
            isActive={true}
          />
        </div>
      </div>

      
    </div>
  );
};

export default SwipePage;