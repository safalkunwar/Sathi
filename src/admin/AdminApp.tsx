import React, { useState } from 'react';
import { Activity, UserCheck, CalendarDays, ShieldAlert, MessageSquare, LogOut } from 'lucide-react';
import * as motion from 'motion/react-client';

import { AdminOverview } from './AdminOverview';
import { AdminGuides } from './AdminGuides';
import { AdminBookings } from './AdminBookings';
import { AdminSecurity } from './AdminSecurity';
import { AdminFeedback } from './AdminFeedback';

export function AdminApp() {
  const [activeTab, setActiveTab] = useState<'overview' | 'guides' | 'bookings' | 'security' | 'feedback'>('overview');

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#222] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#222]">
           <span className="text-xl font-semibold tracking-tight text-white">SATHI <span className="text-[#C8A25E]">Admin</span></span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
           <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}>
             <Activity className="w-4 h-4" /> Overview
           </button>
           <button onClick={() => setActiveTab('guides')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'guides' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}>
             <UserCheck className="w-4 h-4" /> Guides & Verification
           </button>
           <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}>
             <CalendarDays className="w-4 h-4" /> Bookings
           </button>
           <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}>
             <ShieldAlert className="w-4 h-4" /> Security & SOS
           </button>
           <button onClick={() => setActiveTab('feedback')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'feedback' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white hover:bg-[#222]'}`}>
             <MessageSquare className="w-4 h-4" /> Feedback & Alerts
           </button>
        </nav>
        <div className="p-4 border-t border-[#222]">
           <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Exit to App
           </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
         {/* Mobile Header */}
         <div className="md:hidden h-14 bg-[#111111] border-b border-[#222] flex items-center justify-between px-4 sticky top-0 z-50">
            <span className="font-semibold text-white">SATHI Admin</span>
            <div className="flex gap-2">
               <button onClick={() => setActiveTab('security')} className="p-2 text-red-500 hover:text-red-400"><ShieldAlert className="w-5 h-5" /></button>
               <a href="#" className="p-2 text-gray-400 hover:text-white"><LogOut className="w-5 h-5" /></a>
            </div>
         </div>
         
         {/* Mobile Nav Tabs */}
         <div className="md:hidden flex overflow-x-auto bg-[#111] border-b border-[#222] hide-scrollbar">
           {['overview', 'guides', 'bookings', 'security', 'feedback'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-xs font-medium whitespace-nowrap capitalize ${activeTab === tab ? 'text-[#C8A25E] border-b-2 border-[#C8A25E]' : 'text-gray-400'}`}
             >
               {tab}
             </button>
           ))}
         </div>

         <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                    <p className="text-gray-400 text-sm mt-1">
                       {activeTab === 'overview' && 'Monitor overall platform metrics and growth.'}
                       {activeTab === 'guides' && 'Review and approve guides on the platform.'}
                       {activeTab === 'bookings' && 'Manage all platform transactions.'}
                       {activeTab === 'security' && 'Monitor suspicious activities and SOS alerts.'}
                       {activeTab === 'feedback' && 'Review user feedback and system notifications.'}
                    </p>
                 </div>
              </div>

              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'guides' && <AdminGuides />}
              {activeTab === 'bookings' && <AdminBookings />}
              {activeTab === 'security' && <AdminSecurity />}
              {activeTab === 'feedback' && <AdminFeedback />}

            </motion.div>
         </div>
      </main>
    </div>
  );
}
