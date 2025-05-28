
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

// Types for WhatsApp Sessions
export interface WhatsAppSession {
  id: string; // Unique identifier, e.g., session_xxxx
  name: string; // User-defined name for the session
  createdAt: string; // ISO string date
  status: 'conectado' | 'desconectado' | 'escaneando_qr' | 'error'; // Status of the session
  phoneNumber?: string; // Associated phone number, if connected
  qrCodeUrl?: string; // URL for the QR code image if status is 'escaneando_qr'
}
