import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('urlshawtie_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('urlshawtie_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('urlshawtie_token');
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('urlshawtie_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const accessToken = data.access_token;
    localStorage.setItem('urlshawtie_token', accessToken);
    setToken(accessToken);

    // Fetch user details
    const userData = await getCurrentUser();
    setUser(userData);
    localStorage.setItem('urlshawtie_user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (userData) => {
    const registered = await registerUser(userData);
    // After signup, automatically login
    return await login({
      email: userData.email,
      password: userData.password,
    });
  };

  const logout = () => {
    localStorage.removeItem('urlshawtie_token');
    localStorage.removeItem('urlshawtie_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
