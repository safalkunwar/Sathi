import React from 'react';
import { Users, UserCheck, CalendarDays, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPANIONS } from '../data';

const MOCK_CHART_DATA = [
  { name: 'Jan', users: 400, bookings: 240 },
  { name: 'Feb', users: 300, bookings: 139 },
  { name: 'Mar', users: 200, bookings: 980 },
  { name: 'Apr', users: 278, bookings: 390 },
  { name: 'May', users: 189, bookings: 480 },
  { name: 'Jun', users: 239, bookings: 380 },
  { name: 'Jul', users: 349, bookings: 430 },
];

export function AdminOverview() {
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
          <p className="text-3xl font-bold text-white ml-2">1,248</p>
          <p className="text-xs text-green-500 mt-2 ml-2 tracking-wide font-medium">+12% this month</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#222] rounded-lg">
              <UserCheck className="w-4 h-4 text-[#C8A25E]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active Guides</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">{COMPANIONS.length}</p>
          <p className="text-xs text-green-500 mt-2 ml-2 tracking-wide font-medium">+2 new this week</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-900/10 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">14</p>
          <p className="text-xs text-yellow-500 mt-2 ml-2 tracking-wide font-medium">Requires review</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#222] rounded-lg">
              <CalendarDays className="w-4 h-4 text-[#C8A25E]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Bookings</span>
          </div>
          <p className="text-3xl font-bold text-white ml-2">842</p>
          <p className="text-xs text-green-500 mt-2 ml-2 tracking-wide font-medium">+5% this month</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-8 mt-8">
        <h3 className="font-semibold text-sm mb-6 text-white">Platform Growth Overview</h3>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Area type="monotone" dataKey="users" stroke="#C8A25E" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
