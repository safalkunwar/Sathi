import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, Users, Check, Map as MapIcon, Navigation, CreditCard } from 'lucide-react';
import { Companion, Booking } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { MapPreview } from '../maps/MapPreview';
import { MAP_CENTER } from '../../services/maps';
import { paymentService, type PaymentProvider } from '../../services/payments';
import { useToast } from '../ui/Toast';

interface BookingFlowModalProps {
  companion: Companion;
  onClose: () => void;
  onComplete: () => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({ companion, onClose, onComplete }) => {
  const { addBooking, currentUser } = useAppContext();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(2);
  const [participants, setParticipants] = useState(1);
  const [location, setLocation] = useState('');
  const [requests, setRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | ''>('');
  const [processing, setProcessing] = useState(false);

  const calculateTotal = () => companion.hourlyRate * duration;
  const serviceFee = calculateTotal() * 0.1;
  const grandTotal = calculateTotal() + serviceFee;

  const handleConfirm = async () => {
    const bookingId = `bk-${Date.now()}`;
    const booking: Booking = {
      id: bookingId,
      companionId: companion.id,
      userId: currentUser?.id || 'guest',
      date,
      time,
      duration,
      participants,
      status: 'pending',
      totalPrice: grandTotal,
      meetingPoint: location,
      specialRequests: requests,
      createdAt: new Date().toISOString()
    };

    await addBooking(booking);

    if (!paymentMethod) {
      setStep(4);
      return;
    }

    try {
      const requestUrl = `${window.location.origin}/bookings`;
      const result = await paymentService.initiatePayment({
        amount: Math.round(grandTotal),
        currency: 'NPR',
        provider: paymentMethod,
        companionId: companion.id,
        bookingId,
        returnUrl: requestUrl,
        webhookUrl: requestUrl,
        customerInfo: currentUser ? {
          name: currentUser.name,
          email: currentUser.email,
          phone: '',
        } : undefined,
      });

      if (paymentMethod === 'khalti') {
        window.location.href = result.paymentUrl;
        return;
      }

      if (paymentMethod === 'esewa') {
        setStep(4);
        return;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Payment initiation failed', 'error');
    }

    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="booking-flow-title">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="relative w-full max-w-lg bg-[#17191C] rounded-3xl overflow-hidden shadow-2xl border border-[#2A2D31]"
      >
        <div className="p-6 border-b border-[#2A2D31] flex items-center justify-between bg-[#0F1113]">
          <h2 id="booking-flow-title" className="text-xl font-bold text-white">
            {step === 4 ? 'Booking Confirmed' : `Book ${companion.name}`}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#1E2124] flex items-center justify-center text-[#8E9299] hover:text-white transition-colors" aria-label="Close booking dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-6">When do you want to meet?</h3>
                
                 <div className="space-y-5">
                   <div>
                     <label htmlFor="booking-date" className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</label>
                     <input id="booking-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E]" />
                   </div>

                   <div>
                     <label htmlFor="booking-time" className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Time</label>
                     <input id="booking-time" type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E]" />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</label>
                     <div className="flex items-center gap-4">
                       <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] text-white flex items-center justify-center" aria-label="Decrease duration">-</button>
                       <span className="text-xl font-bold text-white w-8 text-center">{duration} hrs</span>
                       <button onClick={() => setDuration(duration + 1)} className="w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] text-white flex items-center justify-center" aria-label="Increase duration">+</button>
                     </div>
                   </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Time</label>
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#8E9299] mb-2 text-right">Duration</label>
                      <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E] appearance-none">
                        {[1,2,3,4,5,6].map(h => <option key={h} value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>)}
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={!date || !time}
                    onClick={() => setStep(2)}
                    className="w-full py-4 mt-4 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-6">Details & Location</h3>
                
                <div className="space-y-5">
                   <div>
                     <label htmlFor="booking-location" className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Meeting Point</label>
                     <input id="booking-location" type="text" placeholder="e.g. Starbucks, Downtown" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E]" aria-required="true" />
                   </div>

                   {location && (
                     <div className="mt-3">
                       <MapPreview
                         center={MAP_CENTER}
                         zoom={13}
                         height="200px"
                         markers={[
                           {
                             id: 'meeting-point',
                             position: MAP_CENTER,
                             title: location,
                             subtitle: 'Proposed meeting point',
                           },
                         ]}
                       />
                     </div>
                   )}

