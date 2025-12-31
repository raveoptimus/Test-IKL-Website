import { Player, Role, Team, DreamTeamSubmission } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V4, V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V4'; 

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLASH]: 'CLASH LANE',
  [Role.FARM]: 'FARM LANE',
  [Role.JUNGLE]: 'JUNGLER',
  [Role.MID]: 'MID LANE',
  [Role.ROAM]: 'ROAMER'
};

// --- PASTE YOUR ADMIN DATA BELOW THIS LINE ---

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  { 
    id: '1', name: 'R7', team: 'RRQ Hoshi', role: Role.CLASH, 
    stats: { matches: 12, kill: 40, death: 20, assist: 60, gpm: 750 } 
  },
  { 
    id: '2', name: 'Butsss', team: 'ONIC Esports', role: Role.CLASH, 
    stats: { matches: 12, kill: 35, death: 25, assist: 70, gpm: 720 } 
  },
  { 
    id: '3', name: 'Pai', team: 'Alter Ego', role: Role.CLASH, 
    stats: { matches: 10, kill: 30, death: 30, assist: 50, gpm: 690 } 
  },
  
  { 
    id: '4', name: 'Alberttt', team: 'RRQ Hoshi', role: Role.JUNGLE, 
    stats: { matches: 12, kill: 90, death: 15, assist: 40, gpm: 850 } 
  },
  { 
    id: '5', name: 'Kairi', team: 'ONIC Esports', role: Role.JUNGLE, 
    stats: { matches: 12, kill: 85, death: 12, assist: 55, gpm: 880 } 
  },
  { 
    id: '6', name: 'Celiboy', team: 'Alter Ego', role: Role.JUNGLE, 
    stats: { matches: 10, kill: 60, death: 25, assist: 45, gpm: 780 } 
  },

  { 
    id: '7', name: 'Clayyy', team: 'RRQ Hoshi', role: Role.MID, 
    stats: { matches: 12, kill: 50, death: 20, assist: 80, gpm: 650 } 
  },
  { 
    id: '8', name: 'Sanz', team: 'ONIC Esports', role: Role.MID, 
    stats: { matches: 12, kill: 55, death: 18, assist: 85, gpm: 710 } 
  },
  { 
    id: '9', name: 'Udil', team: 'Alter Ego', role: Role.MID, 
    stats: { matches: 10, kill: 45, death: 22, assist: 60, gpm: 640 } 
  },

  { 
    id: '10', name: 'Skylar', team: 'RRQ Hoshi', role: Role.FARM, 
    stats: { matches: 12, kill: 65, death: 18, assist: 45, gpm: 790 } 
  },
  { 
    id: '11', name: 'CW', team: 'ONIC Esports', role: Role.FARM, 
    stats: { matches: 12, kill: 60, death: 15, assist: 50, gpm: 800 } 
  },
  { 
    id: '12', name: 'Nino', team: 'Alter Ego', role: Role.FARM, 
    stats: { matches: 10, kill: 50, death: 20, assist: 40, gpm: 760 } 
  },

  { 
    id: '13', name: 'Vyn', team: 'Bigetron Alpha', role: Role.ROAM, 
    stats: { matches: 12, kill: 15, death: 40, assist: 100, gpm: 450 } 
  },
  { 
    id: '14', name: 'Kiboy', team: 'ONIC Esports', role: Role.ROAM, 
    stats: { matches: 12, kill: 20, death: 35, assist: 110, gpm: 500 } 
  },
  { 
    id: '15', name: 'Rasy', team: 'Alter Ego', role: Role.ROAM, 
    stats: { matches: 10, kill: 10, death: 45, assist: 80, gpm: 420 } 
  },
];

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = [
  { 
    id: 't1', 
    name: 'ONIC Esports', 
    logo: 'https://picsum.photos/100/100', 
    matchPoints: 15,
    matchWins: 10,
    matchLosses: 2,
    gameWins: 21,
    gameLosses: 5,
    description: "The defending champions known for their aggressive playstyle and impeccable macro management." 
  },
  { 
    id: 't2', 
    name: 'RRQ Hoshi', 
    logo: 'https://picsum.photos/101/101', 
    matchPoints: 12,
    matchWins: 9,
    matchLosses: 3,
    gameWins: 19,
    gameLosses: 8,
    description: "The King of Kings. With a massive fanbase and a legacy of excellence."
  },
  { 
    id: 't3', 
    name: 'Alter Ego', 
    logo: 'https://picsum.photos/102/102', 
    matchPoints: 0,
    matchWins: 6,
    matchLosses: 6,
    gameWins: 14,
    gameLosses: 14,
    description: "Known for their unpredictable strategies and high-octane team fights."
  },
  { 
    id: 't4', 
    name: 'Bigetron Alpha', 
    logo: 'https://picsum.photos/103/103', 
    matchPoints: -3,
    matchWins: 5,
    matchLosses: 7,
    gameWins: 12,
    gameLosses: 16,
    description: "The Robot Army. disciplined, calculated, and relentless."
  },
  { 
    id: 't5', 
    name: 'EVOS Legends', 
    logo: 'https://picsum.photos/104/104', 
    matchPoints: -6,
    matchWins: 4,
    matchLosses: 8,
    gameWins: 10,
    gameLosses: 18,
    description: "One of the most storied organizations in the scene."
  },
  { 
    id: 't6', 
    name: 'Aura Fire', 
    logo: 'https://picsum.photos/105/105', 
    matchPoints: -12,
    matchWins: 2,
    matchLosses: 10,
    gameWins: 6,
    gameLosses: 21,
    description: "A team with immense potential and fiery spirit."
  },
];

export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [];