import React from 'react';
import { MessageSquare, Bell, Star } from 'lucide-react';

const MOCK_FEEDBACK = [
  { id: 1, user: 'Sarah L.', type: 'feedback', message: 'The app is great, but I wish I could filter guides by language spoken directly on the map.', date: 'Today, 2:30 PM', rating: 4 },
  { id: 2, user: 'John Doe', type: 'bug', message: 'Payment gateway crashed when I tried to use my international card.', date: 'Yesterday, 10:15 AM', rating: null },
  { id: 3, user: 'Pasang D.', type: 'guide_feedback', message: 'I need a way to block users who are unresponsive after booking.', date: 'Nov 20, 2023', rating: null },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'System Update Completed', description: 'v1.2.4 deployed successfully.', time: '1 hour ago', read: false },
  { id: 2, title: 'New Guide Applied', description: 'Priya Gurung applied to be a guide in Kathmandu.', time: '3 hours ago', read: false },
  { id: 3, title: 'High Traffic Alert', description: 'Server load increased by 40% in the last hour.', time: '5 hours ago', read: true },
];

export function AdminFeedback() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Feedback & Support */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col h-[70vh]">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-semibold text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#C8A25E]" /> User Feedback & Reports</h3>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {MOCK_FEEDBACK.map(item => (
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
                 <button className="text-xs font-medium text-[#C8A25E] hover:underline">Reply</button>
                 <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Mark Resolved</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Notifications */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col h-[70vh]">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-[#C8A25E]" /> System Notifications</h3>
          <button className="text-xs text-gray-500 hover:text-white transition-colors">Mark all read</button>
        </div>
        <div className="divide-y divide-[#222] overflow-y-auto">
          {MOCK_NOTIFICATIONS.map(notification => (
            <div key={notification.id} className={`p-5 hover:bg-[#1a1a1a] transition-colors ${!notification.read ? 'bg-[#C8A25E]/5' : ''}`}>
               <div className="flex justify-between items-start mb-1">
                 <h4 className={`text-sm ${!notification.read ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{notification.title}</h4>
                 <span className="text-xs text-gray-500">{notification.time}</span>
               </div>
               <p className="text-sm text-gray-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
