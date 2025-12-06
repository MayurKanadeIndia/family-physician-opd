import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { TagSelector } from '../components/TagSelector';
import { useVisit } from '../context/VisitContext';

const BASE_DIAGNOSIS = [
  'Upper respiratory infection',
  'Viral fever',
  'Gastroenteritis',
  'Migraine',
  'Hypertension',
  'Diabetes',
  'Back pain',
  'Allergic rhinitis'
];

export const DiagnosisPage: React.FC = () => {
  const { visit, update } = useVisit();

  const [search, setSearch] = useState('');
  const [customDiag, setCustomDiag] = useState<string[]>([]);

  const allOptions = useMemo(
    () => Array.from(new Set([...BASE_DIAGNOSIS, ...customDiag])),
    [customDiag]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return allOptions;
    return allOptions.filter((d) =>
      d.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOptions, search]);

  const handleAddDiagnosis = () => {
    const value = search.trim();
    if (!value) return;

    if (!allOptions.includes(value)) {
      setCustomDiag((prev) => [...prev, value]);
    }

    if (!visit.diagnosis.includes(value)) {
      update({ diagnosis: [...visit.diagnosis, value] });
    }

    setSearch('');
  };

  const handleClear = () => {
    update({ diagnosis: [] });
  };

  return (
    <Layout title="Diagnosis">
      <section className="mb-2 flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
          placeholder="Search / add diagnosis"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddDiagnosis();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddDiagnosis}
          className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
        >
          Add
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
        >
          Clear
        </button>
      </section>

      <TagSelector
        label="Diagnosis"
        options={filteredOptions}
        value={visit.diagnosis}
        onChange={(val) => update({ diagnosis: val })}
      />
    </Layout>
  );
};
