import React from 'react';
import { Layout } from '../components/Layout';
import { useVisit } from '../context/VisitContext';

export const PatientDetailsPage: React.FC = () => {
  const { visit, update } = useVisit();

  const setPatientField = (field: string, value: string) => {
    update({
      patient: {
        ...visit.patient,
        [field]: value
      }
    });
  };

  return (
    <Layout title="Patient Details">
      <section className="rounded-xl border bg-white p-3">
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

        <div className="mb-2 grid grid-cols-3 gap-2">
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
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Temperature (°C)</label>
            <input
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={visit.patient.temperature}
              onChange={(e) => setPatientField('temperature', e.target.value)}
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
      </section>

      <section className="mt-3 rounded-xl border bg-white p-3">
        <div className="mb-2 flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Visit date &amp; time</label>
          <input
            type="datetime-local"
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
            value={visit.visitDateIso.slice(0, 16)}
            onChange={(e) =>
              update({ visitDateIso: new Date(e.target.value).toISOString() })
            }
          />
        </div>
      </section>
    </Layout>
  );
};
