const BASE_URL = import.meta.env.VITE_GAS_URL || '';

async function post<T>(action: string, data: any): Promise<T> {
  if (!BASE_URL) {
    throw new Error('VITE_GAS_URL is not configured');
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'API error');
  }
  return json.data as T;
}

export function savePatientVisit(visit: any) {
  return post<{ phone: string; visitDateIso: string }>('savePatientVisit', visit);
}

export function getPatientHistory(phone: string) {
  return post<any[]>('getPatientHistory', { phone });
}

export function listPatients() {
  return post<any[]>('listPatients', {});
}

export function generatePrescriptionPDF(visit: any) {
  return post<{ fileId: string; url: string }>('generatePrescriptionPDF', visit);
}
