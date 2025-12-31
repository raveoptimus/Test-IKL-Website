import React, { useState, useEffect, useRef } from 'react';
import { Player, Team, Role, AppConfig } from '../types';
import { getPlayers, getTeams, updatePlayer, createPlayer, updateTeam, bulkUpdatePlayers, bulkUpdateTeams, getAppConfig, updateAppConfig } from '../services/api';
import { exportToExcel, playersToExcelData, excelDataToPlayers, teamsToExcelData, excelDataToTeams, readExcelFile } from '../services/excelService';

type Tab = 'players' | 'teams' | 'settings';

// Helper to convert file to base64 string for image storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [loading, setLoading] = useState(false);

  // Data State
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [config, setConfig] = useState<AppConfig>({ logoUrl: '', googleFormUrl: '' });

  // Editing State
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  // File Input Refs
  const playerFileInputRef = useRef<HTMLInputElement>(null);
  const teamFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'optimus1') {
      setAuthed(true);
      fetchAll();
    } else {
      alert('Invalid Password');
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

  // --- Players ---
  const handleAddPlayer = () => {
      setIsNewPlayer(true);
      setEditingPlayer({
          id: '',
          name: '',
          team: '',
          role: Role.CLASH,
          stats: { matches: 0, kill: 0, death: 0, assist: 0, gpm: 0 },
          image: ''
      });
  };

  const handleEditPlayerClick = (player: Player) => {
      setIsNewPlayer(false);
      setEditingPlayer({ ...player, stats: { ...player.stats } });
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingPlayer) return;

      if (isNewPlayer) {
          const newPlayer = { ...editingPlayer, id: `p_${Date.now()}` };
          await createPlayer(newPlayer);
      } else {
          await updatePlayer(editingPlayer);
      }
      
      setEditingPlayer(null);
      setIsNewPlayer(false);
      fetchAll();
  };
  
  const handlePlayerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editingPlayer) {
          try {
              const base64 = await fileToBase64(e.target.files[0]);
              setEditingPlayer({ ...editingPlayer, image: base64 });
          } catch (err) {
              console.error(err);
              alert("Failed to load image file.");
          }
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
              if (window.confirm(`Found ${newPlayers.length} players. This will overwrite the current list. Continue?`)) {
                  await bulkUpdatePlayers(newPlayers);
                  alert('Players imported successfully!');
                  fetchAll();
              }
          } catch (err) {
              alert('Error reading file. Please ensure it is a valid Excel file with correct columns.');
              console.error(err);
          }
          if (playerFileInputRef.current) playerFileInputRef.current.value = '';
      }
  };

  // --- Teams ---
  const handleSaveTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingTeam) return;

      // Sync Check: If name changed, update all players associated with this team
      const originalTeam = teams.find(t => t.id === editingTeam.id);
      if (originalTeam && originalTeam.name !== editingTeam.name) {
          const confirmSync = window.confirm(
              `You are renaming team "${originalTeam.name}" to "${editingTeam.name}".\n\nDo you want to update all ${players.filter(p => p.team === originalTeam.name).length} associated players to this new team name?`
          );

          if (confirmSync) {
              const updatedPlayers = players.map(p => 
                  p.team === originalTeam.name ? { ...p, team: editingTeam.name } : p
              );
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
              if (window.confirm(`Found ${newTeams.length} teams. This will overwrite the current standings. Continue?`)) {
                  await bulkUpdateTeams(newTeams);
                  alert('Teams imported successfully!');
                  fetchAll();
              }
          } catch (err) {
              alert('Error reading file. Please ensure it is a valid Excel file.');
              console.error(err);
          }
          if (teamFileInputRef.current) teamFileInputRef.current.value = '';
      }
  };

  // --- Settings ---
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAppConfig(config);
    alert("Configuration saved!");
  };


  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-ikl-panel p-10 rounded-xl border border-white/10 text-center max-w-md w-full shadow-2xl">
           <div className="mb-6 w-16 h-16 bg-ikl-red rounded-full mx-auto flex items-center justify-center">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
           </div>
           <h2 className="text-3xl font-display font-bold mb-6 text-white">ADMIN PORTAL</h2>
           <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Enter Password" 
                className="w-full bg-black/50 border border-white/20 p-3 rounded text-white text-center focus:border-ikl-red outline-none transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="w-full bg-white text-black font-display font-bold text-xl py-3 rounded hover:bg-gray-200 transition-colors">LOGIN DASHBOARD</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen pb-20">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">ADMINISTRATION</h1>
            <p className="text-gray-400 text-sm">Manage League Data</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-ikl-panel p-1 rounded-lg border border-white/10">
              {(['players', 'teams', 'settings'] as Tab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-6 py-2 rounded-md font-display font-bold uppercase text-lg transition-all ${activeTab === tab ? 'bg-ikl-red text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
       </div>

       {loading ? (
         <div className="text-center py-20 text-gray-400">Syncing Data...</div>
       ) : (
         <>
            {/* PLAYERS TAB */}
            {activeTab === 'players' && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <button 
                            onClick={handleAddPlayer}
                            className="flex items-center space-x-2 px-6 py-2 bg-ikl-red hover:bg-red-600 rounded text-white font-bold transition-colors font-display uppercase tracking-wider shadow-[0_0_15px_rgba(255,42,42,0.3)]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            <span>Add New Player</span>
                        </button>

                        <div className="flex gap-4">
                            <button 
                                onClick={handleExportPlayers}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-white font-bold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span>Export Excel</span>
                            </button>
                            <label className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold transition-colors cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <span>Import Excel</span>
                                <input type="file" ref={playerFileInputRef} onChange={handleImportPlayers} accept=".xlsx, .xls" className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {players.map(player => (
                            <div key={player.id} className="bg-ikl-panel border border-white/10 p-4 rounded-lg hover:border-ikl-red/50 transition-colors flex justify-between items-start group">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                         <div className="w-10 h-10 bg-black rounded-full overflow-hidden border border-white/20">
                                            {player.image ? (
                                                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">{player.team.substring(0,2)}</div>
                                            )}
                                         </div>
                                         <h4 className="font-display text-2xl text-white">{player.name}</h4>
                                    </div>
                                    <div className="text-gray-400 text-sm font-bold uppercase">{player.team} &bull; <span className="text-ikl-red">{player.role}</span></div>
                                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono text-gray-500">
                                        <div>Matches: <span className="text-white">{player.stats.matches}</span></div>
                                        <div>GPM: <span className="text-white">{player.stats.gpm}</span></div>
                                        <div>K: <span className="text-white">{player.stats.kill}</span></div>
                                        <div>D: <span className="text-white">{player.stats.death}</span></div>
                                        <div>A: <span className="text-white">{player.stats.assist}</span></div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleEditPlayerClick(player)}
                                    className="p-2 bg-white/5 rounded hover:bg-white/20 text-gray-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* EDIT PLAYER MODAL */}
                    {editingPlayer && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                            <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <h3 className="text-2xl font-display text-white mb-6">
                                    {isNewPlayer ? 'Add New Player' : 'Edit Player Stats'}
                                </h3>
                                <form onSubmit={handleSavePlayer} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                            <input 
                                                required
                                                className="w-full bg-black border border-white/20 rounded p-2 text-white" 
                                                value={editingPlayer.name} 
                                                onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team</label>
                                            <input 
                                                required
                                                list="teams-datalist"
                                                className="w-full bg-black border border-white/20 rounded p-2 text-white" 
                                                value={editingPlayer.team} 
                                                onChange={e => setEditingPlayer({...editingPlayer, team: e.target.value})} 
                                            />
                                            <datalist id="teams-datalist">
                                                {teams.map(t => <option key={t.id} value={t.name} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                                        <select className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.role} onChange={e => setEditingPlayer({...editingPlayer, role: e.target.value as Role})}>
                                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    
                                    {/* IMAGE UPLOAD */}
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Player Image</label>
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 bg-black border border-white/20 rounded overflow-hidden flex-shrink-0">
                                                {editingPlayer.image ? (
                                                    <img src={editingPlayer.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handlePlayerImageUpload}
                                                className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-ikl-red file:text-white cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* NEW STATS GRID */}
                                    <div className="border-t border-white/10 pt-4">
                                        <h4 className="text-white font-bold mb-4">Statistics</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Matches (Played)</label>
                                                <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.matches} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, matches: parseInt(e.target.value) || 0}})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GPM</label>
                                                <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.gpm} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, gpm: parseInt(e.target.value) || 0}})} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-xs font-bold text-ikl-green uppercase mb-1">Total Kills</label>
                                                <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.kill} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, kill: parseInt(e.target.value) || 0}})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-red-500 uppercase mb-1">Total Deaths</label>
                                                <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.death} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, death: parseInt(e.target.value) || 0}})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-blue-400 uppercase mb-1">Total Assists</label>
                                                <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingPlayer.stats.assist} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, assist: parseInt(e.target.value) || 0}})} />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 italic">* Averages and KDA will be calculated automatically.</p>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-white/10">
                                        <button type="button" onClick={() => setEditingPlayer(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-ikl-red text-white font-bold rounded hover:bg-red-600">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TEAMS TAB */}
            {activeTab === 'teams' && (
                 <div className="space-y-6">
                 {/* Toolbar */}
                 <div className="flex justify-end gap-4">
                        <button 
                            onClick={handleExportTeams}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-white font-bold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Export Excel</span>
                        </button>
                        <label className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold transition-colors cursor-pointer">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                             <span>Import Excel</span>
                             <input type="file" ref={teamFileInputRef} onChange={handleImportTeams} accept=".xlsx, .xls" className="hidden" />
                        </label>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {teams.map(team => (
                         <div key={team.id} className="bg-ikl-panel border border-white/10 p-6 rounded-lg hover:border-ikl-red/50 transition-colors flex items-center justify-between group">
                             <div className="flex items-center space-x-4">
                                 <div className="w-16 h-16 bg-black rounded flex items-center justify-center border border-white/10">
                                    <span className="font-display text-2xl text-gray-500">{team.name.substring(0,2)}</span>
                                 </div>
                                 <div>
                                     <h4 className="font-display text-3xl text-white uppercase">{team.name}</h4>
                                     <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                         <span>Pts: <b className="text-white">{team.matchPoints}</b></span>
                                         <span>Match: <b className="text-white">{team.matchWins}-{team.matchLosses}</b></span>
                                         <span>Net Game: <b className="text-white">{team.gameWins - team.gameLosses}</b></span>
                                         <span>Game: <b className="text-white">{team.gameWins}-{team.gameLosses}</b></span>
                                     </div>
                                 </div>
                             </div>
                             <button 
                                 onClick={() => setEditingTeam(team)}
                                 className="px-4 py-2 bg-white/5 rounded hover:bg-white/20 text-gray-400 hover:text-white font-display text-lg uppercase"
                             >
                                 Edit
                             </button>
                         </div>
                     ))}
                 </div>

                 {/* EDIT TEAM MODAL */}
                 {editingTeam && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                         <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-md w-full p-6 shadow-2xl">
                             <h3 className="text-2xl font-display text-white mb-6">Edit Team Standings</h3>
                             <form onSubmit={handleSaveTeam} className="space-y-4">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label>
                                     <input className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} />
                                 </div>
                                 
                                 <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Points</label>
                                      <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchPoints} onChange={e => setEditingTeam({...editingTeam, matchPoints: parseInt(e.target.value) || 0})} />
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Wins</label>
                                         <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchWins} onChange={e => setEditingTeam({...editingTeam, matchWins: parseInt(e.target.value) || 0})} />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Losses</label>
                                         <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.matchLosses} onChange={e => setEditingTeam({...editingTeam, matchLosses: parseInt(e.target.value) || 0})} />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Game Wins</label>
                                         <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.gameWins} onChange={e => setEditingTeam({...editingTeam, gameWins: parseInt(e.target.value) || 0})} />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Game Losses</label>
                                         <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white" value={editingTeam.gameLosses} onChange={e => setEditingTeam({...editingTeam, gameLosses: parseInt(e.target.value) || 0})} />
                                     </div>
                                 </div>

                                 <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-white/10">
                                     <button type="button" onClick={() => setEditingTeam(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                     <button type="submit" className="px-6 py-2 bg-ikl-red text-white font-bold rounded hover:bg-red-600">Save Changes</button>
                                 </div>
                             </form>
                         </div>
                     </div>
                 )}
             </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="bg-ikl-panel rounded-xl border border-white/10 p-6 max-w-2xl">
                    <h3 className="text-2xl font-display text-white mb-6 border-b border-white/10 pb-4">Application Settings</h3>
                    <form onSubmit={handleSaveConfig} className="space-y-6">
                        <div>
                            <label className="block text-lg font-bold text-white mb-2">League Logo URL</label>
                            <div className="flex gap-4">
                                <input 
                                    type="url" 
                                    className="flex-grow bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red focus:outline-none"
                                    placeholder="https://example.com/logo.png"
                                    value={config.logoUrl}
                                    onChange={e => setConfig({...config, logoUrl: e.target.value})}
                                />
                            </div>
                        </div>

                         <div>
                            <label className="block text-lg font-bold text-white mb-2">SBBT Submission Google Form</label>
                            <p className="text-gray-400 text-sm mb-3">
                                Users will be redirected here after building their team.
                            </p>
                            <div className="flex gap-4">
                                <input 
                                    type="url" 
                                    className="flex-grow bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red focus:outline-none"
                                    placeholder="https://docs.google.com/forms/..."
                                    value={config.googleFormUrl || ''}
                                    onChange={e => setConfig({...config, googleFormUrl: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="px-8 py-3 bg-ikl-red text-white font-display font-bold text-xl rounded hover:bg-red-600 transition-colors">
                                Save Configuration
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