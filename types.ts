export enum Role {
  CLASH = 'clash',
  FARM = 'farm',
  JUNGLE = 'jungle',
  MID = 'mid',
  ROAM = 'roam'
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: Role;
  image?: string; // URL to image
  stats: {
    kda: number;
    gpm: number; // Gold per minute
    matches: number;
  };
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  wins: number;
  losses: number;
  points: number;
  description?: string;
}

export interface DreamTeamSubmission {
  id: string;
  email: string;
  instagram: string;
  week: string;
  selections: {
    [key in Role]: string; // Player Name
  };
  submittedAt: string;
}

export interface StatPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface AppConfig {
  logoUrl: string;
}