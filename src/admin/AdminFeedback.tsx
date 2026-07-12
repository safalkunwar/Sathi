import React, { useState, useEffect } from 'react';
import { MessageSquare, Bell, Star } from 'lucide-react';
import { firestore } from '../services/firestore';
import { Notification } from '../types';

interface FeedbackItem {
  id: string;
  user: string;
  type: 'feedback' | 'bug' | 'guide_feedback';
  message: string;
  date: string;
  rating?: number;
  status: 'new' | 'read' | 'resolved';
  userId: string;
}

export function AdminFeedback() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const unsubNotifications = firestore.subscribe<Notification>('notifications', { orderByField: 'timestamp', orderDirection: 'desc' }, (items) => {
      setNotifications(items);
    });

    const unsubFeedback = firestore.subscribe<FeedbackItem>('feedback', { orderByField: 'date', orderDirection: 'desc' }, (items) => {
      setFeedbackItems(items);
    });

    return () => {
      unsubNotifications();
      unsubFeedback();
    };
  }, []);

  const handleReply = async (id: string) => {
    await firestore.updateDocument(`feedback/${id}`, { status: 'read' });
  };

  const handleResolve = async (id: string) => {
    await firestore.updateDocument(`feedback/${id}`, { status: 'resolved' });
  };

  const handleMarkAllRead = async () => {
    for (const n of notifications) {
      if (n.id && !n.isRead) {
        await firestore.updateDocument(`notifications/${n.id}`, { isRead: true });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Feedback & Support */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col h-[70vh]">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-semibold text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#C8A25E]" /> User Feedback & Reports</h3>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {feedbackItems.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No feedback yet.</p>}
          {feedbackItems.map(item => (
            <div key={item.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <span className="font-medium text-sm text-white">{item.user}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.type === 'bug' ? 'bg-red-500/10 text-red-500' : 'bg-[#C8A25E]/10 text-[#C8A25E]'}`}>
                       {item.type}
                     </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.date}</span>
               </div>
               {item.rating && (
                 <div className="flex items-center gap-1 mb-2">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-3 h-3 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                   ))}
                 </div>
               )}
               <p className="text-sm text-gray-300 leading-relaxed">{item.message}</p>
               <div className="mt-3 flex gap-2">
                 <button onClick={() => handleReply(item.id)} className="text-xs font-medium text-[#C8A25E] hover:underline">Reply</button>
                 <button onClick={() => handleResolve(item.id)} className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Mark Resolved</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Notifications */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col h-[70vh]">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-[#C8A25E]" /> System Notifications</h3>
          <button onClick={handleMarkAllRead} className="text-xs text-gray-500 hover:text-white transition-colors">Mark all read</button>
        </div>
        <div className="divide-y divide-[#222] overflow-y-auto">
          {notifications.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No notifications yet.</p>}
          {notifications.map(notification => (
            <div key={notification.id} className={`p-5 hover:bg-[#1a1a1a] transition-colors ${!notification.isRead ? 'bg-[#C8A25E]/5' : ''}`}>
               <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{notification.title}</h4>
                  <span className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</span>
               </div>
               <p className="text-sm text-gray-400">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
