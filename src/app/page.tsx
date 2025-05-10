'use client';

import { EcosystemCard } from '@/components/ecosystem-card';
import type { Ecosystem } from '@/types/friendly-voice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data for ecosystems
const mockEcosystems: Ecosystem[] = [
  {
    id: '1',
    name: 'Tech Talks Weekly',
    topic: 'Latest in technology and software development',
    description: 'Join us for a weekly discussion on all things tech. From new frameworks to AI breakthroughs, we cover it all.',
    tags: ['Technology', 'Software', 'AI', 'Innovation'],
    hostIds: ['user1'],
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    isActive: true,
    participantCount: 125,
  },
  {
    id: '2',
    name: 'Mindful Mornings',
    topic: 'Meditation and mindfulness practices',
    description: 'Start your day with a guided meditation session and share your thoughts on living a more mindful life.',
    tags: ['Mindfulness', 'Meditation', 'Wellness', 'Self-care'],
    hostIds: ['user2'],
    createdBy: 'user2',
    createdAt: new Date().toISOString(),
    isActive: true,
    participantCount: 78,
  },
  {
    id: '3',
    name: 'Bookworms United',
    topic: 'Discussing our favorite books',
    description: 'A friendly space for book lovers to discuss recent reads, classic literature, and hidden gems. All genres welcome!',
    tags: ['Books', 'Literature', 'Reading', 'Community'],
    hostIds: ['user3'],
    createdBy: 'user3',
    createdAt: new Date().toISOString(),
    isActive: false,
    participantCount: 45,
  },
    {
    id: '4',
    name: 'Startup Journeys',
    topic: 'Stories from entrepreneurs and founders',
    description: 'Hear from and interact with startup founders about their challenges, successes, and learnings.',
    tags: ['Entrepreneurship', 'Startups', 'Business', 'Motivation'],
    hostIds: ['user4'],
    createdBy: 'user4',
    createdAt: new Date().toISOString(),
    isActive: true,
    participantCount: 210,
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEcosystems = mockEcosystems.filter(eco => 
    eco.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eco.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eco.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const activeEcosystems = filteredEcosystems.filter(eco => eco.isActive);
  const inactiveEcosystems = filteredEcosystems.filter(eco => !eco.isActive);


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Descubrir Ecosistemas</h1>
        <Link href="/ecosystems/create" passHref>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Ecosistema
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Buscar Ecosistemas por nombre, tema o etiqueta..." 
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredEcosystems.length === 0 && searchTerm && (
        <p className="text-center text-muted-foreground py-8">No se encontraron ecosistemas para "{searchTerm}".</p>
      )}


      {activeEcosystems.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activos Ahora</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEcosystems.map((ecosystem) => (
              <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
            ))}
          </div>
        </div>
      )}
      
      {inactiveEcosystems.length > 0 && (
         <div>
          <h2 className="text-2xl font-semibold mb-4 mt-8">Otros Ecosistemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveEcosystems.map((ecosystem) => (
              <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
            ))}
          </div>
        </div>
      )}

       {filteredEcosystems.length === 0 && !searchTerm && (
        <p className="text-center text-muted-foreground py-8">No hay ecosistemas disponibles en este momento. ¡Intenta crear uno!</p>
      )}

    </div>
  );
}
