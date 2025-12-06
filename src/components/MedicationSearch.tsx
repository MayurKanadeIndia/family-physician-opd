import React, { useMemo, useState } from 'react';
import type { Medication } from '../context/VisitContext';

const BASE_MEDS = [
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicillin 500mg',
  'Pantoprazole 40mg',
  'Cetirizine 10mg',
  'Azithromycin 500mg'
];

interface Props {
  medications: Medication[];
  onChange: (next: Medication[]) => void;
}

export const MedicationSearch: React.FC<Props> = ({ medications, onChange }) => {
  const [search, setSearch] = useState('');
  const [customMeds, setCustomMeds] = useState<string[]>([]);

  const allOptions = useMemo(
    () => Array.from(new Set([...BASE_MEDS, ...customMeds])),
    [customMeds]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return allOptions;
    return allOptions.filter((m) =>
      m.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOptions, search]);

  const addMed = (name: string) => {
    if (!allOptions.includes(name)) {
      setCustomMeds((prev) => [...prev, name]);
    }

    if (!medications.some((m) => m.name === name)) {
      onChange([
        ...medications,
        {
          name,
          morning: '',
          noon: '',
          night: '',
          beforeAfter: '',
          period: '',
          notes: ''
        }
      ]);
    }
    setSearch('');
  };

  const updateMed = (index: number, patch: Partial<Medication>) => {
    const next = medications.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeMed = (index: number) => {
    const next = medications.slice();
    next.splice(index, 1);
    onChange(next);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <section className="rounded-xl border bg-white p-3">
      <div className="mb-2 text-xs font-semibold text-slate-700">Medications</div>

      <section className="mb-2 flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
          placeholder="Search / add medicine"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = search.trim();
              if (value) addMed(value);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            const value = search.trim();
            if (value) addMed(value);
          }}
          className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
        >
          Add
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
        >
          Clear
        </button>
      </section>

      <div className="mb-2 flex flex-wrap gap-2">
        {filteredOptions.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => addMed(name)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700 hover:bg-emerald-50"
          >
            {name}
          </button>
        ))}
      </div>

      {medications.map((m, idx) => (
        <div key={idx} className="border-t border-slate-100 pt-2 mt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold">{m.name}</span>
            <button
              type="button"
              onClick={() => removeMed(idx)}
              className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600"
            >
              Remove
            </button>
          </div>
          <div className="mb-1 grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Morning</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={m.morning}
                onChange={(e) => updateMed(idx, { morning: e.target.value })}
                placeholder="e.g. 1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Noon</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={m.noon}
                onChange={(e) => updateMed(idx, { noon: e.target.value })}
                placeholder="e.g. 0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Night</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={m.night}
                onChange={(e) => updateMed(idx, { night: e.target.value })}
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div className="mb-1 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Before / After Meal</label>
              <select
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={m.beforeAfter}
                onChange={(e) => updateMed(idx, { beforeAfter: e.target.value })}
              >
                <option value="">Select</option>
                <option value="BEFORE MEAL">Before Meal</option>
                <option value="AFTER MEAL">After Meal</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Period</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={m.period}
                onChange={(e) => updateMed(idx, { period: e.target.value })}
                placeholder="e.g. 5 DAYS"
              />
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Notes</label>
            <input
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={m.notes || ''}
              onChange={(e) => updateMed(idx, { notes: e.target.value })}
              placeholder="Optional note"
            />
          </div>
        </div>
      ))}
    </section>
  );
};
