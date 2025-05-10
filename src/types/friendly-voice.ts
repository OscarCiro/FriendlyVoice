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
  chatId: string; // Identificador de la conversación, ej: sortedUserIds.join('_')
  senderId: string;
  recipientId: string; // ID del destinatario del mensaje
  voiceUrl: string; // Data URI de la grabación de voz
  createdAt: string; // ISO date string
  isRead?: boolean;
}

export interface Chat {
  id: string; // Identificador único del chat, ej: sortedUserIds.join('_')
  participantIds: string[]; // IDs de los usuarios en el chat
  otherUserName: string; // Nombre del otro usuario para mostrar en la lista de chats
  otherUserAvatar?: string; // Avatar del otro usuario
  lastMessage?: Message; // El último mensaje de la conversación
  updatedAt: string; // Fecha del último mensaje, para ordenar
  unreadCount?: number; // Número de mensajes no leídos para el usuario actual
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
  userName:string;
  userAvatarUrl?: string;
  audioUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string; // ISO date string
  isLiked?: boolean; // Client-side state for mocking like interaction
  comments?: VozComment[]; // Added to store comments for a Voz
}
