import React, { useState, useEffect } from 'react';
import { Companion } from '../types';
import { MapPin, Star, ShieldCheck, Clock, CalendarDays, AlertTriangle, CheckCircle2, Map as MapIcon } from 'lucide-react';
import { COMPANIONS } from '../data';

interface BookingModalProps {
  companion: Companion;
  onClose: () => void;
  onMessage: () => void;
}

const POPULAR_LOCATIONS: Record<string, string[]> = {
  'Kathmandu': ['Thamel Center', 'Boudhanath Stupa', 'Kathmandu Durbar Square'],
  'Lalitpur': ['Patan Durbar Square', 'Labim Mall', 'Jhamsikhel'],
  'Pokhara': ['Lakeside', 'Sarangkot View Point', 'World Peace Pagoda'],
  'Bhaktapur': ['Bhaktapur Durbar Square', 'Nyatapola Temple', 'Pottery Square']
};

export const BookingModal: React.FC<BookingModalProps> = ({ companion, onClose, onMessage }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [hours, setHours] = useState(2);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | ''>('');

  const total = hours * companion.hourlyRate;

  useEffect(() => {
    if (location) {
      if (location.toLowerCase().includes('pokhara') && companion.location !== 'Pokhara') {
        setLocationError(`Sorry, ${companion.name} is currently not available in Pokhara. They are based in ${companion.location}.`);
      } else if (location.toLowerCase().includes('kathmandu') && companion.location !== 'Kathmandu') {
        setLocationError(`Sorry, ${companion.name} is currently not available in Kathmandu. They are based in ${companion.location}.`);
      } else if (location.toLowerCase().includes('bhaktapur') && companion.location !== 'Bhaktapur') {
        setLocationError(`Sorry, ${companion.name} is currently not available in Bhaktapur. They are based in ${companion.location}.`);
      } else {
         setLocationError('');
      }
    } else {
       setLocationError('');
    }
  }, [location, companion.location, companion.name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#17191C] border border-[#2A2D31] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2A2D31] flex justify-between items-center bg-[#0F1113]">
          <h2 className="text-lg font-semibold text-white">
            {step === 0 ? 'Companion Profile' : step === 1 ? 'Schedule Experience' : step === 2 ? 'Secure Payment' : 'Booking Confirmed'}
          </h2>
          {step !== 3 && (
            <button onClick={onClose} className="text-[#8E9299] hover:text-[#C8A25E] transition-colors">
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-6">
              {/* Image Gallery */}
              {companion.images && companion.images.length > 0 ? (
                <div className="flex gap-2 w-full pt-1 pb-2 overflow-x-auto snap-x hide-scrollbar">
                  {companion.images.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} className="w-56 h-48 rounded-xl object-cover snap-start shrink-0 border border-[#2A2D31]" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-4">
                   <img src={companion.imageUrl} alt={companion.name} className="w-full h-48 rounded-2xl object-cover border border-[#2A2D31]" />
                </div>
              )}

              <div className="flex-1">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   {companion.name}, {companion.age}
                   {companion.isVerified && <ShieldCheck className="w-4 h-4 text-[#C8A25E]" />}
                 </h3>
                 <p className="text-[#C8A25E] text-sm mb-2">NPR {companion.hourlyRate} / hour</p>
                 <div className="flex items-center gap-2 text-sm text-[#8E9299]">
                   <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                   <span className="text-white">{companion.rating}</span>
                   <span>({companion.reviewsCount} reviews)</span>
                 </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold mb-2">About</h4>
                <p className="text-sm text-[#8E9299] leading-relaxed">{companion.bio}</p>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {companion.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-[#1E2124] border border-[#2A2D31] rounded-full text-xs text-[#E0E0E0]">{lang}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold mb-2">Interests & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {companion.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-[#1E2124] border border-[#2A2D31] rounded-full text-xs text-[#E0E0E0]">{interest}</span>
                  ))}
                </div>
              </div>

              {companion.reviews && companion.reviews.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold mb-3">Recent Reviews</h4>
                  <div className="space-y-3">
                    {companion.reviews.map(review => (
                      <div key={review.id} className="p-3 bg-[#1E2124] border border-[#2A2D31] rounded-xl flex flex-col gap-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-white">{review.authorName}</span>
                          <span className="text-xs text-[#8E9299]">{review.date}</span>
                        </div>
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-[#2A2D31]'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-[#8E9299] italic">"{review.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={onMessage}
                  className="w-1/3 py-3 border border-[#C8A25E] text-[#C8A25E] rounded-lg font-medium hover:bg-[#C8A25E]/10 transition-colors uppercase tracking-wide text-sm"
                >
                  Message
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-[#C8A25E] text-[#0F1113] rounded-lg font-medium hover:bg-[#B69150] transition-colors uppercase tracking-wide text-sm"
                >
                  Schedule Experience
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-3 bg-[#1E2124] rounded-xl border border-[#2A2D31]">
                <img src={companion.imageUrl} alt={companion.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-medium text-white">{companion.name}</h3>
                  <p className="text-sm text-[#C8A25E]">NPR {companion.hourlyRate} / hour</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold block mb-3">Date & Time</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="datetime-local" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold block mb-3">Duration (Hours)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" max="8" 
                    value={hours} 
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="flex-1 accent-[#C8A25E]"
                  />
                  <span className="font-medium text-white w-12 text-right">{hours} hr</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#C8A25E] font-bold block mb-3">Meeting Location</label>
                <div className="relative mb-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="e.g. Patan Durbar Square ticket counter"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${locationError ? 'border-red-500/50 focus:ring-red-500' : 'border-[#2A2D31] focus:ring-[#C8A25E]'} bg-[#1E2124] text-white focus:ring-1 outline-none text-sm`}
                  />
                </div>
                {!location && POPULAR_LOCATIONS[companion.location] && (
                  <div className="flex flex-wrap gap-2 mb-3 mt-3">
                    {POPULAR_LOCATIONS[companion.location].map(loc => (
                      <button 
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className="px-3 py-1 bg-[#1E2124] hover:bg-[#2A2D31] text-[#8E9299] hover:text-white text-xs rounded-full border border-[#2A2D31] transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
                {locationError ? (
                   <p className="text-red-400 text-xs italic">{locationError}</p>
                ) : location ? (
                   <div className="mt-3 relative w-full h-32 rounded-lg border border-[#2A2D31] overflow-hidden group">
                      <div className="absolute inset-0 bg-[#2A2D31] animate-[pulse_2s_ease-in-out_infinite]"></div>
                      <img src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80`} alt="Map Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-[#17191C]/60 backdrop-blur-[2px]">
                         <MapIcon className="w-6 h-6 text-[#C8A25E] mb-1" />
                         <span className="text-xs font-semibold text-white drop-shadow-md">Previewing area around {location}</span>
                         <span className="text-[10px] text-[#8E9299]">Estimated travel time for companion: ~15 mins</span>
                      </div>
                   </div>
                ) : null}
              </div>

              {/* Safety notice compliant with SRS */}
              <div className="flex gap-3 items-start bg-[#0F1113] border border-[#2A2D31] text-[#8E9299] p-3 rounded-lg text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#C8A25E] mt-0.5" />
                <p>
                  <strong className="text-white">Safety First:</strong> Real-time location sharing will be activated automatically during the booked hours. This service strictly enforces platonic guidelines.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-4 py-3 border border-[#2A2D31] text-[#8E9299] rounded-lg font-medium hover:text-white hover:border-[#C8A25E] transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!date || !location || !!locationError}
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-[#C8A25E] text-[#0F1113] rounded-lg font-medium hover:bg-[#B69150] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                >
                  Proceed to Payment (NPR {total})
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-[#1E2124] border border-[#2A2D31] p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8E9299]">Service Hours</span>
                  <span className="font-medium text-white">{hours} Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8E9299]">Rate</span>
                  <span className="font-medium text-white">NPR {companion.hourlyRate}/hr</span>
                </div>
                <div className="pt-2 border-t border-[#2A2D31] flex justify-between font-semibold text-lg">
                  <span className="text-white">Total Cost</span>
                  <span className="text-[#C8A25E]">NPR {total}</span>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C8A25E] mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('esewa')}
                    className={"p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all " + (paymentMethod === 'esewa' ? 'border-[#C8A25E] bg-[#C8A25E]/10' : 'border-[#2A2D31] hover:border-[#C8A25E] bg-transparent')}
                  >
                    <div className="font-bold text-green-500 text-xl tracking-tight">eSewa</div>
                    <span className="text-xs text-[#8E9299]">Digital Wallet</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('khalti')}
                    className={"p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all " + (paymentMethod === 'khalti' ? 'border-[#C8A25E] bg-[#C8A25E]/10' : 'border-[#2A2D31] hover:border-[#C8A25E] bg-transparent')}
                  >
                    <div className="font-bold text-purple-500 text-xl tracking-tight">Khalti</div>
                    <span className="text-xs text-[#8E9299]">Digital Wallet</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-[#2A2D31] text-[#8E9299] rounded-lg font-medium hover:text-white hover:border-[#C8A25E] transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!paymentMethod}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#C8A25E] text-[#0F1113] rounded-lg font-medium hover:bg-[#B69150] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                >
                  Pay NPR {total} securely
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#1E2124] border border-[#2A2D31] rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-[#C8A25E]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-[#8E9299] max-w-sm">
                Your experience with {companion.name} is scheduled. You will receive a notification when they confirm.
              </p>
              
              <div className="w-full bg-[#1E2124] border border-[#2A2D31] p-4 rounded-xl mt-6">
                <div className="flex items-center gap-3 text-sm text-[#8E9299] mb-2">
                  <CalendarDays className="w-4 h-4 text-[#C8A25E]" />
                  <span>{new Date(date).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#8E9299]">
                  <MapPin className="w-4 h-4 text-[#C8A25E]" />
                  <span className="text-white">{location}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-[#C8A25E] text-[#0F1113] rounded-lg font-medium hover:bg-[#B69150] transition-colors mt-6 uppercase tracking-wide text-sm"
              >
                Go to My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
