import { io } from 'socket.io-client';

// Create a socket instance
// const socket = io('http://localhost:5001', {
//   withCredentials: true,
//   autoConnect: false,
// });
const socket = io('https://chatbackend-beige.vercel.app', {
  withCredentials: true,
  autoConnect: false,
});

// Event listeners
export const setupSocketListeners = (callbacks) => {
  // Receive message
  socket.on('receiveMessage', (message) => {
    if (callbacks.onMessageReceived) {
      callbacks.onMessageReceived(message);
    }
  });

  // User typing
  socket.on('userTyping', (userId) => {
    if (callbacks.onUserTyping) {
      callbacks.onUserTyping(userId);
    }
  });

  // User stopped typing
  socket.on('userStoppedTyping', () => {
    if (callbacks.onUserStoppedTyping) {
      callbacks.onUserStoppedTyping();
    }
  });

  // User online status
  socket.on('userOnlineStatus', (onlineUsers) => {
    if (callbacks.onOnlineStatusChange) {
      callbacks.onOnlineStatusChange(onlineUsers);
    }
  });

  // New message notification
  socket.on('newMessageNotification', (notification) => {
    if (callbacks.onNewNotification) {
      callbacks.onNewNotification(notification);
    }
  });
};

// Socket actions
export const connectSocket = () => {
  socket.connect();
};

export const setUserOnline = (userId) => {
  socket.emit('online', userId);
};

export const joinChatRoom = (chatRoom) => {
  socket.emit('joinChat', chatRoom);
};

export const sendMessage = (message) => {
  socket.emit('sendMessage', message);
};

export const startTyping = (chatRoom, userId) => {
  socket.emit('typing', { chatRoom, userId });
};

export const stopTyping = (chatRoom) => {
  socket.emit('stopTyping', chatRoom);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;