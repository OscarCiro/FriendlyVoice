'use client';

import type { User } from '@/types/friendly-voice';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) // Simplified login
    => Promise<void>;
  signup: (email: string, name: string) // Simplified signup
    => Promise<void>;
  logout: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth state
    const storedUser = localStorage.getItem('friendlyVoiceUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = { 
      id: 'user123', 
      name: email.split('@')[0] || 'Demo User', 
      email, 
      avatarUrl: localStorage.getItem('friendlyVoiceAvatar') || `https://picsum.photos/seed/${email}/200`,
      interests: ['Music', 'Tech', 'Podcasts'],
      bioSoundUrl: '',
      voiceSamples: [],
    };
    setUser(mockUser);
    localStorage.setItem('friendlyVoiceUser', JSON.stringify(mockUser));
    if (mockUser.avatarUrl && mockUser.avatarUrl.startsWith('https://picsum.photos')) { // If default avatar, go to onboarding
       router.push('/onboarding');
    } else {
       router.push('/');
    }
    setLoading(false);
  };

  const signup = async (email: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
     const mockUser: User = { 
      id: 'user' + Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      avatarUrl: `https://picsum.photos/seed/${email}/200`, // Default placeholder
      interests: [],
      bioSoundUrl: '',
      voiceSamples: [],
    };
    setUser(mockUser);
    localStorage.setItem('friendlyVoiceUser', JSON.stringify(mockUser));
    localStorage.setItem('friendlyVoiceAvatar', mockUser.avatarUrl); // Store default avatar
    router.push('/onboarding');
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('friendlyVoiceUser');
    localStorage.removeItem('friendlyVoiceAvatar');
    router.push('/login');
    setLoading(false);
  };
  
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('friendlyVoiceUser', JSON.stringify(updatedUser));
      localStorage.setItem('friendlyVoiceAvatar', avatarUrl);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserAvatar }}>
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
