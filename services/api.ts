import { Player, Team, DreamTeamSubmission, AppConfig } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS, DATA_VERSION } from '../constants';

// --- STORAGE KEYS ---
// Main storage keys
const KEY_PLAYERS = 'ikl_data_players_v2';
const KEY_TEAMS = 'ikl_data_teams_v2';
const KEY_CONFIG = 'ikl_data_config_v2';
const KEY_VERSION = 'ikl_data_version';

// --- HELPER: CHECK VERSION AND RESET ---
const checkVersionAndReset = () => {
    const storedVersion = localStorage.getItem(KEY_VERSION);
    // If stored version doesn't match code version, reset data to defaults
    if (storedVersion !== DATA_VERSION) {
        console.log(`New version detected (Old: ${storedVersion}, New: ${DATA_VERSION}). Resetting data to defaults.`);
        localStorage.setItem(KEY_PLAYERS, JSON.stringify(MOCK_PLAYERS));
        localStorage.setItem(KEY_TEAMS, JSON.stringify(MOCK_TEAMS));
        localStorage.setItem(KEY_VERSION, DATA_VERSION);
        // We do NOT reset config (logoUrl, googleFormUrl) usually, but for major data changes it might be safer
        // For now, let's keep config to preserve settings like Form URL
    }
};

// Check version immediately on load
checkVersionAndReset();

// --- HELPER: LOAD FROM STORAGE ---
const loadFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    // If no data exists yet, save the default mock data immediately
    try {
      localStorage.setItem(key, JSON.stringify(defaultVal));
    } catch (err) {
      console.warn("Could not initialize default data to storage", err);
    }
    return defaultVal;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultVal;
  }
};

// --- HELPER: SAVE TO STORAGE WITH FALLBACK ---
const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}.`, e);
    
    if (Array.isArray(value)) {
        try {
            console.log("Attempting to save text-only data...");
            const cleanValue = value.map(item => {
                const newItem = { ...item };
                if (newItem.image && newItem.image.startsWith('data:')) {
                    newItem.image = ''; 
                }
                if (newItem.logo && newItem.logo.startsWith('data:')) {
                    newItem.logo = '';
                }
                return newItem;
            });
            
            localStorage.setItem(key, JSON.stringify(cleanValue));
            alert("WARNING: Storage Full!\n\nYour TEXT changes were saved, but large IMAGES were removed.");
            return true;
        } catch (retryErr) {
            console.error("Text-only save also failed", retryErr);
        }
    }

    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("CRITICAL ERROR: Storage Full!\n\nChanges could NOT be saved.");
    }
    return false;
  }
};

// --- INITIALIZE STATE ---
// Load synchronously on startup
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
        console.error("Submission failed", e);
        return true; 
    }
  } else {
    console.warn("No Google Web App URL configured.");
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};