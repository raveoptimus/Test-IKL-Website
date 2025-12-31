import { Player, Team, DreamTeamSubmission, AppConfig, Role } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS, DATA_VERSION, ROLE_LABELS } from '../constants';

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
            result.push(val);
            startValueIndex = i + 1;
        }
    }
    let lastVal = line.substring(startValueIndex).trim();
    if (lastVal.startsWith('"') && lastVal.endsWith('"')) lastVal = lastVal.slice(1, -1);
    result.push(lastVal);
    return result;
};

// --- HELPER: NORMALIZE ROLE ---
const normalizeRole = (rawRole: string): Role => {
    if (!rawRole) return Role.CLASH;
    const s = String(rawRole).toLowerCase().replace(/[\s\-_]/g, '');
    if (s.includes('jung')) return Role.JUNGLE;
    if (s.includes('mid') || s.includes('mage')) return Role.MID;
    if (s.includes('roam') || s.includes('tank') || s.includes('supp')) return Role.ROAM;
    if (s.includes('farm') || s.includes('gold') || s.includes('mm')) return Role.FARM;
    return Role.CLASH; 
};

// --- HELPER: CHECK VERSION AND RESET ---
const checkVersionAndReset = () => {
    const storedVersion = localStorage.getItem(KEY_VERSION);
    if (storedVersion !== DATA_VERSION) {
        console.log(`New version detected (Old: ${storedVersion}, New: ${DATA_VERSION}). Resetting data to defaults.`);
        localStorage.setItem(KEY_PLAYERS, JSON.stringify(MOCK_PLAYERS));
        localStorage.setItem(KEY_TEAMS, JSON.stringify(MOCK_TEAMS));
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

const defaultConfig: AppConfig = {
  logoUrl: "https://drive.google.com/thumbnail?id=1wBPg4cSl_QffKYsiDYv_PH-xFdtm4X_4&sz=w1000",
  googleFormUrl: ""
};

const storedConfig = loadFromStorage<AppConfig>(KEY_CONFIG, defaultConfig);
let currentConfig: AppConfig = { ...defaultConfig, ...storedConfig };

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
            const csvText = await response.text();
            const lines = csvText.split('\n');
            const headers = parseCSVLine(lines[0].toLowerCase());
            
            // Expected headers: id, name, team, role, image, matches, kill, death, assist, gpm
            const newPlayers: Player[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const cols = parseCSVLine(lines[i]);
                // Basic mapping based on index or header name could be added, 
                // but here we assume a strict column order for simplicity or robust find
                
                // We will use a loose mapping strategy
                const getVal = (keywords: string[]) => {
                    const idx = headers.findIndex(h => keywords.some(k => h.includes(k)));
                    return idx !== -1 ? cols[idx] : undefined;
                };

                const name = getVal(['name', 'player']);
                if (!name) continue;

                newPlayers.push({
                    id: getVal(['id']) || `p_${i}`,
                    name: name,
                    team: getVal(['team']) || 'Unknown',
                    role: normalizeRole(getVal(['role']) || ''),
                    image: getVal(['image', 'photo', 'url']),
                    stats: {
                        matches: Number(getVal(['match', 'played'])) || 0,
                        kill: Number(getVal(['kill'])) || 0,
                        death: Number(getVal(['death'])) || 0,
                        assist: Number(getVal(['assist'])) || 0,
                        gpm: Number(getVal(['gpm', 'gold'])) || 0
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
            const csvText = await response.text();
            const lines = csvText.split('\n');
            const headers = parseCSVLine(lines[0].toLowerCase());
            
            const newTeams: Team[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const cols = parseCSVLine(lines[i]);
                
                const getVal = (keywords: string[]) => {
                    const idx = headers.findIndex(h => keywords.some(k => h.includes(k)));
                    return idx !== -1 ? cols[idx] : undefined;
                };

                const name = getVal(['name', 'team']);
                if (!name) continue;

                newTeams.push({
                    id: getVal(['id']) || `t_${i}`,
                    name: name,
                    logo: getVal(['logo', 'url', 'image']) || '',
                    description: getVal(['desc']) || '',
                    matchPoints: Number(getVal(['point'])) || 0,
                    matchWins: Number(getVal(['match_w', 'match win'])) || 0,
                    matchLosses: Number(getVal(['match_l', 'match loss'])) || 0,
                    gameWins: Number(getVal(['game_w', 'game win'])) || 0,
                    gameLosses: Number(getVal(['game_l', 'game loss'])) || 0,
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
        return { success: false, message: "Sync attempted but no data changed or failed." };
    }
};

// --- WRITE OPERATIONS (ADMIN) ---

// Players
export const updatePlayer = async (updatedPlayer: Player): Promise<boolean> => {
  return new Promise((resolve) => {
    const newPlayers = currentPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
    if (saveToStorage(KEY_PLAYERS, newPlayers)) {
        currentPlayers = newPlayers;
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
      resolve(saved);
    });
};

// Teams
export const updateTeam = async (updatedTeam: Team): Promise<boolean> => {
  return new Promise((resolve) => {
    const newTeams = currentTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    if (saveToStorage(KEY_TEAMS, newTeams)) {
        currentTeams = newTeams;
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

export const submitDreamTeam = async (submission: Omit<DreamTeamSubmission, 'id' | 'submittedAt'>): Promise<boolean> => {
  console.log("Submitting:", submission);
  if (currentConfig.googleFormUrl) {
    try {
        await fetch(currentConfig.googleFormUrl, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        });
        return true;
    } catch (e) {
        return true; 
    }
  }
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};