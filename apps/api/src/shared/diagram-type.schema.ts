import z from 'zod';

export const UML_DIAGRAM_TYPES = [
  'CLASS',
  'PACKAGE',
  'OBJECT',
  'COMPONENT',
  'DEPLOYMENT',
  'COMPOSITE_STRUCTURE',
  'ACTIVITY',
  'SEQUENCE',
  'COMMUNICATION',
  'INTERACTION_OVERVIEW',
  'TIMING',
  'USE_CASE',
  'STATE',
] as const;

export const C4_DIAGRAM_TYPES = [
  'C4_CONTEXT',
  'C4_CONTAINER',
  'C4_COMPONENT',
  'C4_CODE',
] as const;

export const DiagramTypeSchema = z.enum([
  ...UML_DIAGRAM_TYPES,
  ...C4_DIAGRAM_TYPES,
]);

export type DiagramType = z.infer<typeof DiagramTypeSchema>;

export const UmlDiagramTypeSchema = z.enum(UML_DIAGRAM_TYPES);
export const C4DiagramTypeSchema = z.enum(C4_DIAGRAM_TYPES);
