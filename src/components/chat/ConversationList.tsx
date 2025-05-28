import type { Conversation } from '@/types';
import { ConversationListItem } from './ConversationListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading: boolean;
}

export function ConversationList({ conversations, selectedConversationId, onSelectConversation, isLoading }: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return <p className="p-4 text-center text-muted-foreground">No conversations yet. Start a new one!</p>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {conversations.map((convo) => (
          <ConversationListItem
            key={convo.id}
            conversation={convo}
            onSelectConversation={onSelectConversation}
            isSelected={selectedConversationId === convo.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
