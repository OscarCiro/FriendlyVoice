import type { User, Voz, VozComment } from '@/types/friendly-voice';

export const mockUsers: User[] = [
  {
    id: 'userAnaP',
    name: 'Ana Pérez',
    email: 'ana.perez@example.com',
    avatarUrl: 'https://picsum.photos/seed/anap/200',
    bio: 'Entusiasta de la tecnología y amante de los podcasts. Siempre en busca de nuevas voces e ideas.',
    interests: ['Tecnología', 'Podcasts', 'Música Indie'],
    personalityTags: ['Curiosa', 'Amigable'],
    followers: ['userCarlosL', 'userLauraG'],
    following: ['userCarlosL'],
    voiceSamples: [],
  },
  {
    id: 'userCarlosL',
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    avatarUrl: 'https://picsum.photos/seed/carlosl/200',
    bio: 'Desarrollador de software y aficionado a la ciencia ficción. Me gusta compartir mis pensamientos sobre el futuro.',
    interests: ['Desarrollo de Software', 'Ciencia Ficción', 'Videojuegos'],
    personalityTags: ['Analítico', 'Creativo'],
    followers: ['userAnaP'],
    following: ['userAnaP', 'userLauraG'],
    voiceSamples: [],
  },
  {
    id: 'userLauraG',
    name: 'Laura García',
    email: 'laura.garcia@example.com',
    avatarUrl: 'https://picsum.photos/seed/laurag/200',
    bio: 'Música y viajera. Comparto fragmentos de mi vida y mis melodías.',
    interests: ['Música', 'Viajes', 'Fotografía'],
    personalityTags: ['Aventurera', 'Artística'],
    followers: ['userCarlosL'],
    following: ['userCarlosL'],
    voiceSamples: [],
  },
   {
    id: 'userDemo',
    name: 'Usuario Demo',
    email: 'demo@example.com',
    avatarUrl: 'https://picsum.photos/seed/demoUser/200',
    bio: 'Explorando FriendlyVoice.',
    interests: ['Nuevas Experiencias'],
    personalityTags: ['Explorador'],
    followers: [],
    following: [],
    voiceSamples: [],
  }
];

const commentsForVoz1: VozComment[] = [
  {
    id: 'comment1-1',
    vozId: 'voz1',
    userId: 'userCarlosL',
    userName: 'Carlos López',
    userAvatarUrl: 'https://picsum.photos/seed/carlosl/60',
    text: '¡Muy interesante tu perspectiva, Ana! Totalmente de acuerdo con lo que mencionas sobre el capítulo 3.',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: 'comment1-2',
    vozId: 'voz1',
    userId: 'userLauraG',
    userName: 'Laura García',
    userAvatarUrl: 'https://picsum.photos/seed/laurag/60',
    text: '¡Qué buen libro! Lo añadiré a mi lista de lectura. Gracias por la recomendación.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
  },
];

const commentsForVoz2: VozComment[] = [
 {
    id: 'comment2-1',
    vozId: 'voz2',
    userId: 'userAnaP',
    userName: 'Ana Pérez',
    userAvatarUrl: 'https://picsum.photos/seed/anap/60',
    text: '¡Ja, ja! Por aquí también hace un sol increíble. ¡A disfrutarlo!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
  }
];


export const initialMockVoces: Voz[] = [
  {
    id: 'voz1',
    userId: 'userAnaP',
    userName: 'Ana Pérez',
    userAvatarUrl: 'https://picsum.photos/seed/anap/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    caption: '¡Hola a todos! Compartiendo mis pensamientos sobre el último libro que leí. 📚✨ Espero que les guste mi primera voz.',
    likesCount: 15,
    commentsCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isLiked: false,
    comments: commentsForVoz1,
  },
  {
    id: 'voz2',
    userId: 'userCarlosL',
    userName: 'Carlos López',
    userAvatarUrl: 'https://picsum.photos/seed/carlosl/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    caption: 'Probando esta nueva función de voces. ¿Qué opinan del clima de hoy? ☀️\n\nMe encanta poder compartir audios así.',
    likesCount: 22,
    commentsCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isLiked: true,
    comments: commentsForVoz2,
  },
  {
    id: 'voz3',
    userId: 'userLauraG',
    userName: 'Laura García',
    userAvatarUrl: 'https://picsum.photos/seed/laurag/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    caption: 'Un pequeño fragmento de la canción que estoy aprendiendo en guitarra. 🎸🎶 Déjenme sus comentarios.',
    likesCount: 30,
    commentsCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isLiked: false,
    comments: [],
  },
];
