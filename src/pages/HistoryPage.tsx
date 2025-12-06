import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getPatientHistory } from '../services/api';
import { useVisit } from '../context/VisitContext';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export const HistoryPage: React.FC = () => {
  const query = useQuery();
  const phoneFromQuery = query.get('phone') || '';
  const [phone, setPhone] = useState(phoneFromQuery);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { visit, update } = useVisit();
  const navigate = useNavigate();

  const load = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const data = await getPatientHistory(phone);
      setHistory(data);
    } catch {
      // offline or API error, ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneFromQuery) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewVisitFromLatest = () => {
    if (!history.length) return;
    const latest = history[0];
    const latestPatient = latest.patient || {};

    update({
      patient: {
        ...visit.patient,
        firstName: latestPatient.firstName || '',
        lastName: latestPatient.lastName || '',
        age: '', // doctor enters current age for this visit
        gender: latestPatient.gender || '',
        phone: latestPatient.phone || phone,
        weight: '',
        bloodPressure: ''
      },
      notes: '',
      symptoms: [],
      diagnosis: [],
      medications: [],
      visitDateIso: new Date().toISOString()
    });

    navigate('/patient');
  };

  return (
    <Layout title="History (1 year)">
      <section className="mb-3 rounded-xl border bg-white p-3">
        <div className="mb-2 flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Phone</label>
          <input
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone"
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
        >
          Load History
        </button>
      </section>

      {loading && <div className="text-xs text-slate-500">Loading…</div>}

      {!loading && history.length > 0 && (
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

      {!loading &&
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
    </Layout>
  );
};
