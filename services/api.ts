import { Player, Team, DreamTeamSubmission, AppConfig, Role, Match } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS, MOCK_MATCHES, DATA_VERSION, ROLE_LABELS, GLOBAL_CONFIG } from '../constants';

// --- STORAGE KEYS ---
const KEY_PLAYERS = 'ikl_data_players_v2';
const KEY_TEAMS = 'ikl_data_teams_v2';
const KEY_CONFIG = 'ikl_data_config_v2';
const KEY_VERSION = 'ikl_data_version';

// --- HELPER: CSV PARSER ---
const parseCSVLine = (line: string): string[] => {
    const result = [];
    let startValueIndex = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            let val = line.substring(startValueIndex, i).trim();
            // Remove surrounding quotes if present
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            // Handle double double-quotes used as escape
            val = val.replace(/""/g, '"');
            result.push(val);
            startValueIndex = i + 1;
        }
    }
    let lastVal = line.substring(startValueIndex).trim();
    if (lastVal.startsWith('"') && lastVal.endsWith('"')) lastVal = lastVal.slice(1, -1);
    lastVal = lastVal.replace(/""/g, '"');
    result.push(lastVal);
    return result;
};

// --- HELPER: ROBUST NUMBER PARSER ---
const parseNumeric = (val: string | undefined): number => {
    if (!val) return 0;
    // Remove commas (often used in formatted numbers like 1,200)
    const clean = val.toString().replace(/,/g, '');
    const num = Number(clean);
    return isNaN(num) ? 0 : num;
};

// --- HELPER: NORMALIZE ROLE ---
const normalizeRole = (rawRole: string): Role => {
    if (!rawRole) return Role.CLASH;
    const s = String(rawRole).toLowerCase().trim();
    
    // Exact mapping for clean data
    if (s === 'clash' || s === 'exp') return Role.CLASH;
    if (s === 'jungle' || s === 'jungler') return Role.JUNGLE;
    if (s === 'mid' || s === 'midlane') return Role.MID;
    if (s === 'roam' || s === 'roamer') return Role.ROAM;
    if (s === 'farm' || s === 'gold') return Role.FARM;

    const clean = s.replace(/[\s\-_]/g, '');
    if (clean.includes('jung')) return Role.JUNGLE;
    if (clean.includes('mid') || clean.includes('mage')) return Role.MID;
    if (clean.includes('roam') || clean.includes('tank') || clean.includes('supp')) return Role.ROAM;
    if (clean.includes('farm') || clean.includes('gold') || clean.includes('mm')) return Role.FARM;
    return Role.CLASH; 
};

// --- HELPER: SMART DRIVE LINK CLEANER ---
const cleanDriveLink = (url: string | undefined): string | undefined => {
    if (!url || typeof url !== 'string') return undefined;
    const makeDirectLink = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    if (url.includes('drive.google.com')) {
        const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch && fileMatch[1]) return makeDirectLink(fileMatch[1]);
        const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) return makeDirectLink(idMatch[1]);
    }
    return url;
};

// --- HELPER: CHECK VERSION AND RESET ---
const checkVersionAndReset = () => {
    const storedVersion = localStorage.getItem(KEY_VERSION);
    if (storedVersion !== DATA_VERSION) {
        console.log(`New version detected (Old: ${storedVersion}, New: ${DATA_VERSION}). Resetting data to defaults.`);
        // Reset ALL data to ensure GLOBAL_CONFIG from constants.ts is applied
        localStorage.setItem(KEY_PLAYERS, JSON.stringify(MOCK_PLAYERS));
        localStorage.setItem(KEY_TEAMS, JSON.stringify(MOCK_TEAMS));
        localStorage.setItem(KEY_CONFIG, JSON.stringify(GLOBAL_CONFIG));
        localStorage.setItem(KEY_VERSION, DATA_VERSION);
    }
};

checkVersionAndReset();

// --- HELPER: LOAD FROM STORAGE ---
const loadFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultVal;
  }
};

