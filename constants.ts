import { Player, Role, Team, DreamTeamSubmission, AppConfig } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V12'; 

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
  "kvUrl": "https://drive.google.com/thumbnail?id=1FcUCzvm9VitTGrWJyVndzMQZbEMG1lDv&sz=w1000"
};
    
    

// --- MOCK DATA (Fallback if Sheets fail) ---

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  {
    "id": "1",
    "name": "RRQ.Harpist",
    "team": "RRQ",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1wBPg4cSl_QffKYsiDYv_PH-xFdtm4X_4&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 81,
      "death": 54,
      "assist": 125,
      "gpm": 810.8
    }
  },
  // ... (You can keep your mock data here as backup)
];

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = [
  {
    "id": "t1",
    "name": "RRQ",
    "matchPoints": 15,
    "matchWins": 10,
    "matchLosses": 2,
    "gameWins": 21,
    "gameLosses": 5,
    "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000"
  },
  // ... (You can keep your mock data here as backup)
];
    

export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [];