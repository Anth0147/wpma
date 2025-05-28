
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, RotateCcw, AlertTriangle } from 'lucide-react';
import type { WhatsAppSession } from '@/types';
import { useToast } from "@/hooks/use-toast";

// Simulación de datos de sesiones activas.
const MOCK_SESSIONS: WhatsAppSession[] = [
  { id: 'session_1', name: 'Mi Cuenta Personal', status: 'conectado', createdAt: new Date().toISOString(), phoneNumber: '+1111111111' },
  // { id: 'session_2', name: 'Cuenta de Empresa', status: 'conectado', createdAt: new Date().toISOString(), phoneNumber: '+2222222222' },
];

const messageFormSchema = z.object({
  sessionId: z.string().min(1, "Debes seleccionar una sesión"),
  recipientPhoneNumber: z.string()
    .min(1, "El número de teléfono es obligatorio")
    .regex(/^\+\d+$/, "Debe ser un número de teléfono válido con código de país (ej. +1234567890)"),
  messageType: z.string().min(1, "Debes seleccionar un tipo de mensaje"),
  messageText: z.string().min(1, "El mensaje no puede estar vacío"),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export default function EnviarMensajePage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const { toast } = useToast();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      sessionId: '',
      recipientPhoneNumber: '',
      messageType: 'text',
      messageText: '',
    },
  });

  useEffect(() => {
    // Simular carga de sesiones
    const timer = setTimeout(() => {
      setSessions(MOCK_SESSIONS); // Cargar las sesiones de ejemplo
      setIsLoadingSessions(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: MessageFormValues) => {
    console.log('Form data submitted:', data);
    // Aquí iría la lógica para enviar el mensaje a través del backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada a API
    toast({
      title: "Mensaje Enviado (Simulación)",
      description: `Mensaje enviado a ${data.recipientPhoneNumber} usando la sesión ${data.sessionId}.`,
    });
    // Opcional: resetear el formulario después de enviar
    // reset(); 
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Formulario restablecido",
      description: "Se han limpiado los campos del formulario.",
    });
  };
  
  const noSessionsAvailable = !isLoadingSessions && sessions.length === 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-primary mb-8">Enviar mensaje</h1>
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Enviar mensaje de WhatsApp</CardTitle>
          <CardDescription>Enviar un mensaje a cualquier número de WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="sessionId">Sesión de WhatsApp</Label>
              <Controller
                name="sessionId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingSessions || noSessionsAvailable || isSubmitting}
                  >
                    <SelectTrigger id="sessionId" aria-label="Seleccionar sesión de WhatsApp">
                      <SelectValue placeholder={isLoadingSessions ? "Cargando sesiones..." : (noSessionsAvailable ? "No hay sesiones disponibles" : "Seleccionar una sesión")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSessions ? (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                      ) : sessions.length > 0 ? (
                        sessions.map(session => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name} ({session.phoneNumber || 'No conectado'})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-sessions" disabled>No hay sesiones disponibles</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {noSessionsAvailable && !errors.sessionId && (
                <p className="text-sm text-destructive mt-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  No hay sesiones conectadas. Por favor, conecta una sesión en la pestaña 'Sesiones'.
                </p>
              )}
              {errors.sessionId && <p className="text-sm text-destructive mt-1">{errors.sessionId.message}</p>}
            </div>

            <div>
              <Label htmlFor="recipientPhoneNumber">Número de teléfono del destinatario</Label>
              <Controller
                name="recipientPhoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="recipientPhoneNumber"
                    placeholder="p. ej. +1234567890"
                    {...field}
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground mt-1">Incluir código de país sin espacios ni caracteres especiales.</p>
              {errors.recipientPhoneNumber && <p className="text-sm text-destructive mt-1">{errors.recipientPhoneNumber.message}</p>}
            </div>

            <div>
              <Label htmlFor="messageType">Tipo de mensaje</Label>
              <Controller
                name="messageType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <SelectTrigger id="messageType" aria-label="Seleccionar tipo de mensaje">
                      <SelectValue placeholder="Seleccionar tipo de mensaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mensaje de texto
                        </div>
                      </SelectItem>
                      {/* Aquí se podrían añadir más tipos de mensajes en el futuro (imagen, documento, etc.) */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.messageType && <p className="text-sm text-destructive mt-1">{errors.messageType.message}</p>}
            </div>

            <div>
              <Label htmlFor="messageText">Mensaje</Label>
              <Controller
                name="messageText"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="messageText"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    {...field}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.messageText && <p className="text-sm text-destructive mt-1">{errors.messageText.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restablecimiento
              </Button>
              <Button type="submit" disabled={isSubmitting || (noSessionsAvailable && sessions.length === 0)} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
