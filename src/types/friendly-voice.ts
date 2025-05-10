export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Generated or uploaded abstract avatar
  interests: string[];
  personalityTags?: string[];
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
  id: string;
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
