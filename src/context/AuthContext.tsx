import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types/types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const existingUser = users.find(u => u.email === email && u.password === password);
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));
      return true;
    }
    return false;
  };

  const register = (newUser: Omit<User, 'likedRecipes' | 'customRecipes'>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const userWithDefaults: User = {
      ...newUser,
      likedRecipes: [],
      customRecipes: []
    };
    users.push(userWithDefaults);
    localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
