import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/patient', label: 'Patient' },
  { to: '/symptoms', label: 'Symptoms' },
  { to: '/diagnosis', label: 'Diagnosis' },
  { to: '/medications', label: 'Meds' },
  { to: '/preview', label: 'Preview' },
  { to: '/history', label: 'History' }
];

export const NavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 border-t bg-white px-1 py-1 flex gap-1 print:hidden">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            'flex-1 rounded-full px-1 py-1 text-center text-[10px] font-medium ' +
            (isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500')
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
};
