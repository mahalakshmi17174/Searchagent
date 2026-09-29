import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('aurqo-session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const login = (userId, name, email) => {
    const userSession = { userId, name, email, loginStatus: true };
    localStorage.setItem('aurqo-session', JSON.stringify(userSession));
    setCurrentUser(userSession);
  };

  const logout = () => {
    localStorage.removeItem('aurqo-session');
    setCurrentUser(null);
  };

  const updateProfile = (name) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name };
    localStorage.setItem('aurqo-session', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProfile, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
