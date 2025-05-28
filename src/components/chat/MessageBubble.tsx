import type { Message } from '@/types';
import { MY_USERNAME } from '@/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMyMessage = message.sender === MY_USERNAME;
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn('flex items-end space-x-2 mb-4', isMyMessage ? 'justify-end' : 'justify-start')}>
      {!isMyMessage && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
            {getInitials(message.sender)}
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        'max-w-xs md:max-w-md lg:max-w-lg rounded-xl shadow-sm',
        isMyMessage ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
      )}>
        <CardContent className="p-3">
          {!isMyMessage && (
            <p className="text-xs font-medium mb-1 text-muted-foreground">{message.sender}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          <p className={cn(
            'text-xs mt-1 text-right',
            isMyMessage ? 'text-primary-foreground/70' : 'text-muted-foreground/80'
          )}>
            {format(parseISO(message.timestamp), 'p')}
          </p>
        </CardContent>
      </Card>
      {isMyMessage && (
         <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="text-xs bg-accent text-accent-foreground">
            {getInitials(MY_USERNAME)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
