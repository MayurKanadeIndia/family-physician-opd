import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { MedicationSearch } from '../components/MedicationSearch';
import { useVisit } from '../context/VisitContext';
import { listTemplates, type VisitTemplate } from '../services/templates';

export const MedicationsPage: React.FC = () => {
  const { visit, update } = useVisit();
  const [templates, setTemplates] = useState<VisitTemplate[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    setTemplates(listTemplates());
  }, []);

  const handleApplyTemplate = (id: string) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    update({
      symptoms: tpl.symptoms,
      diagnosis: tpl.diagnosis,
      medications: tpl.medications,
      notes: tpl.notes
    });
  };

  return (
    <Layout title="Medications">
      {templates.length > 0 && (
        <section className="mb-3 rounded-xl border bg-white p-3 text-xs">
          <div className="mb-1 text-[11px] font-semibold text-slate-700">Apply template</div>
          <select
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
            value={selectedId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedId(id);
              if (id) handleApplyTemplate(id);
            }}
          >
            <option value="">Select template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}{t.disease ? ` (${t.disease})` : ''}
              </option>
            ))}
          </select>
        </section>
      )}

      <MedicationSearch
        medications={visit.medications}
        onChange={(meds) => update({ medications: meds })}
      />
    </Layout>
  );
};
