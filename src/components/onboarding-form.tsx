'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { generateVoiceAvatar } from '@/ai/flows/generate-voice-avatar';
import type { GenerateVoiceAvatarInput } from '@/ai/flows/generate-voice-avatar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Mic, StopCircle, RotateCcw, Send, Loader2, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";


export function OnboardingForm() {
  const { status, startRecording, stopRecording, audioDataUri, error: recorderError, reset: resetRecorder } = useAudioRecorder();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatarUri, setGeneratedAvatarUri] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const { user, updateUserAvatar } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerateAvatar = async () => {
    if (!audioDataUri) {
      setAiError('Por favor, graba tu voz primero.');
      return;
    }
    if (!user) {
      setAiError('Usuario no encontrado. Por favor, inicia sesión de nuevo.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const input: GenerateVoiceAvatarInput = { voiceDataUri: audioDataUri };
      const result = await generateVoiceAvatar(input);
      if (result.avatarDataUri) {
        setGeneratedAvatarUri(result.avatarDataUri);
        updateUserAvatar(result.avatarDataUri);
        toast({ title: '¡Avatar Generado!', description: 'Tu avatar de voz único está listo.' });
      } else {
        throw new Error('La IA no devolvió un avatar.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo generar el avatar.';
      setAiError(message);
      toast({ title: 'Falló la Generación de Avatar', description: message, variant: 'destructive' });
      // Keep the old avatar or a placeholder if generation fails
      setGeneratedAvatarUri(user.avatarUrl || `https://picsum.photos/seed/${user.email}/200`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const completeOnboarding = () => {
    if (!generatedAvatarUri && user?.avatarUrl) {
      // If avatar generation failed or was skipped, but there's an existing avatar (e.g. placeholder)
      // ensure it's set correctly before proceeding.
      updateUserAvatar(user.avatarUrl);
    } else if (!user?.avatarUrl && !generatedAvatarUri) {
      // If no avatar exists at all, set a default one. This shouldn't happen if signup provides one.
      const defaultAvatar = `https://picsum.photos/seed/${user?.email || 'default'}/200`;
      updateUserAvatar(defaultAvatar);
      setGeneratedAvatarUri(defaultAvatar);
    }
    toast({ title: '¡Incorporación Completada!', description: '¡Bienvenido a la comunidad FriendlyVoice!' });
    router.push('/profile');
  };

  const currentAvatar = generatedAvatarUri || user?.avatarUrl;

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Crea Tu Avatar de Voz</CardTitle>
        <CardDescription>Graba una muestra corta de voz. ¡Usaremos IA para generar un avatar abstracto único que represente tu voz!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {currentAvatar && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-md">
              <Image src={currentAvatar} alt="Tu Avatar" width={128} height={128} className="object-cover" data-ai-hint="abstract geometric" />
            </div>
          )}
          {isGenerating && <Progress value={undefined} className="w-full h-2 animate-pulse" />}

          <div className="flex space-x-2">
            {status === 'idle' || status === 'stopped' || status === 'error' ? (
              <Button onClick={startRecording} disabled={isGenerating} variant="outline">
                <Mic className="mr-2 h-4 w-4" /> Comenzar Grabación
              </Button>
            ) : null}
            {status === 'recording' ? (
              <Button onClick={stopRecording} disabled={isGenerating} variant="destructive">
                <StopCircle className="mr-2 h-4 w-4" /> Detener Grabación
              </Button>
            ) : null}
          </div>
          {status === 'recording' && (
            <p className="text-sm text-accent animate-pulse">Grabando... ¡Habla claro!</p>
          )}
        </div>

        {audioDataUri && status === 'stopped' && (
          <div className="p-4 bg-muted rounded-md text-center space-y-2">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">¡Muestra de voz grabada!</p>
            <audio src={audioDataUri} controls className="w-full" />
            <div className="flex justify-center space-x-2 pt-2">
              <Button onClick={resetRecorder} variant="ghost" size="sm" disabled={isGenerating}>
                <RotateCcw className="mr-2 h-4 w-4" /> Grabar de Nuevo
              </Button>
              <Button onClick={handleGenerateAvatar} disabled={isGenerating || !audioDataUri} className="bg-accent hover:bg-accent/90">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Generar Avatar
              </Button>
            </div>
          </div>
        )}

        {recorderError && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" /> {recorderError}
          </div>
        )}
        {aiError && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" /> {aiError}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={completeOnboarding} className="w-full" disabled={isGenerating || (!generatedAvatarUri && !user?.avatarUrl)}>
          <UserCheck className="mr-2 h-4 w-4" /> Finalizar Incorporación
        </Button>
      </CardFooter>
    </Card>
  );
}
