import { Player, Role, Team, DreamTeamSubmission, AppConfig, Match } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V21-FIXED'; 

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLASH]: 'CLASH LANE',
  [Role.FARM]: 'FARM LANE',
  [Role.JUNGLE]: 'JUNGLER',
  [Role.MID]: 'MID LANE',
  [Role.ROAM]: 'ROAMER'
};



// --- PASTE THIS INTO constants.ts (Replace existing GLOBAL_CONFIG) ---
export const GLOBAL_CONFIG: AppConfig = {
  "logoUrl": "https://drive.google.com/thumbnail?id=1nRGF3ELWXAcpdnkQzvXHlCfHqgXQUclF&sz=w1000",
  "googleFormUrl": "https://script.google.com/macros/s/AKfycbw-YWflS7ZUauerR664Oumj7yNWRl9e2R5RjTCyLh3OZwZOetxIreWBPDyf8Wmdqrm-6w/exec",
  "playersSheetUrl": "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDgxWI1M9k61wI-h9N-SBs5oRP6L56-46tu6aZdr1QEcdR-lLjwtYq_ySQgsCjtd4KQRRZe7osiR3A/pub?gid=0&single=true&output=csv",
  "teamsSheetUrl": "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDgxWI1M9k61wI-h9N-SBs5oRP6L56-46tu6aZdr1QEcdR-lLjwtYq_ySQgsCjtd4KQRRZe7osiR3A/pub?gid=777170230&single=true&output=csv",
  "kvUrl": "https://drive.google.com/thumbnail?id=1FcUCzvm9VitTGrWJyVndzMQZbEMG1lDv&sz=w1000",
  "aboutText": "Indonesia Kings Laga (IKL) is the premier Honor of Kings esports tournament in the region. Established in 2025, we bring together the best talent to compete for glory, honor, and the championship title. Join us as we write history."
};
    
    

// --- MOCK DATA (Fallback if Sheets fail) ---

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', teamA: 'RRQ', teamB: 'ONIC', date: '2025-10-25', time: '18:30 WIB', status: 'Live', scoreA: 1, scoreB: 1, format: 'Bo3', stage: 'WEEK 1 - DAY 1' },
  { id: 'm2', teamA: 'EVOS', teamB: 'BTR', date: '2025-10-25', time: '20:30 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 1' },
  { id: 'm3', teamA: 'GEEK', teamB: 'AE', date: '2025-10-26', time: '16:00 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 2' },
  { id: 'm4', teamA: 'RRQ', teamB: 'EVOS', date: '2025-10-26', time: '19:00 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 2' },
];

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  {
    "id": "1",
    "name": "RRQ.Harpist",
    "team": "RRQ",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1wBPg4cSl_QffKYsiDYv_PH-xFdtm4X_4&sz=w1000",
    "stats": { "matches": 35, "kill": 81, "death": 54, "assist": 125, "gpm": 810.8 }
  },
  {
    "id": "2",
    "name": "BTR.ZhanQ",
    "team": "BTR",
    "role": Role.MID,
    "image": "", 
    "stats": { "matches": 30, "kill": 95, "death": 40, "assist": 100, "gpm": 750 }
  },
  {
    "id": "3",
    "name": "ONIC.Senkoo",
    "team": "ONIC",
    "role": Role.JUNGLE,
    "image": "",
    "stats": { "matches": 32, "kill": 110, "death": 35, "assist": 80, "gpm": 850 }
  },
  {
    "id": "4",
    "name": "EVOS.Raven",
    "team": "EVOS",
    "role": Role.CLASH,
    "image": "",
    "stats": { "matches": 28, "kill": 60, "death": 45, "assist": 110, "gpm": 680 }
  }
];

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = [
  { "id": "t1", "name": "RRQ", "matchPoints": 15, "matchWins": 10, "matchLosses": 2, "gameWins": 21, "gameLosses": 5, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t2", "name": "BTR", "matchPoints": 12, "matchWins": 8, "matchLosses": 4, "gameWins": 18, "gameLosses": 10, "logo": "" },
  { "id": "t3", "name": "ONIC", "matchPoints": 10, "matchWins": 7, "matchLosses": 5, "gameWins": 16, "gameLosses": 12, "logo": "" },
  { "id": "t4", "name": "EVOS", "matchPoints": 9, "matchWins": 6, "matchLosses": 6, "gameWins": 14, "gameLosses": 14, "logo": "" }
];
    

export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [];