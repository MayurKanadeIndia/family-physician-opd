import React from 'react';
import { VisitProvider } from './context/VisitContext';
import { SinglePage } from './pages/SinglePage';

const App: React.FC = () => {
  return (
    <VisitProvider>
      <div className="min-h-screen flex justify-center bg-slate-100">
        <div className="w-full max-w-xl bg-white shadow-sm">
          <SinglePage />
        </div>
      </div>
    </VisitProvider>
  );
};

export default App;
