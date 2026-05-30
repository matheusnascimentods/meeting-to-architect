export type LabelVariant = "accent" | "success" | "attention" | "danger";

export type DiagramType = 
  | "class" | "component" | "object" | "deployment" | "package" | "composite"
  | "sequence" | "activity" | "use-case" | "state" | "communication" | "timing" | "interaction-overview"
  | "c4";

export type Diagram = {
  id: string | number;
  title: string;
  type?: string;
  description: string;
  data: string;
  createdAt?: string;
  createdByUser?: string;
  variant?: LabelVariant;
};
