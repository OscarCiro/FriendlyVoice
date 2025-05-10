// src/app/notifications/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 p-8">
           <Bell className="w-24 h-24 text-muted-foreground" />
          <p className="text-lg font-medium">Tus Notificaciones</p>
          <p className="text-muted-foreground">
            Esta función está en desarrollo. Pronto podrás ver aquí tus actualizaciones importantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
