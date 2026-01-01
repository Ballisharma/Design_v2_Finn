import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginCustomer } from '../utils/wordpress';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  lastUpdated?: number; // Timestamp for session management
  billing?: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Session duration: 30 minutes
const SESSION_DURATION = 30 * 60 * 1000;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = async (email: string) => {
    try {
      const userData: any = await loginCustomer(email, '');
      handleSetUser(userData);
    } catch (error) {
      console.error("Failed to refresh user profile", error);
    }
  };

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('jumplings_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        // Check session age
        const now = Date.now();
        const lastUpdated = parsed.lastUpdated || 0;
        const isSessionFresh = (now - lastUpdated) < SESSION_DURATION;

        // Force logout if it's an old mock user from early development
        if (parsed.first_name === 'Funky' || parsed.id === '1') {
          handleSetUser(null);
        } else if (!isSessionFresh) {
          // Session expired or needs refresh
          console.log("🔄 Session needs refresh...");
          setUser(parsed); // Keep old data until refresh
          refreshUser(parsed.email);
        } else {
          // Session is still fresh (within 30 mins)
          setUser(parsed);
        }
      } catch (e) {
        handleSetUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData: any = await loginCustomer(email, password);
      setUser(userData);
      localStorage.setItem('jumplings_user', JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = (userData: User | null) => {
    if (userData) {
      const updatedUser = { ...userData, lastUpdated: Date.now() };
      setUser(updatedUser);
      localStorage.setItem('jumplings_user', JSON.stringify(updatedUser));
    } else {
      setUser(null);
      localStorage.removeItem('jumplings_user');
    }
  };

  const logout = () => {
    handleSetUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, setUser: handleSetUser, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};