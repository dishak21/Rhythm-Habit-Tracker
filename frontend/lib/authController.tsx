import { auth, provider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";
import { db } from "./firebase"; // Make sure your Firestore instance is correctly imported
import { doc, setDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Add user information to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    ); // merge: true prevents overwriting existing data

    console.log("User signed in and data stored in Firestore");
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};
