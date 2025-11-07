import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    // Mock login
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: (role as any) || 'user',
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'user',
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
