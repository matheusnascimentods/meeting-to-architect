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
  created_by?: string;
  variant?: LabelVariant;
};
