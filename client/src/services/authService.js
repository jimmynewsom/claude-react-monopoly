import { 
    createUserWithEmailAndPassword as firebaseCreateUser,
    signInWithEmailAndPassword as firebaseSignIn,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseAuthStateChanged,
    updateProfile
  } from "firebase/auth";
  import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
  } from "firebase/firestore";
  import { auth, db } from "../firebase";
  
  // Create a new user
  export const createUserWithEmailAndPassword = async (email, password) => {
    const userCredential = await firebaseCreateUser(auth, email, password);
    return userCredential;
  };
  
  // Update user profile
  export const updateUserProfile = async (user, displayName) => {
    return updateProfile(user, { displayName });
  };
  
  // Create user document in Firestore
  export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      const { email, displayName } = user;
      
      try {
        await setDoc(userRef, {
          displayName,
          email,
          createdAt: serverTimestamp(),
          stats: {
            wins: 0,
            losses: 0,
            gamesPlayed: 0
          },
          ...additionalData
        });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    
    return userRef;
  };
  
  // Sign in
  export const signInWithEmailAndPassword = (email, password) => {
    return firebaseSignIn(auth, email, password);
  };
  
  // Sign out
  export const signOut = () => {
    return firebaseSignOut(auth);
  };
  
  // Auth state observer
  export const onAuthStateChanged = (callback) => {
    return firebaseAuthStateChanged(auth, callback);
  };
  
  // Get user data from Firestore
  export const getUserData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    
    return null;
  };
  
  // Update user stats
  export const updateUserStats = async (userId, stats) => {
    const userRef = doc(db, "users", userId);
    
    try {
      await updateDoc(userRef, {
        'stats.wins': stats.wins,
        'stats.losses': stats.losses,
        'stats.gamesPlayed': stats.gamesPlayed,
        lastUpdated: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating user stats", error);
      return false;
    }
  };