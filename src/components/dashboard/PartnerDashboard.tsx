import React, { useState } from 'react';
import { Store, BarChart2, Calendar, Users, TrendingUp, Star } from 'lucide-react';

type PartnerType = 'hotel' | 'restaurant' | 'cafe' | 'adventure';

interface PartnerStats {
  views: number;
  bookings: number;
  revenue: number;
  rating: number;
}

interface PartnerOffer {
  id: string;
  title: string;
  discount: string;
  validUntil: string;
}

export const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'analytics'>('overview');

  const stats: PartnerStats = {
    views: 1240,
    bookings: 86,
    revenue: 42500,
    rating: 4.8,
  };

  const offers: PartnerOffer[] = [
    { id: 'o1', title: 'Weekend Stay Discount', discount: '20%', validUntil: '2026-08-01' },
    { id: 'o2', title: 'Group Package', discount: '15%', validUntil: '2026-07-20' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#17191C] border border-[#2A2D31] rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#C8A25E]/10 text-[#C8A25E] flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Partner Dashboard</h1>
            <p className="text-sm text-[#8E9299]">Manage your business profile, offers, and bookings.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-[#C8A25E]" />
              <span className="text-xs text-[#8E9299] uppercase tracking-wider">Views</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.views}</p>
          </div>
          <div className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#C8A25E]" />
              <span className="text-xs text-[#8E9299] uppercase tracking-wider">Bookings</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.bookings}</p>
          </div>
          <div className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#C8A25E]" />
              <span className="text-xs text-[#8E9299] uppercase tracking-wider">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">NPR {stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#C8A25E]" />
              <span className="text-xs text-[#8E9299] uppercase tracking-wider">Rating</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.rating}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#17191C] border border-[#2A2D31] rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-[#C8A25E]" />
          <h2 className="text-xl font-bold text-white">Active Offers</h2>
        </div>
        <div className="space-y-4">
          {offers.map(offer => (
            <div key={offer.id} className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{offer.title}</p>
                <p className="text-xs text-[#8E9299] mt-1">Valid until {offer.validUntil}</p>
              </div>
              <span className="text-[#C8A25E] font-bold">{offer.discount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
