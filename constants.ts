import { Player, Role, Team, DreamTeamSubmission, AppConfig, Match } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V26-MEGA-ROSTER'; 

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
  "aboutText": "Indonesia Kings Laga (IKL) is the premier Honor of Kings esports tournament in Indonesia. Established in 2025, we bring together the best talent to compete for glory, honor, and the championship title. Join us as we write history."
};
    
// --- MOCK DATA (Fallback if Sheets fail) ---

const PLACEHOLDER_IMG = "https://drive.google.com/thumbnail?id=1wBPg4cSl_QffKYsiDYv_PH-xFdtm4X_4&sz=w1000";

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', teamA: 'RRQ', teamB: 'ONIC', date: '2025-10-25', time: '18:30 WIB', status: 'Live', scoreA: 1, scoreB: 1, format: 'Bo3', stage: 'WEEK 1 - DAY 1' },
  { id: 'm2', teamA: 'EVOS', teamB: 'BTR', date: '2025-10-25', time: '20:30 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 1' },
  { id: 'm3', teamA: 'GEEK', teamB: 'AE', date: '2025-10-26', time: '16:00 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 2' },
  { id: 'm4', teamA: 'TLID', teamB: 'DEWA', date: '2025-10-26', time: '19:00 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 2' },
  { id: 'm5', teamA: 'RBL', teamB: 'KAG', date: '2025-10-27', time: '17:00 WIB', status: 'Upcoming', scoreA: 0, scoreB: 0, format: 'Bo3', stage: 'WEEK 1 - DAY 3' },
];

