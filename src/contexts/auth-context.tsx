// src/contexts/auth-context.tsx
'use client';

import type { User } from '@/types/friendly-voice';
import { mockUsers } from '@/lib/mock-data'; // Import mock users
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  followUser: (targetUserId: string) => Promise<void>;
  unfollowUser: (targetUserId: string) => Promise<void>;
  isFollowing: (targetUserId: string) => boolean;
  getUserById: (userId: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage users in localStorage for persistence across sessions for mock
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return mockUsers; // Default if no window
  const stored = localStorage.getItem('friendlyVoiceAllUsers');
  return stored ? JSON.parse(stored) : mockUsers;
};

const storeUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('friendlyVoiceAllUsers', JSON.stringify(users));
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>(getStoredUsers()); // Manage all users for follow/unfollow
  const router = useRouter();

  useEffect(() => {
    setAllUsers(getStoredUsers()); // Load users on mount
    const storedUser = localStorage.getItem('friendlyVoiceUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      // Ensure the user from localStorage is also updated in allUsers state
      const userInAllUsers = allUsers.find(u => u.id === parsedUser.id);
      if (userInAllUsers) {
        setUser({...userInAllUsers, ...parsedUser}); // Prioritize allUsers for follow/follower counts but localStorage for other data
      } else {
        setUser(parsedUser);
        setAllUsers(prev => prev.find(u => u.id === parsedUser.id) ? prev : [...prev, parsedUser]);
      }
    }
    setLoading(false);
  }, []); // Empty dependency array - runs once on mount

  useEffect(() => {
    storeUsers(allUsers); // Persist allUsers whenever it changes
  }, [allUsers]);

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let foundUser = allUsers.find(u => u.email === email);
    if (!foundUser) { // Simplified: create if not exists for demo purposes
      foundUser = { 
        id: 'user' + Math.random().toString(36).substr(2, 9), 
        name: email.split('@')[0] || 'Usuario Nuevo', 
        email, 
        avatarUrl: `https://picsum.photos/seed/${email}/200`,
        interests: [], bio: '', personalityTags: [], followers: [], following: [], voiceSamples: []
      };
      setAllUsers(prev => [...prev, foundUser!]);
    }

    setUser(foundUser);
    localStorage.setItem('friendlyVoiceUser', JSON.stringify(foundUser));
    // Avatar might have been updated via onboarding, ensure localStorage reflects this
    const storedAvatar = localStorage.getItem(`friendlyVoiceAvatar-${foundUser.id}`);
    if (storedAvatar && foundUser.avatarUrl !== storedAvatar) {
        updateUserAvatar(storedAvatar); // This will set user and local storage again
    }


    if (foundUser.avatarUrl && (foundUser.avatarUrl.startsWith('https://picsum.photos/seed/') || !foundUser.bioSoundUrl)) {
       router.push('/onboarding');
    } else {
       router.push('/');
    }
    setLoading(false);
  };

  const signup = async (email: string, name: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    let existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      // For simplicity, log them in if they exist, or throw error
      // throw new Error('User already exists with this email.');
      login(email); // or handle as error
      return;
    }

    const newUser: User = { 
      id: 'user' + Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      avatarUrl: `https://picsum.photos/seed/${email}/200`,
      interests: [], bio: '', personalityTags: [], followers: [], following: [], voiceSamples: []
    };
    setUser(newUser);
    setAllUsers(prev => [...prev, newUser]);
    localStorage.setItem('friendlyVoiceUser', JSON.stringify(newUser));
    localStorage.setItem(`friendlyVoiceAvatar-${newUser.id}`, newUser.avatarUrl);
    router.push('/onboarding');
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('friendlyVoiceUser');
    // Don't remove all users or individual avatars from localStorage on logout
    // localStorage.removeItem('friendlyVoiceAllUsers'); 
    // Object.keys(localStorage).forEach(key => {
    //   if (key.startsWith('friendlyVoiceAvatar-')) localStorage.removeItem(key);
    // });
    router.push('/login');
    setLoading(false);
  };
  
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      localStorage.setItem('friendlyVoiceUser', JSON.stringify(updatedUser));
      localStorage.setItem(`friendlyVoiceAvatar-${user.id}`, avatarUrl);
    }
  };

  const followUser = async (targetUserId: string) => {
    if (!user || user.id === targetUserId) return;
    
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedCurrentUser = {
        ...currentUser,
        following: Array.from(new Set([...(currentUser.following || []), targetUserId])),
      };
      localStorage.setItem('friendlyVoiceUser', JSON.stringify(updatedCurrentUser));
      return updatedCurrentUser;
    });

    setAllUsers(prevAllUsers => {
        return prevAllUsers.map(u => {
            if (u.id === user.id) { // Current user
                return {...u, following: Array.from(new Set([...(u.following || []), targetUserId]))};
            }
            if (u.id === targetUserId) { // Target user
                return {...u, followers: Array.from(new Set([...(u.followers || []), user.id]))};
            }
            return u;
        });
    });
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!user) return;

    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedCurrentUser = {
        ...currentUser,
        following: (currentUser.following || []).filter(id => id !== targetUserId),
      };
      localStorage.setItem('friendlyVoiceUser', JSON.stringify(updatedCurrentUser));
      return updatedCurrentUser;
    });
    
    setAllUsers(prevAllUsers => {
        return prevAllUsers.map(u => {
            if (u.id === user.id) { // Current user
                return {...u, following: (u.following || []).filter(id => id !== targetUserId)};
            }
            if (u.id === targetUserId) { // Target user
                return {...u, followers: (u.followers || []).filter(id => id !== user.id)};
            }
            return u;
        });
    });
  };

  const isFollowing = (targetUserId: string): boolean => {
    return !!user?.following?.includes(targetUserId);
  };

  const getUserById = (userId: string): User | undefined => {
    return allUsers.find(u => u.id === userId);
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserAvatar, followUser, unfollowUser, isFollowing, getUserById }}>
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
