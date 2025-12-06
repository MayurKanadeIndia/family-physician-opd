import React, { createContext, useContext, useEffect, useState } from 'react';

export type Medication = {
  name: string;
  morning: string;
  noon: string;
  night: string;
  beforeAfter: string;
  period: string;
};

export type Patient = {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  weight: string;
  bloodPressure: string;
   allergies: string;
};

export type Visit = {
  doctorName: string;
  clinicName: string;
  patient: Patient;
  visitDateIso: string;
  symptoms: string[];
  diagnosis: string[];
  medications: Medication[];
  notes: string;
};

type VisitContextValue = {
  visit: Visit;
  setVisit: (v: Visit) => void;
  update: (patch: Partial<Visit>) => void;
  reset: () => void;
};

const STORAGE_KEY = 'opd_current_visit_v2';

const defaultVisit = (): Visit => ({
  doctorName: 'Dr. Hemant Huilgoalkar',
  clinicName: 'Sai Clinic',
  patient: {
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    weight: '',
    bloodPressure: '',
    allergies: ''
  },
  visitDateIso: new Date().toISOString(),
  symptoms: [],
  diagnosis: [],
  medications: [],
  notes: ''
});

const VisitContext = createContext<VisitContextValue | undefined>(undefined);

export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visit, setVisitState] = useState<Visit>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultVisit();
  });

  const setVisit = (v: Visit) => {
    setVisitState(v);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  };

  const update = (patch: Partial<Visit>) => {
    setVisit({ ...visit, ...patch });
  };

  const reset = () => {
    setVisit(defaultVisit());
  };

  useEffect(() => {
    if (!visit.visitDateIso) {
      update({ visitDateIso: new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VisitContext.Provider value={{ visit, setVisit, update, reset }}>
      {children}
    </VisitContext.Provider>
  );
};

export const useVisit = () => {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error('useVisit must be used within VisitProvider');
  return ctx;
};
