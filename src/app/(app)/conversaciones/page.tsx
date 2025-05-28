
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Conversation, Message } from '@/types';
import { MY_USERNAME } from '@/types';
import { fetchConversations, createConversation, sendMessage as apiSendMessage } from '@/lib/api';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageDisplay } from '@/components/chat/MessageDisplay';
import { MessageInput } from '@/components/chat/MessageInput';
import { NewConversationModal } from '@/components/chat/NewConversationModal';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function ConversacionesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      const myConversations = data.filter(convo => convo.participants.includes(MY_USERNAME));
      setConversations(myConversations);
    } catch (err) {
      const baseTitle = "Error de Red";
      let descriptionMessage = "Ocurrió un error desconocido al cargar las conversaciones.";
      
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('failed to fetch')) {
          descriptionMessage = 'No se pudo conectar al servidor de chat. Verifica que el backend (Replit) esté activo y accesible. Revisa la consola del navegador (Cmd+Opt+J o Ctrl+Shift+J) para detalles técnicos como errores CORS.';
        } else {
          descriptionMessage = `Error al cargar conversaciones: ${err.message}`;
        }
      }
      setError(descriptionMessage);
      toast({ 
        title: baseTitle, 
        description: descriptionMessage, 
        variant: "destructive",
        duration: 10000 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedConversationId) return;

    const currentConversation = conversations.find(c => c.id === selectedConversationId);
    if (!currentConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: MY_USERNAME,
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
    };

    try {
      setConversations(prev => prev.map(c => c.id === selectedConversationId ? updatedConversation : c));
      await apiSendMessage(selectedConversationId, updatedConversation);
    } catch (err) {
      const baseTitle = "Error al Enviar Mensaje";
      let descriptionMessage = "No se pudo enviar el mensaje. Intenta de nuevo.";
      
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('failed to fetch')) {
          descriptionMessage = 'Error de red al enviar mensaje. Verifica tu conexión y que el backend (Replit) esté activo. Revisa la consola del navegador para más detalles.';
        } else {
          descriptionMessage = `Error al enviar mensaje: ${err.message}`;
        }
      }
      setError(descriptionMessage);
      toast({ 
        title: baseTitle, 
        description: descriptionMessage, 
        variant: "destructive",
        duration: 10000 
      });
      setConversations(prev => prev.map(c => c.id === selectedConversationId ? currentConversation : c));
    }
  };

  const handleCreateConversation = async (recipientName: string, initialMessageText: string) => {
    if (recipientName === MY_USERNAME) {
        toast({ title: "Error", description: "No puedes iniciar una conversación contigo mismo.", variant: "destructive" });
        return;
    }

    const existingConversation = conversations.find(c => 
        c.participants.includes(recipientName) && c.participants.includes(MY_USERNAME) && c.participants.length === 2
    );

    if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        toast({ title: "Información", description: `La conversación con ${recipientName} ya existe. Se ha cambiado a ella.`, variant: "default" });
        return;
    }

    const initialMessage: Message = {
      id: Date.now().toString(),
      sender: MY_USERNAME,
      text: initialMessageText,
      timestamp: new Date().toISOString(),
    };

    const newConversationData: Omit<Conversation, 'id'> = {
      participants: [MY_USERNAME, recipientName],
      messages: [initialMessage],
    };
    
    setIsLoading(true);
    try {
      const createdConvo = await createConversation(newConversationData);
      setConversations(prev => [...prev, createdConvo]);
      setSelectedConversationId(createdConvo.id);
      toast({ title: "Éxito", description: `Conversación con ${recipientName} creada.`, variant: "default" });
    } catch (err) {
      const baseTitle = "Error al Crear Conversación";
      let descriptionMessage = "No se pudo crear la conversación. Intenta de nuevo.";
      
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('failed to fetch')) {
          descriptionMessage = 'Error de red al crear conversación. Verifica tu conexión y que el backend (Replit) esté activo. Revisa la consola del navegador para más detalles.';
        } else {
          descriptionMessage = `Error al crear conversación: ${err.message}`;
        }
      }
      setError(descriptionMessage); 
      toast({ 
        title: baseTitle, 
        description: descriptionMessage, 
        variant: "destructive",
        duration: 10000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessages = conversations.find(c => c.id === selectedConversationId)?.messages || [];

  return (
    <div className="flex h-[calc(100vh-var(--header-height,4rem)-2rem)]"> {/* Adjust height based on header/padding */}
      <Card className="w-1/3 max-w-sm rounded-lg shadow-lg flex flex-col border-border overflow-hidden h-full">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">Conversaciones</h2>
              <span className="text-sm text-muted-foreground">Usuario: {MY_USERNAME}</span>
            </div>
          </div>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoading && conversations.length === 0}
          />
          <div className="p-4 border-t">
            <NewConversationModal onCreateConversation={handleCreateConversation} disabled={isLoading}/>
          </div>
        </CardContent>
      </Card>

      <Separator orientation="vertical" className="h-[calc(100%-1rem)] self-center mx-2" />

      <main className="flex-1 flex flex-col overflow-hidden h-full">
         <Card className="flex-1 flex flex-col rounded-lg shadow-lg border-border overflow-hidden">
            {selectedConversationId && conversations.find(c=>c.id === selectedConversationId) ? (
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-primary">
                        {conversations.find(c=>c.id === selectedConversationId)?.participants.filter(p => p !== MY_USERNAME).join(', ') || "Conversación"}
                    </h3>
                </div>
            ) : null}
            <MessageDisplay messages={currentMessages} isLoading={isLoading && selectedConversationId !== null && currentMessages.length === 0} conversationId={selectedConversationId} />
            {selectedConversationId && (
              <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
            )}
        </Card>
      </main>
    </div>
  );
}
