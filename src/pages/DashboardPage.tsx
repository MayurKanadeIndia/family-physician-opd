import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { listPatients } from '../services/api';
import { useVisit } from '../context/VisitContext';

export const DashboardPage: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reset } = useVisit();

  const load = async () => {
    try {
      setLoading(true);
      const data = await listPatients();
      setPatients(data);
    } catch {
      // offline or API error: ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleNewVisit = () => {
    reset();
    navigate('/patient');
  };

  const openHistory = (phone: string) => {
    navigate('/history?phone=' + encodeURIComponent(phone));
  };

  return (
    <Layout title="Dashboard">
      <section className="mb-3 rounded-xl border bg-white p-3">
        <button
          type="button"
          onClick={handleNewVisit}
          className="w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
        >
          New Patient Visit
        </button>
      </section>

      <section className="rounded-xl border bg-white p-3">
        <div className="mb-2 text-sm font-semibold">Recent Patients</div>
        {loading && <div className="text-xs text-slate-500">Loading…</div>}
        {!loading && patients.length === 0 && (
          <div className="text-xs text-slate-500">
            No patients yet. Start by creating a new visit.
          </div>
        )}
        {!loading && patients.length > 0 && (
          <div className="divide-y rounded-xl border text-xs">
            {patients.map((p) => (
              <button
                key={p.phone}
                type="button"
                onClick={() => openHistory(p.phone)}
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

      <div className="mt-3 text-center text-[10px] text-slate-400">
        Powered by <span className="font-semibold">MK</span>
      </div>
    </Layout>
  );
};
