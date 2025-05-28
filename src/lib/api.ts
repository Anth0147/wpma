import type { Conversation, Message } from '@/types';

const API_BASE_URL = 'https://a37f811c-ce93-4795-94b3-12f3d7994297-00-1pei85ipky8kg.kirk.replit.dev';

export async function fetchConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE_URL}/conversations`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
}

export async function createConversation(newConversation: Omit<Conversation, 'id'> & { id?: string }): Promise<Conversation> {
   // The backend might assign an ID, or we might need to generate one if it's a simple JSON store.
   // For json-server, POSTing without an ID usually results in the server generating one.
   // If the ID is optional and we provide it, it will use ours.
   // Let's assume the backend generates the ID if not provided or can take a client-generated one.
   const payload = { ...newConversation, id: newConversation.id || Date.now().toString() };

  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    // Try to get more error info from backend
    const errorBody = await response.text();
    console.error("Error creating conversation:", errorBody);
    throw new Error(`Failed to create conversation. Status: ${response.status}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function sendMessage(conversationId: string, updatedConversation: Conversation): Promise<Conversation> {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedConversation),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error sending message / updating conversation:", errorBody);
    throw new Error(`Failed to send message / update conversation. Status: ${response.status}. Body: ${errorBody}`);
  }
  return response.json();
}
