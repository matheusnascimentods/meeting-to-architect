export interface Team {
  id: string;
  name: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at?: string;
  Teams?: Team;
}

export interface CreateTeamDto {
  name: string;
}

export interface UpdateTeamDto {
  name?: string;
}

export interface UserTeam {
  team_id: string;
  role: 'admin' | 'member';
  Teams?: Team;
  teams?: Team; // Add lowercase option
}
