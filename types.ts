export interface Message {
  id: string;
  senderId: string; // 'me' or user id
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'audio';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

export interface Conversation {
  id: string;
  userId: string;
  user: User;
  messages: Message[];
  unreadCount: number;
  lastMessageTime: string;
}

export interface SummaryResult {
  summary: string;
  timestamp: number;
}