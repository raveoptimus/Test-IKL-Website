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
  return players.map(p => ({
    ID: p.id,
    Name: p.name,
    Team: p.team,
    Role: p.role,
    Matches: p.stats.matches,
    KDA: p.stats.kda,
    GPM: p.stats.gpm,
    ImageURL: p.image || ''
  }));
};

// Reconstruct Player object from Excel data
export const excelDataToPlayers = (data: any[]): Player[] => {
  return data.map((row: any) => ({
    id: String(row.ID || Math.random().toString(36).substr(2, 9)),
    name: row.Name,
    team: row.Team,
    role: row.Role as Role,
    image: row.ImageURL || undefined,
    stats: {
      matches: Number(row.Matches) || 0,
      kda: Number(row.KDA) || 0,
      gpm: Number(row.GPM) || 0
    }
  }));
};

// Teams are already flat, but let's ensure structure
export const teamsToExcelData = (teams: Team[]) => {
  return teams.map(t => ({
    ID: t.id,
    Name: t.name,
    Wins: t.wins,
    Losses: t.losses,
    Points: t.points,
    LogoURL: t.logo
  }));
};

export const excelDataToTeams = (data: any[]): Team[] => {
    return data.map((row: any) => ({
        id: String(row.ID || Math.random().toString(36).substr(2, 9)),
        name: row.Name,
        wins: Number(row.Wins) || 0,
        losses: Number(row.Losses) || 0,
        points: Number(row.Points) || 0,
        logo: row.LogoURL || ''
    }));
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