// src/app/feed/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Voz } from '@/types/friendly-voice';
import { CreateVozForm } from '@/components/create-voz-form';
import { VozCard } from '@/components/voz-card';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for initial voces - normally this would come from a backend
const initialMockVoces: Voz[] = [
  {
    id: 'voz1',
    userId: 'userAnaP',
    userName: 'Ana Pérez',
    userAvatarUrl: 'https://picsum.photos/seed/anap/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
    caption: '¡Hola a todos! Compartiendo mis pensamientos sobre el último libro que leí. 📚✨ Espero que les guste mi primera voz.',
    likesCount: 15,
    commentsCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isLiked: false,
  },
  {
    id: 'voz2',
    userId: 'userCarlosL',
    userName: 'Carlos López',
    userAvatarUrl: 'https://picsum.photos/seed/carlosl/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
    caption: 'Probando esta nueva función de voces. ¿Qué opinan del clima de hoy? ☀️\n\nMe encanta poder compartir audios así.',
    likesCount: 22,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isLiked: true,
  },
  {
    id: 'voz3',
    userId: 'userLauraG',
    userName: 'Laura García',
    userAvatarUrl: 'https://picsum.photos/seed/laurag/60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder audio
    caption: 'Un pequeño fragmento de la canción que estoy aprendiendo en guitarra. 🎸🎶 Déjenme sus comentarios.',
    likesCount: 30,
    commentsCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isLiked: false,
  },
];

export default function FeedPage() {
  const { user, loading } = useAuth();
  const [voces, setVoces] = useState<Voz[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    // Simulate fetching feed data
    setTimeout(() => {
      setVoces(initialMockVoces.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsLoadingFeed(false);
    }, 1000);
  }, []);

  const handleVozCreated = (newVoz: Voz) => {
    setVoces(prevVoces => [newVoz, ...prevVoces]);
  };

  const handleLikeToggle = (vozId: string) => {
    setVoces(prevVoces =>
      prevVoces.map(v =>
        v.id === vozId
          ? { ...v, isLiked: !v.isLiked, likesCount: v.isLiked ? v.likesCount - 1 : v.likesCount + 1 }
          : v
      )
    );
  };

  const handleComment = (vozId: string) => {
    // Placeholder: In a real app, this might open a comment modal or navigate to a comment section
    console.log('Comment on voz:', vozId);
    // Potentially increment comment count optimistically if adding a comment immediately
    // setVoces(prevVoces =>
    //   prevVoces.map(v =>
    //     v.id === vozId ? { ...v, commentsCount: v.commentsCount + 1 } : v
    //   )
    // );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Users className="w-24 h-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Únete a la Conversación</h2>
        <p className="text-muted-foreground mb-6">Inicia sesión o crea una cuenta para ver y compartir voces.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Registrarse</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Voces Recientes</h1>
      
      <CreateVozForm onVozCreated={handleVozCreated} />

      {isLoadingFeed && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Cargando voces...</p>
        </div>
      )}

      {!isLoadingFeed && voces.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Aún no hay voces. ¡Sé el primero en publicar!</p>
        </div>
      )}

      {!isLoadingFeed && voces.length > 0 && (
        <div className="space-y-6">
          {voces.map(voz => (
            <VozCard key={voz.id} voz={voz} onLikeToggle={handleLikeToggle} onComment={handleComment} />
          ))}
        </div>
      )}
    </div>
  );
}
