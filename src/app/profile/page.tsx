'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Edit3, LogOut, Mic, Settings, Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by a protected route mechanism
    // For now, redirect if not logged in.
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null; 
  }

  // Mock data for demonstration
  const mockVoiceSamples = [
    { id: 'vs1', title: 'My Introduction', url: '#', createdAt: new Date().toISOString() },
    { id: 'vs2', title: 'Thoughts on Tech', url: '#', createdAt: new Date().toISOString() },
  ];
  const followersCount = user.followers?.length || 25;
  const followingCount = user.following?.length || 42;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-500 p-8 text-primary-foreground">
          <div className="flex flex-col items-center text-center space-y-3">
            {user.avatarUrl && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name} 
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
              <p className="text-sm text-muted-foreground">Voces Amigas (Followers)</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{followingCount}</p>
              <p className="text-sm text-muted-foreground">Siguiendo Voces</p>
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Settings className="mr-2 h-5 w-5" />Interests & Personality</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests?.map(interest => (
                <Badge key={interest} variant="secondary" className="text-sm">{interest}</Badge>
              ))}
              {(user.personalityTags || ['Creative', 'Introvert']).map(tag => (
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
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Mic className="mr-2 h-5 w-5" />Fragmentos de Voz</h3>
            {mockVoiceSamples.length > 0 ? (
              <ul className="space-y-3">
                {mockVoiceSamples.map(sample => (
                  <li key={sample.id} className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <span>{sample.title}</span>
                    <Button variant="ghost" size="sm">Reproducir</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No voice samples yet.</p>
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
