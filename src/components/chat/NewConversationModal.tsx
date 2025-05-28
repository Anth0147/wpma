'use client';
import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

interface NewConversationModalProps {
  onCreateConversation: (recipientName: string, initialMessage: string) => void;
  disabled?: boolean;
}

export function NewConversationModal({ onCreateConversation, disabled }: NewConversationModalProps) {
  const [recipientName, setRecipientName] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (recipientName.trim() && initialMessage.trim()) {
      onCreateConversation(recipientName.trim(), initialMessage.trim());
      setRecipientName('');
      setInitialMessage('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10" disabled={disabled}>
          <PlusCircle size={18} className="mr-2" /> New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Enter the recipient&apos;s name and your first message.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientName" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Bob"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initialMessage" className="text-right">
                Message
              </Label>
              <Textarea
                id="initialMessage"
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                className="col-span-3"
                placeholder="Your initial message..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!recipientName.trim() || !initialMessage.trim()}>
              Start Conversation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
