"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pairedWith?: string[]; // IDs of paired users
  pairingCode?: string; // For parents
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('kidsafe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check localStorage for existing users
    const usersData = localStorage.getItem('kidsafe_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('kidsafe_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock signup - store in localStorage
    const usersData = localStorage.getItem('kidsafe_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role,
      pairedWith: [],
      pairingCode: role === 'parent' ? Math.floor(100000 + Math.random() * 900000).toString() : undefined
    };
    
    users.push(newUser);
    localStorage.setItem('kidsafe_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('kidsafe_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kidsafe_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('kidsafe_user', JSON.stringify(updatedUser));
      
      // Also update in users list
      const usersData = localStorage.getItem('kidsafe_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('kidsafe_users', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
