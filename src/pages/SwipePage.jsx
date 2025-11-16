// pages/SwipePage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import SwipeListItem from '../components/SwipeListItem';
import { Loader, Heart, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './SwipePage.css';

const SwipePage = () => {
  const { 
    swipeableUsers, 
    getSwipeableUsers, 
    loadMoreUsers,
    swipeUser, 
    isLoadingUsers,
    hasMoreUsers,
    resetSwipeableUsers
  } = useAuthStore();
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [removedUsers, setRemovedUsers] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Refs
  const observerRef = useRef();
  const loadingRef = useRef();

  // Calculate displayUsers AFTER removedUsers is defined
  const displayUsers = swipeableUsers.filter(user => !removedUsers.has(user._id));

  // Load initial users
  useEffect(() => {
    loadInitialUsers();
  }, []);

  const loadInitialUsers = async () => {
    try {
      setIsLoading(true);
      resetSwipeableUsers(); // Clear existing users
      await getSwipeableUsers(1); // Load first page
    } catch (error) {
      console.error('Error loading initial users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // LoadMore function
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreUsers) {
      console.log('LoadMore blocked:', { isLoadingMore, hasMoreUsers });
      return;
    }
    
    try {
      console.log('Starting to load more users...');
      setIsLoadingMore(true);
      const newUsers = await loadMoreUsers();
      console.log('Loaded new users:', newUsers.length);
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreUsers, loadMoreUsers]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('Intersection observer triggered:', {
          isIntersecting: target.isIntersecting,
          hasMoreUsers,
          isLoadingUsers,
          isLoadingMore,
          currentUsersCount: displayUsers.length
        });
        
        if (target.isIntersecting && hasMoreUsers && !isLoadingUsers && !isLoadingMore) {
          console.log('Triggering loadMore...');
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreUsers, isLoadingUsers, isLoadingMore, displayUsers.length, loadMore]);

  const handleSwipe = async (userId, action, likeType = null) => {
    try {
      console.log('Swiping:', { userId, action, likeType });
      
      // Add to removed users immediately for UI responsiveness
      setRemovedUsers(prev => new Set([...prev, userId]));
      
      // Add to swipe history
      setSwipeHistory(prev => [...prev, { userId, action, likeType, timestamp: Date.now() }]);
      
      // Make API call
      const result = await swipeUser(userId, action, likeType);
      
      if (result.isMatch) {
        toast.success('🎉 It\'s a match!', {
          duration: 3000,
          style: {
            background: '#ec4899',
            color: 'white',
            fontWeight: 'bold',
          }
        });
      }
      
    } catch (error) {
      console.error('Error swiping:', error);
      // Remove from removed users if API call failed
      setRemovedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      toast.error('Failed to swipe. Please try again.');
    }
  };

  const undoLastSwipe = () => {
    if (swipeHistory.length === 0) {
      toast('No swipes to undo');
      return;
    }
    
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    
    // Remove from removed users
    setRemovedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(lastSwipe.userId);
      return newSet;
    });
    
    // Remove from history
    setSwipeHistory(prev => prev.slice(0, -1));
    
    toast.success('Swipe undone!');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader className="animate-spin" size={40} />
        <p>Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="swipe-page">
      <div className="swipe-header">
     <div className="swipe-instructions">
        <div className="instruction-item">
        <span className="instruction-icon">
          <X size={20} />
        </span>
        <span className="instruction-text">Swipe left to dislike</span>
      </div>
      <div className="instruction-item">
        <span className="instruction-icon">
          <Heart size={20} />
        </span>
        <span className="instruction-text">Swipe right to like</span>
      </div>
    
     </div>
      
      </div>

      {/* Debug info (remove in production) */}
     

      <div className="swipe-container">
        {displayUsers.length === 0 && !isLoadingUsers ? (
          <div className="no-users">
            <Heart size={80} className="text-gray-400" />
            <h2>No more profiles</h2>
            <p>Check back later for new people to discover!</p>
            <button 
              className="refresh-btn"
              onClick={loadInitialUsers}
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="swipe-list">
              {displayUsers.map((user, index) => (
                <SwipeListItem
                  key={user._id}
                  user={user}
                  onSwipe={handleSwipe}
                  isActive={true} // Make ALL cards active
                />
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            <div 
              ref={loadingRef} 
              className="loading-trigger"
              style={{ 
                height: '50px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '20px 0'
              }}
            >
              {isLoadingMore && (
                <div className="loading-more">
                  <Loader className="animate-spin" size={24} />
                  <span>Loading more profiles...</span>
                </div>
              )}
              {!hasMoreUsers && displayUsers.length > 0 && (
                <div className="no-more-users">
                  <p>No more profiles to show</p>
                </div>
              )}
            </div>

            {/* Manual load more button for testing */}
            <div className="manual-load-more" style={{ padding: '20px', textAlign: 'center' }}>
              <button 
                onClick={loadMore}
                disabled={isLoadingMore || !hasMoreUsers}
                style={{
                  padding: '10px 20px',
                  background: hasMoreUsers ? '#3b82f6' : '#gray',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: hasMoreUsers ? 'pointer' : 'not-allowed'
                }}
              >
                {isLoadingMore ? 'Loading...' : hasMoreUsers ? 'Load More ' : 'No More Users'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SwipePage;