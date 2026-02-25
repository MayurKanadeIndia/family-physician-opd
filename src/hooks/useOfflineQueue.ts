import { useEffect, useState } from 'react';
import { savePatientVisit } from '../services/api';

let queueInMemory: any[] = [];

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(() => queueInMemory.length);

  const enqueue = (visit: any) => {
    queueInMemory = [...queueInMemory, visit];
    setPendingCount(queueInMemory.length);
  };

  const flush = async () => {
    const q = queueInMemory;
    if (!q.length) return;
    const remaining: any[] = [];
    for (const v of q) {
      try {
        await savePatientVisit(v);
      } catch {
        remaining.push(v);
      }
    }
    queueInMemory = remaining;
    setPendingCount(queueInMemory.length);
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
