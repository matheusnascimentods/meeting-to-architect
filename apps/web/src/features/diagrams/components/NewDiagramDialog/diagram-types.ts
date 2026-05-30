export type DiagramCategory = 'structural' | 'behavioral' | 'c4'

export interface DiagramType {
  id: string
  label: string
  description: string
  icon: string // Octicon name as string
  category: DiagramCategory
}

export const DIAGRAM_CATEGORIES = [
  { id: 'structural',  label: 'UML Structural'   },
  { id: 'behavioral',  label: 'UML Behavioral'   },
  { id: 'c4',          label: 'C4 Model'         },
] as const

export const DIAGRAM_TYPES: DiagramType[] = [
  // Structural
  { id: 'class',       label: 'Class',                     description: 'Object structure, attributes and relationships',            icon: 'CodeSquareIcon',        category: 'structural' },
  { id: 'component',   label: 'Component',                 description: 'Organization and dependencies between components',          icon: 'PackageIcon',           category: 'structural' },
  { id: 'object',      label: 'Object',                    description: 'Concrete instances of classes at runtime',                  icon: 'DatabaseIcon',          category: 'structural' },
  { id: 'deployment',  label: 'Deployment',                description: 'Infrastructure and distribution of the system',             icon: 'ServerIcon',            category: 'structural' },
  { id: 'package',     label: 'Package',                   description: 'Logical grouping of system elements',                       icon: 'FileDirectoryIcon',     category: 'structural' },
  { id: 'composite',   label: 'Composite Structure',        description: 'Internal structure of a classifier',                        icon: 'GearIcon',              category: 'structural' },
  // Behavioral
  { id: 'sequence',    label: 'Sequence',                  description: 'Interactions between components over time',                  icon: 'ArrowSwitchIcon',       category: 'behavioral' },
  { id: 'activity',    label: 'Activity',                  description: 'Control flow and business processes',                       icon: 'PlayIcon',              category: 'behavioral' },
  { id: 'use-case',    label: 'Use Case',                  description: 'Interactions between actors and the system',                 icon: 'PersonIcon',            category: 'behavioral' },
  { id: 'state',       label: 'State',                     description: 'Lifecycle and state transitions of an object',               icon: 'GitCommitIcon',         category: 'behavioral' },
  { id: 'communication', label: 'Communication',           description: 'Collaboration between objects and their messages',           icon: 'CommentDiscussionIcon', category: 'behavioral' },
  { id: 'timing',      label: 'Timing',                    description: 'Behavior as a function of time',                            icon: 'ClockIcon',             category: 'behavioral' },
  { id: 'interaction-overview', label: 'Interaction Overview', description: 'Combination of activity and sequence diagrams',       icon: 'ThreeBarsIcon',         category: 'behavioral' },
  // C4
  { id: 'c4',          label: 'C4 Context',                description: 'System overview and its external actors',                   icon: 'PackageIcon',           category: 'c4'         },
]

export const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  DIAGRAM_TYPES.map((t) => [t.id, `${t.label} Diagram`])
)
