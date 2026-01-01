import React, { useState, useEffect, useRef } from 'react';
import { Player, Team, Role, AppConfig } from '../types';
import { getPlayers, getTeams, updatePlayer, createPlayer, updateTeam, bulkUpdatePlayers, bulkUpdateTeams, getAppConfig, updateAppConfig, deletePlayer, syncDataFromSheets } from '../services/api';
import { exportToExcel, playersToExcelData, excelDataToPlayers, teamsToExcelData, excelDataToTeams, readExcelFile } from '../services/excelService';
import { ROLE_LABELS } from '../constants';

type Tab = 'players' | 'teams' | 'settings';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Checkerboard pattern for transparent PNGs
const transparentBgStyle = {
  backgroundImage: `
    linear-gradient(45deg, #222 25%, transparent 25%), 
    linear-gradient(-45deg, #222 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #222 75%), 
    linear-gradient(-45deg, transparent 75%, #222 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  backgroundColor: '#111'
};

const convertDriveLink = (url: string) => {
    if (!url) return url;
    const makeDirectLink = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    const viewMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (viewMatch && viewMatch[1]) return makeDirectLink(viewMatch[1]);
    if (url.includes('drive.google.com')) {
         const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
         if (idMatch && idMatch[1]) return makeDirectLink(idMatch[1]);
    }
    return url;
};

// --- NEW: Convert Edit Link to CSV Export Link ---
const convertSheetLinkToCSV = (url: string, gid?: string) => {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        const id = match[1];
        if (url.includes('output=csv') || url.includes('format=csv')) return url;
        const gidMatch = url.match(/gid=([0-9]+)/);
        const sheetGid = gidMatch ? gidMatch[1] : (gid || '0');
        return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${sheetGid}`;
    }
    return url;
};

