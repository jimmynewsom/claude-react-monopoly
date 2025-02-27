import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateUserProfile,
  createUserDocument,
  getUserData
} from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Signup function
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      // Update the user's profile with display name
      await updateUserProfile(userCredential.user, displayName);
      // Create user document in Firestore
      await createUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }
  
  function login(email, password) {
    return signInWithEmailAndPassword(email, password);
  }
  
  function logout() {
    // Clear guest user if exists
    localStorage.removeItem('monopoly_guest_user');
    return signOut();
  }
  
  // Guest login functionality
  function loginAsGuest(guestName) {
    // Create a new guest user
    const guestUser = {
      uid: `guest-${Date.now()}`,
      email: null,
      displayName: guestName || `Guest-${Math.floor(Math.random() * 10000)}`,
      isGuest: true,
      stats: {
        wins: 0,
        losses: 0,
        gamesPlayed: 0
      }
    };
    
    // Store guest user in localStorage for persistence
    localStorage.setItem('monopoly_guest_user', JSON.stringify(guestUser));
    setCurrentUser(guestUser);
    setUserData(guestUser);
    
    return Promise.resolve({ user: guestUser });
  }
  
  // Update guest stats
  function updateGuestStats(stats) {
    if (currentUser?.isGuest) {
      const updatedUser = {
        ...currentUser,
        stats: {
          ...currentUser.stats,
          ...stats
        }
      };
      
      setCurrentUser(updatedUser);
      setUserData(updatedUser);
      localStorage.setItem('monopoly_guest_user', JSON.stringify(updatedUser));
      return Promise.resolve(true);
    }
    
    return Promise.resolve(false);
  }
  
  // Listen for auth state changes and check for guest user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      // If no authenticated user, check for guest user in localStorage
      if (!user) {
        const guestUser = localStorage.getItem('monopoly_guest_user');
        if (guestUser) {
          const parsedUser = JSON.parse(guestUser);
          setCurrentUser(parsedUser);
          setUserData(parsedUser);
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } else {
        setCurrentUser(user);
        // Fetch additional user data from Firestore
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loginAsGuest,
    updateGuestStats,
    isGuest: currentUser?.isGuest || false
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}