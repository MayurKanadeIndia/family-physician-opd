import React from 'react';

const OPTIONS = [
  'OD (Once daily)',
  'BD (Twice daily)',
  'TDS (Thrice daily)',
  'HS (Night)',
  'SOS'
];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const DosageFrequencySelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="mt-1 flex flex-col gap-1">
      <label className="text-[11px] text-slate-500">Frequency</label>
      <select
        className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt.split(' ')[0]}>
            {opt}
          </option>
        ))}
      </select>
      <p className="text-[10px] text-slate-400">
        Breakfast / Lunch / Dinner / Before / After meal can be added in notes.
      </p>
    </div>
  );
};
