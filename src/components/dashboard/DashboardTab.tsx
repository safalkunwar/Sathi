import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { useCompanions } from '../../hooks/useFirestoreData';
import { Star, ShieldCheck, Heart, MapPin, Settings, Calendar } from 'lucide-react';
import * as motion from 'motion/react-client';

export const DashboardTab: React.FC = () => {
  const { currentUser, favorites, toggleFavorite, bookings } = useAppContext();
  const { showToast } = useToast();
  const { companions: fetchedCompanions } = useCompanions();

  if (!currentUser) return <div className="text-white p-8">Please log in to view dashboard</div>;

  const favoriteCompanions = fetchedCompanions.filter(c => favorites.includes(c.id));
  const myBookings = bookings.filter(b => b.userId === currentUser.id);
  const totalSpent = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-[#17191C] border border-[#2A2D31] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A25E]/5 rounded-full blur-3xl" />
        <img src={currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-[#1E2124] shadow-xl relative z-10" />
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">{currentUser.name}</h1>
          <p className="text-[#8E9299] mb-4">{currentUser.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
             <span className="px-3 py-1 bg-[#1E2124] text-[#E0E0E0] rounded-lg border border-[#2A2D31] capitalize">
               {currentUser.role} Account
             </span>
             {currentUser.role === 'customer' && (
               <span className="px-3 py-1 bg-[#1E2124] text-[#C8A25E] rounded-lg border border-[#2A2D31]">
                 {myBookings.length} Trips Booked
               </span>
             )}
          </div>
        </div>

        <button 
          onClick={() => showToast('Profile editing will be available soon.', 'info')}
          className="relative z-10 px-6 py-3 bg-[#1E2124] text-white border border-[#2A2D31] rounded-xl hover:border-[#C8A25E] transition-colors flex items-center gap-2 font-medium"
        >
          <Settings className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {currentUser.role === 'customer' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Total Spent</h3>
              <p className="text-3xl font-bold text-white">NPR {totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Saved Favorites</h3>
              <p className="text-3xl font-bold text-white">{favorites.length}</p>
            </div>
            <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-6">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Upcoming Trips</h3>
              <p className="text-3xl font-bold text-white">{myBookings.filter(b => b.status === 'confirmed').length}</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Bookings</h2>
            {myBookings.length > 0 ? (
              <div className="space-y-4">
                {myBookings.slice(0, 3).map(booking => {
                  const companion = favoriteCompanions.find(c => c.id === booking.companionId) || fetchedCompanions.find(c => c.id === booking.companionId);
                  return (
                    <div key={booking.id} className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {companion && (
                          <img src={companion.imageUrl} alt={companion.name} className="w-12 h-12 rounded-full object-cover border border-[#2A2D31]" />
                        )}
                        <div>
                          <h3 className="font-bold text-white mb-1">Booking with {companion?.name || 'Companion'}</h3>
                          <p className="text-sm text-[#8E9299] flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {booking.date} at {booking.time}</p>
                          <p className="text-xs text-[#8E9299]">{booking.duration} hour(s) x {booking.participants} people</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-[#C8A25E]">NPR {booking.totalPrice.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${booking.status === 'confirmed' ? 'bg-green-500/10 border-green-500/50 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-8 text-center text-[#8E9299]">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No bookings yet. Explore companions to book your first experience!</p>
              </div>
            )}
          </div>

          {/* Favorites List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Saved Favorites</h2>
            {favoriteCompanions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {favoriteCompanions.map(companion => (
                  <div key={companion.id} className="group bg-[#17191C] rounded-[20px] overflow-hidden shadow-lg border border-[#2A2D31]/50 relative flex flex-col">
                    <div className="relative aspect-[4/5]">
                      <img src={companion.imageUrl} alt={companion.name} className="w-full h-full object-cover" />
                      <button onClick={() => toggleFavorite(companion.id)} className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 z-20">
                         <Heart className="w-4 h-4 fill-[#C8A25E] text-[#C8A25E]" />
                      </button>
                    </div>
                    <div className="p-4 bg-[#1E2124]">
                      <h3 className="font-bold text-white flex items-center gap-1.5">{companion.name} <ShieldCheck className="w-3.5 h-3.5 text-[#C8A25E]" /></h3>
                      <p className="text-xs text-[#8E9299] flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {companion.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl p-8 text-center text-[#8E9299]">
                 <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p>You haven't saved any companions yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {currentUser.role === 'companion' && (
        <div className="bg-[#17191C] border border-[#2A2D31] p-8 rounded-3xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Guide Dashboard</h2>
          <p className="text-[#8E9299] mb-6">Manage your availability, view incoming requests, and track earnings.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#1E2124] rounded-2xl p-6 border border-[#2A2D31]">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-white">NPR 1,250.00</p>
            </div>
            <div className="bg-[#1E2124] rounded-2xl p-6 border border-[#2A2D31]">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Pending Requests</h3>
              <p className="text-3xl font-bold text-[#C8A25E]">3</p>
            </div>
            <div className="bg-[#1E2124] rounded-2xl p-6 border border-[#2A2D31]">
              <h3 className="text-[#8E9299] text-sm uppercase tracking-wider mb-2">Profile Views (30d)</h3>
              <p className="text-3xl font-bold text-white">428</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
