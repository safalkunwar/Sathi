import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const LoadingScreen: React.FC = () => {
  const { loading } = useAppContext();
  const [timeout, setTimeout] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimeout(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!loading && !timeout) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0F1113]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#C8A25E] flex items-center justify-center font-bold text-[#0F1113] text-2xl animate-pulse">
          S
        </div>
        <p className="text-[#8E9299] text-sm">{timeout ? 'Taking longer than usual...' : 'Loading SATHI...'}</p>
        {timeout && (
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-[#C8A25E] underline"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};
