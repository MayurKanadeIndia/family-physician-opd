import React from 'react';
import { Layout } from '../components/Layout';
import { MedicationSearch } from '../components/MedicationSearch';
import { useVisit } from '../context/VisitContext';

export const MedicationsPage: React.FC = () => {
  const { visit, update } = useVisit();

  return (
    <Layout title="Medications">
      <MedicationSearch
        medications={visit.medications}
        onChange={(meds) => update({ medications: meds })}
      />
    </Layout>
  );
};
