import { useState, useEffect } from "react";
import { onAuthStateChanged, getIdToken, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        try {
          const idToken = await user.getIdToken(); // Fetch the ID token (JWT)
          setToken(idToken);
        } catch (error) {
          console.error("Error fetching ID token:", error);
        }
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshToken = async () => {
    if (user) {
      try {
        const newToken = await user.getIdToken(true); // Force token refresh
        setToken(newToken);
        return newToken;
      } catch (error) {
        console.error("Error refreshing ID token:", error);
        return null;
      }
    }
    return null;
  };

  return { user, loading, token, refreshToken };
};

export default useAuth;