                   <div>
                     <label htmlFor="booking-requests" className="block text-sm font-medium text-[#8E9299] mb-2">Special Requests (Optional)</label>
                     <textarea id="booking-requests" value={requests} onChange={e => setRequests(e.target.value)} placeholder="Any specific activities or preferences?" className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E] h-24 resize-none" />
                   </div>

                   {location && (
                     <div className="mt-3">
                       <MapPreview
                         center={MAP_CENTER}
                         zoom={13}
                         height="200px"
                         markers={[
                           {
                             id: 'meeting-point',
                             position: MAP_CENTER,
                             title: location,
                             subtitle: 'Proposed meeting point',
                           },
                         ]}
                       />
                     </div>
                   )}

                  <div>
                    <label className="block text-sm font-medium text-[#8E9299] mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Participants</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setParticipants(Math.max(1, participants - 1))} className="w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] text-white flex items-center justify-center">-</button>
                      <span className="text-xl font-bold text-white w-8 text-center">{participants}</span>
                      <button onClick={() => setParticipants(participants + 1)} className="w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] text-white flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#8E9299] mb-2">Special Requests (Optional)</label>
                    <textarea value={requests} onChange={e => setRequests(e.target.value)} placeholder="Any specific activities or preferences?" className="w-full bg-[#1E2124] border border-[#2A2D31] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8A25E] h-24 resize-none" />
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setStep(1)} className="px-6 py-4 bg-[#1E2124] text-white rounded-xl font-bold hover:bg-[#2A2D31] transition-colors">Back</button>
                    <button 
                      disabled={!location}
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Review Booking
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-bold text-white mb-6">Review & Pay</h3>
                
                <div className="bg-[#1E2124] rounded-2xl p-5 border border-[#2A2D31] mb-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8E9299]">Date & Time</span>
                    <span className="text-white font-medium">{date} at {time}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8E9299]">Duration</span>
                    <span className="text-white font-medium">{duration} hours</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8E9299]">Meeting Point</span>
                    <span className="text-white font-medium truncate max-w-[200px] text-right">{location}</span>
                  </div>
                  
                  <div className="border-t border-[#2A2D31] pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8E9299]">NPR {companion.hourlyRate} x {duration} hrs</span>
                      <span className="text-white">NPR {calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8E9299]">Service Fee (10%)</span>
                      <span className="text-white">NPR {serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-[#2A2D31]">
                      <span className="text-white">Total</span>
                      <span className="text-[#C8A25E]">NPR {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C8A25E] mb-3">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('khalti')}
                      className={"p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all " + (paymentMethod === 'khalti' ? 'border-[#C8A25E] bg-[#C8A25E]/10' : 'border-[#2A2D31] hover:border-[#C8A25E] bg-transparent')}
                    >
                      <div className="font-bold text-purple-400 text-xl tracking-tight">Khalti</div>
                      <span className="text-xs text-[#8E9299]">Digital Wallet</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('esewa')}
                      className={"p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all " + (paymentMethod === 'esewa' ? 'border-[#C8A25E] bg-[#C8A25E]/10' : 'border-[#2A2D31] hover:border-[#C8A25E] bg-transparent')}
                    >
                      <div className="font-bold text-green-400 text-xl tracking-tight">eSewa</div>
                      <span className="text-xs text-[#8E9299]">Digital Wallet</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-4 bg-[#1E2124] text-white rounded-xl font-bold hover:bg-[#2A2D31] transition-colors">Back</button>
                  <button 
                    disabled={!paymentMethod || processing}
                    onClick={async () => {
                      if (!paymentMethod || processing) return;
                      setProcessing(true);
                      try {
                        await handleConfirm();
                      } catch (err) {
                        showToast(err instanceof Error ? err.message : 'Payment failed', 'error');
                        setProcessing(false);
                      }
                    }}
                    className="flex-1 py-4 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] transition-colors shadow-lg shadow-[#C8A25E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : `Pay NPR ${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-[#8E9299] mb-8">
                  {companion.name} will review your request and get back to you shortly. You can track this in your Bookings tab.
                </p>
                <button 
                  onClick={onComplete}
                  className="w-full py-4 bg-[#1E2124] text-white rounded-xl font-bold hover:bg-[#2A2D31] transition-colors border border-[#2A2D31]"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
