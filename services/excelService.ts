import * as XLSX from 'xlsx';
import { Player, Team, Role } from '../types';

// Helper to download data as Excel
export const exportToExcel = (data: any[], fileName: string, sheetName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Flatten Player object for Excel friendly format
export const playersToExcelData = (players: Player[]) => {
  return players.map(p => {
    const played = p.stats.matches || 1; 
    const kda = (p.stats.kill + p.stats.assist) / (p.stats.death === 0 ? 1 : p.stats.death);
    
    return {
      ID: p.id,
      'TEAM NAME': p.team,
      ROLE: p.role,
      'PLAYER NAME': p.name,
      PLAYED: p.stats.matches,
      KILL: p.stats.kill,
      'AVG KILL': Number((p.stats.kill / played).toFixed(2)),
      DEATH: p.stats.death,
      'AVG DEATH': Number((p.stats.death / played).toFixed(2)),
      ASSIST: p.stats.assist,
      'AVG ASSIST': Number((p.stats.assist / played).toFixed(2)),
      KDA: Number(kda.toFixed(2)),
      GPM: p.stats.gpm,
      'Image URL': p.image || ''
    };
  });
};

// Reconstruct Player object from Excel data
export const excelDataToPlayers = (data: any[]): Player[] => {
  return data.map((row: any) => {
    // Helper to find key case-insensitively
    const findKey = (keys: string[]) => {
        for (const k of keys) {
            if (row[k] !== undefined) return row[k];
            // Try uppercase/lowercase variations
            const lowerK = k.toLowerCase();
            const upperK = k.toUpperCase();
            const foundKey = Object.keys(row).find(rk => rk.toLowerCase() === lowerK || rk.replace(/\s/g, '').toLowerCase() === lowerK.replace(/\s/g, ''));
            if (foundKey) return row[foundKey];
        }
        return undefined;
    };

    const imageUrl = findKey(['Image URL', 'ImageURL', 'Image', 'Photo', 'URL']);

    return {
        id: String(row.ID || Math.random().toString(36).substr(2, 9)),
        name: findKey(['PLAYER NAME', 'Player Name', 'Name', 'Player']) || 'Unknown',
        team: findKey(['TEAM NAME', 'Team Name', 'Team']) || 'Free Agent',
        role: (findKey(['ROLE', 'Role']) || Role.CLASH) as Role,
        image: imageUrl || undefined,
        stats: {
        matches: Number(findKey(['PLAYED', 'Played', 'Matches'])) || 0,
        kill: Number(findKey(['KILL', 'Kill', 'Kills'])) || 0,
        death: Number(findKey(['DEATH', 'Death', 'Deaths'])) || 0,
        assist: Number(findKey(['ASSIST', 'Assist', 'Assists'])) || 0,
        gpm: Number(findKey(['GPM', 'Gold'])) || 0
        }
    };
  }).filter(p => p.name !== 'Unknown'); // Filter out empty rows
};

// Teams Export
export const teamsToExcelData = (teams: Team[]) => {
  return teams.map(t => ({
    Team: t.name,
    'Match Point': t.matchPoints,
    'Match W - L': `${t.matchWins} - ${t.matchLosses}`,
    'Net Game Win': t.gameWins - t.gameLosses,
    'Game W - L': `${t.gameWins} - ${t.gameLosses}`,
    _id: t.id,
    _matchW: t.matchWins,
    _matchL: t.matchLosses,
    _gameW: t.gameWins,
    _gameL: t.gameLosses,
    _logo: t.logo
  }));
};

export const excelDataToTeams = (data: any[]): Team[] => {
    return data.map((row: any) => {
        let matchWins = row._matchW || 0;
        let matchLosses = row._matchL || 0;
        
        const matchWL = row['Match W - L'] || row['Match W-L'];
        if (typeof matchWL === 'string' && matchWL.includes('-')) {
            const parts = matchWL.split('-').map((s: string) => parseInt(s.trim()));
            if (parts.length === 2) {
                matchWins = parts[0];
                matchLosses = parts[1];
            }
        }

        let gameWins = row._gameW || 0;
        let gameLosses = row._gameL || 0;

        const gameWL = row['Game W - L'] || row['Game W-L'];
        if (typeof gameWL === 'string' && gameWL.includes('-')) {
            const parts = gameWL.split('-').map((s: string) => parseInt(s.trim()));
            if (parts.length === 2) {
                gameWins = parts[0];
                gameLosses = parts[1];
            }
        }

        return {
            id: String(row._id || Math.random().toString(36).substr(2, 9)),
            name: row.Team || row.Name,
            matchPoints: Number(row['Match Point']) || 0,
            matchWins,
            matchLosses,
            gameWins,
            gameLosses,
            logo: row._logo || row.LogoURL || row.Logo || ''
        };
    }).filter(t => t.name);
};

export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};