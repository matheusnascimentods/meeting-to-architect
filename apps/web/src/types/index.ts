export type LabelVariant = "accent" | "success" | "attention" | "danger";

export type DiagramType = "sequence" | "c4" | "class";

export type Diagram = {
  id: string | number;
  title: string;
  type?: string;
  description: string;
  data: string;
  created_at?: string;
  createdByUser?: string;
  variant?: LabelVariant;
};
