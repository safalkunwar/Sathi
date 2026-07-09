import React, { useState } from 'react';
import { MapPin, AlertTriangle, Navigation, CheckCircle2 } from 'lucide-react';
import * as motion from 'motion/react-client';

export const SafetyWidget: React.FC = () => {
  const [sosActive, setSosActive] = useState(false);

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-[#17191C] rounded-2xl shadow-2xl border border-[#2A2D31] p-4 w-72 flex flex-col gap-3">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#1E2124] border border-[#2A2D31] flex items-center justify-center relative">
             <div className={`absolute inset-0 rounded-full border-2 ${sosActive ? 'border-red-500' : 'border-[#C8A25E]'} animate-ping opacity-20`}></div>
             <Navigation className={`w-5 h-5 ${sosActive ? 'text-red-500' : 'text-[#C8A25E]'}`} />
           </div>
           <div>
             <h4 className="text-sm font-semibold text-white">
                {sosActive ? 'SOS Protocol Active' : 'Safety Features Active'}
             </h4>
             <p className="text-xs text-[#8E9299]">
                {sosActive ? 'Broadcasting live location' : 'Live tracking enabled'}
             </p>
           </div>
        </div>

        <div className="bg-[#1E2124] rounded-lg p-3 border border-[#2A2D31]">
           <div className="text-xs flex justify-between text-[#8E9299] mb-1">
             <span>Emergency Contacts</span>
             <span className={`${sosActive ? 'text-red-500' : 'text-[#C8A25E]'} font-medium whitespace-nowrap`}>
               {sosActive ? 'Alerted' : 'Shared'}
             </span>
           </div>
           <div className="flex -space-x-2">
             <div className={`w-6 h-6 rounded-full ${sosActive ? 'bg-red-900 text-red-100 border-red-500' : 'bg-[#0F1113] border-[#2A2D31] text-[#E0E0E0]'} border-2 flex justify-center items-center text-[10px] uppercase font-bold transition-colors`}>Mom</div>
             <div className={`w-6 h-6 rounded-full ${sosActive ? 'bg-red-900 text-red-100 border-red-500' : 'bg-[#0F1113] border-[#2A2D31] text-[#E0E0E0]'} border-2 flex justify-center items-center text-[10px] uppercase font-bold transition-colors`}>Sis</div>
           </div>
        </div>

        <button 
          onClick={() => setSosActive(!sosActive)}
          className={`w-full flex items-center justify-center gap-2 py-2 font-medium text-sm rounded-lg transition-colors ${
            sosActive 
              ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
              : 'bg-red-900/30 border border-red-500/30 hover:bg-red-900/50 text-red-500'
          }`}
        >
          {sosActive ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {sosActive ? 'Cancel SOS' : 'Emergency SOS'}
        </button>
      </div>
    </motion.div>
  );
};
