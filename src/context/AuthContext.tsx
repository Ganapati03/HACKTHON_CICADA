import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'developer' | 'hr' | 'examiner';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext(undefined as any);

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user and token
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await authAPI.login(email, password, role);
      const { token, user: apiUser } = response.data;
      
      const newUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.name,
        role: (apiUser.role as any) || 'user',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role?: string) => {
    try {
      const response = await authAPI.signup(email, password, name, role);
      const { token, user: apiUser } = response.data;
      
      const newUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.name,
        role: (apiUser.role as any) || 'user',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = user?.role !== 'user' && user?.role !== undefined;

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, updateProfile }}>
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
