import React, { useState, useEffect, useRef } from 'react';
import { Player, Team, Role, AppConfig } from '../types';
import { getPlayers, getTeams, updatePlayer, createPlayer, updateTeam, bulkUpdatePlayers, bulkUpdateTeams, getAppConfig, updateAppConfig, deletePlayer } from '../services/api';
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

  const handleDeletePlayer = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this player?")) {
          await deletePlayer(id);
          fetchAll();
      }
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
              // Limit size check (e.g. 300KB) to prevent localStorage crash
              if (e.target.files[0].size > 300000) {
                  alert("File is too large! Please upload an image smaller than 300KB or use an Image URL.");
                  return;
              }
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
    alert("Configuration saved! Data is persisted locally.");
  };


  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
        <div className="bg-ikl-panel p-10 rounded-xl border border-white/10 text-center max-w-md w-full shadow-[0_0_50px_rgba(255,42,42,0.1)] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ikl-red to-transparent"></div>
           <div className="mb-6 w-20 h-20 bg-black/50 border border-white/10 rounded-full mx-auto flex items-center justify-center">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
           </div>
           <h2 className="text-4xl font-display font-bold mb-2 text-white tracking-wide">ADMIN ACCESS</h2>
           <p className="text-gray-500 mb-8 text-sm">Restricted Area. Authorized Personnel Only.</p>
           
           <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-black/50 border border-white/20 p-4 rounded text-white text-center focus:border-ikl-red outline-none transition-all placeholder-gray-600 font-bold tracking-widest"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="w-full bg-white hover:bg-gray-200 text-black font-display font-bold text-xl py-3 rounded transition-all transform active:scale-95">
                UNLOCK DASHBOARD
              </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen pb-20">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl font-display font-bold text-white mb-1">DASHBOARD</h1>
            <p className="text-gray-400 font-mono text-sm">Welcome back, Admin. Data is synced locally.</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
              {(['players', 'teams', 'settings'] as Tab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-md font-display font-bold uppercase text-lg tracking-wider transition-all ${activeTab === tab ? 'bg-ikl-red text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
       </div>

       {loading ? (
         <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ikl-red"></div>
         </div>
       ) : (
         <>
            {/* PLAYERS TAB */}
            {activeTab === 'players' && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="bg-ikl-panel p-4 rounded-lg border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <button 
                            onClick={handleAddPlayer}
                            className="flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold transition-colors font-display uppercase tracking-wider text-xl w-full md:w-auto justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            <span>Add Player</span>
                        </button>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={handleExportPlayers}
                                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 rounded text-green-100 font-bold transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span className="text-sm uppercase tracking-wide">Export</span>
                            </button>
                            <label className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 rounded text-blue-100 font-bold transition-colors cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <span className="text-sm uppercase tracking-wide">Import</span>
                                <input type="file" ref={playerFileInputRef} onChange={handleImportPlayers} accept=".xlsx, .xls" className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {players.map(player => (
                            <div key={player.id} className="bg-white/5 border border-white/5 p-4 rounded-lg hover:border-ikl-red/50 transition-all hover:bg-white/10 flex flex-col gap-3 group relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                         <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/20 shrink-0">
                                            {player.image ? (
                                                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold">{player.team.substring(0,2)}</div>
                                            )}
                                         </div>
                                         <div className="overflow-hidden">
                                            <h4 className="font-display text-2xl text-white leading-none truncate">{player.name}</h4>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 bg-black/40 px-1.5 py-0.5 rounded inline-block truncate max-w-full">
                                                {player.team}
                                            </div>
                                         </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                         <button 
                                            onClick={() => handleEditPlayerClick(player)}
                                            className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePlayer(player.id)}
                                            className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-3 mt-1">
                                     <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase">{player.role}</span>
                                        <span className="font-mono text-gray-300">Match: {player.stats.matches} | KDA: {((player.stats.kill+player.stats.assist)/(player.stats.death||1)).toFixed(1)}</span>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* EDIT PLAYER MODAL */}
                    {editingPlayer && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                            <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-2xl w-full p-0 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <h3 className="text-3xl font-display text-white">
                                        {isNewPlayer ? 'REGISTER NEW PLAYER' : 'EDIT PLAYER PROFILE'}
                                    </h3>
                                    <button onClick={() => setEditingPlayer(null)} className="text-gray-500 hover:text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                
                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    <form id="playerForm" onSubmit={handleSavePlayer} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Photo Section */}
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Player Photo</label>
                                                <div className="w-full aspect-[4/5] bg-black border border-white/20 rounded-lg overflow-hidden relative mb-3 group">
                                                    {editingPlayer.image ? (
                                                        <img src={editingPlayer.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            <span className="text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <input 
                                                        type="text"
                                                        placeholder="Or paste Image URL..."
                                                        className="w-full bg-black border border-white/20 rounded p-2 text-xs text-white"
                                                        value={editingPlayer.image && editingPlayer.image.startsWith('http') ? editingPlayer.image : ''}
                                                        onChange={(e) => setEditingPlayer({...editingPlayer, image: e.target.value})}
                                                    />
                                                    <div className="relative overflow-hidden">
                                                        <button type="button" className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors uppercase font-bold">Upload File</button>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={handlePlayerImageUpload}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 text-center">Max 300KB for uploads. URLs recommended.</p>
                                                </div>
                                            </div>

                                            {/* Data Section */}
                                            <div className="col-span-2 space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">In-Game Name</label>
                                                    <input 
                                                        required
                                                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none transition-colors" 
                                                        value={editingPlayer.name} 
                                                        onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team</label>
                                                        <input 
                                                            required
                                                            list="teams-datalist"
                                                            className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none transition-colors" 
                                                            value={editingPlayer.team} 
                                                            onChange={e => setEditingPlayer({...editingPlayer, team: e.target.value})} 
                                                        />
                                                        <datalist id="teams-datalist">
                                                            {teams.map(t => <option key={t.id} value={t.name} />)}
                                                        </datalist>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                                                        <select 
                                                            className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none uppercase" 
                                                            value={editingPlayer.role} 
                                                            onChange={e => setEditingPlayer({...editingPlayer, role: e.target.value as Role})}
                                                        >
                                                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 rounded-lg p-4 border border-white/5 mt-4">
                                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-ikl-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                                        Performance Stats
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Matches Played</label>
                                                            <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white font-mono" value={editingPlayer.stats.matches} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, matches: parseInt(e.target.value) || 0}})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gold Per Min (GPM)</label>
                                                            <input type="number" className="w-full bg-black border border-white/20 rounded p-2 text-white font-mono text-ikl-gold" value={editingPlayer.stats.gpm} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, gpm: parseInt(e.target.value) || 0}})} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Kills</label>
                                                            <input type="number" className="w-full bg-black border border-green-900/50 rounded p-2 text-green-400 text-center font-mono font-bold" value={editingPlayer.stats.kill} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, kill: parseInt(e.target.value) || 0}})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Deaths</label>
                                                            <input type="number" className="w-full bg-black border border-red-900/50 rounded p-2 text-red-400 text-center font-mono font-bold" value={editingPlayer.stats.death} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, death: parseInt(e.target.value) || 0}})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Assists</label>
                                                            <input type="number" className="w-full bg-black border border-blue-900/50 rounded p-2 text-blue-400 text-center font-mono font-bold" value={editingPlayer.stats.assist} onChange={e => setEditingPlayer({...editingPlayer, stats: {...editingPlayer.stats, assist: parseInt(e.target.value) || 0}})} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                                    <button type="button" onClick={() => setEditingPlayer(null)} className="px-6 py-3 rounded text-gray-400 hover:text-white font-bold">CANCEL</button>
                                    <button type="submit" form="playerForm" className="px-8 py-3 bg-white text-black hover:bg-ikl-red hover:text-white rounded font-display font-bold text-xl uppercase tracking-wider shadow-lg transition-all">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TEAMS TAB */}
            {activeTab === 'teams' && (
                 <div className="space-y-6">
                 {/* Toolbar */}
                 <div className="flex justify-end gap-4 bg-ikl-panel p-4 rounded-lg border border-white/10">
                        <button 
                            onClick={handleExportTeams}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 rounded text-green-100 font-bold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Export Excel</span>
                        </button>
                        <label className="flex items-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 rounded text-blue-100 font-bold transition-colors cursor-pointer">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                             <span>Import Excel</span>
                             <input type="file" ref={teamFileInputRef} onChange={handleImportTeams} accept=".xlsx, .xls" className="hidden" />
                        </label>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {teams.map(team => (
                         <div key={team.id} className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-ikl-red/50 transition-colors flex items-center justify-between group">
                             <div className="flex items-center space-x-6">
                                 <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
                                     {team.logo && !team.logo.includes('placehold') ? (
                                         <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                     ) : (
                                         <span className="font-display text-4xl text-gray-600 font-bold">{team.name.substring(0,2)}</span>
                                     )}
                                 </div>
                                 <div>
                                     <h4 className="font-display text-4xl text-white uppercase leading-none">{team.name}</h4>
                                     <div className="flex gap-4 mt-2 text-sm">
                                         <span className="px-2 py-1 bg-white/5 rounded text-gray-300"><b>{team.matchPoints}</b> PTS</span>
                                         <span className="px-2 py-1 bg-white/5 rounded text-gray-300"><b>{team.matchWins}-{team.matchLosses}</b> (M)</span>
                                         <span className="px-2 py-1 bg-white/5 rounded text-gray-300"><b>{team.gameWins}-{team.gameLosses}</b> (G)</span>
                                     </div>
                                 </div>
                             </div>
                             <button 
                                 onClick={() => setEditingTeam(team)}
                                 className="px-6 py-3 bg-white/5 rounded hover:bg-white/10 text-gray-400 hover:text-white font-display text-xl uppercase tracking-wider"
                             >
                                 Edit
                             </button>
                         </div>
                     ))}
                 </div>

                 {/* EDIT TEAM MODAL */}
                 {editingTeam && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                         <div className="bg-ikl-panel border border-white/20 rounded-xl max-w-md w-full p-6 shadow-2xl">
                             <h3 className="text-3xl font-display text-white mb-6">UPDATE STANDINGS</h3>
                             <form onSubmit={handleSaveTeam} className="space-y-4">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label>
                                     <input className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-ikl-red outline-none" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} />
                                 </div>
                                 
                                 <div className="bg-white/5 p-4 rounded-lg">
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Match Points</label>
                                        <input type="number" className="w-full bg-black border border-white/20 rounded p-3 text-white text-2xl font-bold text-center" value={editingTeam.matchPoints} onChange={e => setEditingTeam({...editingTeam, matchPoints: parseInt(e.target.value) || 0})} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Match W</label>
                                            <input type="number" className="w-full bg-black border border-green-900/30 rounded p-2 text-white text-center" value={editingTeam.matchWins} onChange={e => setEditingTeam({...editingTeam, matchWins: parseInt(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Match L</label>
                                            <input type="number" className="w-full bg-black border border-red-900/30 rounded p-2 text-white text-center" value={editingTeam.matchLosses} onChange={e => setEditingTeam({...editingTeam, matchLosses: parseInt(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Game W</label>
                                            <input type="number" className="w-full bg-black border border-green-900/30 rounded p-2 text-white text-center" value={editingTeam.gameWins} onChange={e => setEditingTeam({...editingTeam, gameWins: parseInt(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Game L</label>
                                            <input type="number" className="w-full bg-black border border-red-900/30 rounded p-2 text-white text-center" value={editingTeam.gameLosses} onChange={e => setEditingTeam({...editingTeam, gameLosses: parseInt(e.target.value) || 0})} />
                                        </div>
                                    </div>
                                 </div>

                                 <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-white/10">
                                     <button type="button" onClick={() => setEditingTeam(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold">CANCEL</button>
                                     <button type="submit" className="px-6 py-2 bg-ikl-red text-white font-bold rounded hover:bg-red-600 shadow-lg font-display text-xl uppercase tracking-wider">Update</button>
                                 </div>
                             </form>
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
                            <p className="text-gray-400 text-sm mb-3">
                                This logo will appear in the navigation bar and footer.
                            </p>
                            <div className="flex flex-col gap-4">
                                <input 
                                    type="url" 
                                    className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-red focus:outline-none"
                                    placeholder="https://example.com/logo.png"
                                    value={config.logoUrl}
                                    onChange={e => setConfig({...config, logoUrl: e.target.value})}
                                />
                                {/* Preview */}
                                <div className="bg-black/50 p-4 rounded border border-white/10 flex items-center gap-4">
                                    <span className="text-gray-500 text-sm font-bold uppercase">Preview:</span>
                                    {config.logoUrl ? (
                                        <img src={config.logoUrl} alt="Logo Preview" className="h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    ) : (
                                        <span className="text-gray-600 text-xs italic">No URL entered</span>
                                    )}
                                </div>
                            </div>
                        </div>

                         <div>
                            <label className="block text-lg font-bold text-white mb-2">SBBT Submission Google Form</label>
                            <p className="text-gray-400 text-sm mb-3">
                                (Optional) Link for users who want to submit elsewhere. Currently SBBT uses Excel/Copy.
                            </p>
                            <div className="flex gap-4">
                                <input 
                                    type="url" 
                                    className="w-full bg-black border border-white/20 rounded p-4 text-white focus:border-ikl-red focus:outline-none"
                                    placeholder="https://docs.google.com/forms/..."
                                    value={config.googleFormUrl || ''}
                                    onChange={e => setConfig({...config, googleFormUrl: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/10">
                            <button type="submit" className="px-10 py-4 bg-white text-black font-display font-bold text-2xl rounded hover:bg-ikl-red hover:text-white transition-all shadow-xl uppercase tracking-widest">
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