import React, { useState, useEffect, useRef } from 'react';
import { ChatList } from './components/ChatList';
import { SummaryModal } from './components/SummaryModal';
import { AudioRecorder } from './components/AudioRecorder';
import { INITIAL_CONVERSATIONS } from './constants';
import { Conversation, Message } from './types';
import { summarizeUnreadMessages } from './services/geminiService';
import { Send, Menu, ArrowLeft, BrainCircuit, CheckCheck } from 'lucide-react';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Mobile responsiveness state
  const [showMobileList, setShowMobileList] = useState(true);

  // Summary State
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Message Input State
  const [inputText, setInputText] = useState("");

  const activeConversation = conversations.find(c => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message or chat change
  useEffect(() => {
    if (activeChatId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, conversations]);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowMobileList(false); // Hide list on mobile when chat selected
    
    // Mark as read immediately when opened (Mock logic)
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return {
           ...c,
           unreadCount: 0,
           messages: c.messages.map(m => ({ ...m, isRead: true }))
        };
      }
      return c;
    }));
  };

  const handleBackToSafe = () => {
    setActiveChatId(null);
    setShowMobileList(true);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'text'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessageTime: newMessage.timestamp
        };
      }
      return c;
    }));

    setInputText("");
  };

  const handleTranscription = (text: string) => {
    setInputText(text);
  };

  const handleSummarize = async () => {
    setIsSummaryModalOpen(true);
    setIsSummarizing(true);
    setSummaryText("");

    // Prepare data for Gemini
    // Filter only conversations with unread messages (or use the initial state logic if they were marked read locally)
    // For this demo, we will use the "mock initial state" or track unread logic.
    // However, since handleSelectChat clears unread, let's gather conversations that HAD unread count > 0 
    // We can simulate this by filtering the CURRENT state for unreadCount > 0.
    
    const unreadConvos = conversations.filter(c => c.unreadCount > 0).map(c => ({
      senderName: c.user.name,
      messages: c.messages.filter(m => !m.isRead).map(m => m.text)
    }));

    if (unreadConvos.length === 0) {
      setSummaryText("Non hai nuovi messaggi da leggere! 🎉");
      setIsSummarizing(false);
      return;
    }

    const result = await summarizeUnreadMessages(unreadConvos);
    setSummaryText(result);
    setIsSummarizing(false);
  };

  return (
    <div className="flex h-screen bg-[#d1d7db] relative overflow-hidden">
      {/* Summary Modal */}
      <SummaryModal 
        isOpen={isSummaryModalOpen} 
        onClose={() => setIsSummaryModalOpen(false)} 
        summary={summaryText}
        isLoading={isSummarizing}
      />

      {/* Decorative Green Background Band */}
      <div className="absolute top-0 w-full h-32 bg-[#00a884] z-0"></div>

      <div className="w-full h-full max-w-[1600px] mx-auto z-10 p-0 md:p-4 flex">
        <div className="bg-white w-full h-full rounded-none md:rounded-lg shadow-lg flex overflow-hidden">
          
          {/* Sidebar / Chat List */}
          <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[350px] lg:w-[400px] bg-white border-r border-gray-200 transition-all`}>
            {/* Sidebar Header */}
            <div className="bg-gray-100 p-3 py-4 flex justify-between items-center border-b border-gray-200">
               <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                 <img src="https://picsum.photos/id/65/200/200" alt="Me" className="w-full h-full object-cover" />
               </div>
               <div className="flex gap-4">
                  {/* AI Action Button */}
                  <button 
                    onClick={handleSummarize}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
                    title="Riassumi Messaggi Non Letti"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span className="hidden lg:inline">Gemini Check</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Menu className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <ChatList 
              conversations={conversations} 
              activeId={activeChatId} 
              onSelect={handleSelectChat} 
            />
          </div>

          {/* Chat Window */}
          <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#efeae2] relative`}>
             {/* Chat Background Pattern would go here */}
             
             {activeConversation ? (
               <>
                {/* Chat Header */}
                <div className="bg-gray-100 p-3 py-3 flex items-center border-b border-gray-200">
                   <button onClick={handleBackToSafe} className="md:hidden mr-2 text-gray-600">
                     <ArrowLeft className="w-6 h-6" />
                   </button>
                   <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                     <img src={activeConversation.user.avatar} alt={activeConversation.user.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h2 className="font-semibold text-gray-800">{activeConversation.user.name}</h2>
                      <p className="text-xs text-gray-500 truncate">
                        {activeConversation.user.status === 'online' ? 'Online' : 'Ultimo accesso oggi alle 10:00'}
                      </p>
                   </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
                  {activeConversation.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2 px-3 shadow-sm relative ${
                         msg.senderId === 'me' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'
                       }`}>
                          <p className="text-gray-800 text-sm md:text-base leading-relaxed break-words">{msg.text}</p>
                          <div className="flex justify-end items-center gap-1 mt-1">
                            <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                            {msg.senderId === 'me' && (
                              <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`} />
                            )}
                          </div>
                       </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-gray-100 p-3 px-4">
                  <div className="flex items-center gap-2">
                     <div className="flex-1 bg-white rounded-lg flex items-center shadow-sm border border-gray-200 px-2">
                        <input 
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Scrivi un messaggio" 
                          className="flex-1 py-3 px-2 text-gray-700 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                        />
                     </div>
                     
                     {/* Microphone / Send Button Logic */}
                     {inputText.trim() ? (
                        <button 
                          onClick={handleSendMessage}
                          className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition-colors shadow-sm"
                        >
                          <Send className="w-5 h-5 ml-0.5" />
                        </button>
                     ) : (
                        <AudioRecorder onTranscription={handleTranscription} isSending={false} />
                     )}
                  </div>
                </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f0f2f5] text-center border-b-[6px] border-[#25d366]">
                  <div className="w-64 h-64 opacity-60 mb-8 flex items-center justify-center bg-gray-100 rounded-full">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" alt="WhatsApp" className="w-32 h-32 opacity-50 grayscale" />
                  </div>
                  <h1 className="text-3xl font-light text-gray-700 mb-4">WhatsSum AI</h1>
                  <p className="text-gray-500 max-w-md">
                    Invia e ricevi messaggi senza dover tenere il telefono connesso. <br/>
                    Usa <strong>Gemini Check</strong> per riassumere velocemente le chat non lette.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                    <BrainCircuit className="w-3 h-3" />
                    <span>Powered by Google Gemini 2.5 Flash</span>
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}