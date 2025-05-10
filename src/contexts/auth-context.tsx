// src/contexts/auth-context.tsx
'use client';

import type { User, Message as DirectMessage } from '@/types/friendly-voice';
import { mockUsers, mockDirectMessages as initialMockDirectMessages } from '@/lib/mock-data'; // Import mock users and messages
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
  getMutualFollows: () => User[];
  getDirectMessages: (chatPartnerId: string) => DirectMessage[];
  sendDirectMessage: (recipientId: string, voiceDataUri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage users in localStorage for persistence
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return mockUsers;
  const stored = localStorage.getItem('friendlyVoiceAllUsers');
  return stored ? JSON.parse(stored) : mockUsers;
};

const storeUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('friendlyVoiceAllUsers', JSON.stringify(users));
  }
};

// Helper to manage direct messages in localStorage
const getStoredDirectMessages = (): DirectMessage[] => {
  if (typeof window === 'undefined') return initialMockDirectMessages;
  const stored = localStorage.getItem('friendlyVoiceDirectMessages');
  return stored ? JSON.parse(stored) : initialMockDirectMessages;
};

const storeDirectMessages = (messages: DirectMessage[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('friendlyVoiceDirectMessages', JSON.stringify(messages));
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>(getStoredUsers());
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(getStoredDirectMessages());
  const router = useRouter();

  useEffect(() => {
    setAllUsers(getStoredUsers());
    setDirectMessages(getStoredDirectMessages());
    const storedUser = localStorage.getItem('friendlyVoiceUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      const userInAllUsers = allUsers.find(u => u.id === parsedUser.id);
      if (userInAllUsers) {
        setUser({...userInAllUsers, ...parsedUser});
      } else {
        setUser(parsedUser);
        setAllUsers(prev => prev.find(u => u.id === parsedUser.id) ? prev : [...prev, parsedUser]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    storeUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    storeDirectMessages(directMessages);
  }, [directMessages]);

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let foundUser = allUsers.find(u => u.email === email);
    if (!foundUser) { 
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
    const storedAvatar = localStorage.getItem(`friendlyVoiceAvatar-${foundUser.id}`);
    if (storedAvatar && foundUser.avatarUrl !== storedAvatar) {
        updateUserAvatar(storedAvatar);
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
      login(email);
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
            if (u.id === user.id) {
                return {...u, following: Array.from(new Set([...(u.following || []), targetUserId]))};
            }
            if (u.id === targetUserId) {
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
            if (u.id === user.id) {
                return {...u, following: (u.following || []).filter(id => id !== targetUserId)};
            }
            if (u.id === targetUserId) {
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

  const getMutualFollows = (): User[] => {
    if (!user) return [];
    return allUsers.filter(otherUser => {
      if (otherUser.id === user.id) return false;
      const currentUserFollowsOther = user.following?.includes(otherUser.id);
      const otherUserFollowsCurrent = otherUser.followers?.includes(user.id);
      return currentUserFollowsOther && otherUserFollowsCurrent;
    });
  };

  const getDirectMessages = (chatPartnerId: string): DirectMessage[] => {
    if (!user) return [];
    const chatId = [user.id, chatPartnerId].sort().join('_');
    return directMessages
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const sendDirectMessage = async (recipientId: string, voiceDataUri: string): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado.");

    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      chatId: [user.id, recipientId].sort().join('_'),
      senderId: user.id,
      recipientId: recipientId,
      voiceUrl: voiceDataUri,
      createdAt: new Date().toISOString(),
      isRead: false, // Default for new message
    };
    
    setDirectMessages(prevMessages => [...prevMessages, newMessage]);
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      updateUserAvatar, 
      followUser, 
      unfollowUser, 
      isFollowing, 
      getUserById,
      getMutualFollows,
      getDirectMessages,
      sendDirectMessage
    }}>
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
