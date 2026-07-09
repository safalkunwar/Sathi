import React, { useState } from 'react';
import { Mail, Lock, User, MapPin, DollarSign, Upload, ShieldCheck, Briefcase } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'signup' | 'guide';
  onClose: () => void;
  onSuccess?: (mode: 'login' | 'signup' | 'guide') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'guide'>(initialMode);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) onSuccess(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#17191C] border border-[#2A2D31] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#2A2D31] flex justify-between items-center bg-[#0F1113]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Join as a Guide'}
          </h2>
          <button onClick={onClose} className="text-[#8E9299] hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {(mode === 'signup' || mode === 'guide') && (
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input type="text" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input type="email" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm" placeholder="hello@example.com" />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input type="password" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm" placeholder="••••••••" />
              </div>
            </div>

            {mode === 'guide' && (
              <>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Location / City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input type="text" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm" placeholder="Kathmandu" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Hourly Rate (NPR)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input type="number" required min="500" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2A2D31] bg-[#1E2124] text-white focus:ring-1 focus:ring-[#C8A25E] outline-none text-sm" placeholder="1500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] font-bold block mb-2">Identity Verification</label>
                  <div className="w-full py-6 rounded-xl border-2 border-dashed border-[#2A2D31] bg-[#1E2124] text-[#8E9299] hover:border-[#C8A25E] hover:text-[#C8A25E] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
                     <Upload className="w-6 h-6" />
                     <span className="text-xs">Upload Citizenship / Passport Document</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#1E2124] border border-[#2A2D31] rounded-xl flex items-start gap-3">
                   <input type="checkbox" id="terms" required checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-[#C8A25E]" />
                   <label htmlFor="terms" className="text-xs text-[#8E9299] leading-relaxed cursor-pointer">
                     I agree to the <span className="text-[#C8A25E]">Terms and Conditions</span> and confirm that I have undergone a mandatory background check. I understand that any violation of safety protocols will result in immediate termination.
                   </label>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={mode === 'guide' && !agreed}
              className="w-full py-3 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold hover:bg-[#B69150] transition-colors mt-6 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Submit Application'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8E9299]">
            {mode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-[#C8A25E] font-medium hover:underline">Sign up</button></p>
            ) : mode === 'signup' ? (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-[#C8A25E] font-medium hover:underline">Log in</button></p>
            ) : (
              <p>Just want to browse? <button onClick={() => setMode('signup')} className="text-[#C8A25E] font-medium hover:underline">Create a user account</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
