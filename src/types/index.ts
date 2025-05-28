export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string; // ISO string date
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
}

// Constant for the current user's name
export const MY_USERNAME = "ChatUser";
