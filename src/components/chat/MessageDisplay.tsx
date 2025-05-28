'use client';
import type { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  conversationId: string | null;
}

export function MessageDisplay({ messages, isLoading, conversationId }: MessageDisplayProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, conversationId]);


  if (isLoading) {
     return (
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`flex items-end space-x-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            <div className={`p-3 rounded-xl max-w-xs md:max-w-md lg:max-w-lg ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/20'}`}>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>
        ))}
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Select a conversation to start chatting.</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Send one to start the conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </ScrollArea>
  );
}
