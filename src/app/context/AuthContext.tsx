import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { api, setLocalToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Verify token with backend and extract local JWT
          const response = await api.loginAdmin(token);
          if (response && response.access_token) {
            setLocalToken(response.access_token);
          } else {
            console.warn("No access_token returned from backend during sync");
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error('Failed to sync auth with backend:', error);
          await signOut(auth);
          setLocalToken(null);
          setUser(null);
        }
      } else {
        setLocalToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const token = await userCredential.user.getIdToken();
      const response = await api.loginAdmin(token);
      
      if (response && response.access_token) {
        setLocalToken(response.access_token);
      } else {
        console.warn("No access_token returned from backend during login");
      }
      
      setUser(userCredential.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLocalToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
