// src/app/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Edit3, LogOut, Mic, Settings, Users, Shield, LayoutGrid, Headphones } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Mock data for demonstration
  const mockVoiceSamples = [
    { id: 'vs1', title: 'Mi Introducción', url: '#', createdAt: new Date().toISOString() },
    { id: 'vs2', title: 'Reflexiones sobre Tecnología', url: '#', createdAt: new Date().toISOString() },
  ];
  const followersCount = user.followers?.length || 25;
  const followingCount = user.following?.length || 42;

  const mockJoinedEcosystems = [
    { id: 'eco1', name: 'Charlas de Tech Semanal', topic: 'Lo último en tecnología y desarrollo', participantCount: 120 },
    { id: 'eco2', name: 'Club de Lectura "Entre Líneas"', topic: 'Discusiones mensuales de libros', participantCount: 75 },
    { id: 'eco3', name: 'Mañanas Conscientes', topic: 'Meditación y mindfulness', participantCount: 50 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-500 p-8 text-primary-foreground">
          <div className="flex flex-col items-center text-center space-y-3">
            {user.avatarUrl && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name || 'Avatar de Usuario'} 
                  width={128} 
                  height={128} 
                  className="object-cover"
                  data-ai-hint="abstract geometric"
                  priority
                />
              </div>
            )}
            <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
            <CardDescription className="text-blue-100">{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-semibold">{followersCount}</p>
              <p className="text-sm text-muted-foreground">Voces Amigas (Seguidores)</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{followingCount}</p>
              <p className="text-sm text-muted-foreground">Siguiendo Voces</p>
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Settings className="mr-2 h-5 w-5" />Intereses y Personalidad</h3>
            <div className="flex flex-wrap gap-2">
              {(user.interests?.length ? user.interests : ['Música', 'Tecnología']).map(interest => (
                <Badge key={interest} variant="secondary" className="text-sm">{interest}</Badge>
              ))}
              {(user.personalityTags?.length ? user.personalityTags : ['Creativo', 'Introvertido']).map(tag => (
                <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
              ))}
            </div>
          </div>

          {user.bioSoundUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Mic className="mr-2 h-5 w-5" />Biografía Sonora</h3>
              <audio controls src={user.bioSoundUrl} className="w-full" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><Mic className="mr-2 h-5 w-5" />Mis Voces Publicadas</h3>
            {mockVoiceSamples.length > 0 ? (
              <ul className="space-y-3">
                {mockVoiceSamples.map(sample => (
                  <li key={sample.id} className="p-3 bg-muted rounded-md flex justify-between items-center hover:bg-muted/80 transition-colors">
                    <span>{sample.title}</span>
                    <Button variant="ghost" size="sm">Reproducir</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no has publicado ninguna voz.</p>
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
             <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" /> Gestionar Voces Amigas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" /> Privacidad y Seguridad
            </Button>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-6 border-t">
          <Button variant="outline">
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
