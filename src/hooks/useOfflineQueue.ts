import { useEffect, useState } from 'react';
import { savePatientVisit } from '../services/api';

const QUEUE_KEY = 'opd_pending_visits_v2';

function loadQueue(): any[] {
  try {
    const s = localStorage.getItem(QUEUE_KEY);
    if (!s) return [];
    return JSON.parse(s);
  } catch {
    return [];
  }
}

function saveQueue(q: any[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(() => loadQueue().length);

  const enqueue = (visit: any) => {
    const q = loadQueue();
    q.push(visit);
    saveQueue(q);
    setPendingCount(q.length);
  };

  const flush = async () => {
    const q = loadQueue();
    if (!q.length) return;
    const remaining: any[] = [];
    for (const v of q) {
      try {
        await savePatientVisit(v);
      } catch {
        remaining.push(v);
      }
    }
    saveQueue(remaining);
    setPendingCount(remaining.length);
  };

  useEffect(() => {
    const onOnline = () => {
      flush();
    };
    window.addEventListener('online', onOnline);
    if (navigator.onLine) flush();
    return () => window.removeEventListener('online', onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { pendingCount, enqueue, flush };
}
