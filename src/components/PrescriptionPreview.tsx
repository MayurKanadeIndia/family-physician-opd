import React from 'react';
import type { Visit } from '../context/VisitContext';

interface Props {
  visit: Visit;
}

export const PrescriptionPreview: React.FC<Props> = ({ visit }) => {
  const fullName = `${visit.patient.firstName} ${visit.patient.lastName}`.trim();

  return (
    <div className="text-xs leading-relaxed">
      <div className="mb-2 text-[11px]">
        <div className="flex justify-between">
          <div className="w-1/2">
            <div>
              <span className="font-semibold">Patient Name:</span> {fullName || '—'}
            </div>
            <div>
              <span className="font-semibold">Age:</span> {visit.patient.age || '—'} Years
            </div>
            <div>
              <span className="font-semibold">Allergic To:</span>{' '}
              {visit.patient.allergies || 'None'}
            </div>
          </div>
          <div className="w-1/2 text-right">
            <div>
              <span className="font-semibold">Gender:</span>{' '}
              {visit.patient.gender || '—'}
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{' '}
              {visit.patient.phone || '—'}
            </div>
            <div>
              <span className="font-semibold">Date:</span>{' '}
              {new Date(visit.visitDateIso).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2 text-[11px]">
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Weight:</span>{' '}
            {visit.patient.weight || '—'} {visit.patient.weight ? 'kg' : ''}
          </div>
          <div>
            <span className="font-semibold">BP:</span>{' '}
            {visit.patient.bloodPressure || '—'} {visit.patient.bloodPressure ? 'mmHg' : ''}
          </div>
        </div>
      </div>

      {visit.notes && (
        <div className="mt-3 mb-2 text-[11px]">
          <div className="font-semibold">Notes:</div>
          <div>{visit.notes}</div>
        </div>
      )}

      <div className="mt-4 text-[11px] text-center">
        {visit.medications.length > 0 && (
          <div className="mb-2 font-semibold uppercase tracking-wide">Medicines</div>
        )}
        {visit.medications.map((m, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-semibold">{idx + 1}. {m.name}</div>
            {Boolean(m.morning || m.noon || m.night) && (
              <div>
                Morning: {m.morning || '0'} &nbsp;|&nbsp; Afternoon: {m.noon || '0'} &nbsp;|&nbsp; Night: {m.night || '0'}
              </div>
            )}
            {(m.beforeAfter || m.period) && (
              <div className="text-[10px] text-slate-700">
                {m.beforeAfter && <span>{m.beforeAfter}</span>}
                {m.beforeAfter && m.period && <span> · </span>}
                {m.period && <span>{m.period}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end text-[11px]">
        <div className="text-right">
          <div className="mb-4">Signature: ____________________________</div>
          <div className="font-semibold">{visit.doctorName}</div>
        </div>
      </div>
    </div>
  );
};
