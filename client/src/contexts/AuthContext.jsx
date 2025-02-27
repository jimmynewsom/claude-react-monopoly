import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from '../services/mockFirebase'; // We'll use a mock implementation for now

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate Firebase auth behavior
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      // Update the user's profile with display name
      userCredential.user.displayName = displayName;
      return userCredential;
    } catch (error) {
      throw error;
    }
  }
  
  function login(email, password) {
    return signInWithEmailAndPassword(email, password);
  }
  
  function logout() {
    return signOut();
  }
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    signup,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}