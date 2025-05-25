import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { IoCloudUploadOutline, IoArrowBackOutline } from "react-icons/io5";
import userImage from '../../src/images/user1.jpg'
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
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return messageTime.toLocaleDateString();
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
      <div className="chat-container chat-room">
        <div className="users-listing">
          <h2 className="title-users-listing">
            {authUser?.role === 'admin' ? 'Customers' : 'Contacts'}
          </h2>
          
          <div className="users">
            {conversations.length === 0 ? (
              <p className="title-users-listing">No conversations found</p>
            ) : (
              conversations.map((conversation) => {
                const lastMessage = conversationMessages[conversation._id];
                const lastMessageText = formatLastMessage(lastMessage, authUser._id, conversation);
                
                return (
                  <div 
                    key={conversation._id}
                    className="user-wrapper"
                    onClick={() => handleUserSelect(conversation)}
                  >
                    <div className="relative image">
                      <img 
                        src={conversation.profilePic || userImage} 
                        alt={conversation.firstName}
                        className="img-user"
                      />
                      {onlineUsers.includes(conversation._id) && (
                        <span className="online"></span>
                      )}
                    </div>
                    <div className="data">
                      <div className="top-row">
                        <p className="name">
                          {conversation.firstName}
                        </p>
                        {lastMessage && (
                          <span className="time">
                            {getTimeAgo(lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text">
                        {lastMessageText || conversation.location || 'No location'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show chat view (when user is selected either from conversations or from listings)
  return (
    <div className="chat-room">
      <div className="chat-container">
        {/* Chat header with back button */}
        <div className="header">
          <button 
            onClick={handleBackToUsers}
            className="back-button"
          >
            <IoArrowBackOutline />
          </button>
          <div className="image">
            <img 
              src={selectedUser.profilePic || userImage} 
              alt={selectedUser.firstName}
              className=""
            />
          </div>
          <div className="data">
            <p className="name">
              {selectedUser.firstName} {selectedUser.lastName} {selectedUser?.location && `(${selectedUser.location})`}
            </p>
            <div className="online-status">
              <span className={`circle ${onlineUsers.includes(selectedUser._id) ? 'online' : 'offline'}`}></span>
              <span className="status">
                {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="messages-wrapper">
          {isLoadingMessages ? (
            <div className="loading-messages">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="loading-messages">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={message._id || index}
                className={` flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`message-main ${
                    message.senderId === authUser._id 
                      ? 'sender-message' 
                      : 'receiver-message'
                  }`}
                >
                  <div className="image">
                    <img 
                      src={message.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic || userImage} 
                      alt={message.senderId === authUser._id ? authUser.firstName : selectedUser.firstName}
                      className="img-user"
                    />
                  </div>
                  <div className="data">
                    <p className="name">
                      {message.senderId === authUser._id ? authUser.firstName : selectedUser.firstName}
                      <span className="time">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                    {message.text && <p className='text'>{message.text}</p>}
                      
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Message" 
                        className="img"
                        onClick={() => window.open(message.image, '_blank')}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex items-center text-gray-500 mb-2">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="ml-2 text-sm">{selectedUser.firstName} is typing...</p>
            </div>
          )}
          <div ref={lastMessageRef} />
        </div>
        
        {/* Message input */}
        <div className="chat-box">
          <form onSubmit={handleSendMessage}>
            {imagePreview && (
              <div className="uploaded-image">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-20 rounded"
                />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="close-button"
                >
                  ×
                </button>
              </div>
            )}
            <div className="inner-box">
              <div className="input-container">
                <input 
                  type="text"
                  className="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyUp={handleTyping}
                  placeholder="Type a message..."
                />
                
                <div className="file-wrapper">
                  <IoCloudUploadOutline />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                
                <button 
                  type="submit"
                  className="send"
                  disabled={!newMessage.trim() && !imageFile}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;