import React, { useState, useEffect } from 'react';
import { Users, UserCheck, CalendarDays, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { firestore } from '../services/firestore';

export function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, guides: 0, pending: 0, bookings: 0 });
  const [chartData, setChartData] = useState<Array<{ name: string; users: number; bookings: number }>>([]);

  useEffect(() => {
    const unsubUsers = firestore.subscribe('users', {}, (items) => {
      setStats(prev => ({ ...prev, users: items.length }));
    });

    const unsubCompanions = firestore.subscribe('companions', {}, (items) => {
      setStats(prev => ({ ...prev, guides: items.length }));
    });

    const unsubBookings = firestore.subscribe('bookings', {}, (items) => {
      setStats(prev => ({ ...prev, bookings: items.length }));
      const monthly = new Map<string, { users: number; bookings: number }>();
      items.forEach((booking: any) => {
        const date = booking.createdAt || booking.date;
        if (!date) return;
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        if (!monthly.has(month)) monthly.set(month, { users: 0, bookings: 0 });
        const entry = monthly.get(month)!;
        entry.bookings += 1;
      });
      const data = Array.from(monthly.entries()).map(([name, values]) => ({ name, ...values }));
      setChartData(data);
    });

    return () => {
      unsubUsers();
      unsubCompanions();
      unsubBookings();
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#222] rounded-lg">
              <Users className="w-4 h-4 text-[#C8A25E]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">{stats.users}</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#222] rounded-lg">
              <UserCheck className="w-4 h-4 text-[#C8A25E]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active Guides</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">{stats.guides}</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-900/10 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">{stats.pending}</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#222] rounded-lg">
              <CalendarDays className="w-4 h-4 text-[#C8A25E]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Bookings</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">{stats.bookings}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-8 mt-8">
        <h3 className="font-semibold text-sm mb-6 text-white">Platform Growth Overview</h3>
        <div className="h-64 w-full text-xs">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A25E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C8A25E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#C8A25E' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#C8A25E" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available yet. Seed Firestore to see analytics.</p>
          )}
        </div>
      </div>
    </>
  );
}
