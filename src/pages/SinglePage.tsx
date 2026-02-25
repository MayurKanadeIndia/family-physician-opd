import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { MedicationSearch } from '../components/MedicationSearch';
import { PrescriptionPreview } from '../components/PrescriptionPreview';
import { TagSelector } from '../components/TagSelector';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { generatePrescriptionPDF, getPatientHistory, listPatients, savePatientVisit } from '../services/api';
import { deleteTemplate, listTemplates, saveTemplate, type VisitTemplate } from '../services/templates';
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

export const SinglePage: React.FC = () => {
  const { visit, update, reset } = useVisit();
  const { enqueue } = useOfflineQueue();

  const patientRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);

  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [historyPhone, setHistoryPhone] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [symptomSearch, setSymptomSearch] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);

  const [diagSearch, setDiagSearch] = useState('');
  const [customDiag, setCustomDiag] = useState<string[]>([]);

  const [templates, setTemplates] = useState<VisitTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [newTplName, setNewTplName] = useState('');
  const [newTplDisease, setNewTplDisease] = useState('');
  const [newTplMeds, setNewTplMeds] = useState(() => [] as VisitTemplate['medications']);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setPatientsLoading(true);
      const data = await listPatients();
      setPatients(data);
    } catch {
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const loadHistory = async (phone?: string) => {
    const p = (phone ?? historyPhone).trim();
    if (!p) return;

    setHistoryLoading(true);
    try {
      const data = await getPatientHistory(p);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    setTemplates(listTemplates());
  }, []);

  const allSymptomOptions = useMemo(
    () => Array.from(new Set([...BASE_SYMPTOMS, ...customSymptoms])),
    [customSymptoms]
  );

  const filteredSymptomOptions = useMemo(() => {
    if (!symptomSearch) return allSymptomOptions;
    return allSymptomOptions.filter((s) =>
      s.toLowerCase().includes(symptomSearch.toLowerCase())
    );
  }, [allSymptomOptions, symptomSearch]);

  const allDiagnosisOptions = useMemo(
    () => Array.from(new Set([...BASE_DIAGNOSIS, ...customDiag])),
    [customDiag]
  );

  const filteredDiagnosisOptions = useMemo(() => {
    if (!diagSearch) return allDiagnosisOptions;
    return allDiagnosisOptions.filter((d) =>
      d.toLowerCase().includes(diagSearch.toLowerCase())
    );
  }, [allDiagnosisOptions, diagSearch]);

  const setPatientField = (field: string, value: string) => {
    update({
      patient: {
        ...visit.patient,
        [field]: value
      }
    });
  };

  const handleNewVisit = () => {
    reset();
    setMessage(null);
    patientRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openHistoryFromPatient = async (phone: string) => {
    const p = phone.trim();
    if (!p) return;

    setHistoryPhone(p);
    await loadHistory(p);
    historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddSymptom = () => {
    const value = symptomSearch.trim();
    if (!value) return;

    if (!allSymptomOptions.includes(value)) {
      setCustomSymptoms((prev) => [...prev, value]);
    }

    if (!visit.symptoms.includes(value)) {
      update({ symptoms: [...visit.symptoms, value] });
    }

    setSymptomSearch('');
  };

  const handleAddDiagnosis = () => {
    const value = diagSearch.trim();
    if (!value) return;

    if (!allDiagnosisOptions.includes(value)) {
      setCustomDiag((prev) => [...prev, value]);
    }

    if (!visit.diagnosis.includes(value)) {
      update({ diagnosis: [...visit.diagnosis, value] });
    }

    setDiagSearch('');
  };

  const refreshTemplates = () => {
    setTemplates(listTemplates());
  };

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

  const handleCreateTemplate = () => {
    if (!newTplName.trim()) {
      window.alert('Please enter a template name.');
      return;
    }

    saveTemplate({
      name: newTplName.trim(),
      disease: newTplDisease.trim(),
      symptoms: [],
      diagnosis: [],
      medications: newTplMeds,
      notes: ''
    });

    setNewTplName('');
    setNewTplDisease('');
    setNewTplMeds([]);
    refreshTemplates();
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    deleteTemplate(id);
    refreshTemplates();
  };

  const startNewVisitFromLatest = () => {
    if (!history.length) return;
    const latest = history[0];
    const latestPatient = latest.patient || {};

    update({
      patient: {
        ...visit.patient,
        firstName: latestPatient.firstName || '',
        lastName: latestPatient.lastName || '',
        age: '',
        gender: latestPatient.gender || '',
        phone: latestPatient.phone || historyPhone,
        weight: '',
        bloodPressure: '',
        allergies: latestPatient.allergies || ''
      },
      notes: '',
      symptoms: [],
      diagnosis: [],
      medications: [],
      visitDateIso: new Date().toISOString()
    });

    patientRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveVisit = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await savePatientVisit(visit);
      setMessage('Visit saved.');
      loadPatients();
    } catch {
      enqueue(visit);
      setMessage('Saved locally (offline). Will sync when online.');
    } finally {
      setBusy(false);
    }
  };

  const handleGeneratePdf = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await generatePrescriptionPDF(visit);
      setMessage('PDF generated. Opening…');
      window.open(res.url, '_blank');
    } catch {
      setMessage('Error generating PDF. Try again when online.');
    } finally {
      setBusy(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title="">
      <div className="print:hidden">
        <section className="mb-3 rounded-xl border bg-white p-3">
          <button
            type="button"
            onClick={handleNewVisit}
            className="w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
          >
            New Patient Visit
          </button>
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-sm font-semibold">Recent Patients</div>
          {patientsLoading && <div className="text-xs text-slate-500">Loading…</div>}
          {!patientsLoading && patients.length === 0 && (
            <div className="text-xs text-slate-500">
              No patients yet. Start by creating a new visit.
            </div>
          )}
          {!patientsLoading && patients.length > 0 && (
            <div className="divide-y rounded-xl border text-xs">
              {patients.map((p) => (
                <button
                  key={p.phone}
                  type="button"
                  onClick={() => openHistoryFromPatient(p.phone)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-emerald-50"
                >
                  <span>{p.phone}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {p.latestVisit
                      ? new Date(p.latestVisit).toLocaleDateString()
                      : 'No visit'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <div ref={patientRef} className="mb-3" />

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">Patient Details</div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">First Name</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.firstName}
                onChange={(e) => setPatientField('firstName', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Last Name</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.lastName}
                onChange={(e) => setPatientField('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Age (years)</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.age}
                onChange={(e) => setPatientField('age', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Phone Number</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.phone}
                onChange={(e) => setPatientField('phone', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Gender</label>
              <select
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.gender}
                onChange={(e) => setPatientField('gender', e.target.value)}
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Weight (kg)</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.weight}
                onChange={(e) => setPatientField('weight', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Blood Pressure (mmHg)</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={visit.patient.bloodPressure}
                onChange={(e) => setPatientField('bloodPressure', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2 flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Allergies</label>
            <textarea
              rows={2}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={visit.patient.allergies}
              onChange={(e) => setPatientField('allergies', e.target.value)}
            />
          </div>

          <div className="mb-2 flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Notes</label>
            <textarea
              rows={2}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={visit.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Visit date &amp; time</label>
            <input
              type="datetime-local"
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={visit.visitDateIso.slice(0, 16)}
              onChange={(e) => update({ visitDateIso: new Date(e.target.value).toISOString() })}
            />
          </div>
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">Symptoms</div>
          <section className="mb-2 flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
              placeholder="Search / add symptom"
              value={symptomSearch}
              onChange={(e) => setSymptomSearch(e.target.value)}
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
              onClick={() => update({ symptoms: [] })}
              className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
            >
              Clear
            </button>
          </section>

          <TagSelector
            label="Symptoms"
            options={filteredSymptomOptions}
            value={visit.symptoms}
            onChange={(val) => update({ symptoms: val })}
          />
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">Diagnosis</div>
          <section className="mb-2 flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
              placeholder="Search / add diagnosis"
              value={diagSearch}
              onChange={(e) => setDiagSearch(e.target.value)}
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
              onClick={() => update({ diagnosis: [] })}
              className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
            >
              Clear
            </button>
          </section>

          <TagSelector
            label="Diagnosis"
            options={filteredDiagnosisOptions}
            value={visit.diagnosis}
            onChange={(val) => update({ diagnosis: val })}
          />
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">Medications</div>

          {templates.length > 0 && (
            <section className="mb-3 rounded-xl border bg-white p-3 text-xs">
              <div className="mb-1 text-[11px] font-semibold text-slate-700">Apply template</div>
              <select
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={selectedTemplateId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTemplateId(id);
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
        </section>
      </div>

      <section className="mb-3 rounded-xl border bg-white p-3 print:mb-0 print:rounded-none print:border-0 print:bg-transparent print:p-0">
        <div className="print-sheet">
          <section className="print-sheet-inner rounded-xl border bg-white p-3 print:border-0 print:p-0 print:shadow-none">
            <PrescriptionPreview visit={visit} />
          </section>
        </div>
      </section>

      <div className="print:hidden">
        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={busy}
              className="flex-1 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Working…' : 'Generate PDF'}
            </button>
            <button
              type="button"
              onClick={handleSaveVisit}
              disabled={busy}
              className="flex-1 rounded-full bg-slate-800 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save Visit'}
            </button>
          </div>
          {message && <div className="mt-2 text-xs text-slate-700">{message}</div>}
        </section>

        <div ref={historyRef} className="mb-3" />

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">History (1 year)</div>
          <section className="mb-3 rounded-xl border bg-white p-3">
            <div className="mb-2 flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Phone</label>
              <input
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                value={historyPhone}
                onChange={(e) => setHistoryPhone(e.target.value)}
                placeholder="Enter phone"
              />
            </div>
            <button
              type="button"
              onClick={() => loadHistory()}
              className="w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
            >
              Load History
            </button>
          </section>

          {historyLoading && <div className="text-xs text-slate-500">Loading…</div>}

          {!historyLoading && history.length > 0 && (
            <div className="mb-3">
              <button
                type="button"
                onClick={startNewVisitFromLatest}
                className="w-full rounded-full bg-slate-800 py-2 text-sm font-semibold text-white"
              >
                Start new visit from latest record
              </button>
            </div>
          )}

          {!historyLoading &&
            history.map((v, idx) => (
              <section key={idx} className="mb-2 rounded-xl border bg-white p-3 text-xs">
                <div className="mb-1 font-semibold">
                  {new Date(v.visitDateIso || v.date).toLocaleString()}
                </div>
                {v.symptoms && v.symptoms.length > 0 && (
                  <div className="text-[11px]">
                    <span className="font-semibold">Symptoms:</span> {v.symptoms.join(', ')}
                  </div>
                )}
                {v.diagnosis && v.diagnosis.length > 0 && (
                  <div className="text-[11px]">
                    <span className="font-semibold">Diagnosis:</span> {v.diagnosis.join(', ')}
                  </div>
                )}
                {v.medications && v.medications.length > 0 && (
                  <div className="text-[11px]">
                    <span className="font-semibold">Meds:</span>{' '}
                    {v.medications.map((m: any) => m.name).join(', ')}
                  </div>
                )}
              </section>
            ))}
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">Templates</div>

          <section className="mb-3 rounded-xl border bg-white p-3 text-xs">
            <div className="mb-2 font-semibold text-slate-700">New Disease Template</div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">Template name</label>
                <input
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  value={newTplName}
                  onChange={(e) => setNewTplName(e.target.value)}
                  placeholder="e.g. COVID standard"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">Disease</label>
                <input
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  value={newTplDisease}
                  onChange={(e) => setNewTplDisease(e.target.value)}
                  placeholder="e.g. COVID"
                />
              </div>
            </div>

            <MedicationSearch medications={newTplMeds} onChange={setNewTplMeds} />

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
                        onClick={() => handleApplyTemplate(t.id)}
                        className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold text-white"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(t.id)}
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
        </section>

        <section className="mb-3 rounded-xl border bg-white p-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full rounded-full border border-emerald-600 py-2 text-sm font-semibold text-emerald-700"
          >
            Print
          </button>
        </section>

        <div className="mt-3 text-center text-[10px] text-slate-400">
          Powered by <span className="font-semibold">MK</span>
        </div>
      </div>
    </Layout>
  );
};
