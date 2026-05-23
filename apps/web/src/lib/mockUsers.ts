export const MOCK_USERS = [
  { email: 'matheus@m2a.dev', password: 'senha123', name: 'Matheus Santos' },
  { email: 'brenno@m2a.dev',  password: 'senha456', name: 'Brenno Souza'   },
];

export type User = typeof MOCK_USERS[number];
