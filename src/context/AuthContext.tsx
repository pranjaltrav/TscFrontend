import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define user role types
export type UserRole = 'admin' | 'dealer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, phoneNumber: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Configure axios defaults - using relative URLs instead of absolute
  const api = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login Function with Axios Integration using relative URL
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/Auth/login', {
        username: email,
        password,
        userType: role,
      });
  
      if (response.data) {
        // Set user details in localStorage
        const user: User = { id: '1', name: email, email, role }; 
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
  
        // Redirect to appropriate dashboard based on role
        window.location.href = role === 'admin' ? '/admin/dashboard' : '/dealer/dashboard';
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Updated Register Function with Axios Integration using relative URL
  const register = async (name: string, email: string, phoneNumber: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/Auth/register', {
        username: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        userType: role
      });

      // Map API response to User interface
      const user: User = {
        id: response.data.id?.toString() || '1',
        name: response.data.username || name,
        email: response.data.email || email,
        role: role
      };

      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return; // Allow component to handle navigation
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};