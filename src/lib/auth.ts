import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "./firebase";

// ... (existing UserProfile interface)

export const isNicknameAvailable = async (nickname: string, excludeUid?: string) => {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("nickname", "==", nickname));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return true;
  }
  
  // If we found a document, check if it's the current user's document
  if (excludeUid) {
    const otherUsers = querySnapshot.docs.filter(doc => doc.id !== excludeUid);
    return otherUsers.length === 0;
  }
  
  return false;
};

// Define the UserProfile interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  nickname?: string;
  job?: string;
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return await createUserProfile(user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const createUserProfile = async (user: User) => {
  const userRef = doc(firestore, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // If user profile doesn't exist, create it with initial data from Google
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      nickname: user.displayName || "익명", // Default nickname to Google's display name
      job: "", // Default empty job
    };
    await setDoc(userRef, userProfile);
    return userProfile;
  } else {
    // If it exists, return existing profile
    return docSnap.data() as UserProfile;
  }
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(firestore, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(firestore, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
