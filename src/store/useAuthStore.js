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
  matchStats: null,

  // New state for swipeable users
  swipeableUsers: [],
  isLoadingUsers: false,

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
  login: async (data) => {
    
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
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
  getSwipeableUsers: async () => {
    try {
      set({ isLoadingUsers: true });
      const response = await axiosInstance.get('/swipe/users');
      
      // Calculate age for each user
      const usersWithAge = response.data.map(user => ({
        ...user,
        age: calculateAge(user.dateOfBirth)
      }));
      
      set({ 
        swipeableUsers: usersWithAge, 
        isLoadingUsers: false 
      });
      return usersWithAge;
    } catch (error) {
      console.error('Error fetching swipeable users:', error);
      set({ isLoadingUsers: false });
      toast.error('Failed to load users');
      throw error;
    }
  },

  swipeUser: async (userId, action) => {
    try {
      const response = await axiosInstance.post('/swipe/swipe', { userId, action });
      return response.data; // This will include { success: true, isMatch, alreadySwiped, etc. }
    } catch (error) {
      throw error;
    }
  },

  getMatches: async () => {
    try {
      const response = await axiosInstance.get('/swipe/matches');
      set({ matches: response.data });
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  sendFriendRequest: async (recipientId) => {
    try {
      const response = await axiosInstance.post('/friend-request/send', { recipientId });
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // New friend request functions
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