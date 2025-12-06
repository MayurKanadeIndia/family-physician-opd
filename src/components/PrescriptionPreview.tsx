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
              <span className="font-bold">Patient Name:</span> <span className="font-bold">{fullName || '—'}</span>
            </div>
            <div>
              <span className="font-bold">Age:</span> <span className="font-bold">{visit.patient.age || '—'} Years </span>
            </div>
            <div>
              <span className="font-bold">Allergic To:</span>{' '}
             <span className="font-bold"> {visit.patient.allergies || 'None'} </span>
            </div>
          </div>
          <div className="w-1/2 text-right">
            <div>
              <span className="font-bold">Gender:</span>{' '}
             <span className="font-bold"> {visit.patient.gender || '—'} </span>
            </div>

            <div>
              <span className="font-bold">Date:</span>{' '}
              <span className="font-bold">{new Date(visit.visitDateIso).toLocaleString()}
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-2 text-[11px]">
        <div className="flex justify-between">
          <div>
            <span className="font-bold">Weight:</span>{' '}
            <span className="font-bold">{visit.patient.weight || '—'} {visit.patient.weight ? 'kg' : ''} </span>
          </div>
          <div>
            <span className="font-bold">BP:</span>{' '}
            <span className="font-bold">{visit.patient.bloodPressure || '—'} {visit.patient.bloodPressure ? 'mmHg' : ''}</span>
          </div>
        </div>
      </div>

      {visit.notes && (
        <div className="mt-3 mb-2 text-[11px]">
          <div className="font-bold">Note: <></>
          {visit.notes}</div>
        </div>
      )}

      <div className="mt-4 text-[11px] text-left">
        {visit.medications.length > 0 && (
          <div className="mb-2 font-bold uppercase tracking-wide">Medicines</div>
        )}
        {visit.medications.map((m, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-bold">{idx + 1}. {m.name}</div>
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

      <div className="mt-8 flex  text-[11px]text-left">
        <div className="text-left">
          <div className="text-left">Signature: ____________________________</div>
          <div className="font-bold">{visit.doctorName}</div>
        </div>
      </div>
    </div>
  );
};
