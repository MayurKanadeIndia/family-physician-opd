import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { TagSelector } from '../components/TagSelector';
import { useVisit } from '../context/VisitContext';

const BASE_SYMPTOMS = [
  'Fever',
  'Cough',
  'Cold',
  'Headache',
  'Body ache',
  'Vomiting',
  'Loose motions',
  'Breathlessness',
  'Chest pain',
  'Sore throat'
];

export const SymptomsPage: React.FC = () => {
  const { visit, update } = useVisit();

  const [search, setSearch] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);

  const allOptions = useMemo(
    () => Array.from(new Set([...BASE_SYMPTOMS, ...customSymptoms])),
    [customSymptoms]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return allOptions;
    return allOptions.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOptions, search]);

  const handleAddSymptom = () => {
    const value = search.trim();
    if (!value) return;

    if (!allOptions.includes(value)) {
      setCustomSymptoms((prev) => [...prev, value]);
    }

    if (!visit.symptoms.includes(value)) {
      update({ symptoms: [...visit.symptoms, value] });
    }

    setSearch('');
  };

  const handleClear = () => {
    update({ symptoms: [] });
  };

  return (
    <Layout title="Symptoms">
      <section className="mb-2 flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
          placeholder="Search / add symptom"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSymptom();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddSymptom}
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
        label="Symptoms"
        options={filteredOptions}
        value={visit.symptoms}
        onChange={(val) => update({ symptoms: val })}
      />
    </Layout>
  );
};
