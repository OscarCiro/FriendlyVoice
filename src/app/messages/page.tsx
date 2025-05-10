import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareDashed } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Mensajes Directos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 p-8">
           <MessageSquareDashed className="w-24 h-24 text-muted-foreground" />
          <p className="text-lg font-medium">Mensajería de Voz Directa</p>
          <p className="text-muted-foreground">
            Esta función está en desarrollo. Pronto podrás enviar y recibir mensajes de voz con tus Voces Amigas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
