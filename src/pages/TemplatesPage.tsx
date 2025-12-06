import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useVisit } from '../context/VisitContext';
import { MedicationSearch } from '../components/MedicationSearch';
import { deleteTemplate, listTemplates, saveTemplate, type VisitTemplate } from '../services/templates';

export const TemplatesPage: React.FC = () => {
  const { update } = useVisit();
  const [templates, setTemplates] = useState<VisitTemplate[]>(() => listTemplates());

  const [name, setName] = useState('');
  const [disease, setDisease] = useState('');
  const [medications, setMedications] = useState(() => [] as VisitTemplate['medications']);

  const refresh = () => {
    setTemplates(listTemplates());
  };

  const handleCreateTemplate = () => {
    if (!name.trim()) {
      window.alert('Please enter a template name.');
      return;
    }

    saveTemplate({
      name: name.trim(),
      disease: disease.trim(),
      symptoms: [],
      diagnosis: [],
      medications,
      notes: ''
    });

    setName('');
    setDisease('');
    setMedications([]);
    refresh();
  };

  const handleApply = (tpl: VisitTemplate) => {
    update({
      symptoms: tpl.symptoms,
      diagnosis: tpl.diagnosis,
      medications: tpl.medications,
      notes: tpl.notes
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    deleteTemplate(id);
    refresh();
  };

  return (
    <Layout title="Templates">
      <section className="mb-3 rounded-xl border bg-white p-3 text-xs">
        <div className="mb-2 font-semibold text-slate-700">New Disease Template</div>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Template name</label>
            <input
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. COVID standard"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Disease</label>
            <input
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              placeholder="e.g. COVID"
            />
          </div>
        </div>

        <MedicationSearch medications={medications} onChange={setMedications} />

        <button
          type="button"
          onClick={handleCreateTemplate}
          className="mt-3 w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
        >
          Save template
        </button>
      </section>

      <section className="rounded-xl border bg-white p-3 text-xs">
        <div className="mb-2 font-semibold text-slate-700">Saved Templates</div>
        {templates.length === 0 && (
          <div className="text-slate-500 text-[11px]">No templates yet. Create one above.</div>
        )}
        {templates.length > 0 && (
          <div className="flex flex-col gap-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-slate-200 px-2 py-2 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-[11px]">{t.name}</div>
                  {t.disease && (
                    <div className="text-[10px] text-slate-500">Disease: {t.disease}</div>
                  )}
                  <div className="text-[10px] text-slate-500">
                    {t.medications.length} medicine(s)
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleApply(t)}
                    className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold text-white"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="rounded-full border border-red-500 px-3 py-1 text-[10px] font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};
