import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { firestore } from '../services/firestore';
import { Activity, Event } from '../types';
import { useToast } from '../components/ui/Toast';

export function AdminContent() {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<'activities' | 'events'>('activities');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubActivities = firestore.subscribe<Activity>('activities', {}, (items) => {
      setActivities(items);
    });
    const unsubEvents = firestore.subscribe<Event>('events', {}, (items) => {
      setEvents(items);
    });
    return () => {
      unsubActivities();
      unsubEvents();
    };
  }, []);

  const filtered = tab === 'activities'
    ? activities.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    : events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    await firestore.deleteDocument(`${tab === 'activities' ? 'activities' : 'events'}/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-[#111] border border-[#222] p-1 rounded-xl w-fit">
        <button onClick={() => setTab('activities')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'activities' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white'}`}>Activities</button>
        <button onClick={() => setTab('events')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'events' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : 'text-gray-400 hover:text-white'}`}>Events</button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col min-h-[60vh]">
        <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
          <h3 className="font-semibold text-sm capitalize">{tab}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
              <Search className="w-4 h-4 text-gray-500" />
              <input type="text" placeholder={`Search ${tab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-white outline-none w-32 md:w-auto" />
            </div>
            <button onClick={() => showToast('Create feature coming soon', 'info')} className="flex items-center gap-1 px-3 py-1.5 bg-[#C8A25E] text-[#0F1113] text-xs font-bold rounded-lg hover:bg-[#B69150] transition-colors">
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No {tab} found.</p>}
          {filtered.map(item => (
            <div key={item.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222] flex items-center justify-between hover:border-[#C8A25E]/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-gray-400">{tab === 'activities' ? `${(item as Activity).duration} • NPR ${(item as Activity).avgPrice}/hr` : `${item.date} • ${item.location}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast('Edit feature coming soon', 'info')} className="p-1.5 rounded-lg text-[#C8A25E] hover:bg-[#C8A25E]/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
