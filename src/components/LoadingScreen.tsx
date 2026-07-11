import React from 'react';
import { useAppContext } from '../context/AppContext';

export const LoadingScreen: React.FC = () => {
  const { loading } = useAppContext();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0F1113]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#C8A25E] flex items-center justify-center font-bold text-[#0F1113] text-2xl animate-pulse">
          S
        </div>
        <p className="text-[#8E9299] text-sm">Loading SATHI...</p>
      </div>
    </div>
  );
};
