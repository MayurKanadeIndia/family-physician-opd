import React from 'react';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { NavBar } from './NavBar';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ title, children }) => {
  const { pendingCount } = useOfflineQueue();

  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-2 print:hidden">
        <div className="text-sm font-semibold truncate">{title}</div>
        <div className="text-right text-[10px] leading-tight">
          {pendingCount > 0 && (
            <div className="text-red-600">Pending sync: {pendingCount}</div>
          )}
          <div className={online ? 'text-emerald-600' : 'text-red-600'}>
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-3 pb-24 pt-2 bg-slate-50 print:p-0 print:bg-white print:overflow-visible">
        {children}
      </main>
      <NavBar />
    </div>
  );
};
