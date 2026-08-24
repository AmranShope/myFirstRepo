import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-[#1D327B] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between space-x-reverse space-x-3 border border-white/20 animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center space-x-reverse space-x-2">
        <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
