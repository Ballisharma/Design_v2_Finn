import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginCustomer } from '../utils/wordpress';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
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
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = async (email: string) => {
    try {
      const userData: any = await loginCustomer(email, '');
      setUser(userData);
      localStorage.setItem('jumplings_user', JSON.stringify(userData));
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
        // Force logout if it's an old mock user from early development
        if (parsed.first_name === 'Funky' || parsed.id === '1' || parsed.id === '0') {
          localStorage.removeItem('jumplings_user');
          setUser(null);
        } else {
          setUser(parsed);
          // Auto-refresh profile from WordPress in the background
          refreshUser(parsed.email);
        }
      } catch (e) {
        localStorage.removeItem('jumplings_user');
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jumplings_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
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