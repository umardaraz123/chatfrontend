import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  IoArrowBackOutline, 
  IoSearchOutline, 
  IoCreateOutline,
  IoAttachOutline,
  IoImageOutline,
  IoMicOutline,
  IoSendOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoCallOutline
} from "react-icons/io5";
import userImage from '../../src/images/user1.jpg';
import { 
  connectSocket, 
  setupSocketListeners, 
  setUserOnline, 
  joinChatRoom, 
  sendMessage as emitMessage,
  startTyping,
  stopTyping,
  disconnectSocket
} from '../lib/socket';
import './ChatContent.css';

const ChatContent = () => {
  const { 
    authUser, 
    conversations,
    messages,
    selectedUser,
    isLoadingMessages,
    getConversations,
    getMessages,
    sendMessage,
    setSelectedUser,
    addMessage
  } = useAuthStore();
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showChatView, setShowChatView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Initialize conversationMessages from localStorage
  const [conversationMessages, setConversationMessages] = useState(() => {
    if (typeof window !== 'undefined' && authUser?._id) {
      try {
        const saved = localStorage.getItem(`lastMessages_${authUser._id}`);
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error('Error loading saved messages:', error);
        return {};
      }
    }
    return {};
  });
  
  const lastMessageRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Save conversationMessages to localStorage whenever it changes
  useEffect(() => {
    if (authUser?._id && Object.keys(conversationMessages).length > 0) {
      try {
        localStorage.setItem(`lastMessages_${authUser._id}`, JSON.stringify(conversationMessages));
        console.log('Saved conversation messages to localStorage');
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
      }
    }
  }, [conversationMessages, authUser]);

  function getAge(dobString) {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  // Function to get last message for a conversation
  const getLastMessage = async (userId) => {
    try {
      const response = await fetch(`/api/message/${userId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No messages found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const messages = await response.json();
      
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[messages.length - 1];
      }
      
      return null;
      
    } catch (error) {
      console.error(`Error fetching messages for user ${userId}:`, error);
      return null;
    }
  };

  // Enhanced function to format the last message preview
  const formatLastMessage = (message, authUserId, conversationUser) => {
    if (!message) return null;
    
    const isMyMessage = message.senderId === authUserId;
    
    // Handle image messages
    if (message.image && !message.text) {
      return isMyMessage ? "You: 📷 Photo" : "📷 Photo";
    }
    
    // Handle text messages
    if (message.text) {
      const truncatedText = message.text.length > 25 
        ? `${message.text.substring(0, 25)}...`
        : message.text;
      
      return isMyMessage 
        ? `You: ${truncatedText}` 
        : truncatedText;
    }
    
    // Handle messages with both text and image
    if (message.image && message.text) {
      const truncatedText = message.text.length > 20 
        ? `${message.text.substring(0, 20)}...`
        : message.text;
      
      return isMyMessage 
        ? `You: 📷 ${truncatedText}` 
        : `📷 ${truncatedText}`;
    }
    
    return "New message";
  };

  // Function to get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const messageTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} min ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return messageTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate unread count (mock - you can implement real unread logic)
  const getUnreadCount = (userId) => {
    // Mock implementation - replace with real unread logic from backend
    return 0; // You can implement this with actual unread messages
  };

  // Initialize socket connection and fetch conversations
  useEffect(() => {
    if (authUser?._id) {
      connectSocket();
      setUserOnline(authUser._id);

      setupSocketListeners({
        onMessageReceived: handleNewMessage,
        onUserTyping: () => setIsTyping(true),
        onUserStoppedTyping: () => setIsTyping(false),
        onOnlineStatusChange: setOnlineUsers,
      });

      getConversations();

      return () => {
        disconnectSocket();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [authUser]);

  // Fetch last messages for conversations that don't have cached messages
  useEffect(() => {
    const fetchMissingLastMessages = async () => {
      if (conversations.length === 0) return;
      
      // Find conversations that don't have cached last messages
      const conversationsToFetch = conversations.filter(conv => {
        const hasMessage = conversationMessages[conv._id];
        console.log(`${conv.firstName}: has cached message = ${!!hasMessage}`);
        return !hasMessage;
      });
      
      if (conversationsToFetch.length === 0) {
        console.log('All conversations have cached messages');
        return;
      }
      
      console.log(`Fetching last messages for ${conversationsToFetch.length} conversations`);
      
      // Fetch messages for conversations without cached data
      for (const conversation of conversationsToFetch) {
        try {
          console.log(`Fetching last message for ${conversation.firstName}`);
          const lastMessage = await getLastMessage(conversation._id);
          
          if (lastMessage) {
            setConversationMessages(prev => ({
              ...prev,
              [conversation._id]: lastMessage
            }));
            console.log(`✓ Got last message for ${conversation.firstName}`);
          } else {
            console.log(`✗ No messages found for ${conversation.firstName}`);
          }
          
        } catch (error) {
          console.error(`Error fetching for ${conversation.firstName}:`, error);
        }
        
        // Small delay to prevent API overload
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    fetchMissingLastMessages();
  }, [conversations, conversationMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join chat room and fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      
      const users = [authUser._id, selectedUser._id].sort();
      const room = `chat_${users[0]}_${users[1]}`;
      joinChatRoom(room);
    }
  }, [selectedUser]);

  // Update last message when current conversation messages change
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      setConversationMessages(prev => ({
        ...prev,
        [selectedUser._id]: lastMessage
      }));
    }
  }, [messages, selectedUser]);

  // Add this useEffect to handle when a user is selected from listings
  useEffect(() => {
    // If a user is selected and we're not showing chat view, show it
    if (selectedUser && !showChatView) {
      setShowChatView(true);
    }
  }, [selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowChatView(true);
  };

  const handleBackToUsers = () => {
    setShowChatView(false);
    setSelectedUser(null);
    setNewMessage('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleNewMessage = (message) => {
    addMessage(message);
    
    // Update the last message for this conversation
    const otherUserId = message.senderId === authUser._id ? message.receiverId : message.senderId;
    setConversationMessages(prev => ({
      ...prev,
      [otherUserId]: message
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !imageFile) || !selectedUser) return;

    let imageData = null;
    if (imageFile) {
      const reader = new FileReader();
      imageData = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
    }

    try {
      const newMessageObj = await sendMessage(selectedUser._id, newMessage.trim(), imageData);
      
      if (newMessageObj) {
        // Update last message for this conversation
        setConversationMessages(prev => ({
          ...prev,
          [selectedUser._id]: newMessageObj
        }));

        const users = [authUser._id, selectedUser._id].sort();
        const room = `chat_${users[0]}_${users[1]}`;
        
        emitMessage({
          ...newMessageObj,
          room
        });
  
        // Clear form
        setNewMessage('');
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (!selectedUser) return;
    
    const users = [authUser._id, selectedUser._id].sort();
    const room = `chat_${users[0]}_${users[1]}`;
    
    startTyping(room, authUser._id);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(room);
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Clear localStorage on logout
  useEffect(() => {
    if (!authUser) {
      // Clear saved messages when user logs out
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('lastMessages_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [authUser]);

  // Show user listing view (only if no user is pre-selected)
  if (!showChatView && !selectedUser) {
    return (
      <div className="messages-page">
        {/* Header */}
        <div className="messages-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <IoArrowBackOutline size={24} />
          </button>
          <h1>Messages</h1>
          <button className="new-message-btn">
            <IoCreateOutline size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <IoSearchOutline className="search-icon" size={20} />
          <input 
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Conversations List */}
        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const lastMessage = conversationMessages[conversation._id];
              const lastMessageText = formatLastMessage(lastMessage, authUser._id, conversation);
              const unreadCount = getUnreadCount(conversation._id);
              
              return (
                <div 
                  key={conversation._id}
                  className={`conversation-item ${selectedUser?._id === conversation._id ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(conversation)}
                >
                  <div className="conversation-avatar">
                    <img 
                      src={conversation.profilePic || userImage} 
                      alt={conversation.firstName}
                    />
                    {onlineUsers.includes(conversation._id) && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-top">
                      <h3 className="conversation-name">
                        {conversation.firstName} {conversation.lastName}
                      </h3>
                      {lastMessage && (
                        <span className="conversation-time">
                          {getTimeAgo(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-preview">
                        {lastMessageText || 'Start a conversation'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Show chat view (when user is selected either from conversations or from listings)
  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <button onClick={handleBackToUsers} className="chat-back-btn">
          <IoArrowBackOutline size={24} />
        </button>
        
        <div className="chat-user-info">
          <div className="chat-avatar">
            <img 
              src={selectedUser.profilePic || userImage} 
              alt={selectedUser.firstName}
            />
          </div>
          <div className="chat-user-details">
            <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
            <p className="chat-user-status">
              {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>
        
        <button className="chat-call-btn">
          <IoCallOutline size={24} />
        </button>
      </div>
        
      {/* Messages Area */}
      <div className="chat-messages">
        {isLoadingMessages ? (
          <div className="chat-loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <>
            {/* Date Separator */}
            <div className="date-separator">
              <span>Today</span>
            </div>
            
            {messages.map((message, index) => {
              const isMyMessage = message.senderId === authUser._id;
              const showAvatar = !isMyMessage;
              
              return (
                <div 
                  key={message._id || index}
                  className={`message-wrapper ${isMyMessage ? 'my-message' : 'their-message'}`}
                >
                  {showAvatar && (
                    <div className="message-avatar">
                      <img 
                        src={selectedUser.profilePic || userImage} 
                        alt={selectedUser.firstName}
                      />
                    </div>
                  )}
                  
                  <div className="message-group">
                    {!isMyMessage && index === 0 && (
                      <span className="message-sender-name">{selectedUser.firstName} {selectedUser.lastName}</span>
                    )}
                    
                    <div className={`message-bubble ${isMyMessage ? 'my-bubble' : 'their-bubble'}`}>
                      {message.text && (
                        <p className="message-text">{message.text}</p>
                      )}
                      
                      {message.audio && (
                        <div className="audio-message">
                          <button 
                            className="audio-play-btn"
                            onClick={() => {
                              if (playingAudio === message._id) {
                                setPlayingAudio(null);
                              } else {
                                setPlayingAudio(message._id);
                              }
                            }}
                          >
                            {playingAudio === message._id ? (
                              <IoPauseOutline size={20} />
                            ) : (
                              <IoPlayOutline size={20} />
                            )}
                          </button>
                          <div className="audio-waveform">
                            <div className="waveform-bars">
                              {[...Array(20)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className="waveform-bar"
                                  style={{ 
                                    height: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.05}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="audio-duration">
                            {message.audioDuration ? `00:${message.audioDuration}` : '00:16'}
                          </span>
                        </div>
                      )}
                      
                      {message.image && (
                        <div className="image-message">
                          <img 
                            src={message.image} 
                            alt="Shared" 
                            onClick={() => window.open(message.image, '_blank')}
                          />
                        </div>
                      )}
                      
                      <span className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        
        {isTyping && (
          <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={lastMessageRef} />
      </div>
        
      {/* Message Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSendMessage}>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button 
                type="button"
                onClick={removeImage}
                className="remove-preview"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="chat-input-wrapper">
            <button 
              type="button" 
              className="input-action-btn"
              onClick={() => document.getElementById('file-input').click()}
            >
              <IoAttachOutline size={22} />
            </button>
            <input 
              type="file" 
              id="file-input"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <input 
              type="text"
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={handleTyping}
              placeholder="Write your message"
            />
            
            <button 
              type="button" 
              className="input-action-btn"
              onClick={() => document.getElementById('image-input').click()}
            >
              <IoImageOutline size={22} />
            </button>
            <input 
              type="file" 
              id="image-input"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <button 
              type="button" 
              className="input-action-btn"
            >
              <IoMicOutline size={22} />
            </button>
            
            <button 
              type="submit"
              className="send-btn"
              disabled={!newMessage.trim() && !imageFile}
            >
              <IoSendOutline size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;