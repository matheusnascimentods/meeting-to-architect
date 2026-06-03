export interface Team {
  id: string;
  name: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'maintainer';
  joined_at?: string;
  Teams?: Team;
  Users?: User;
}

export interface CreateTeamDto {
  name: string;
}

export interface UpdateTeamDto {
  name?: string;
}

export interface UserTeam {
  team_id: string;
  role: 'admin' | 'member' | 'maintainer';
  Teams?: Team;
  teams?: Team; // Add lowercase option
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  Teams?: Team;
}
