import { Player, Team, DreamTeamSubmission, AppConfig } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS } from '../constants';

// --- STORAGE KEYS ---
const KEY_PLAYERS = 'ikl_data_players';
const KEY_TEAMS = 'ikl_data_teams';
const KEY_CONFIG = 'ikl_data_config';

// --- HELPER: LOAD FROM STORAGE ---
const loadFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultVal;
  }
};

// --- HELPER: SAVE TO STORAGE ---
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}. Storage might be full (Base64 images?).`, e);
    alert("Warning: Could not save data. Local storage might be full. Try using Image URLs instead of uploading large files.");
    return false;
  }
};

// --- INITIALIZE STATE ---
// We initialize from storage once, or fall back to MOCK constants
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
    // Reload from storage to ensure we have latest
    currentPlayers = loadFromStorage<Player[]>(KEY_PLAYERS, currentPlayers);
    setTimeout(() => resolve([...currentPlayers]), SIMULATE_DELAY);
  });
};

export const getTeams = async (): Promise<Team[]> => {
  return new Promise((resolve) => {
    currentTeams = loadFromStorage<Team[]>(KEY_TEAMS, currentTeams);
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
    currentConfig = loadFromStorage<AppConfig>(KEY_CONFIG, currentConfig);
    setTimeout(() => resolve({...currentConfig}), SIMULATE_DELAY);
  });
};

// --- WRITE OPERATIONS (ADMIN) ---

// Players
export const updatePlayer = async (updatedPlayer: Player): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentPlayers = currentPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
      saveToStorage(KEY_PLAYERS, currentPlayers);
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const createPlayer = async (newPlayer: Player): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers = [...currentPlayers, newPlayer];
        saveToStorage(KEY_PLAYERS, currentPlayers);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

export const deletePlayer = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers = currentPlayers.filter(p => p.id !== id);
        saveToStorage(KEY_PLAYERS, currentPlayers);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

export const bulkUpdatePlayers = async (players: Player[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers = players;
        saveToStorage(KEY_PLAYERS, currentPlayers);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

// Teams
export const updateTeam = async (updatedTeam: Team): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentTeams = currentTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
      saveToStorage(KEY_TEAMS, currentTeams);
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const bulkUpdateTeams = async (teams: Team[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentTeams = teams;
        saveToStorage(KEY_TEAMS, currentTeams);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

// Config
export const updateAppConfig = async (config: AppConfig): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentConfig = config;
      saveToStorage(KEY_CONFIG, currentConfig);
      // Dispatch custom event to notify other components (like Layout)
      window.dispatchEvent(new Event('storage-config-updated'));
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const submitDreamTeam = async (submission: Omit<DreamTeamSubmission, 'id' | 'submittedAt'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};