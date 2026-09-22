import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem('token') || null
  );
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    const currentToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    return Boolean(currentToken && !storedUser);
  });

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const currentToken = sessionStorage.getItem('token');
      if (!currentToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (isMounted) {
          setUser(res.data);
          sessionStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (error) {
        console.error('Failed to verify user session:', error);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: authToken, ...userData } = res.data;

    // Per-tab isolated storage
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const registerCandidate = async (candidateData) => {
    const res = await api.post('/auth/register', candidateData);
    const { token: authToken, ...userData } = res.data;

    // Per-tab isolated storage
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    // Only clear the current tab's session
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUserState = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      sessionStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerCandidate,
        logout,
        updateUserState,
        isAdmin: user?.role === 'admin',
        isCandidate: user?.role === 'candidate',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
