import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { firestore } from '../services/firestore';
import { Booking } from '../types';

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.subscribe<Booking>('bookings', { orderByField: 'createdAt', orderDirection: 'desc' }, (items) => {
      setBookings(items);
    });
    return () => unsubscribe();
  }, []);

  const filtered = bookings.filter(b => b.id.includes(search) || b.meetingPoint?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col min-h-[60vh]">
      <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
        <h3 className="font-semibold text-sm">All Bookings</h3>
        <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
          <Search className="w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-white outline-none w-32 md:w-auto" />
        </div>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No bookings found.</p>}
        {filtered.map(booking => (
          <div key={booking.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222] flex items-center justify-between hover:border-[#C8A25E]/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-gray-500">{booking.id}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-[#C8A25E]/10 text-[#C8A25E]'}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-white">
                <span className="font-medium">{booking.userId}</span> booked companion <span className="font-medium text-[#C8A25E]">{booking.companionId}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium text-white text-sm">NPR {booking.totalPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">{booking.date} at {booking.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
