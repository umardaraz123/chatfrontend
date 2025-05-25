import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import girlImage from '../images/girl.jpg'
import boyImage from '../images/boy.jpg'
import { SlLocationPin } from "react-icons/sl";
import { GiLovers } from "react-icons/gi";
import { IoChatbox, IoEyeOutline, IoHeart, IoHeartOutline, IoClose, IoLocation, IoPeople, IoCalendar, IoColorPalette, IoWine, IoPersonOutline, IoMailOutline, IoPhonePortraitOutline, IoEyeSharp, IoBarbellOutline, IoSunnyOutline, IoCheckmarkCircleOutline, IoBodyOutline, IoResizeOutline } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoStatsChartOutline } from "react-icons/io5";

// Match Details Modal Component
const MatchDetailsModal = ({ isOpen, onClose, matchDetails, user, onStartChat }) => {
  if (!isOpen || !matchDetails) return null;

  const { compatibility } = matchDetails;
  const score = compatibility.overallScore;

  // Get match level styling
  const getMatchLevel = (score) => {
    if (score >= 70) return { 
      level: 'EXCELLENT MATCH', 
      color: '#28a745', 
      emoji: '🔥',
      description: 'You have great compatibility!'
    };
    if (score >= 40) return { 
      level: 'GOOD MATCH', 
      color: '#ffc107', 
      emoji: '⭐',
      description: 'You share important commonalities!'
    };
    if (score >= 20) return { 
      level: 'DECENT MATCH', 
      color: '#17a2b8', 
      emoji: '👍',
      description: 'Some shared interests and values!'
    };
    return { 
      level: 'LOW MATCH', 
      color: '#6c757d', 
      emoji: '💭',
      description: 'Consider if you\'re open to differences.'
    };
  };

  const matchLevel = getMatchLevel(score);

  const handleStartChat = () => {
    onStartChat(user);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <button onClick={onClose} className="close-button">
            <IoClose />
          </button>
          
          <div className="header-content">
            <div className='title'>
              {matchLevel.emoji}
              <span>{score}% Match</span>
            </div>
            
            <div className='subtitle'>
              {user?.firstName} {user?.lastName}
            </div>
            <div className='subtitle'>
              {matchLevel.level} - {matchLevel.description}
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="body-title text-center">
            📊 Compatibility Breakdown
          </div>

          <div className="compatibility-details">
            {/* Interests */}
            {compatibility.details.interests.total > 0 && (
              <div className="detail-item">
                <div className="small-title">
                  <IoPeople className="detail-icon" />
                  <strong className="s">
                    Common Interests ({compatibility.details.interests.score}%)
                  </strong>
                </div>
                <div className='common-interests mb-3'>
                  {compatibility.details.interests.common.map((interest, index) => (
                    <span key={index} className='intrest'>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {compatibility.details.location.match && (
              <div className="detail-item">
                <div className="small-title">
                  <IoLocation className="detail-icon" />
                  <strong className="detail-title">
                    Location Match ({compatibility.details.location.score}%)
                  </strong>
                </div>
                <div className="item">
                  ✓ You're in the same location area
                </div>
              </div>
            )}

            {/* Age */}
            {compatibility.details.age.compatible && (
              <div className="detail-item">
                <div className="small-title">
                  <IoCalendar className="detail-icon" />
                  <strong className="detail-title">
                    Age Compatibility ({compatibility.details.age.score}%)
                  </strong>
                </div>
                <div className="item">
                  ✓ {compatibility.details.age.age} years old (within your preference)
                </div>
              </div>
            )}

            {/* Relationship Goals */}
            {compatibility.details.relationship.match && (
              <div className="detail-item">
                <div className="small-title">
                  <IoHeart className="detail-icon" />
                  <strong className="detail-title">
                    Relationship Goals ({compatibility.details.relationship.score}%)
                  </strong>
                </div>
                <div className="item">
                  ✓ Same relationship intentions
                </div>
              </div>
            )}

            {/* Orientation */}
            {compatibility.details.orientation.match && (
              <div className="detail-item">
                <div className="small-title">
                  <IoColorPalette className="detail-icon" />
                  <strong className="detail-title">
                    Orientation ({compatibility.details.orientation.score}%)
                  </strong>
                </div>
                <div className="item">
                  ✓ Compatible orientation
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {compatibility.details.lifestyle.score > 0 && (
              <div className="detail-item">
                <div className="small-title">
                  <IoWine className="detail-icon" />
                  <strong className="detail-title">
                    Lifestyle ({compatibility.details.lifestyle.score}%)
                  </strong>
                </div>
                <div className="item">
                  {compatibility.details.lifestyle.smoking && (
                    <div>✓ Same smoking preference</div>
                  )}
                  {compatibility.details.lifestyle.alcohol && (
                    <div>✓ Same drinking preference</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons-modal">
            <button onClick={handleStartChat} className='button'>
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Details Modal Component - Same CSS Classes as MatchDetailsModal
const UserDetailsModal = ({ isOpen, onClose, userDetails, onStartChat }) => {
  if (!isOpen || !userDetails) return null;

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
  };

  const handleStartChat = () => {
    onStartChat(userDetails);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <button onClick={onClose} className="close-button">
            <IoClose />
          </button>
          
          <div className="header-content">
            <div className='title'>
              <IoPersonOutline />
              <span>User Profile</span>
            </div>
            
            <div className='subtitle'>
              {userDetails?.firstName} {userDetails?.lastName}
            </div>
            <div className='subtitle'>
              {getAge(userDetails?.dateOfBirth)} years old
            </div>
          </div>
        </div>

        <div className="modal-body">
          <h4 className="body-title text-center">
            👤 Profile Details
          </h4>

          <div className="compatibility-details">
            {/* Basic Info */}
            <div className="detail-item">
              <div className="small-title">
                <IoPersonOutline className="detail-icon" />
                <strong className="detail-title">Basic Information</strong>
              </div>
              <div className="item">
                <div>📧 {userDetails?.email}</div>
                {userDetails?.phoneNumber && <div>📱 {userDetails.phoneNumber}</div>}
                <div>🎂 {getAge(userDetails?.dateOfBirth)} years old</div>
                <div>👤 {userDetails?.gender}</div>
              </div>
            </div>

            {/* Location */}
            {userDetails?.location && (
              <div className="detail-item">
                <div className="small-title">
                  <IoLocation className="detail-icon" />
                  <strong className="detail-title">Location</strong>
                </div>
                <div className="item">
                  📍 {userDetails.location}
                </div>
              </div>
            )}

            {/* Bio */}
            {userDetails?.bio && (
              <div className="detail-item">
                <div className="small-title">
                  <IoSunnyOutline className="detail-icon" />
                  <strong className="detail-title">About</strong>
                </div>
                <div className="item">
                  {userDetails.bio}
                </div>
              </div>
            )}

            {/* Interests */}
            {userDetails?.interests && userDetails.interests.length > 0 && (
              <div className="detail-item">
                <div className="small-title">
                  <IoPeople className="detail-icon" />
                  <strong className="detail-title">Interests</strong>
                </div>
                <div className='common-interests'>
                  {userDetails.interests.map((interest, index) => (
                    <span key={index} className='intrest'>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Physical Attributes - Fixed icon */}
            {(userDetails?.height || userDetails?.weight || userDetails?.eyes || userDetails?.hairs) && (
              <div className="detail-item">
                <div className="small-title">
                  <IoBodyOutline className="detail-icon" />
                  <strong className="detail-title">Physical Attributes</strong>
                </div>
                <div className="item">
                  {userDetails?.height && <div>📏 Height: {userDetails.height}</div>}
                  {userDetails?.weight && <div>⚖️ Weight: {userDetails.weight}</div>}
                  {userDetails?.eyes && <div>👁️ Eyes: {userDetails.eyes}</div>}
                  {userDetails?.hairs && <div>💇 Hair: {userDetails.hairs}</div>}
                </div>
              </div>
            )}

            {/* Preferences */}
            {(userDetails?.relationship || userDetails?.orientation || userDetails?.lookingFor) && (
              <div className="detail-item">
                <div className="small-title">
                  <IoHeart className="detail-icon" />
                  <strong className="detail-title">Preferences</strong>
                </div>
                <div className="item">
                  {userDetails?.relationship && <div>💕 Looking for: {userDetails.relationship}</div>}
                  {userDetails?.orientation && <div>🌈 Orientation: {userDetails.orientation}</div>}
                  {userDetails?.lookingFor && <div>👫 Interested in: {userDetails.lookingFor}</div>}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {(userDetails?.smoking || userDetails?.alcohol || userDetails?.sociability) && (
              <div className="detail-item">
                <div className="small-title">
                  <IoWine className="detail-icon" />
                  <strong className="detail-title">Lifestyle</strong>
                </div>
                <div className="item">
                  {userDetails?.smoking && <div>🚬 Smoking: {userDetails.smoking}</div>}
                  {userDetails?.alcohol && <div>🍷 Drinking: {userDetails.alcohol}</div>}
                  {userDetails?.sociability && <div>🎉 Sociability: {userDetails.sociability}</div>}
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons-modal">
            <button onClick={handleStartChat} className='button'>
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Listings Component
const Listings = () => {
  const navigate = useNavigate();
  const [showMatches, setShowMatches] = useState(false);
  
  // Modal states
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedMatchDetails, setSelectedMatchDetails] = useState(null);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  
  // User details modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  
  function getAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
  }

  const { 
    usersList, 
    getAllUsers, 
    isUsersFetched, 
    setSelectedUser,
    authUser,
    // Match methods
    matches,
    findMatches,
    getMatchDetails,
    getUserById,
    isLoadingMatches,
    matchStats,
    clearMatches
  } = useAuthStore();

  useEffect(() => {
    if (!showMatches) {
      getAllUsers();
    }
  }, [getAllUsers, showMatches]);

  // Function to handle showing matches
  const handleShowMatches = async () => {
    try {
      setShowMatches(true);
      await findMatches();
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  // Function to handle showing all users
  const handleShowAllUsers = () => {
    setShowMatches(false);
    clearMatches(); // Clear matches when switching to all users
  };

  // Function to handle chat initiation
  const handleStartChat = (user) => {
    setSelectedUser(user);
    navigate('/dashboard/chat');
  };

  // Function to handle view profile with modal - Using getUserById API
  const handleViewProfile = async (user) => {
    try {
      console.log('Getting user details for:', user._id);
      const userDetails = await getUserById(user._id);
      console.log('User details received:', userDetails);
      
      // Set modal data and open user details modal
      setSelectedUserDetails(userDetails);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error('Error getting user details:', error);
      alert('❌ Error getting user details. Please try again.');
    }
  };

  // Enhanced function to handle match details with modal
  const handleViewMatchDetails = async (user) => {
    try {
      const matchDetails = await getMatchDetails(user._id);
      console.log('Match details:', matchDetails);
      
      // Set modal data and open match details modal
      setSelectedMatchDetails(matchDetails);
      setSelectedUserForModal(user);
      setIsMatchModalOpen(true);
    } catch (error) {
      console.error('Error getting match details:', error);
      alert('❌ Error getting match details. Please try again.');
    }
  };

  // Function to close match modal
  const closeMatchModal = () => {
    setIsMatchModalOpen(false);
    setSelectedMatchDetails(null);
    setSelectedUserForModal(null);
  };

  // Function to close user modal
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserDetails(null);
  };

  // Get match level emoji
  const getMatchEmoji = (score) => {
    if (score >= 70) return '🔥';
    if (score >= 40) return '⭐';
    if (score >= 20) return '👍';
    return '💭';
  };

  // Get the current list to display
  const currentList = showMatches ? matches : usersList;

  return (
    <div className='users-listing'> 
      {/* Toggle buttons */}
      <div className="listing-controls">
        <button 
          onClick={handleShowAllUsers}
          className={`toggle-btn ${!showMatches ? 'active' : ''}`}
        >
          <HiOutlineUsers /> All Users ({usersList?.length || 0})
        </button>
        
        <button 
          onClick={handleShowMatches}
          className={`toggle-btn ${showMatches ? 'active' : ''}`}
          disabled={isLoadingMatches}
        >
          {isLoadingMatches ? (
            <>🔄 Loading...</>
          ) : (
            <>💖 My Matches  {matchStats && `(${matchStats.total})`}</>
          )}
        </button>
      </div>

      {/* Match statistics */}
      {showMatches && matchStats && matchStats.total > 0 && (
        <div className="match-stats-wrapper">
          <h4 className='title'>
            <IoStatsChartOutline /> Match Statistics
          </h4>
          <div className='lists'>
            <div className='item'>
              🔥 High (70%+): {matchStats.high}
            </div>
            <div className='item'>
              ⭐ Medium (40-69%): {matchStats.medium}
            </div>
            <div className='item'>
              👍 Low (20-39%): {matchStats.low}
            </div>
          </div>
          <div className='lists'>
            <div className="item">
              {matchStats.average > 0 && (
                <div>
                  📊 Average Match Score: <strong>{matchStats.average}%</strong>
                </div>
              )}
            </div>
            <div className="item">
              {matchStats.bestMatch && (
                <div>
                  🏆 Best Match: <strong>
                    {matchStats.bestMatch.firstName} ({matchStats.bestMatch.matchScore}%)
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No matches message */}
      {showMatches && matchStats && matchStats.total === 0 && !isLoadingMatches && (
        <div className="no-matches-message">
          <h3>🔍 No matches found</h3>
          <p>
            We couldn't find any matches with 20% or higher compatibility.
          </p>
          <p>
            💡 Try updating your profile with more interests or adjusting your preferences for better matches.
          </p>
        </div>
      )}

      <div className="row">
        {currentList?.length === 0 && !isLoadingMatches ? (
          <div className="col-12">
            <p className="no-users-message">
              {showMatches ? 'No matches available' : 'No users found'}
            </p>
          </div>
        ) : (
          currentList?.map((user) => (
            <div key={user._id} className='col-12 col-md-6 col-lg-3'>
              <div className="list">
                <div className="image">
                  {user?.profilePic ? (
                    <img src={user?.profilePic} alt={user?.firstName} />
                  ) : user?.gender === 'male' ? (
                    <img src={boyImage} alt={user?.firstName} />
                  ) : (
                    <img src={girlImage} alt={user?.firstName} />
                  )}
                  
                  {/* Match score display */}
                  {showMatches && user.matchScore && (
                    <div className="match-score">
                      {getMatchEmoji(user.matchScore)} {user.matchScore}%, <span className="overall">{user.matchScore >= 70 ? 'HIGH' : user.matchScore >= 40 ? 'MEDIUM' : 'LOW'}</span>
                    </div>
                  )}
                </div>
                
                <div className="data">
                  <h2 className="name">
                    {user?.firstName}, {getAge(user?.dateOfBirth)}
                  </h2>
                  
                  {/* Show location if available */}
                  {user?.location && (
                    <div className="location">
                      <SlLocationPin />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  <div className="action-buttons">
                    <div 
                      className="action" 
                      title='View Profile'
                      onClick={() => handleViewProfile(user)}
                    >
                      <IoEyeOutline />
                    </div>
                    
                    <div 
                      className="action" 
                      title='Chat with user'
                      onClick={() => handleStartChat(user)}
                    >
                      <BsChatDots />
                    </div>

                    {/* Match details button */}
                    {showMatches && (
                      <div 
                        className="action match-action" 
                        title={`View detailed compatibility analysis (${user.matchScore}%)`}
                        onClick={() => handleViewMatchDetails(user)}
                      >
                        <GiLovers />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={isMatchModalOpen}
        onClose={closeMatchModal}
        matchDetails={selectedMatchDetails}
        user={selectedUserForModal}
        onStartChat={handleStartChat}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        userDetails={selectedUserDetails}
        onStartChat={handleStartChat}
      />
    </div>
  )
}

export default Listings