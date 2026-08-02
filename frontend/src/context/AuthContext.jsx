import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('simkasan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('simkasan_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/api/me');
          const userData = res.data.data;
          setUser(userData);
          localStorage.setItem('simkasan_user', JSON.stringify(userData));
        } catch (err) {
          console.error("Gagal mengambil data user:", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/login', { email, password });
    const { token: tokenData, user: userData } = res.data;
    
    setToken(tokenData);
    setUser(userData);
    
    localStorage.setItem('simkasan_token', tokenData);
    localStorage.setItem('simkasan_user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    if (token) {
      try {
        await api.post('/api/logout');
      } catch (err) {
        console.error("Gagal logout di server:", err);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('simkasan_token');
    localStorage.removeItem('simkasan_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
