export enum Role {
  CLASH = 'clash',
  FARM = 'farm',
  JUNGLE = 'jungle',
  MID = 'mid',
  ROAM = 'roam'
}

export interface PlayerStats {
  matches: number; // Played
  kill: number;
  death: number;
  assist: number;
  gpm: number;
  // Computed values like KDA, Avg Kill, etc., are derived from these
}

export interface Player {
  id: string;
  name: string;
  team: string;
  teamAbv?: string; // New: Abbreviation for display (e.g. RRQ instead of RRQ Hoshi)
  role: Role;
  image?: string; // URL to image
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  matchPoints: number;
  matchWins: number;
  matchLosses: number;
  gameWins: number;
  gameLosses: number;
  description?: string;
}

export interface Match {
  id: string;
  teamA: string; // Team Name
  teamB: string; // Team Name
  date: string;  // ISO Date string YYYY-MM-DD
  time: string;  // Display time e.g. "19:00"
  status: 'Upcoming' | 'Live' | 'Finished';
  scoreA: number;
  scoreB: number;
  format: string; // e.g. "Bo3"
  stage: string;  // e.g. "Week 1 - Day 1"
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

export interface AppConfig {
  logoUrl: string;
  kvUrl?: string;          // Link to Key Visual / Banner Background
  aboutText?: string;      // New: About Us Description text
  googleFormUrl?: string;
  playersSheetUrl?: string; 
  teamsSheetUrl?: string;   
}