const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}`, e);
    return false;
  }
};

// --- INITIALIZE STATE ---
let currentPlayers = loadFromStorage<Player[]>(KEY_PLAYERS, [...MOCK_PLAYERS]);
let currentTeams = loadFromStorage<Team[]>(KEY_TEAMS, [...MOCK_TEAMS]);

// Use GLOBAL_CONFIG from constants.ts as the default
const storedConfig = loadFromStorage<AppConfig>(KEY_CONFIG, GLOBAL_CONFIG);
let currentConfig: AppConfig = { ...GLOBAL_CONFIG, ...storedConfig };

const SIMULATE_DELAY = 100;

// --- READ OPERATIONS ---

export const getPlayers = async (): Promise<Player[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...currentPlayers]), SIMULATE_DELAY);
  });
};

export const getTeams = async (): Promise<Team[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...currentTeams]), SIMULATE_DELAY);
  });
};

export const getMatches = async (): Promise<Match[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_MATCHES]), SIMULATE_DELAY);
  });
};

export const getSubmissions = async (): Promise<DreamTeamSubmission[]> => {
   return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_SUBMISSIONS]), SIMULATE_DELAY);
  });
};

export const getAppConfig = async (): Promise<AppConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...currentConfig}), SIMULATE_DELAY);
  });
};

// --- REMOTE SYNC OPERATIONS ---

export const syncDataFromSheets = async (): Promise<{ success: boolean; message?: string }> => {
    if (!currentConfig.playersSheetUrl && !currentConfig.teamsSheetUrl) {
        return { success: false, message: "No Sheet URLs configured" };
    }

    let updated = false;

    // 1. Sync Players
    if (currentConfig.playersSheetUrl) {
        try {
            console.log("Fetching Players from Sheet...");
            const response = await fetch(currentConfig.playersSheetUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            let csvText = await response.text();
            // Remove potential Byte Order Mark (BOM)
            csvText = csvText.replace(/^\uFEFF/, ''); 

            const lines = csvText.split('\n');
            if (lines.length < 2) throw new Error("CSV Empty");

            const headers = parseCSVLine(lines[0].toLowerCase());
            
            const newPlayers: Player[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const cols = parseCSVLine(lines[i]);
                
                // Helper to find column index by list of possible names
                const getVal = (keywords: string[]) => {
                    // Try exact matches first
                    let idx = headers.findIndex(h => keywords.includes(h));
                    if (idx !== -1) return cols[idx];
                    
                    // Try fuzzy matches
                    idx = headers.findIndex(h => keywords.some(k => h.includes(k)));
                    return idx !== -1 ? cols[idx] : undefined;
                };

                const name = getVal(['player name', 'playername', 'name', 'ign', 'nick']);
                // Strict check: if no name, skip row
                if (!name) continue;

                const teamName = getVal(['team name', 'teamname', 'team', 'squad']) || 'Unknown';
                // Try to get ABV Team, fallback to full team name
                const teamAbv = getVal(['abv team', 'team abv', 'abv', 'tag', 'code']) || teamName;

                newPlayers.push({
                    id: getVal(['id']) || `p_${i}`,
                    name: name,
                    team: teamName,
                    teamAbv: teamAbv,
                    role: normalizeRole(getVal(['role', 'lane', 'pos', 'position']) || ''),
                    image: cleanDriveLink(getVal(['image', 'photo', 'url', 'pic', 'link'])),
                    stats: {
                        matches: parseNumeric(getVal(['played', 'matches', 'games', 'main'])),
                        kill: parseNumeric(getVal(['kill', 'kills', 'k'])),
                        death: parseNumeric(getVal(['death', 'deaths', 'd'])),
                        assist: parseNumeric(getVal(['assist', 'assists', 'a'])),
                        gpm: parseNumeric(getVal(['gpm', 'gold', 'gold/min']))
                    }
                });
            }

            if (newPlayers.length > 0) {
                await bulkUpdatePlayers(newPlayers);
                updated = true;
            }
        } catch (e) {
            console.error("Failed to sync players", e);
        }
    }

    // 2. Sync Teams
    if (currentConfig.teamsSheetUrl) {
        try {
            console.log("Fetching Teams from Sheet...");
            const response = await fetch(currentConfig.teamsSheetUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            let csvText = await response.text();
            csvText = csvText.replace(/^\uFEFF/, ''); 

            const lines = csvText.split('\n');
            if (lines.length < 2) throw new Error("CSV Empty");

            const headers = parseCSVLine(lines[0].toLowerCase());
            
            const newTeams: Team[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const cols = parseCSVLine(lines[i]);
                
                const getVal = (keywords: string[]) => {
                     let idx = headers.findIndex(h => keywords.includes(h));
                     if (idx !== -1) return cols[idx];
                     idx = headers.findIndex(h => keywords.some(k => h.includes(k)));
                     return idx !== -1 ? cols[idx] : undefined;
                };

                const name = getVal(['team name', 'teamname', 'team', 'name']);
                if (!name) continue;

                newTeams.push({
                    id: getVal(['id']) || `t_${i}`,
                    name: name,
                    logo: cleanDriveLink(getVal(['_logo', 'logo', 'url', 'image', 'pic'])) || '',
                    description: getVal(['desc', 'description']) || '',
                    matchPoints: parseNumeric(getVal(['match point', 'points', 'pts', 'point'])),
                    
                    // Updated keywords for separated Stats columns (e.g. _matchW, _matchL)
                    matchWins: parseNumeric(getVal(['_matchw', 'match w', 'match win', 'win', 'mw'])),
                    matchLosses: parseNumeric(getVal(['_matchl', 'match l', 'match loss', 'loss', 'ml'])),
                    gameWins: parseNumeric(getVal(['_gamew', 'game w', 'game win', 'gw'])),
                    gameLosses: parseNumeric(getVal(['_gamel', 'game l', 'game loss', 'gl'])),
                });
            }

            if (newTeams.length > 0) {
                await bulkUpdateTeams(newTeams);
                updated = true;
            }

        } catch (e) {
             console.error("Failed to sync teams", e);
        }
    }

    if (updated) {
        return { success: true };
    } else {
        return { success: false, message: "Sync attempted but no valid data found or network failed." };
    }
};

// --- WRITE OPERATIONS (ADMIN) ---

// Players
export const updatePlayer = async (updatedPlayer: Player): Promise<boolean> => {
  return new Promise((resolve) => {
    const newPlayers = currentPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
    if (saveToStorage(KEY_PLAYERS, newPlayers)) {
        currentPlayers = newPlayers;
        window.dispatchEvent(new Event('data-updated'));
        resolve(true);
    } else {
        currentPlayers = newPlayers; 
        resolve(false);
    }
  });
};

export const createPlayer = async (newPlayer: Player): Promise<boolean> => {
    return new Promise((resolve) => {
      const newPlayers = [...currentPlayers, newPlayer];
      if (saveToStorage(KEY_PLAYERS, newPlayers)) {
          currentPlayers = newPlayers;
          window.dispatchEvent(new Event('data-updated'));
          resolve(true);
      } else {
          currentPlayers = newPlayers;
          resolve(false);
      }
    });
};

export const deletePlayer = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const newPlayers = currentPlayers.filter(p => p.id !== id);
      if (saveToStorage(KEY_PLAYERS, newPlayers)) {
          currentPlayers = newPlayers;
          window.dispatchEvent(new Event('data-updated'));
          resolve(true);
      } else {
          currentPlayers = newPlayers;
          resolve(false);
      }
    });
};

export const bulkUpdatePlayers = async (players: Player[]): Promise<boolean> => {
    return new Promise((resolve) => {
      currentPlayers = players;
      const saved = saveToStorage(KEY_PLAYERS, players);
      if (saved) {
          window.dispatchEvent(new Event('data-updated'));
      }
      resolve(saved);
    });
};

// Teams
export const updateTeam = async (updatedTeam: Team): Promise<boolean> => {
  return new Promise((resolve) => {
    const newTeams = currentTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    if (saveToStorage(KEY_TEAMS, newTeams)) {
        currentTeams = newTeams;
        window.dispatchEvent(new Event('data-updated'));
        resolve(true);
    } else {
        currentTeams = newTeams;
        resolve(false);
    }
  });
};

export const bulkUpdateTeams = async (teams: Team[]): Promise<boolean> => {
    return new Promise((resolve) => {
      currentTeams = teams;
      const saved = saveToStorage(KEY_TEAMS, teams);
      if (saved) {
          window.dispatchEvent(new Event('data-updated'));
      }
      resolve(saved);
    });
};

// Config
export const updateAppConfig = async (config: AppConfig): Promise<boolean> => {
  return new Promise((resolve) => {
    if (saveToStorage(KEY_CONFIG, config)) {
        currentConfig = config;
        window.dispatchEvent(new Event('storage-config-updated'));
        resolve(true);
    } else {
        currentConfig = config;
        resolve(false);
    }
  });
};

export const submitDreamTeam = async (submission: any): Promise<boolean> => {
  console.log("Submitting:", submission);
  if (currentConfig.googleFormUrl) {
    try {
        await fetch(currentConfig.googleFormUrl, {
            method: 'POST',
            mode: 'no-cors', 
            // Changed from application/json to text/plain to avoid CORS preflight options request which GAS cannot handle
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(submission)
        });
        return true;
    } catch (e) {
        console.error("Submission failed", e);
        return true; 
    }
  }
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};