export type LabelVariant = "accent" | "success" | "attention" | "danger";

export type DiagramType = "sequence" | "c4" | "class";

export type Diagram = {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  variant: LabelVariant;
  author: string;
};
