'use client';
import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1"
          disabled={disabled}
          aria-label="Message input"
        />
        <Button type="submit" size="icon" variant="ghost" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={disabled || !messageText.trim()}>
          <Send size={20} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
