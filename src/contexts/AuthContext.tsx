import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'GamerPro',
    email: 'gamer@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    banner: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=800',
    bio: 'Professional gamer and content creator',
    role: 'streamer',
    followers: 12500,
    following: 89,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    username: 'ChatModerator',
    email: 'mod@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'admin',
    followers: 234,
    following: 156,
    createdAt: '2022-11-08'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('twitchCloneUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser || email === 'demo@example.com') {
      const userData = foundUser || {
        id: '3',
        username: 'DemoUser',
        email: 'demo@example.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'viewer' as const,
        followers: 0,
        following: 5,
        createdAt: '2024-01-01'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('twitchCloneUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || 'NewUser',
      email: userData.email || '',
      avatar: userData.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: userData.role || 'viewer',
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('twitchCloneUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('twitchCloneUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('twitchCloneUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};