import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VisitProvider } from './context/VisitContext';
import { DashboardPage } from './pages/DashboardPage';
import { PatientDetailsPage } from './pages/PatientDetailsPage';
import { SymptomsPage } from './pages/SymptomsPage';
import { DiagnosisPage } from './pages/DiagnosisPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { PrescriptionPreviewPage } from './pages/PrescriptionPreviewPage';
import { HistoryPage } from './pages/HistoryPage';

const App: React.FC = () => {
  return (
    <VisitProvider>
      <div className="min-h-screen flex justify-center bg-slate-100">
        <div className="w-full max-w-xl bg-white shadow-sm">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/patient" element={<PatientDetailsPage />} />
            <Route path="/symptoms" element={<SymptomsPage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/preview" element={<PrescriptionPreviewPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </VisitProvider>
  );
};

export default App;
