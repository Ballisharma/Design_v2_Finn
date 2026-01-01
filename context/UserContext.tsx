import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginCustomer, getCurrentUser, registerCustomer } from '../utils/wordpress';

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
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Session duration: 30 minutes
const SESSION_DURATION = 30 * 60 * 1000;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUserData = async () => {
    try {
      const userData = await getCurrentUser();
      handleSetUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to refresh user profile", error);
      // If refresh fails, clear session
      handleSetUser(null);
      throw error;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jumplings_user');
    const jwtToken = localStorage.getItem('jumplings_jwt_token');
    
    if (savedUser && jwtToken) {
      try {
        const parsed = JSON.parse(savedUser);

        // Check session age
        const now = Date.now();
        const lastUpdated = parsed.lastUpdated || 0;
        const isSessionFresh = (now - lastUpdated) < SESSION_DURATION;

        // Remove old mock users
        if (parsed.first_name === 'Funky' || parsed.id === '1' || parsed.id === '0') {
          handleSetUser(null);
          return;
        }

        if (!isSessionFresh) {
          // Session expired, try to refresh with JWT
          console.log("🔄 Session expired, refreshing...");
          setUser(parsed); // Show old data while refreshing
          refreshUserData().catch(() => {
            // If refresh fails, user will be logged out
          });
        } else {
          // Session is still fresh
          setUser(parsed);
          // Verify token is still valid by attempting to refresh
          refreshUserData().catch(() => {
            // Silent fail - user stays logged in if refresh fails but session is fresh
          });
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
        handleSetUser(null);
      }
    } else if (savedUser && !jwtToken) {
      // User data exists but no token - clear it (old session)
      handleSetUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData: any = await loginCustomer(email, password);
      handleSetUser(userData);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const userData: any = await registerCustomer(email, password, firstName, lastName);
      handleSetUser(userData);
    } catch (error) {
      console.error("Registration failed", error);
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
      localStorage.removeItem('jumplings_jwt_token');
    }
  };

  const logout = () => {
    handleSetUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      register,
      setUser: handleSetUser, 
      logout, 
      isAuthenticated: !!user, 
      isLoading,
      refreshUser: refreshUserData
    }}>
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