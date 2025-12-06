import { Medication } from '../context/VisitContext';

export type VisitTemplate = {
  id: string;
  name: string;
  disease: string;
  symptoms: string[];
  diagnosis: string[];
  medications: Medication[];
  notes: string;
};

const STORAGE_KEY = 'opd_visit_templates_v1';

function loadAll(): VisitTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveAll(templates: VisitTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function listTemplates(): VisitTemplate[] {
  return loadAll();
}

export function saveTemplate(input: Omit<VisitTemplate, 'id'>): VisitTemplate {
  const all = loadAll();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const tpl: VisitTemplate = { id, ...input };
  all.unshift(tpl);
  saveAll(all);
  return tpl;
}

export function deleteTemplate(id: string) {
  const all = loadAll();
  saveAll(all.filter((t) => t.id !== id));
}
