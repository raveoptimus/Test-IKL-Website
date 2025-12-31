import { Player, Role, Team, DreamTeamSubmission, AppConfig } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V5'; 

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLASH]: 'CLASH LANE',
  [Role.FARM]: 'FARM LANE',
  [Role.JUNGLE]: 'JUNGLER',
  [Role.MID]: 'MID LANE',
  [Role.ROAM]: 'ROAMER'
};

// --- GLOBAL CONFIGURATION (SOURCE OF TRUTH) ---
// PASTE YOUR CONFIG FROM ADMIN PANEL HERE to apply it to all users
export const GLOBAL_CONFIG: AppConfig = {
  logoUrl: "https://drive.google.com/file/d/1nRGF3ELWXAcpdnkQzvXHlCfHqgXQUclF/view?usp=drive_link",
  googleFormUrl: "",
  playersSheetUrl: "", // Paste your CSV Link here
  teamsSheetUrl: ""    // Paste your CSV Link here
};

// --- MOCK DATA (Fallback if Sheets fail) ---

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  {
    "id": "1",
    "name": "RRQ.Harpist",
    "team": "REX REGUM QEON",
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
    "name": "REX REGUM QEON",
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