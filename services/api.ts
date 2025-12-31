import { Player, Team, DreamTeamSubmission, AppConfig } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS } from '../constants';

// --- STORAGE KEYS ---
const KEY_PLAYERS = 'ikl_data_players_v1';
const KEY_TEAMS = 'ikl_data_teams_v1';
const KEY_CONFIG = 'ikl_data_config_v1';

// --- HELPER: LOAD FROM STORAGE ---
const loadFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    // If no data exists yet, save the default mock data immediately so we have a base
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultVal;
  }
};

// --- HELPER: SAVE TO STORAGE ---
const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}.`, e);
    // Determine if it's a quota error
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("CRITICAL ERROR: Storage Full!\n\nYou have uploaded too many large images. The browser cannot save your changes.\n\nSOLUTION:\n1. Use Image URLs instead of uploading files.\n2. Delete some players/teams to free up space.\n3. Try to compress your images.");
    } else {
        alert("Error saving data. Check console for details.");
    }
    return false;
  }
};

// --- INITIALIZE STATE ---
// Load synchronously on startup
let currentPlayers = loadFromStorage<Player[]>(KEY_PLAYERS, [...MOCK_PLAYERS]);
let currentTeams = loadFromStorage<Team[]>(KEY_TEAMS, [...MOCK_TEAMS]);
let currentConfig = loadFromStorage<AppConfig>(KEY_CONFIG, {
  logoUrl: "https://placehold.co/400x400/000000/ff2a2a?text=IKL+FALL",
  googleFormUrl: ""
});

const SIMULATE_DELAY = 100;

// --- READ OPERATIONS ---

export const getPlayers = async (): Promise<Player[]> => {
  return new Promise((resolve) => {
    // Re-read from variable (which is in sync with LS)
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
          resolve(false);
      }
    });
};

export const bulkUpdatePlayers = async (players: Player[]): Promise<boolean> => {
    return new Promise((resolve) => {
      if (saveToStorage(KEY_PLAYERS, players)) {
          currentPlayers = players;
          resolve(true);
      } else {
          resolve(false);
      }
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
        resolve(false);
    }
  });
};

export const bulkUpdateTeams = async (teams: Team[]): Promise<boolean> => {
    return new Promise((resolve) => {
      if (saveToStorage(KEY_TEAMS, teams)) {
          currentTeams = teams;
          resolve(true);
      } else {
          resolve(false);
      }
    });
};

// Config
export const updateAppConfig = async (config: AppConfig): Promise<boolean> => {
  return new Promise((resolve) => {
    if (saveToStorage(KEY_CONFIG, config)) {
        currentConfig = config;
        // Dispatch custom event to notify Layout to re-render logo
        window.dispatchEvent(new Event('storage-config-updated'));
        resolve(true);
    } else {
        resolve(false);
    }
  });
};

export const submitDreamTeam = async (submission: Omit<DreamTeamSubmission, 'id' | 'submittedAt'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};