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

let templatesInMemory: VisitTemplate[] = [];

export function listTemplates(): VisitTemplate[] {
  return templatesInMemory;
}

export function saveTemplate(input: Omit<VisitTemplate, 'id'>): VisitTemplate {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const tpl: VisitTemplate = { id, ...input };
  templatesInMemory = [tpl, ...templatesInMemory];
  return tpl;
}

export function deleteTemplate(id: string) {
  templatesInMemory = templatesInMemory.filter((t) => t.id !== id);
}
