// src/app/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Edit3, LogOut, Mic, Settings, Users, Shield, LayoutGrid, Headphones, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Voz } from '@/types/friendly-voice';
import { initialMockVoces } from '@/lib/mock-data';
import { VozCard } from '@/components/voz-card';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading, logout, getUserById } = useAuth(); // Added getUserById
  const router = useRouter();
  const { toast } = useToast();
  const [userVoces, setUserVoces] = useState<Voz[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      // Load current user's voces
      const voces = initialMockVoces.filter(v => v.userId === user.id)
                                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserVoces(voces);
    }
  }, [user, loading, router]);

  // Dummy handlers for VozCard interactions on this page
  const handleLikeOnProfile = (vozId: string) => {
    setUserVoces(prevVoces =>
      prevVoces.map(v =>
        v.id === vozId
          ? { ...v, isLiked: !v.isLiked, likesCount: v.isLiked ? v.likesCount - 1 : v.likesCount + 1 }
          : v
      )
    );
  };
  const handleCommentOnProfile = (vozId: string) => {
     toast({ title: 'Comentarios', description: 'La función de comentarios está en desarrollo.'});
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Get up-to-date follower/following counts
  const profileUser = getUserById(user.id) || user; // Fallback to context user if somehow not in allUsers
  const followersCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.following?.length || 0;

  const mockJoinedEcosystems = [
    { id: 'eco1', name: 'Charlas de Tech Semanal', topic: 'Lo último en tecnología y desarrollo', participantCount: 120 },
    { id: 'eco2', name: 'Club de Lectura "Entre Líneas"', topic: 'Discusiones mensuales de libros', participantCount: 75 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-500 p-8 text-primary-foreground">
          <div className="flex flex-col items-center text-center space-y-3">
            {profileUser.avatarUrl && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image 
                  src={profileUser.avatarUrl} 
                  alt={profileUser.name || 'Avatar de Usuario'} 
                  width={128} 
                  height={128} 
                  className="object-cover"
                  data-ai-hint="abstract geometric"
                  priority
                />
              </div>
            )}
            <CardTitle className="text-3xl font-bold">{profileUser.name}</CardTitle>
            <CardDescription className="text-blue-100">{profileUser.email}</CardDescription>
            {profileUser.bio && <p className="text-sm text-blue-50 mt-1">{profileUser.bio}</p>}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-semibold">{followersCount}</p>
              <p className="text-sm text-muted-foreground">Seguidores</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{followingCount}</p>
              <p className="text-sm text-muted-foreground">Siguiendo</p>
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Settings className="mr-2 h-5 w-5" />Intereses y Personalidad</h3>
            <div className="flex flex-wrap gap-2">
              {(profileUser.interests?.length ? profileUser.interests : ['Música', 'Tecnología']).map(interest => (
                <Badge key={interest} variant="secondary" className="text-sm">{interest}</Badge>
              ))}
              {(profileUser.personalityTags?.length ? profileUser.personalityTags : ['Creativo', 'Introvertido']).map(tag => (
                <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
              ))}
            </div>
          </div>

          {profileUser.bioSoundUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Mic className="mr-2 h-5 w-5" />Biografía Sonora</h3>
              <audio controls src={profileUser.bioSoundUrl} className="w-full" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><Mic className="mr-2 h-5 w-5" />Mis Voces Publicadas</h3>
            {userVoces.length > 0 ? (
              <div className="space-y-4">
                {userVoces.map(voz => (
                  <VozCard key={voz.id} voz={voz} onLikeToggle={handleLikeOnProfile} onOpenComments={handleCommentOnProfile} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aún no has publicado ninguna voz.</p>
            )}
          </div>
          
          <Separator />

           <div>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><LayoutGrid className="mr-2 h-5 w-5" />Mis Ecosistemas</h3>
            {mockJoinedEcosystems.length > 0 ? (
              <div className="space-y-3">
                {mockJoinedEcosystems.map(eco => (
                  <Link key={eco.id} href={`/ecosystems/${eco.id}`} passHref>
                    <div className="p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                           <p className="font-medium">{eco.name}</p>
                           <p className="text-xs text-muted-foreground flex items-center"><Headphones className="mr-1.5 h-3 w-3"/> {eco.topic}</p>
                        </div>
                        <Badge variant="outline">{eco.participantCount} part.</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no te has unido a ningún ecosistema.</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
             <Button variant="outline" className="w-full justify-start" onClick={() => toast({title: 'Próximamente', description: 'La gestión de amigos de voz estará disponible pronto.'})}>
              <Users className="mr-2 h-4 w-4" /> Gestionar Voces Amigas
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast({title: 'Próximamente', description: 'La configuración de privacidad estará disponible pronto.'})}>
              <Shield className="mr-2 h-4 w-4" /> Privacidad y Seguridad
            </Button>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-6 border-t">
          <Button variant="outline" onClick={() => toast({title: 'Próximamente', description: 'La edición de perfil estará disponible pronto.'})}>
            <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
          </Button>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
