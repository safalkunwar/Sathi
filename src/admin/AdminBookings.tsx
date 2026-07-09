import React from 'react';
import { Search } from 'lucide-react';

const MOCK_RECENT_BOOKINGS = [
  { id: 'B-1029', user: 'Alex', guide: 'Pasang Dolma', date: '2023-11-25', amount: 'NPR 3000', status: 'upcoming' },
  { id: 'B-1028', user: 'Maria', guide: 'Arjun Thapa', date: '2023-11-24', amount: 'NPR 4500', status: 'completed' },
  { id: 'B-1027', user: 'John', guide: 'Maya Sherpa', date: '2023-11-23', amount: 'NPR 2000', status: 'cancelled' },
  { id: 'B-1026', user: 'Sarah', guide: 'Rajesh Karki', date: '2023-11-22', amount: 'NPR 1500', status: 'completed' },
  { id: 'B-1025', user: 'Mike', guide: 'Pasang Dolma', date: '2023-11-21', amount: 'NPR 3000', status: 'completed' },
];

export function AdminBookings() {
  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden flex flex-col min-h-[60vh]">
      <div className="px-5 py-4 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
        <h3 className="font-semibold text-sm">All Bookings</h3>
        <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
          <Search className="w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search ID..." className="bg-transparent text-sm text-white outline-none w-32 md:w-auto" />
        </div>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {MOCK_RECENT_BOOKINGS.map(booking => (
          <div key={booking.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222] flex items-center justify-between hover:border-[#C8A25E]/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-gray-500">{booking.id}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${booking.status === 'upcoming' ? 'bg-[#C8A25E]/10 text-[#C8A25E]' : booking.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-white">
                <span className="font-medium">{booking.user}</span> booked <span className="font-medium text-[#C8A25E]">{booking.guide}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium text-white text-sm">{booking.amount}</div>
              <div className="text-xs text-gray-500 mt-1">{booking.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
