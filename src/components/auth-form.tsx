'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const formSchemaBase = z.object({
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

const signupSchema = formSchemaBase.extend({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
});

type AuthFormProps = {
  type: 'login' | 'signup';
};

export function AuthForm({ type }: AuthFormProps) {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentSchema = type === 'signup' ? signupSchema : formSchemaBase;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === 'signup' && { name: '' }),
    },
  });

  async function onSubmit(values: z.infer<typeof currentSchema>) {
    setIsLoading(true);
    try {
      if (type === 'login') {
        await login(values.email);
        toast({ title: 'Inicio de Sesión Exitoso', description: '¡Bienvenido de nuevo!' });
      } else if (type === 'signup') {
        const signupValues = values as z.infer<typeof signupSchema>;
        await signup(signupValues.email, signupValues.name);
        toast({ title: 'Registro Exitoso', description: '¡Bienvenido a FriendlyVoice!' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      toast({
        title: type === 'login' ? 'Error al Iniciar Sesión' : 'Error en el Registro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        {type === 'login' ? 'Bienvenido de Nuevo' : 'Únete a FriendlyVoice'}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {type === 'signup' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {type === 'login' ? "¿No tienes una cuenta? " : '¿Ya tienes una cuenta? '}
        <Link href={type === 'login' ? '/signup' : '/login'} className="font-medium text-primary hover:underline">
          {type === 'login' ? 'Registrarse' : 'Iniciar Sesión'}
        </Link>
      </p>
    </div>
  );
}
