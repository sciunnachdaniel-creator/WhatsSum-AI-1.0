import { Conversation, User } from './types';

export const USERS: Record<string, User> = {
  'user1': { id: 'user1', name: 'Mamma', avatar: 'https://picsum.photos/id/64/200/200', status: 'online' },
  'user2': { id: 'user2', name: 'Marco (Lavoro)', avatar: 'https://picsum.photos/id/107/200/200', status: 'busy' },
  'user3': { id: 'user3', name: 'Calcetto Giovedì', avatar: 'https://picsum.photos/id/75/200/200', status: 'offline' },
  'user4': { id: 'user4', name: 'Giulia', avatar: 'https://picsum.photos/id/342/200/200', status: 'online' },
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userId: 'user1',
    user: USERS['user1'],
    unreadCount: 3,
    lastMessageTime: '10:30',
    messages: [
      { id: 'm1', senderId: 'user1', text: 'Ciao amore, tutto bene?', timestamp: '10:28', isRead: false, type: 'text' },
      { id: 'm2', senderId: 'user1', text: 'Ti ho lasciato le lasagne in frigo.', timestamp: '10:29', isRead: false, type: 'text' },
      { id: 'm3', senderId: 'user1', text: 'Chiamami quando hai un attimo!', timestamp: '10:30', isRead: false, type: 'text' },
    ]
  },
  {
    id: 'c2',
    userId: 'user2',
    user: USERS['user2'],
    unreadCount: 5,
    lastMessageTime: '09:15',
    messages: [
      { id: 'm4', senderId: 'user2', text: 'Hai visto il report?', timestamp: '09:00', isRead: false, type: 'text' },
      { id: 'm5', senderId: 'user2', text: 'Dobbiamo aggiornare le slide per il cliente.', timestamp: '09:05', isRead: false, type: 'text' },
      { id: 'm6', senderId: 'user2', text: 'Mi serve entro le 14.', timestamp: '09:06', isRead: false, type: 'text' },
      { id: 'm7', senderId: 'user2', text: 'Anche i dati di vendita di Q3.', timestamp: '09:10', isRead: false, type: 'text' },
      { id: 'm8', senderId: 'user2', text: 'Fammi sapere se hai problemi.', timestamp: '09:15', isRead: false, type: 'text' },
    ]
  },
  {
    id: 'c3',
    userId: 'user3',
    user: USERS['user3'],
    unreadCount: 0,
    lastMessageTime: 'Ieri',
    messages: [
      { id: 'm9', senderId: 'user3', text: 'Ragazzi chi c\'è stasera?', timestamp: '18:00', isRead: true, type: 'text' },
      { id: 'm10', senderId: 'me', text: 'Io ci sono!', timestamp: '18:05', isRead: true, type: 'text' },
    ]
  },
  {
    id: 'c4',
    userId: 'user4',
    user: USERS['user4'],
    unreadCount: 2,
    lastMessageTime: '08:45',
    messages: [
      { id: 'm11', senderId: 'user4', text: 'Hai preso i biglietti per il cinema?', timestamp: '08:40', isRead: false, type: 'text' },
      { id: 'm12', senderId: 'user4', text: 'Preferirei lo spettacolo delle 21.', timestamp: '08:45', isRead: false, type: 'text' },
    ]
  }
];