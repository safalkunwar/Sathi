import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Star, ShieldCheck, Languages, CheckCircle2, Clock, Calendar, MessageSquare, Heart } from 'lucide-react';
import { Companion } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { BookingFlowModal } from './BookingFlowModal';
import { MapPreview, MAP_CENTER } from '../maps/MapPreview';

interface CompanionProfileModalProps {
  companion: Companion | null;
  onClose: () => void;
  onMessage?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup' | 'guide') => void;
}

export const CompanionProfileModal: React.FC<CompanionProfileModalProps> = ({ companion, onClose, onMessage, onOpenAuth }) => {
  const { favorites, toggleFavorite, currentUser } = useAppContext();
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  if (!companion) return null;

  const isFavorite = favorites.includes(companion.id);

  const handleBookClick = () => {
    if (!currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    setShowBookingFlow(true);
  };

  const handleMessageClick = () => {
    if (!currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    if (onMessage) onMessage();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 100, scale: 0.95 }} 
          className="relative w-full max-w-4xl bg-[#0F1113] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] border border-[#2A2D31]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="companion-profile-name"
        >
          {/* Header Image */}
          <div className="h-64 md:h-80 relative shrink-0">
            <img src={companion.imageUrl} alt={companion.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/40 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={() => toggleFavorite(companion.id)}
              className="absolute top-4 right-16 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#C8A25E] text-[#C8A25E]' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 -mt-20 relative z-10 custom-scrollbar">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Details */}
              <div className="flex-1">
                <div className="flex items-end gap-4 mb-4">
                  <h1 id="companion-profile-name" className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                    {companion.name}, {companion.age}
                    {companion.isVerified && <ShieldCheck className="w-6 h-6 text-[#C8A25E]" title="Verified" />}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[#8E9299] mb-8 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {companion.location}</span>
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {companion.rating} ({companion.reviewsCount} reviews)</span>
                  <span className="flex items-center gap-1.5"><Languages className="w-4 h-4" /> {companion.languages.join(', ')}</span>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">About Me</h2>
                  <p className="text-[#8E9299] leading-relaxed text-[15px]">{companion.bio}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">Interests & Activities</h2>
                  <div className="flex flex-wrap gap-2">
                    {companion.interests.map(interest => (
                      <span key={interest} className="px-4 py-2 bg-[#1E2124] border border-[#2A2D31] text-[#E0E0E0] rounded-xl text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                 </div>

                 {companion.coordinates && (
                   <div className="mb-8">
                     <h2 className="text-xl font-bold text-white mb-3">Location</h2>
                     <MapPreview
                       center={{ lat: companion.coordinates.latitude, lng: companion.coordinates.longitude }}
                       zoom={14}
                       height="220px"
                       markers={[
                         {
                           id: companion.id,
                           position: { lat: companion.coordinates.latitude, lng: companion.coordinates.longitude },
                           title: companion.location,
                           subtitle: companion.name,
                         },
                       ]}
                     />
                   </div>
                 )}

                 {/* Reviews Summary Placeholder */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Reviews</h2>
                  {companion.reviews && companion.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {companion.reviews.map(review => (
                        <div key={review.id} className="bg-[#17191C] p-4 rounded-2xl border border-[#2A2D31]">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="flex text-[#C8A25E]"><Star className="w-3.5 h-3.5 fill-current" /></div>
                             <span className="font-medium text-white text-sm">{review.authorName}</span>
                             <span className="text-xs text-[#8E9299] ml-auto">{review.date}</span>
                          </div>
                          <p className="text-[#8E9299] text-sm">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#8E9299] italic">No reviews yet.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Booking Card */}
              <div className="w-full md:w-80 shrink-0">
                <div className="bg-[#17191C] rounded-3xl p-6 border border-[#2A2D31] sticky top-0 shadow-xl">
                  <div className="mb-6 pb-6 border-b border-[#2A2D31]">
                     <span className="text-3xl font-bold text-white">NPR {companion.hourlyRate}</span>
                    <span className="text-[#8E9299]"> / hour</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#E0E0E0]">
                      <CheckCircle2 className="w-5 h-5 text-[#C8A25E]" />
                      <span>Usually responds in 1 hour</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#E0E0E0]">
                      <Calendar className="w-5 h-5 text-[#C8A25E]" />
                      <span>Available this weekend</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleBookClick}
                    className="w-full py-4 bg-[#C8A25E] text-[#0F1113] rounded-2xl font-bold text-lg hover:bg-[#B69150] transition-colors mb-3 shadow-lg shadow-[#C8A25E]/20"
                  >
                    Request to Book
                  </button>
                  <button 
                    onClick={handleMessageClick}
                    className="w-full py-3 bg-[#1E2124] text-white border border-[#2A2D31] rounded-2xl font-medium hover:border-[#C8A25E] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showBookingFlow && (
        <BookingFlowModal companion={companion} onClose={() => setShowBookingFlow(false)} onComplete={() => { setShowBookingFlow(false); onClose(); }} />
      )}
    </AnimatePresence>
  );
};
