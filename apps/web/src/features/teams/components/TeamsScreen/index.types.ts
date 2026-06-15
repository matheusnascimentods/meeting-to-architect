export type TeamsView =
  | { name: 'list' }
  | { name: 'detail'; team: { id: string; name: string } };
