import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useVisit } from '../context/VisitContext';
import { PrescriptionPreview } from '../components/PrescriptionPreview';
import { generatePrescriptionPDF, savePatientVisit } from '../services/api';
import { useOfflineQueue } from '../hooks/useOfflineQueue';

export const PrescriptionPreviewPage: React.FC = () => {
  const { visit } = useVisit();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { enqueue } = useOfflineQueue();

  const handleSave = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await savePatientVisit(visit);
      setMessage('Visit saved.');
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
    <Layout title="Prescription">
      <section className="rounded-xl border bg-white p-3 print:border-0 print:p-0 print:shadow-none">
        <PrescriptionPreview visit={visit} />
      </section>
      <div className="mt-3 flex gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 rounded-full border border-emerald-600 py-2 text-sm font-semibold text-emerald-700"
        >
          Print
        </button>
        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={busy}
          className="flex-1 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Working…' : 'Generate PDF'}
        </button>
      </div>
      <div className="mt-2 print:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="w-full rounded-full bg-slate-800 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save Visit'}
        </button>
      </div>
      {message && (
        <div className="mt-2 text-xs text-slate-700 print:hidden">{message}</div>
      )}
    </Layout>
  );
};
