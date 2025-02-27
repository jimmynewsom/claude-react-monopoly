// Mock implementation of Firebase Auth for development
// In a real app, you would import from firebase/auth

// Store users in localStorage for persistence between refreshes
const USERS_KEY = 'monopoly_users';
const CURRENT_USER_KEY = 'monopoly_current_user';

// Helper to get users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Helper for current user
const getCurrentUser = () => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
};

const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Auth state observers
const observers = [];

// Function to create a new user
export const createUserWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    const users = getUsers();
    
    // Check if email already exists
    if (users[email]) {
      reject(new Error('Email already in use'));
      return;
    }
    
    // Create the new user
    const newUser = {
      uid: Date.now().toString(),
      email,
      password, // In a real app, you would NEVER store passwords this way
      displayName: '',
      createdAt: new Date().toISOString(),
      stats: {
        wins: 0,
        losses: 0,
        gamesPlayed: 0
      }
    };
    
    // Save the user
    users[email] = newUser;
    saveUsers(users);
    
    // Set as current user (omit password)
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    
    // Notify observers
    observers.forEach(observer => observer(userWithoutPassword));
    
    resolve({ user: userWithoutPassword });
  });
};

// Function to sign in
export const signInWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    const users = getUsers();
    const user = users[email];
    
    if (!user || user.password !== password) {
      reject(new Error('Invalid email or password'));
      return;
    }
    
    // Set as current user (omit password)
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    
    // Notify observers
    observers.forEach(observer => observer(userWithoutPassword));
    
    resolve({ user: userWithoutPassword });
  });
};

// Function to sign out
export const signOut = () => {
  return new Promise((resolve) => {
    setCurrentUser(null);
    
    // Notify observers
    observers.forEach(observer => observer(null));
    
    resolve();
  });
};

// Function to listen to auth state changes
export const onAuthStateChanged = (observer) => {
  observers.push(observer);
  
  // Immediately call with current auth state
  observer(getCurrentUser());
  
  // Return unsubscribe function
  return () => {
    const index = observers.indexOf(observer);
    if (index > -1) {
      observers.splice(index, 1);
    }
  };
};

// Update a user's stats
export const updateUserStats = (userId, stats) => {
  const users = getUsers();
  
  // Find the user by userId
  for (const email in users) {
    if (users[email].uid === userId) {
      users[email].stats = {
        ...users[email].stats,
        ...stats
      };
      saveUsers(users);
      
      // Update current user if it's the same
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.uid === userId) {
        currentUser.stats = users[email].stats;
        setCurrentUser(currentUser);
        
        // Notify observers
        observers.forEach(observer => observer({...currentUser}));
      }
      
      return true;
    }
  }
  
  return false;
};