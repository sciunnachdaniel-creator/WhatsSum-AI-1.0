import React from 'react';
import { Conversation } from '../types';
import { Circle, CheckCheck } from 'lucide-react';

interface ChatListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, activeId, onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">Messaggi</h2>
      </div>
      
      <div className="flex-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
              activeId === conv.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={conv.user.avatar}
                alt={conv.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conv.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {conv.unreadCount}
                </div>
              )}
            </div>
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                <span className={`text-xs ${conv.unreadCount > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {conv.lastMessageTime}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                 {conv.unreadCount === 0 && conv.messages.length > 0 && conv.messages[conv.messages.length - 1].senderId === 'me' && (
                    <CheckCheck className="w-4 h-4 text-blue-500 mr-1" />
                 )}
                <p className="truncate flex-1">
                  {conv.messages.length > 0 
                    ? conv.messages[conv.messages.length - 1].text 
                    : <span className="italic text-gray-400">Nessun messaggio</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};