export const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [loading, setLoading] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [config, setConfig] = useState<AppConfig>({ logoUrl: '', googleFormUrl: '' });

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  const [previewError, setPreviewError] = useState(false);
  const playerFileInputRef = useRef<HTMLInputElement>(null);
  const teamFileInputRef = useRef<HTMLInputElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [editingPlayer?.image]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'optimus1') {
      setAuthed(true);
      fetchAll();
    } else {
      alert('Invalid Password');
      setPassword('');
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    const [playersData, teamsData, configData] = await Promise.all([
        getPlayers(),
        getTeams(),
        getAppConfig()
    ]);
    setPlayers(playersData);
    setTeams(teamsData);
    setConfig(configData);
    setLoading(false);
  };

  const handleAddPlayer = () => {
      setIsNewPlayer(true);
      setEditingPlayer({
          id: '', name: '', team: '', role: Role.CLASH,
          stats: { matches: 0, kill: 0, death: 0, assist: 0, gpm: 0 },
          image: ''
      });
  };

  const handleEditPlayerClick = (player: Player) => {
      setIsNewPlayer(false);
      setEditingPlayer({ ...player, stats: { ...player.stats } });
  };

  const handleDeletePlayer = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this player?")) {
          await deletePlayer(id);
          fetchAll();
      }
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingPlayer) return;
      let success = false;
      if (isNewPlayer) {
          const newPlayer = { ...editingPlayer, id: `p_${Date.now()}` };
          success = await createPlayer(newPlayer);
      } else {
          success = await updatePlayer(editingPlayer);
      }
      if (success) { setEditingPlayer(null); setIsNewPlayer(false); fetchAll(); } 
      else { fetchAll(); }
  };
  
  const handlePlayerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editingPlayer) {
          const file = e.target.files[0];
          if (file.size > 300000) {
              alert("FILE TOO LARGE!\nPlease use images smaller than 300KB or use an Image URL.");
              return;
          }
          try {
              const base64 = await fileToBase64(file);
              setEditingPlayer({ ...editingPlayer, image: base64 });
          } catch (err) { alert("Failed to load image file."); }
      }
  };

  const handleExportPlayers = () => {
      const data = playersToExcelData(players);
      exportToExcel(data, 'IKL_Fall_2025_Players', 'Players');
  };

  const handleImportPlayers = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const rawData = await readExcelFile(e.target.files[0]);
              const newPlayers = excelDataToPlayers(rawData);
              if (newPlayers.length === 0) { alert("No valid players found in Excel."); return; }
              if (window.confirm(`Found ${newPlayers.length} players. Continue?`)) {
                  await bulkUpdatePlayers(newPlayers);
                  alert('Players imported successfully!');
                  await fetchAll();
              }
          } catch (err) { alert('Error reading file.'); }
          if (playerFileInputRef.current) playerFileInputRef.current.value = '';
      }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingTeam) return;
      const originalTeam = teams.find(t => t.id === editingTeam.id);
      if (originalTeam && originalTeam.name !== editingTeam.name) {
          const confirmSync = window.confirm(`Update all players to new team name "${editingTeam.name}"?`);
          if (confirmSync) {
              const updatedPlayers = players.map(p => p.team === originalTeam.name ? { ...p, team: editingTeam.name } : p);
              await bulkUpdatePlayers(updatedPlayers);
          }
      }
      await updateTeam(editingTeam);
      setEditingTeam(null);
      fetchAll();
  };

  const handleExportTeams = () => {
      const data = teamsToExcelData(teams);
      exportToExcel(data, 'IKL_Fall_2025_Teams', 'Teams');
  };

  const handleImportTeams = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const rawData = await readExcelFile(e.target.files[0]);
              const newTeams = excelDataToTeams(rawData);
              if (newTeams.length === 0) { alert("No valid teams found."); return; }
              if (window.confirm(`Found ${newTeams.length} teams. Overwrite?`)) {
                  await bulkUpdateTeams(newTeams);
                  alert('Teams imported successfully!');
                  await fetchAll();
              }
          } catch (err) { alert('Error reading file.'); }
          if (teamFileInputRef.current) teamFileInputRef.current.value = '';
      }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAppConfig(config);
    alert("Configuration saved! IMPORTANT: This only saves to YOUR computer. To make it live for everyone, click 'Copy Config for Code' below and paste it into constants.ts");
    fetchAll();
  };
  
  const handleForceSync = async () => {
    setIsSyncing(true);
    const result = await syncDataFromSheets();
    setIsSyncing(false);
    if (result.success) {
        alert("Sync Successful! Data updated from Sheets.");
        fetchAll();
    } else {
        alert("Sync Failed: " + (result.message || "Unknown error.\n\nMake sure the Sheet is 'Shared' with 'Anyone with the link'"));
    }
  };

  const handleCopyConfigForCode = () => {
    const codeSnippet = `
// --- PASTE THIS INTO constants.ts (Replace existing GLOBAL_CONFIG) ---
export const GLOBAL_CONFIG: AppConfig = ${JSON.stringify(config, null, 2)};
    `;
    
    navigator.clipboard.writeText(codeSnippet).then(() => {
        alert("Config code copied to clipboard!\n\n1. Open 'constants.ts' in your project.\n2. Replace 'export const GLOBAL_CONFIG = { ... }' with the code you just copied.\n3. Deploy your app.");
    }).catch(err => {
        console.error("Failed to copy", err);
        alert("Failed to copy. Check console.");
    });
  };

  const handleCopyDataForCode = () => {
    const codeSnippet = `
// --- PASTE THIS INTO constants.ts TO SYNC DATA ---

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = ${JSON.stringify(players, null, 2)};

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = ${JSON.stringify(teams, null, 2)};
    `;
    
    navigator.clipboard.writeText(codeSnippet).then(() => {
        alert("Data copied to clipboard!\n\n1. Open 'constants.ts' in your code editor.\n2. Replace MOCK_PLAYERS and MOCK_TEAMS with this data.\n3. Deploy your app.");
    }).catch(err => {
        console.error("Failed to copy", err);
        alert("Failed to copy to clipboard. Check console.");
    });
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
        <div className="bg-ikl-panel p-10 rounded-xl border border-white/10 text-center max-w-md w-full shadow-[0_0_50px_rgba(255,42,42,0.1)] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ikl-red to-transparent"></div>
           <h2 className="text-4xl font-display font-bold mb-2 text-white tracking-wide">ADMIN ACCESS</h2>
           <form onSubmit={handleLogin} className="space-y-4">
              <input type="password" placeholder="Password" className="w-full bg-black/50 border border-white/20 p-4 rounded text-white text-center focus:border-ikl-red outline-none transition-all placeholder-gray-600 font-bold tracking-widest" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-white hover:bg-gray-200 text-black font-display font-bold text-xl py-3 rounded transition-all transform active:scale-95">UNLOCK DASHBOARD</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen pb-20">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/10 pb-6">
          <div><h1 className="text-5xl font-display font-bold text-white mb-1">DASHBOARD</h1><p className="text-gray-400 font-mono text-sm">Welcome back, Admin. Data is synced locally.</p></div>
          <div className="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
              {(['players', 'teams', 'settings'] as Tab[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-md font-display font-bold uppercase text-lg tracking-wider transition-all ${activeTab === tab ? 'bg-ikl-red text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{tab}</button>
              ))}
          </div>
       </div>

       {loading ? ( <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ikl-red"></div></div> ) : (
         <>
            {/* PLAYERS TAB & TEAMS TAB ... (Identical to previous, skipping strictly for brevity as requested only changes, but need to include SETTINGS tab updates) */}
            {activeTab === 'players' && (
                <div className="space-y-6">
                    <div className="bg-ikl-panel p-4 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <button onClick={handleAddPlayer} className="flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold transition-colors font-display uppercase tracking-wider text-xl w-full md:w-auto justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg><span>Add Player</span></button>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={handleExportPlayers} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 rounded text-green-100 font-bold transition-colors"><span>Export</span></button>
                            <label className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 rounded text-blue-100 font-bold transition-colors cursor-pointer"><span>Import</span><input type="file" ref={playerFileInputRef} onChange={handleImportPlayers} accept=".xlsx, .xls" className="hidden" /></label>
                        </div>
                    </div>
                    {/* ... Existing Player Grid ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {players.map(player => (
                             <div key={player.id} className="bg-white/5 border border-white/5 p-4 rounded-lg hover:border-ikl-red/50 transition-all hover:bg-white/10 flex flex-col gap-3 group relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                         <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 flex items-center justify-center relative" style={transparentBgStyle}>
                                            {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('show-initials'); }} /> : null}
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-bold pointer-events-none opacity-100" style={{ zIndex: 0 }}>{player.team.substring(0,2)}</div>
                                         </div>
                                         <div className="overflow-hidden"><h4 className="font-display text-2xl text-white leading-none truncate">{player.name}</h4><div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 bg-black/40 px-1.5 py-0.5 rounded inline-block truncate max-w-full">{player.team}</div></div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                         <button onClick={() => handleEditPlayerClick(player)} className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                        <button onClick={() => handleDeletePlayer(player.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* ... Edit Player Modal (Preserved) ... */}
                    {editingPlayer && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                            <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-2xl w-full p-0 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5"><h3 className="text-3xl font-display text-white">{isNewPlayer ? 'REGISTER NEW PLAYER' : 'EDIT PLAYER PROFILE'}</h3><button onClick={() => setEditingPlayer(null)} className="text-gray-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    <form id="playerForm" onSubmit={handleSavePlayer} className="space-y-8">
                                        {/* Simplified logic for update: only showing that it wraps existing form */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Player Photo</label>
                                                <div className="w-full aspect-[4/5] border border-white/20 rounded-lg overflow-hidden relative mb-3 group flex items-center justify-center" style={transparentBgStyle}>
                                                    {editingPlayer.image && !previewError ? <img src={editingPlayer.image} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={() => setPreviewError(true)} /> : <div className="flex flex-col items-center justify-center text-gray-500 gap-2 text-center p-2">{previewError ? <span className="text-red-500 font-bold text-xs">LOAD ERROR<br/>Check Permissions</span> : <span className="text-xs font-bold">No Image</span>}</div>}
                                                </div>
                                                <div className="flex flex-col gap-2"><input type="text" placeholder="Paste Public Drive Link..." className="w-full bg-black border border-white/20 rounded p-2 text-xs text-white placeholder-gray-600" value={editingPlayer.image && !editingPlayer.image.startsWith('data:') ? editingPlayer.image : ''} onChange={(e) => setEditingPlayer({...editingPlayer, image: convertDriveLink(e.target.value)})} /><div className="relative overflow-hidden"><button type="button" className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors uppercase font-bold">{editingPlayer.image?.startsWith('data') ? 'Change File' : 'Upload File'}</button><input type="file" accept="image/*" onChange={handlePlayerImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div>
                                            </div>
                                            <div className="col-span-2 space-y-4">
                                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">In-Game Name</label><input required className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none" value={editingPlayer.name} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} /></div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team</label><input required list="teams-datalist" className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none" value={editingPlayer.team} onChange={e => setEditingPlayer({...editingPlayer, team: e.target.value})} /><datalist id="teams-datalist">{teams.map(t => <option key={t.id} value={t.name} />)}</datalist></div>
                                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label><select className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none uppercase" value={editingPlayer.role} onChange={e => setEditingPlayer({...editingPlayer, role: e.target.value as Role})}>{Object.values(Role).map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/5 mt-4"><h4 className="text-white font-bold mb-4">Performance Stats</h4><div className="grid grid-cols-2 gap-4 mb-4"><div><label className="block text-xs text-gray-500">Matches</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.matches} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, matches: parseInt(e.target.value) || 0}})} /></div><div><label className="block text-xs text-gray-500">GPM</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.gpm} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, gpm: parseInt(e.target.value) || 0}})} /></div></div></div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3"><button type="button" onClick={() => setEditingPlayer(null)} className="px-6 py-3 rounded text-gray-400 hover:text-white font-bold">CANCEL</button><button type="submit" form="playerForm" className="px-8 py-3 bg-white text-black hover:bg-ikl-red hover:text-white rounded font-display font-bold text-xl uppercase tracking-wider shadow-lg">Save Changes</button></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'teams' && (
                 <div className="space-y-6">
                 {/* ... Existing Teams Grid Logic ... */}
                 <div className="flex justify-end gap-4 bg-ikl-panel p-4 rounded-lg border border-white/10">
                        <button onClick={handleExportTeams} className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 rounded text-green-100 font-bold transition-colors"><span>Export Excel</span></button>
                        <label className="flex items-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 rounded text-blue-100 font-bold transition-colors cursor-pointer"><span>Import Excel</span><input type="file" ref={teamFileInputRef} onChange={handleImportTeams} accept=".xlsx, .xls" className="hidden" /></label>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {teams.map(team => (
                         <div key={team.id} className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-ikl-red/50 transition-colors flex items-center justify-between group">
                             <div className="flex items-center space-x-6">
                                 <div className="w-20 h-20 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden" style={transparentBgStyle}>{team.logo && !team.logo.includes('placehold') ? <img src={team.logo} alt={team.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : <span className="font-display text-4xl text-gray-600 font-bold">{team.name.substring(0,2)}</span>}</div>
                                 <div><h4 className="font-display text-4xl text-white uppercase leading-none">{team.name}</h4><div className="flex gap-4 mt-2 text-sm"><span className="px-2 py-1 bg-white/5 rounded text-gray-300"><b>{team.matchPoints}</b> PTS</span></div></div>
                             </div>
                             <button onClick={() => setEditingTeam(team)} className="px-6 py-3 bg-white/5 rounded hover:bg-white/10 text-gray-400 hover:text-white font-display text-xl uppercase tracking-wider">Edit</button>
                         </div>
                     ))}
                 </div>
                 {/* ... Team Edit Modal ... */}
                 {editingTeam && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                        <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-2xl w-full p-0 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5"><h3 className="text-3xl font-display text-white">EDIT TEAM: {editingTeam.name}</h3><button onClick={() => setEditingTeam(null)} className="text-gray-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <form id="teamForm" onSubmit={handleSaveTeam} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Team Logo</label>
                                        <div className="flex gap-4 items-start"><div className="w-24 h-24 rounded border border-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center" style={transparentBgStyle}>{editingTeam.logo ? <img src={editingTeam.logo} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display='none')} /> : <span className="text-xs text-gray-500">No Logo</span>}</div><div className="flex-grow space-y-2"><input type="text" placeholder="Paste Public Drive Link or Image URL..." className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none text-sm" value={editingTeam.logo} onChange={(e) => setEditingTeam({...editingTeam, logo: convertDriveLink(e.target.value)})} /><p className="text-xs text-gray-500">Supported: Google Drive Links, Direct Image URLs</p></div></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label><input required className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none font-bold" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label><textarea className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none h-24" value={editingTeam.description || ''} onChange={e => setEditingTeam({...editingTeam, description: e.target.value})} /></div>
                                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg border border-white/5"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Points</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchPoints} onChange={e => setEditingTeam({...editingTeam, matchPoints: parseInt(e.target.value) || 0})} /></div><div className="grid grid-cols-2 gap-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Wins</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchWins} onChange={e => setEditingTeam({...editingTeam, matchWins: parseInt(e.target.value) || 0})} /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Loss</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchLosses} onChange={e => setEditingTeam({...editingTeam, matchLosses: parseInt(e.target.value) || 0})} /></div></div><div className="grid grid-cols-2 gap-2 col-span-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Game Wins</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.gameWins} onChange={e => setEditingTeam({...editingTeam, gameWins: parseInt(e.target.value) || 0})} /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Game Loss</label><input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.gameLosses} onChange={e => setEditingTeam({...editingTeam, gameLosses: parseInt(e.target.value) || 0})} /></div></div></div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3"><button type="button" onClick={() => setEditingTeam(null)} className="px-6 py-3 rounded text-gray-400 hover:text-white font-bold">CANCEL</button><button type="submit" form="teamForm" className="px-8 py-3 bg-white text-black hover:bg-ikl-red hover:text-white rounded font-display font-bold text-xl uppercase tracking-wider shadow-lg">Save Team</button></div>
                        </div>
                    </div>
                 )}
                 </div>
            )}
            
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="bg-ikl-panel rounded-xl border border-white/10 p-8 max-w-2xl">
                    <h3 className="text-3xl font-display text-white mb-6 border-b border-white/10 pb-4">GLOBAL SETTINGS</h3>
                    <form onSubmit={handleSaveConfig} className="space-y-8">
                        <div>
                            <label className="block text-lg font-bold text-white mb-2">League Logo URL</label>
                            <div className="flex flex-col gap-4">
                                <input type="url" className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-red focus:outline-none" placeholder="https://example.com/logo.png" value={config.logoUrl} onChange={e => setConfig({...config, logoUrl: convertDriveLink(e.target.value)})} />
                                <div className="p-4 rounded border border-white/10 flex items-center gap-4" style={transparentBgStyle}><span className="text-gray-500 text-sm font-bold uppercase bg-black/80 px-2 rounded">Preview:</span>{config.logoUrl ? <img src={config.logoUrl} alt="Logo Preview" className="h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} referrerPolicy="no-referrer" /> : <span className="text-gray-600 text-xs italic">No URL entered</span>}</div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-lg font-bold text-white mb-2">Key Visual / Background (KV)</label>
                            <div className="flex flex-col gap-4">
                                <input type="url" className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-red focus:outline-none" placeholder="https://i.imgur.com/..." value={config.kvUrl || ''} onChange={e => setConfig({...config, kvUrl: convertDriveLink(e.target.value)})} />
                                <div className="p-2 rounded border border-white/10 relative h-32 overflow-hidden flex items-center justify-center bg-black">
                                     {config.kvUrl ? (
                                         <img src={config.kvUrl} alt="KV Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                     ) : <span className="text-gray-600 text-xs italic relative z-10">No KV Image Set</span>}
                                     <span className="relative z-10 text-white font-bold text-xl drop-shadow-md">PREVIEW</span>
                                </div>
                            </div>
                        </div>

                        {/* --- NEW: ABOUT US SETTINGS --- */}
                        <div className="pt-8 mt-8 border-t border-white/10">
                            <h4 className="text-xl font-display text-ikl-gold mb-4 uppercase tracking-widest">About Us Settings</h4>
                            <p className="text-gray-400 text-sm mb-2">Update the description shown on the Home Page.</p>
                            <textarea 
                                className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-gold focus:outline-none min-h-[150px]"
                                placeholder="Enter your organization description..."
                                value={config.aboutText || ''}
                                onChange={e => setConfig({...config, aboutText: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-bold text-white mb-2">Google Sheet Web App URL</label>
                            <input type="url" className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-red focus:outline-none" placeholder="https://script.google.com/macros/s/..." value={config.googleFormUrl || ''} onChange={e => setConfig({...config, googleFormUrl: e.target.value})} />
                        </div>
                        
                         <div className="pt-8 mt-8 border-t border-white/10">
                            <h4 className="text-xl font-display text-ikl-gold mb-4 uppercase tracking-widest">Automatic Sync (Google Sheets)</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Players Sheet Link</label>
                                    <input 
                                        type="url" 
                                        className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-gold focus:outline-none" 
                                        placeholder="https://docs.google.com/spreadsheets/d/..." 
                                        value={config.playersSheetUrl || ''} 
                                        onChange={e => setConfig({...config, playersSheetUrl: convertSheetLinkToCSV(e.target.value)})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Teams Sheet Link</label>
                                    <input 
                                        type="url" 
                                        className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-gold focus:outline-none" 
                                        placeholder="https://docs.google.com/spreadsheets/d/..." 
                                        value={config.teamsSheetUrl || ''} 
                                        onChange={e => setConfig({...config, teamsSheetUrl: convertSheetLinkToCSV(e.target.value, '0')})} 
                                    />
                                </div>
                                <button type="button" onClick={handleForceSync} disabled={isSyncing} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold uppercase tracking-wider transition-colors text-sm border border-white/10 flex items-center gap-2">
                                    {isSyncing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Test & Force Sync Now</span>}
                                </button>
                            </div>
                        </div>

                        {/* DEVELOPER ZONE */}
                        <div className="pt-8 mt-8 border-t border-white/10">
                            <h4 className="text-xl font-display text-gray-500 mb-4 uppercase tracking-widest">Developer Zone</h4>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-bold">1. SAVE CONFIGURATION TO CODE (Required for Global Update)</p>
                                    <button type="button" onClick={handleCopyConfigForCode} className="w-full py-4 bg-gradient-to-r from-ikl-gold/20 to-yellow-900/20 text-ikl-gold font-mono text-sm border border-ikl-gold/30 rounded transition-all uppercase tracking-widest hover:border-ikl-gold">
                                        Copy Config for Code
                                    </button>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-2 font-bold">2. HARDCODE MOCK DATA (Optional)</p>
                                    <button type="button" onClick={handleCopyDataForCode} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-sm border border-white/20 rounded transition-all uppercase tracking-widest">
                                        Copy Data for Code
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/10">
                            <button type="submit" className="px-10 py-4 bg-white text-black font-display font-bold text-2xl rounded hover:bg-ikl-red hover:text-white transition-all shadow-xl uppercase tracking-widest">
                                Save Configuration (Local Only)
                            </button>
                        </div>
                    </form>
                </div>
            )}
         </>
       )}
    </div>
  );
};