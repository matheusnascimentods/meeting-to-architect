import { Diagram } from '../../types';

type ApiDiagram = {
  id: string;
  title: string;
  description: string;
  type?: string;
  mermaid_code?: string;
  mermaidCode?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  created_by?: string;
  createdBy?: string;
  team_id?: string;
  teamId?: string;
  creator?: { name: string };
};

export function normalizeDiagram(raw: ApiDiagram): Diagram {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    type: raw.type,
    mermaid_code: raw.mermaid_code ?? raw.mermaidCode ?? '',
    created_at: raw.created_at ?? raw.createdAt,
    updated_at: raw.updated_at ?? raw.updatedAt,
    created_by: raw.created_by ?? raw.createdBy,
    team_id: raw.team_id ?? raw.teamId,
    creator: raw.creator,
  };
}

export function normalizeDiagrams(raw: ApiDiagram[]): Diagram[] {
  return raw.map(normalizeDiagram);
}
