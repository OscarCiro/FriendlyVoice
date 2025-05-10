export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Generated or uploaded abstract avatar
  interests: string[];
  personalityTags?: string[];
  bio?: string; // Added bio field
  bioSoundUrl?: string; // URL to a short audio biography
  voiceSamples: VoiceSample[];
  followers?: string[]; // User IDs
  following?: string[]; // User IDs
}

export interface VoiceSample {
  id: string;
  url: string;
  title?: string;
  createdAt: string;
}

export interface Ecosystem {
  id:string;
  name: string;
  topic: string;
  description?: string;
  tags: string[];
  hostIds: string[];
  coHostIds?: string[];
  speakerIds?: string[];
  listenerIds?: string[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  participantCount?: number; // Denormalized for quick display
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  voiceUrl: string;
  createdAt: string;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}

// For AI Avatar Generation
export interface GenerateVoiceAvatarInput {
  voiceDataUri: string;
}

export interface GenerateVoiceAvatarOutput {
  avatarDataUri: string;
}

// For Feed/Voces feature
export interface VozComment {
  id: string;
  vozId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  createdAt: string; // ISO date string
}

export interface Voz {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  audioUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string; // ISO date string
  isLiked?: boolean; // Client-side state for mocking like interaction
  comments?: VozComment[]; // Added to store comments for a Voz
}


