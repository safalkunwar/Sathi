import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert } from 'lucide-react';
import { firestore } from '../services/firestore';
import { Companion } from '../types';

export function AdminCompanions() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.subscribe<Companion>('companions', {}, (items) => {
      setCompanions(items);
    });
    return () => unsubscribe();
  }, []);

  const filtered = companions.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()));

  const toggleVerification = async (companionId: string, isVerified: boolean) => {
    await firestore.updateDocument(`companions/${companionId}`, { isVerified: !isVerified });
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col min-h-[60vh]">
      <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
        <h3 className="font-semibold text-sm">All Companions</h3>
        <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
          <Search className="w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search companions..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-white outline-none w-32 md:w-auto" />
        </div>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No companions found.</p>}
        {filtered.map(companion => (
          <div key={companion.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222] flex items-center justify-between hover:border-[#C8A25E]/50 transition-colors">
            <div className="flex items-center gap-4">
              <img src={companion.imageUrl} alt={companion.name} className="w-10 h-10 rounded-full object-cover border border-[#222]" />
              <div>
                <p className="text-sm font-medium text-white">{companion.name} • {companion.location}</p>
                <p className="text-xs text-gray-400">NPR {companion.hourlyRate}/hr • {companion.languages.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVerification(companion.id, companion.isVerified)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${companion.isVerified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#222] text-gray-300 border-[#333] hover:text-white'}`}>
                <ShieldCheck className="w-3 h-3" /> {companion.isVerified ? 'Verified' : 'Verify'}
              </button>
              <button className="px-3 py-1.5 rounded-lg text-red-500 text-xs border border-red-500/20 hover:bg-red-500/10 transition-colors">
                <ShieldAlert className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
