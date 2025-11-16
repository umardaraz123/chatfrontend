import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  conversations: [],
  messages: [],
  selectedUser: null,
  isLoadingMessages: false,
  isLoadingConversations: false,
  isSendingMessage: false,

  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth: true,
  isFetchingUserDetails: false,
  isUsersFetched:false,
  
  // New state for matches
  matches: [],
  isLoadingMatches: false,

  // New state for swipeable users
  swipeableUsers: [],
  isLoadingUsers: false,
  hasMoreUsers: true,
  currentPage: 1,

  // New state for DropBox count
  dropBoxCount: 0,

  // Existing functions
  checkAuth:async()=>{
    try {
        const response = await axiosInstance.get('/auth/check')
        set({authUser:response?.data})
    } catch (error) {
        set({authUser:null})
        console.log('error in check auth',error)
    }
    finally{
        set({isCheckingAuth:false})
    }
  },
  signup:async(data)=>{
    set({isSigningUp:true})
    try {
    const response =  await axiosInstance.post('/auth/signup',data);
    set({authUser:response?.data})
    toast.success("Account created successfuly!");
 
      
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    finally{
      set({isSigningUp:false})
    }
  },

  // New signup flow methods
  sendSignupOTP: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/signup/send-otp', { email });
      toast.success(response.data.message || 'Verification code sent to your email');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  },

  verifySignupOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/signup/verify-otp', { email, otp });
      toast.success(response.data.message || 'Email verified successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
      throw error;
    }
  },

  completeSignup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup/complete', data);
      set({ authUser: response.data });
      toast.success("Account created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to create account';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/auth/update-profile', data);
      
      // Update both authUser and userDetails properly
      set({ 
        authUser: response.data,
        userDetails: response.data 
      });
      
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  logout:async()=>{
    try {
      await axiosInstance.post('/auth/logout');
      set({authUser:null});
      toast.success("Logout successfuly!")
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  },
  getUserDetail: async () => {
    set({ isFetchingUserDetails: true });
    try {
      const response = await axiosInstance.get('/auth/user-detail');
      set({ userDetails: response?.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error fetching user details');
    } finally {
      set({ isFetchingUserDetails: false });
    }
  },
  getAllUsers: async () => {
    set({ isUsersFetched: true });
    try {
      const response = await axiosInstance.get('/auth/users');
      set({ usersList: response?.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error fetching users');
    } finally {
      set({ isUsersFetched: false });
    }
  },

  // New Chat Functions
  getConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const response = await axiosInstance.get('/message/users');
      
      // Filter based on user role if needed
      const authUser = get().authUser;
      let filteredConversations = response.data;
      
      if (authUser?.role === 'admin') {
        // Admin sees all customers
        filteredConversations = response.data.filter(u => u.role === 'customer');
      }
      
      set({ conversations: filteredConversations });
      return filteredConversations;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error fetching conversations');
      return [];
    } finally {
      set({ isLoadingConversations: false });
    }
  },
  
  getMessages: async (userId) => {
    if (!userId) return;
    
    set({ isLoadingMessages: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error fetching messages');
      return [];
    } finally {
      set({ isLoadingMessages: false });
    }
  },
  
  sendMessage: async (receiverId, text, image) => {
    set({ isSendingMessage: true });
    try {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        text,
        image
      });
      
      // Add message to state
      set(state => ({
        messages: [...state.messages, response.data]
      }));
      
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error sending message');
      return null;
    } finally {
      set({ isSendingMessage: false });
    }
  },
  
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  
  addMessage: (message) => {
    set(state => {
      // Make sure we don't add duplicates
      const messageExists = state.messages.some(m => m._id === message._id);
      if (messageExists) return state;
      
      return { messages: [...state.messages, message] };
    });
  },
  
  resetChat: () => {
    set({
      messages: [],
      selectedUser: null
    });
  },

  // Get specific user details by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/auth/user/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Error fetching user details');
      throw error;
    }
  },

  // Enhanced findMatches method with 20% minimum threshold
  findMatches: async () => {
    try {
      set({ isLoadingMatches: true });
      
      // Updated path for Option 1 from route changes above
      const response = await axiosInstance.get('/auth/matches/find', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = response.data;
      
      // Filter matches to show only 20% or higher
      const qualifiedMatches = data.matches ? data.matches.filter(match => match.matchScore >= 10) : [];
      
      const matchStats = {
        total: qualifiedMatches.length,
        high: qualifiedMatches.filter(m => m.matchScore >= 70).length,
        medium: qualifiedMatches.filter(m => m.matchScore >= 40 && m.matchScore < 70).length,
        low: qualifiedMatches.filter(m => m.matchScore >= 20 && m.matchScore < 40).length,
        average: qualifiedMatches.length > 0 
          ? Math.round(qualifiedMatches.reduce((sum, match) => sum + match.matchScore, 0) / qualifiedMatches.length)
          : 0,
        bestMatch: qualifiedMatches[0] || null,
        lastUpdated: new Date().toLocaleString()
      };

      set({ 
        matches: qualifiedMatches, 
        isLoadingMatches: false,
        matchStats: matchStats
      });
      
      return {
        matches: qualifiedMatches,
        ...matchStats
      };
    } catch (error) {
      console.error('Error finding matches:', error);
      set({ isLoadingMatches: false });
      toast.error(error?.response?.data?.message || 'Error finding matches');
      throw error;
    }
  },

  getMatchDetails: async (userId) => {
    try {
      // Updated path for Option 1 from route changes above
      const response = await axiosInstance.get(`/auth/matches/details/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting match details:', error);
      toast.error('Error getting match details');
      throw error;
    }
  },

  // Swipe functionality
  getSwipeableUsers: async (page = 1, append = false) => {
    try {
      if (page === 1) {
        set({ isLoadingUsers: true, currentPage: 1, hasMoreUsers: true });
      }
      
      const response = await axiosInstance.get(`/swipe/users?page=${page}&limit=10`);
      
      if (!response.data || response.data.length === 0) {
        set({ 
          hasMoreUsers: false,
          isLoadingUsers: false 
        });
        return [];
      }
      
      const usersWithAge = response.data.map(user => ({
        ...user,
        age: calculateAge(user.dateOfBirth)
      }));
      
      if (append) {
        const currentUsers = get().swipeableUsers;
        const newUsers = usersWithAge.filter(newUser => 
          !currentUsers.some(existingUser => existingUser._id === newUser._id)
        );
        
        set({ 
          swipeableUsers: [...currentUsers, ...newUsers],
          isLoadingUsers: false,
          currentPage: page,
          hasMoreUsers: usersWithAge.length === 10
        });
        return newUsers;
      } else {
        set({ 
          swipeableUsers: usersWithAge, 
          isLoadingUsers: false,
          currentPage: page,
          hasMoreUsers: usersWithAge.length === 10
        });
        return usersWithAge;
      }
    } catch (error) {
      console.error('Error fetching swipeable users:', error);
      set({ 
        isLoadingUsers: false,
        hasMoreUsers: false
      });
      
      if (error.response?.status !== 404) {
        toast.error('Failed to load users');
      }
      
      return [];
    }
  },

  // Add method to load more users
  loadMoreUsers: async () => {
    const currentState = get();
    const nextPage = currentState.currentPage + 1;
    
    try {
      console.log('Loading more users, page:', nextPage);
      
      const response = await axiosInstance.get(`/swipe/users?page=${nextPage}&limit=10`);
      
      if (!response.data || response.data.length === 0) {
        console.log('No more users available');
        set({ hasMoreUsers: false });
        return [];
      }
      
      const newUsersWithAge = response.data.map(user => ({
        ...user,
        age: calculateAge(user.dateOfBirth)
      }));
      
      // Filter out users that might already be in the list
      const existingUserIds = currentState.swipeableUsers.map(user => user._id);
      const uniqueNewUsers = newUsersWithAge.filter(newUser => 
        !existingUserIds.includes(newUser._id)
      );
      
      console.log('New unique users loaded:', uniqueNewUsers.length);
      
      set({ 
        swipeableUsers: [...currentState.swipeableUsers, ...uniqueNewUsers],
        currentPage: nextPage,
        hasMoreUsers: response.data.length === 10 // If less than 10, no more users
      });
      
      return uniqueNewUsers;
    } catch (error) {
      console.error('Error loading more users:', error);
      set({ hasMoreUsers: false });
      return [];
    }
  },

  // Add reset function
  resetSwipeableUsers: () => {
    set({ 
      swipeableUsers: [], 
      currentPage: 1, 
      hasMoreUsers: true 
    });
  },

  // New friend request functions
  sendFriendRequest: async (userId) => {
    try {
      const response = await axiosInstance.post('/friend-request/send', { recipientId: userId });
      toast.success('Friend request sent successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to send friend request';
      toast.error(errorMessage);
      throw error;
    }
  },

  getFriendRequests: async () => {
    try {
      const response = await axiosInstance.get('/friend-request/requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw error;
    }
  },

  respondToFriendRequest: async (requestId, action) => {
    try {
      const response = await axiosInstance.put(`/friend-request/respond/${requestId}`, { action });
      return response.data;
    } catch (error) {
      console.error('Error responding to friend request:', error);
      throw error;
    }
  },

  getFriends: async () => {
    try {
      const response = await axiosInstance.get('/friend-request/friends');
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    }
  },

  // New swipe functions
  getLikedUsers: async () => {
    try {
      const response = await axiosInstance.get('/swipe/liked');
      return response.data;
    } catch (error) {
      console.error('Error fetching liked users:', error);
      throw error;
    }
  },

  getSwipeStats: async () => {
    try {
      const response = await axiosInstance.get('/swipe/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching swipe stats:', error);
      throw error;
    }
  },

  swipeUser: async (userId, action, likeType = null) => {
    console.log('Auth store swipeUser called:', { userId, action, likeType }); // Debug log
    
    try {
      const response = await axiosInstance.post('/swipe/swipe', { 
        userId, 
        action,
        likeType: action === 'like' ? likeType : null
      });
      
      console.log('API call successful:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in auth store swipeUser:', error);
      throw error;
    }
  },

  // Update existing getReceivedSwipes to also update count
  getReceivedSwipes: async () => {
    try {
      const response = await axiosInstance.get('/swipe/received');
      set({ dropBoxCount: response.data.length }); // Update count
      return response.data;
    } catch (error) {
      console.error('Error fetching received swipes:', error);
      throw error;
    }
  },

  // Add function to get DropBox count
  getDropBoxCount: async () => {
    try {
      const swipes = await get().getReceivedSwipes();
      const count = swipes.length;
      set({ dropBoxCount: count });
      return count;
    } catch (error) {
      console.error('Error getting DropBox count:', error);
      return 0;
    }
  },

  // Add/update this function
  getMatches: async () => {
    try {
      set({ isLoadingMatches: true });
      const response = await axiosInstance.get('/swipe/matches');
      set({ 
        matches: response.data,
        isLoadingMatches: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      set({ isLoadingMatches: false });
      throw error;
    }
  },

  // Password Reset Functions
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      toast.success(response.data.message || 'OTP sent to your email');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      toast.success(response.data.message || 'OTP verified successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
      throw error;
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      toast.success(response.data.message || 'Password reset successful');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      throw error;
    }
  },
}));

// Helper function to calculate age
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return '';
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}