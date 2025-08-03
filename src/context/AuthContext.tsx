// context/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User } from '../types/types';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const newUser: User = {
      email,
      password,
      name: 'Saba', // Can be made dynamic if needed
      likedRecipes: [],
      customRecipes: []
    };

    setUser(newUser);
    return true;
  };

  const register = (newUser: Omit<User, 'likedRecipes' | 'customRecipes'>) => {
    setUser({
      ...newUser,
      likedRecipes: [],
      customRecipes: []
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
