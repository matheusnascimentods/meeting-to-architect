export type LabelVariant = "accent" | "success" | "attention" | "danger";

export type DiagramType = 
  | "class" | "component" | "object" | "deployment" | "package" | "composite"
  | "sequence" | "activity" | "use-case" | "state" | "communication" | "timing" | "interaction-overview"
  | "c4";

export type Diagram = {
  id: string;
  title: string;
  type?: string;
  description: string;
  mermaid_code: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  team_id?: string | null;
  creator?: { name: string };
  variant?: LabelVariant;
};

export interface DiagramRequest {
  id: string;
  diagram_id: string;
  user_id: string;
  team_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  Diagrams?: {
    title: string;
    type: string;
  };
  Users?: {
    name: string;
    email: string;
  };
}
