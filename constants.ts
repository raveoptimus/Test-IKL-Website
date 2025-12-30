import { Player, Role, Team, DreamTeamSubmission } from './types';

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'R7', team: 'RRQ Hoshi', role: Role.CLASH, stats: { kda: 4.5, gpm: 750, matches: 12 } },
  { id: '2', name: 'Butsss', team: 'ONIC Esports', role: Role.CLASH, stats: { kda: 3.8, gpm: 720, matches: 12 } },
  { id: '3', name: 'Pai', team: 'Alter Ego', role: Role.CLASH, stats: { kda: 3.2, gpm: 690, matches: 10 } },
  
  { id: '4', name: 'Alberttt', team: 'RRQ Hoshi', role: Role.JUNGLE, stats: { kda: 8.1, gpm: 850, matches: 12 } },
  { id: '5', name: 'Kairi', team: 'ONIC Esports', role: Role.JUNGLE, stats: { kda: 9.2, gpm: 880, matches: 12 } },
  { id: '6', name: 'Celiboy', team: 'Alter Ego', role: Role.JUNGLE, stats: { kda: 5.5, gpm: 780, matches: 10 } },

  { id: '7', name: 'Clayyy', team: 'RRQ Hoshi', role: Role.MID, stats: { kda: 6.0, gpm: 650, matches: 12 } },
  { id: '8', name: 'Sanz', team: 'ONIC Esports', role: Role.MID, stats: { kda: 7.2, gpm: 710, matches: 12 } },
  { id: '9', name: 'Udil', team: 'Alter Ego', role: Role.MID, stats: { kda: 5.8, gpm: 640, matches: 10 } },

  { id: '10', name: 'Skylar', team: 'RRQ Hoshi', role: Role.FARM, stats: { kda: 6.5, gpm: 790, matches: 12 } },
  { id: '11', name: 'CW', team: 'ONIC Esports', role: Role.FARM, stats: { kda: 5.9, gpm: 800, matches: 12 } },
  { id: '12', name: 'Nino', team: 'Alter Ego', role: Role.FARM, stats: { kda: 4.8, gpm: 760, matches: 10 } },

  { id: '13', name: 'Vyn', team: 'Bigetron Alpha', role: Role.ROAM, stats: { kda: 2.5, gpm: 450, matches: 12 } },
  { id: '14', name: 'Kiboy', team: 'ONIC Esports', role: Role.ROAM, stats: { kda: 3.1, gpm: 500, matches: 12 } },
  { id: '15', name: 'Rasy', team: 'Alter Ego', role: Role.ROAM, stats: { kda: 1.9, gpm: 420, matches: 10 } },
];

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = [
  { 
    id: 't1', 
    name: 'ONIC Esports', 
    logo: 'https://picsum.photos/100/100', 
    wins: 10, 
    losses: 2, 
    points: 15,
    description: "The defending champions known for their aggressive playstyle and impeccable macro management. ONIC Esports continues to set the bar high in the league." 
  },
  { 
    id: 't2', 
    name: 'RRQ Hoshi', 
    logo: 'https://picsum.photos/101/101', 
    wins: 9, 
    losses: 3, 
    points: 12,
    description: "The King of Kings. With a massive fanbase and a legacy of excellence, RRQ Hoshi brings star power and mechanical brilliance to every match."
  },
  { 
    id: 't3', 
    name: 'Alter Ego', 
    logo: 'https://picsum.photos/102/102', 
    wins: 6, 
    losses: 6, 
    points: 0,
    description: "Known for their unpredictable strategies and high-octane team fights. Alter Ego is the dark horse that can take down any giant on their day."
  },
  { 
    id: 't4', 
    name: 'Bigetron Alpha', 
    logo: 'https://picsum.photos/103/103', 
    wins: 5, 
    losses: 7, 
    points: -3,
    description: "The Robot Army. disciplined, calculated, and relentless. Bigetron Alpha is looking to climb the ranks with their revamped roster."
  },
  { 
    id: 't5', 
    name: 'EVOS Legends', 
    logo: 'https://picsum.photos/104/104', 
    wins: 4, 
    losses: 8, 
    points: -6,
    description: "One of the most storied organizations in the scene. EVOS Legends is rebuilding to reclaim their former glory with new young talents."
  },
  { 
    id: 't6', 
    name: 'Aura Fire', 
    logo: 'https://picsum.photos/105/105', 
    wins: 2, 
    losses: 10, 
    points: -12,
    description: "A team with immense potential and fiery spirit. Aura Fire is fighting tooth and nail to secure their spot in the playoffs."
  },
];

// Simulate KV Data for Submissions
export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [
  {
    id: 'sub_1',
    email: 'fan1@example.com',
    instagram: 'https://instagram.com/fan1',
    week: 'Week 1',
    selections: { clash: 'R7', farm: 'Skylar', jungle: 'Alberttt', mid: 'Clayyy', roam: 'Vyn' },
    submittedAt: '2025-09-01T10:00:00Z'
  },
  {
    id: 'sub_2',
    email: 'fan2@example.com',
    instagram: 'https://instagram.com/fan2',
    week: 'Week 1',
    selections: { clash: 'Butsss', farm: 'CW', jungle: 'Kairi', mid: 'Sanz', roam: 'Kiboy' },
    submittedAt: '2025-09-01T12:30:00Z'
  }
];