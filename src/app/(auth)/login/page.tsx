import { AuthForm } from '@/components/auth-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primary">Log In to FriendlyVoice</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm type="login" />
        </CardContent>
      </Card>
    </div>
  );
}
