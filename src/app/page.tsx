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

export default function ChatPage() {
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
      // Filter conversations to include only those where MY_USERNAME is a participant
      const myConversations = data.filter(convo => convo.participants.includes(MY_USERNAME));
      setConversations(myConversations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({ title: "Error", description: `Failed to load conversations: ${errorMessage}`, variant: "destructive" });
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
      id: Date.now().toString(), // Client-generated ID, backend might re-assign
      sender: MY_USERNAME,
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
    };

    try {
      // Optimistically update UI
      setConversations(prev => prev.map(c => c.id === selectedConversationId ? updatedConversation : c));
      
      await apiSendMessage(selectedConversationId, updatedConversation);
      // Optionally, re-fetch or update with server response if IDs change, etc.
      // For now, optimistic update is fine given the backend might be simple.
      // loadConversations(); // Or update specific conversation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to send message: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to send message: ${errorMessage}`, variant: "destructive" });
      // Revert optimistic update if needed
      setConversations(prev => prev.map(c => c.id === selectedConversationId ? currentConversation : c));
    }
  };

  const handleCreateConversation = async (recipientName: string, initialMessageText: string) => {
    if (recipientName === MY_USERNAME) {
        toast({ title: "Error", description: "You cannot start a conversation with yourself.", variant: "destructive" });
        return;
    }

    const existingConversation = conversations.find(c => 
        c.participants.includes(recipientName) && c.participants.includes(MY_USERNAME) && c.participants.length === 2
    );

    if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
        toast({ title: "Info", description: `Conversation with ${recipientName} already exists. Switched to it.`, variant: "default" });
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
      // The API for createConversation might need an ID or might generate one.
      // Let's assume it can take an ID, or generates one if not provided.
      // The api.ts createConversation handles this.
      const createdConvo = await createConversation(newConversationData);
      setConversations(prev => [...prev, createdConvo]);
      setSelectedConversationId(createdConvo.id);
      toast({ title: "Success", description: `Conversation with ${recipientName} created.`, variant: "default" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to create conversation: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to create conversation: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessages = conversations.find(c => c.id === selectedConversationId)?.messages || [];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <Card className="w-1/3 max-w-sm m-2 rounded-lg shadow-lg flex flex-col border-border overflow-hidden">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-primary">Conversations</h2>
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

      <Separator orientation="vertical" className="h-[calc(100vh-1rem)] self-center" />

      <main className="flex-1 flex flex-col m-2 ml-0 overflow-hidden">
         <Card className="flex-1 flex flex-col rounded-lg shadow-lg border-border overflow-hidden">
            {selectedConversationId && conversations.find(c=>c.id === selectedConversationId) ? (
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-primary">
                        {conversations.find(c=>c.id === selectedConversationId)?.participants.filter(p => p !== MY_USERNAME).join(', ') || "Conversation"}
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
