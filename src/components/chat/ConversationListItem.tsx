import type { Conversation } from '@/types';
import { MY_USERNAME } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';

interface ConversationListItemProps {
  conversation: Conversation;
  onSelectConversation: (id: string) => void;
  isSelected: boolean;
}

export function ConversationListItem({ conversation, onSelectConversation, isSelected }: ConversationListItemProps) {
  const otherParticipants = conversation.participants.filter(p => p !== MY_USERNAME);
  const displayName = otherParticipants.join(', ') || 'N/A';
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card
      className={`mb-2 cursor-pointer hover:shadow-md transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}`}
      onClick={() => onSelectConversation(conversation.id)}
      aria-selected={isSelected}
    >
      <CardContent className="p-3 flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {/* Placeholder for potential future avatar image */}
          {/* <AvatarImage src={undefined} alt={displayName} /> */}
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {displayName !== 'N/A' ? getInitials(displayName) : <MessageSquare size={20} />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-card-foreground">{displayName}</p>
          {lastMessage && (
            <p className="text-xs text-muted-foreground truncate">
              {lastMessage.sender === MY_USERNAME ? 'You: ' : ''}{lastMessage.text}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
