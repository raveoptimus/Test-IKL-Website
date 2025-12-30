import { Player, Team, DreamTeamSubmission, AppConfig } from '../types';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_SUBMISSIONS } from '../constants';

// In-memory storage to simulate database updates during the session
let currentPlayers = [...MOCK_PLAYERS];
let currentTeams = [...MOCK_TEAMS];
let currentSubmissions = [...MOCK_SUBMISSIONS];
let currentConfig: AppConfig = {
  logoUrl: "https://placehold.co/400x400/000000/ff2a2a?text=IKL+FALL" // Default placeholder
};

const SIMULATE_DELAY = 400;

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
    setTimeout(() => resolve([...currentSubmissions]), SIMULATE_DELAY);
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
    setTimeout(() => {
      currentPlayers = currentPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const createPlayer = async (newPlayer: Player): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers.push(newPlayer);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

export const deletePlayer = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers = currentPlayers.filter(p => p.id !== id);
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

export const bulkUpdatePlayers = async (players: Player[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentPlayers = players;
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

// Teams
export const updateTeam = async (updatedTeam: Team): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentTeams = currentTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const bulkUpdateTeams = async (teams: Team[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentTeams = teams;
        resolve(true);
      }, SIMULATE_DELAY);
    });
};

// Config
export const updateAppConfig = async (config: AppConfig): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentConfig = config;
      resolve(true);
    }, SIMULATE_DELAY);
  });
};

export const submitDreamTeam = async (submission: Omit<DreamTeamSubmission, 'id' | 'submittedAt'>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSub = {
        ...submission,
        id: `sub_${Date.now()}`,
        submittedAt: new Date().toISOString()
      };
      currentSubmissions.unshift(newSub);
      console.log("Submitting to KV:", newSub);
      resolve(true);
    }, 1000);
  });
};