import React, { useState, useEffect, useMemo } from 'react';
import { Search, Send, Image as ImageIcon, Phone, Video, Info, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { firestore } from '../../services/firestore';
import { COMPANIONS } from '../../data';

export const MessagesTab: React.FC = () => {
  const { currentUser, getConversationId } = useAppContext();
  const { showToast } = useToast();
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [localConversations, setLocalConversations] = useState<Record<string, { participantIds: string[]; lastMessage?: any; unreadCount?: number }>>({});
  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({});
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const companionIds = useMemo(() => {
    if (!currentUser) return [];
    const companions = COMPANIONS.map(c => c.id);
    return companions;
  }, [currentUser]);

  const conversations = useMemo(() => {
    return Object.values(localConversations).sort((a, b) => {
      const aTime = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTime = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTime - aTime;
    });
  }, [localConversations]);

  const messages = useMemo(() => {
    if (!selectedConvo) return [];
    return localMessages[selectedConvo] || [];
  }, [selectedConvo, localMessages]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubs: (() => void)[] = [];

    companionIds.forEach((companionId) => {
      const convoId = getConversationId(companionId);
      if (!convoId) return;

      const convoUnsub = firestore.subscribeDocument(`conversations/${convoId}`, (convo) => {
        if (convo) {
          setLocalConversations(prev => ({
            ...prev,
            [convoId]: {
              participantIds: (convo as any).participantIds || [currentUser.id, companionId],
              lastMessage: (convo as any).lastMessage,
              unreadCount: (convo as any).unreadCount || 0,
            },
          }));
        } else {
          const fallback = {
            participantIds: [currentUser.id, companionId],
            unreadCount: 0,
          };
          setLocalConversations(prev => ({
            ...prev,
            [convoId]: fallback,
          }));
        }
      });
      unsubs.push(convoUnsub);

      const msgUnsub = firestore.subscribe<any>(
        'messages',
        { where: [{ field: 'conversationId', operator: '==', value: convoId }], orderByField: 'timestamp', orderDirection: 'asc' },
        (items) => {
          setLocalMessages(prev => ({
            ...prev,
            [convoId]: items,
          }));
          setAllMessages(items);
        }
      );
      unsubs.push(msgUnsub);
    });

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [currentUser, companionIds, getConversationId]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser || !selectedConvo) return;
    const text = inputText.trim();
    setInputText('');

    await firestore.setDocument(`messages/${`msg-${Date.now()}`}`, {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvo,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    const convo = localConversations[selectedConvo];
    await firestore.setDocument(`conversations/${selectedConvo}`, {
      participantIds: convo?.participantIds || [currentUser.id, companionIds[0] || ''],
      lastMessage: {
        id: `msg-${Date.now()}`,
        conversationId: selectedConvo,
        senderId: currentUser.id,
        text,
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    });
  };

  const currentChat = conversations.find(c => c.id === selectedConvo);
  const companionId = currentChat?.participantIds.find((id: string) => id !== currentUser?.id);
  const companion = COMPANIONS.find(c => c.id === companionId);

  return (
    <div className="h-[calc(100vh-160px)] md:h-[700px] flex rounded-3xl overflow-hidden border border-[#2A2D31] bg-[#0F1113]">
      {/* Sidebar */}
      <div className={`w-full md:w-80 flex-col border-r border-[#2A2D31] bg-[#17191C] ${selectedConvo ? 'hidden md:flex' : 'flex'}`} role="region" aria-label="Conversations">
        <div className="p-4 border-b border-[#2A2D31]">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9299]" />
            <input type="text" placeholder="Search conversations..." aria-label="Search conversations" className="w-full bg-[#1E2124] text-white border border-[#2A2D31] rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#C8A25E]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 && (
            <div className="p-4 text-sm text-[#8E9299] text-center">No conversations yet.</div>
          )}
          {conversations.map((convo) => {
            const cId = convo.participantIds.find((id: string) => id !== currentUser?.id);
            const comp = COMPANIONS.find(c => c.id === cId);
            if (!comp) return null;

            return (
              <div
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-[#1E2124] transition-colors border-b border-[#2A2D31]/50 ${selectedConvo === convo.id ? 'bg-[#1E2124]' : ''}`}
              >
                <div className="relative">
                  <img src={comp.imageUrl} alt={comp.name} className="w-12 h-12 rounded-full object-cover" />
                  {(convo.unreadCount || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8A25E] text-[#0F1113] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-white truncate">{comp.name}</h4>
                    <span className="text-xs text-[#8E9299]">
                      {convo.lastMessage ? new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${(convo.unreadCount || 0) > 0 ? 'text-white font-medium' : 'text-[#8E9299]'}`}>
                    {convo.lastMessage?.text || 'Tap to chat'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConvo ? (
        <div className="flex-1 flex flex-col bg-[#0F1113]">
          {/* Header */}
          <div className="h-16 border-b border-[#2A2D31] flex items-center justify-between px-6 bg-[#17191C]">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedConvo(null)} className="md:hidden text-[#8E9299] hover:text-white mr-2">
                ←
              </button>
              {companion ? (
                <>
                  <img src={companion.imageUrl} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{companion.name}</h3>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </>
              ) : (
                <h3 className="font-bold text-white text-sm">Conversation</h3>
              )}
            </div>
            <div className="flex items-center gap-4 text-[#8E9299]">
              <Phone onClick={() => showToast('Audio calls coming soon', 'info')} className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <Video onClick={() => showToast('Video calls coming soon', 'info')} className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <Info onClick={() => showToast('User info coming soon', 'info')} className="w-5 h-5 cursor-pointer hover:text-white transition" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe ? 'bg-[#C8A25E] text-[#0F1113] rounded-br-sm' : 'bg-[#1E2124] text-white rounded-bl-sm border border-[#2A2D31]'}`}>
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-[#0F1113]/70' : 'text-[#8E9299]'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 bg-[#17191C] border-t border-[#2A2D31]">
            <div className="flex items-center gap-3">
              <button onClick={() => showToast('Image attachments coming soon', 'info')} className="text-[#8E9299] hover:text-[#C8A25E] transition p-2 bg-[#1E2124] rounded-full">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-[#1E2124] text-white border border-[#2A2D31] rounded-full px-5 py-3 focus:outline-none focus:border-[#C8A25E]"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-12 h-12 bg-[#C8A25E] text-[#0F1113] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B69150] transition-colors"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#0F1113] text-[#8E9299]">
          <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
};