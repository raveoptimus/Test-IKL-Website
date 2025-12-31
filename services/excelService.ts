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
// Columns: ID, TEAM NAME, ROLE, PLAYER NAME, PLAYED, KILL, AVG KILL, DEATH, AVG DEATH, ASSIST, AVG ASSIST, KDA, GPM, Image URL
export const playersToExcelData = (players: Player[]) => {
  return players.map(p => {
    const played = p.stats.matches || 1; // Avoid division by zero
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
  return data.map((row: any) => ({
    id: String(row.ID || Math.random().toString(36).substr(2, 9)),
    name: row['PLAYER NAME'] || row.Name,
    team: row['TEAM NAME'] || row.Team,
    role: (row.ROLE || row.Role) as Role,
    image: row['Image URL'] || row.ImageURL || undefined,
    stats: {
      matches: Number(row.PLAYED) || Number(row.Matches) || 0,
      kill: Number(row.KILL) || 0,
      death: Number(row.DEATH) || 0,
      assist: Number(row.ASSIST) || 0,
      gpm: Number(row.GPM) || 0
    }
  }));
};

// Teams Export
// Columns: Team, Match Point, Match W - L, Net Game Win, Game W - L
export const teamsToExcelData = (teams: Team[]) => {
  return teams.map(t => ({
    Team: t.name,
    'Match Point': t.matchPoints,
    'Match W - L': `${t.matchWins} - ${t.matchLosses}`,
    'Net Game Win': t.gameWins - t.gameLosses,
    'Game W - L': `${t.gameWins} - ${t.gameLosses}`,
    // Hidden fields for re-import logic if needed, though usually we rely on parsing the W-L string or re-entering
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
        // Parse W - L strings if present, otherwise look for hidden fields or default to 0
        let matchWins = row._matchW || 0;
        let matchLosses = row._matchL || 0;
        
        if (typeof row['Match W - L'] === 'string' && row['Match W - L'].includes('-')) {
            const parts = row['Match W - L'].split('-').map((s: string) => parseInt(s.trim()));
            if (parts.length === 2) {
                matchWins = parts[0];
                matchLosses = parts[1];
            }
        }

        let gameWins = row._gameW || 0;
        let gameLosses = row._gameL || 0;

        if (typeof row['Game W - L'] === 'string' && row['Game W - L'].includes('-')) {
            const parts = row['Game W - L'].split('-').map((s: string) => parseInt(s.trim()));
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
            logo: row._logo || row.LogoURL || ''
        };
    });
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