// Simulate KV Data for Teams (10 Teams)
export const MOCK_TEAMS: Team[] = [
  { "id": "t1", "name": "RRQ", "matchPoints": 15, "matchWins": 10, "matchLosses": 2, "gameWins": 21, "gameLosses": 5, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t2", "name": "BTR", "matchPoints": 12, "matchWins": 8, "matchLosses": 4, "gameWins": 18, "gameLosses": 10, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t3", "name": "ONIC", "matchPoints": 10, "matchWins": 7, "matchLosses": 5, "gameWins": 16, "gameLosses": 12, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t4", "name": "EVOS", "matchPoints": 9, "matchWins": 6, "matchLosses": 6, "gameWins": 14, "gameLosses": 14, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t5", "name": "AE", "matchPoints": 6, "matchWins": 4, "matchLosses": 8, "gameWins": 10, "gameLosses": 18, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t6", "name": "GEEK", "matchPoints": 6, "matchWins": 4, "matchLosses": 8, "gameWins": 11, "gameLosses": 19, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t7", "name": "TLID", "matchPoints": 12, "matchWins": 8, "matchLosses": 4, "gameWins": 17, "gameLosses": 11, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t8", "name": "DEWA", "matchPoints": 3, "matchWins": 2, "matchLosses": 10, "gameWins": 8, "gameLosses": 22, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t9", "name": "RBL", "matchPoints": 3, "matchWins": 2, "matchLosses": 10, "gameWins": 7, "gameLosses": 23, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" },
  { "id": "t10", "name": "KAG", "matchPoints": 9, "matchWins": 6, "matchLosses": 6, "gameWins": 13, "gameLosses": 15, "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000" }
];

// Simulate KV Data for Players (62 Players total - 10 Teams)
export const MOCK_PLAYERS: Player[] = [
  // --- RRQ ROSTER (7) ---
  { id: "rrq1", name: "RRQ.R7", team: "RRQ", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 35, kill: 120, death: 60, assist: 150, gpm: 720 } },
  { id: "rrq2", name: "RRQ.Sutsujin", team: "RRQ", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 35, kill: 180, death: 50, assist: 110, gpm: 850 } },
  { id: "rrq3", name: "RRQ.Clayyy", team: "RRQ", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 35, kill: 140, death: 45, assist: 200, gpm: 680 } },
  { id: "rrq4", name: "RRQ.Harpist", team: "RRQ", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 35, kill: 190, death: 54, assist: 90, gpm: 810 } },
  { id: "rrq5", name: "RRQ.Vyn", team: "RRQ", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 35, kill: 40, death: 80, assist: 250, gpm: 500 } },
  { id: "rrq6", name: "RRQ.Lemon", team: "RRQ", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 15, kill: 60, death: 20, assist: 90, gpm: 700 } },
  { id: "rrq7", name: "RRQ.Skylar", team: "RRQ", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 20, kill: 100, death: 30, assist: 45, gpm: 790 } },

  // --- BTR ROSTER (6) ---
  { id: "btr1", name: "BTR.Xorizo", team: "BTR", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 30, kill: 90, death: 65, assist: 120, gpm: 700 } },
  { id: "btr2", name: "BTR.SuperKenn", team: "BTR", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 30, kill: 160, death: 55, assist: 100, gpm: 830 } },
  { id: "btr3", name: "BTR.ZhanQ", team: "BTR", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 30, kill: 155, death: 40, assist: 180, gpm: 750 } },
  { id: "btr4", name: "BTR.Eman", team: "BTR", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 30, kill: 170, death: 60, assist: 80, gpm: 790 } },
  { id: "btr5", name: "BTR.Kyy", team: "BTR", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 30, kill: 30, death: 90, assist: 220, gpm: 510 } },
  { id: "btr6", name: "BTR.Moreno", team: "BTR", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 12, kill: 50, death: 25, assist: 70, gpm: 710 } },

  // --- ONIC ROSTER (6) ---
  { id: "onic1", name: "ONIC.Butsss", team: "ONIC", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 32, kill: 100, death: 50, assist: 140, gpm: 710 } },
  { id: "onic2", name: "ONIC.Senkoo", team: "ONIC", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 32, kill: 210, death: 35, assist: 80, gpm: 880 } },
  { id: "onic3", name: "ONIC.Sanz", team: "ONIC", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 32, kill: 160, death: 40, assist: 190, gpm: 760 } },
  { id: "onic4", name: "ONIC.CW", team: "ONIC", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 32, kill: 180, death: 45, assist: 100, gpm: 820 } },
  { id: "onic5", name: "ONIC.Kiboy", team: "ONIC", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 32, kill: 50, death: 70, assist: 280, gpm: 530 } },
  { id: "onic6", name: "ONIC.Alberttt", team: "ONIC", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 18, kill: 120, death: 30, assist: 60, gpm: 860 } },

  // --- EVOS ROSTER (7) ---
  { id: "evos1", name: "EVOS.Raven", team: "EVOS", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 28, kill: 110, death: 45, assist: 110, gpm: 690 } },
  { id: "evos2", name: "EVOS.Anavel", team: "EVOS", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 28, kill: 140, death: 60, assist: 90, gpm: 800 } },
  { id: "evos3", name: "EVOS.Clawkun", team: "EVOS", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 28, kill: 130, death: 50, assist: 160, gpm: 700 } },
  { id: "evos4", name: "EVOS.Branz", team: "EVOS", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 28, kill: 160, death: 55, assist: 85, gpm: 780 } },
  { id: "evos5", name: "EVOS.Dreams", team: "EVOS", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 28, kill: 25, death: 85, assist: 210, gpm: 490 } },
  { id: "evos6", name: "EVOS.Fluffy", team: "EVOS", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 14, kill: 60, death: 30, assist: 70, gpm: 680 } },
  { id: "evos7", name: "EVOS.Douma", team: "EVOS", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 10, kill: 50, death: 20, assist: 30, gpm: 770 } },
  
  // --- AE ROSTER (6) ---
  { id: "ae1", name: "AE.Pai", team: "AE", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 25, kill: 85, death: 55, assist: 130, gpm: 680 } },
  { id: "ae2", name: "AE.Nnael", team: "AE", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 25, kill: 150, death: 65, assist: 95, gpm: 810 } },
  { id: "ae3", name: "AE.Udil", team: "AE", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 25, kill: 145, death: 48, assist: 170, gpm: 720 } },
  { id: "ae4", name: "AE.Nino", team: "AE", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 25, kill: 165, death: 58, assist: 75, gpm: 770 } },
  { id: "ae5", name: "AE.Rasy", team: "AE", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 25, kill: 20, death: 95, assist: 200, gpm: 480 } },
  { id: "ae6", name: "AE.Celiboy", team: "AE", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 15, kill: 80, death: 40, assist: 100, gpm: 710 } },

  // --- GEEK FAM ROSTER (6) ---
  { id: "geek1", name: "GEEK.Luke", team: "GEEK", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 26, kill: 95, death: 55, assist: 110, gpm: 695 } },
  { id: "geek2", name: "GEEK.Reyy", team: "GEEK", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 26, kill: 135, death: 62, assist: 88, gpm: 790 } },
  { id: "geek3", name: "GEEK.Aboy", team: "GEEK", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 26, kill: 125, death: 48, assist: 150, gpm: 715 } },
  { id: "geek4", name: "GEEK.Caderaa", team: "GEEK", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 26, kill: 155, death: 50, assist: 70, gpm: 785 } },
  { id: "geek5", name: "GEEK.Baloyskie", team: "GEEK", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 26, kill: 35, death: 88, assist: 230, gpm: 505 } },
  { id: "geek6", name: "GEEK.Markyyyyy", team: "GEEK", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 12, kill: 65, death: 25, assist: 35, gpm: 780 } },

  // --- TLID (Team Liquid ID) ROSTER (6) ---
  { id: "tlid1", name: "TLID.Aran", team: "TLID", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 29, kill: 105, death: 52, assist: 125, gpm: 710 } },
  { id: "tlid2", name: "TLID.Gugun", team: "TLID", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 29, kill: 165, death: 58, assist: 92, gpm: 825 } },
  { id: "tlid3", name: "TLID.Yehezkiel", team: "TLID", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 29, kill: 142, death: 44, assist: 175, gpm: 740 } },
  { id: "tlid4", name: "TLID.Kabuki", team: "TLID", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 29, kill: 168, death: 52, assist: 78, gpm: 805 } },
  { id: "tlid5", name: "TLID.Yawi", team: "TLID", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 29, kill: 42, death: 82, assist: 260, gpm: 520 } },
  { id: "tlid6", name: "TLID.Aeron", team: "TLID", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 10, kill: 48, death: 18, assist: 32, gpm: 795 } },

  // --- DEWA UNITED ROSTER (6) ---
  { id: "dewa1", name: "DEWA.Dyxon", team: "DEWA", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 24, kill: 82, death: 60, assist: 105, gpm: 675 } },
  { id: "dewa2", name: "DEWA.Lanaya", team: "DEWA", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 24, kill: 128, death: 68, assist: 85, gpm: 785 } },
  { id: "dewa3", name: "DEWA.Keyz", team: "DEWA", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 24, kill: 115, death: 52, assist: 140, gpm: 690 } },
  { id: "dewa4", name: "DEWA.Watt", team: "DEWA", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 24, kill: 145, death: 58, assist: 65, gpm: 765 } },
  { id: "dewa5", name: "DEWA.Shacco", team: "DEWA", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 24, kill: 22, death: 92, assist: 190, gpm: 475 } },
  { id: "dewa6", name: "DEWA.Pendragon", team: "DEWA", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 10, kill: 35, death: 25, assist: 45, gpm: 670 } },

  // --- RBL (Rebellion) ROSTER (6) ---
  { id: "rbl1", name: "RBL.Karss", team: "RBL", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 23, kill: 78, death: 62, assist: 100, gpm: 665 } },
  { id: "rbl2", name: "RBL.Vincentt", team: "RBL", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 23, kill: 122, death: 70, assist: 80, gpm: 775 } },
  { id: "rbl3", name: "RBL.SwayLow", team: "RBL", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 23, kill: 110, death: 55, assist: 135, gpm: 685 } },
  { id: "rbl4", name: "RBL.Matt", team: "RBL", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 23, kill: 138, death: 62, assist: 60, gpm: 760 } },
  { id: "rbl5", name: "RBL.AudyTzy", team: "RBL", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 23, kill: 25, death: 95, assist: 185, gpm: 470 } },
  { id: "rbl6", name: "RBL.Haizz", team: "RBL", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 8, kill: 40, death: 15, assist: 25, gpm: 755 } },

  // --- KAG (Kagendra) ROSTER (6) ---
  { id: "kag1", name: "KAG.Hanss", team: "KAG", role: Role.CLASH, image: PLACEHOLDER_IMG, stats: { matches: 27, kill: 98, death: 50, assist: 115, gpm: 705 } },
  { id: "kag2", name: "KAG.Wiraww", team: "KAG", role: Role.JUNGLE, image: PLACEHOLDER_IMG, stats: { matches: 27, kill: 155, death: 45, assist: 95, gpm: 840 } },
  { id: "kag3", name: "KAG.Muver", team: "KAG", role: Role.MID, image: PLACEHOLDER_IMG, stats: { matches: 27, kill: 135, death: 42, assist: 165, gpm: 730 } },
  { id: "kag4", name: "KAG.Backdoor", team: "KAG", role: Role.FARM, image: PLACEHOLDER_IMG, stats: { matches: 27, kill: 162, death: 48, assist: 75, gpm: 795 } },
  { id: "kag5", name: "KAG.Starlest", team: "KAG", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 27, kill: 38, death: 75, assist: 240, gpm: 515 } },
  { id: "kag6", name: "KAG.Zero", team: "KAG", role: Role.ROAM, image: PLACEHOLDER_IMG, stats: { matches: 10, kill: 15, death: 30, assist: 80, gpm: 500 } }
];

export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [];