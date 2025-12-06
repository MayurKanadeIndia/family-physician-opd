import React from 'react';
import type { Visit } from '../context/VisitContext';

interface Props {
  visit: Visit;
}

export const PrescriptionPreview: React.FC<Props> = ({ visit }) => {
  const fullName = `${visit.patient.firstName} ${visit.patient.lastName}`.trim();

  return (
    <div className="text-xs leading-relaxed border border-black p-3">
      <div className="flex justify-between border-b border-black pb-2 text-[11px]">
        <div className="w-1/3">
          <div className="font-semibold">{visit.doctorName}</div>
          <div>B.A.M.S, M.D.E.H</div>
          <div>Reg. No: A1-I-11758</div>
          <div>Mobile: 9822636344</div>
        </div>
        <div className="w-1/3 text-center">
          <div className="text-base font-extrabold tracking-wide">
            {visit.clinicName.toUpperCase()}
          </div>
          <div className="text-[10px]">
            Shop No.3, Opp. to Sai Mandir, Bhoir Ali, Keshav Nagar, Chinchwad
          </div>
          <div className="text-[10px]">Mobile: 9822636344</div>
        </div>
        <div className="w-1/3 text-right text-[11px]">
          <div className="font-semibold">Clinic Timings</div>
          <div>Morning: 11:00 AM to 01:30 PM</div>
          <div>Evening: 7:00 PM to 10:00 PM</div>
          <div>Sunday: Closed</div>
        </div>
      </div>

      <div className="border-b border-black py-1 text-center text-sm font-semibold">
        Prescription
      </div>

      <div className="border-b border-black py-2 text-[11px]">
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

      <div className="border-b border-black py-1 text-[11px]">
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Weight:</span>{' '}
            {visit.patient.weight || '—'} {visit.patient.weight ? 'kg' : ''}
          </div>
          <div>
            <span className="font-semibold">BP:</span>{' '}
            {visit.patient.bloodPressure || '—'} {visit.patient.bloodPressure ? 'mmHg' : ''}
          </div>
          <div>
            <span className="font-semibold">Temp:</span>{' '}
            {visit.patient.temperature || '—'} {visit.patient.temperature ? '°C' : ''}
          </div>
        </div>
      </div>

      <div className="mt-2 border border-black text-[11px]">
        <div className="flex border-b border-black bg-slate-100 font-semibold">
          <div className="w-2/5 border-r border-black px-2 py-1">Rx</div>
          <div className="w-1/5 border-r border-black px-2 py-1 text-center">
            Morning
          </div>
          <div className="w-1/5 border-r border-black px-2 py-1 text-center">
            Noon
          </div>
          <div className="w-1/5 border-r border-black px-2 py-1 text-center">
            Night
          </div>
          <div className="w-1/5 border-r border-black px-2 py-1 text-center">
            Before/After
          </div>
          <div className="w-1/5 px-2 py-1 text-center">Period</div>
        </div>
        {visit.medications.map((m, idx) => (
          <div key={idx} className="flex border-b border-black last:border-b-0">
            <div className="w-2/5 border-r border-black px-2 py-1">
              {idx + 1}. {m.name}
            </div>
            <div className="w-1/5 border-r border-black px-2 py-1 text-center">
              {m.morning || '0'}
            </div>
            <div className="w-1/5 border-r border-black px-2 py-1 text-center">
              {m.noon || '0'}
            </div>
            <div className="w-1/5 border-r border-black px-2 py-1 text-center">
              {m.night || '0'}
            </div>
            <div className="w-1/5 border-r border-black px-2 py-1 text-center">
              {m.beforeAfter || '—'}
            </div>
            <div className="w-1/5 px-2 py-1 text-center">{m.period || '—'}</div>
          </div>
        ))}
      </div>

      {visit.notes && (
        <div className="mt-2 border-t border-black pt-2 text-[11px]">
          <div className="font-semibold">Notes:</div>
          <div>{visit.notes}</div>
        </div>
      )}

      <div className="mt-4 border-t border-black pt-2 text-[11px]">
        <div className="font-semibold uppercase">Please do not repeat medicines without medical advice.</div>
        <div>Please inform us of any allergies before starting treatment.</div>
      </div>

      <div className="mt-6 flex justify-end text-[11px]">
        <div className="text-right">
          <div className="mb-6">Signature: ____________________________</div>
          <div className="font-semibold">{visit.doctorName}</div>
        </div>
      </div>
    </div>
  );
};
