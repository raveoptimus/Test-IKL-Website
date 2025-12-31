import React, { useState, useEffect } from 'react';
import { Player, Role, Team, AppConfig } from '../types';
import { getPlayers, getTeams, getAppConfig } from '../services/api';
import { ROLE_LABELS } from '../constants';

// --- COMPONENTS ---

const PlayerListTable: React.FC<{ players: Player[]; teams: Team[] }> = ({ players, teams }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-gradient-to-br from-white/5 to-black border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-2xl animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-6">
          <div className="w-full md:w-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-2">Player Database</h2>
            <p className="text-gray-500 text-lg">Analyze stats to build your perfect team.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             {/* Search */}
             <div className="relative flex-1 md:flex-none">
                <input 
                  type="text" 
                  placeholder="Search Player or Team..." 
                  className="w-full md:w-72 bg-black/50 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white focus:border-ikl-red focus:outline-none text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-6 h-6 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             
             {/* Role Filter */}
             <select 
                className="w-full md:w-auto bg-black/50 border border-white/20 rounded-lg py-3 px-4 text-white focus:border-ikl-red focus:outline-none uppercase text-lg"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
             >
                <option value="all">All Roles</option>
                {Object.values(Role).map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
             </select>
          </div>
       </div>

       <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
                <tr className="text-gray-500 text-sm font-bold uppercase tracking-wider border-b border-white/10">
                   <th className="pb-4 pl-6 md:pl-4">Player</th>
                   <th className="pb-4">Role</th>
                   <th className="pb-4">Team</th>
                   <th className="pb-4 text-right">KDA</th>
                   <th className="pb-4 text-right pr-6 md:pr-4">GPM</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-base">
                {filteredPlayers.map(player => {
                   const teamLogo = teams.find(t => t.name === player.team)?.logo;
                   // Calc KDA manually for display if needed or use pre-calc
                   const kda = (player.stats.kill + player.stats.assist) / (player.stats.death || 1);
                   
                   return (
                     <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 pl-6 md:pl-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-900 rounded-full overflow-hidden border border-white/10 group-hover:border-ikl-red/50 transition-colors relative flex-shrink-0">
                                 {player.image ? (
                                    <img 
                                        src={player.image} 
                                        alt={player.name} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.classList.add('fallback-avatar');
                                        }}
                                    />
                                 ) : null}
                                 {/* Fallback Text Avatar */}
                                 <div className={`absolute inset-0 flex items-center justify-center text-gray-600 font-display pointer-events-none ${player.image ? 'opacity-0' : 'opacity-100'} fallback-content`}>
                                     {player.name.substring(0,1)}
                                 </div>
                              </div>
                              <span className="font-display text-2xl text-white tracking-wide">{player.name}</span>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-xs uppercase text-gray-300 tracking-wider font-bold">
                              {ROLE_LABELS[player.role]}
                           </span>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-3 text-gray-300">
                              {teamLogo && <img src={teamLogo} alt="Team" className="w-6 h-6 object-contain opacity-80" referrerPolicy="no-referrer" />}
                              <span className="uppercase text-sm font-bold tracking-wide">{player.team}</span>
                           </div>
                        </td>
                        <td className="py-4 text-right font-mono text-xl text-ikl-red font-bold">{kda.toFixed(1)}</td>
                        <td className="py-4 text-right pr-6 md:pr-4 font-mono text-xl text-ikl-gold font-bold">{player.stats.gpm}</td>
                     </tr>
                   );
                })}
             </tbody>
          </table>
          {filteredPlayers.length === 0 && (
             <div className="text-center py-12 text-gray-500 text-xl font-display uppercase tracking-widest">No players found matching your filters.</div>
          )}
       </div>
    </div>
  );
};

const RoleSection: React.FC<{
  role: Role;
  players: Player[];
  teams: Team[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  error?: boolean;
}> = ({ role, players, teams, selectedId, onSelect, error }) => {
  
  return (
    <div className={`mb-12 rounded-xl p-4 md:p-8 transition-all duration-500 ${error ? 'bg-red-900/20 border border-red-500 shadow-[0_0_30px_rgba(255,42,42,0.3)]' : 'bg-white/5 border border-white/5'}`}>
      <div className="flex items-center mb-6 border-l-4 border-ikl-red pl-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-widest text-white uppercase">
          {ROLE_LABELS[role]}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {players.filter(p => p.role === role).map((player) => {
           const isSelected = selectedId === player.id;
           const teamLogo = teams.find(t => t.name === player.team)?.logo;
           const [imgError, setImgError] = useState(false);

           return (
            <div
              key={player.id}
              onClick={() => onSelect(player.id)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform active:scale-95 ${
                isSelected 
                  ? 'border-ikl-green shadow-[0_0_25px_rgba(74,222,128,0.5)] bg-gradient-to-b from-ikl-green/10 to-transparent z-10' 
                  : 'border-white/5 bg-black/40 hover:border-ikl-red/50 hover:bg-white/5'
              }`}
            >
              {/* Image Container */}
              <div className="aspect-[4/5] bg-gradient-to-b from-[#1a1a1a] to-black relative">
                 {player.image && !imgError ? (
                   <img 
                    src={player.image} 
                    alt={player.name} 
                    className="w-full h-full object-contain object-bottom opacity-90 group-hover:opacity-100 transition-opacity" 
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                   />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-800 font-display text-7xl font-bold select-none">
                        {player.team.substring(0,2)}
                    </div>
                 )}
                 {/* Stronger Gradient Overlay for Text readability */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-ikl-green text-black text-xs font-bold px-3 py-1 rounded shadow-lg animate-pulse uppercase tracking-wider z-20">
                  Picked
                </div>
              )}
              
              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-4 pt-12">
                <div className={`font-display text-3xl md:text-3xl font-bold leading-none tracking-wide text-center mb-3 drop-shadow-md ${isSelected ? 'text-ikl-green' : 'text-white group-hover:text-ikl-red transition-colors'}`}>
                    {player.name}
                </div>
                
                {/* Team Info */}
                <div className="flex items-center justify-center gap-2 border-t border-white/20 pt-2">
                    {teamLogo ? (
                        <img src={teamLogo} alt={player.team} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                    )}
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-widest truncate max-w-[100px]">
                        {player.team}
                    </div>
                </div>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const DreamTeam: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'list'>('builder');
  
  // State for flow: builder -> confirm -> success
  const [step, setStep] = useState<'builder' | 'confirm' | 'success'>('builder');
  
  const [selections, setSelections] = useState<{ [key in Role]?: string }>({});
  const [errors, setErrors] = useState<string[]>([]);

  // Confirmation Form States
  const [managerName, setManagerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/167WebdFXfpn0arheh1KoHNwoRnbq2aJlHtlB00dxK1Q/edit?usp=sharing";

  useEffect(() => {
    Promise.all([getPlayers(), getTeams(), getAppConfig()]).then(([playerData, teamData, configData]) => {
      setPlayers(playerData);
      setTeams(teamData);
      setConfig(configData);
      setLoading(false);
    });
  }, []);

  const handleSelection = (role: Role, playerId: string) => {
    setSelections(prev => ({ ...prev, [role]: playerId }));
    // Clear error for this role if exists
    if (errors.includes(role)) {
       setErrors(prev => prev.filter(e => e !== role));
    }
  };

  const validate = () => {
    const missingRoles: string[] = [];
    Object.values(Role).forEach(role => {
      if (!selections[role]) missingRoles.push(role);
    });
    setErrors(missingRoles);
    return missingRoles.length === 0;
  };

  // Step 1: User clicks "Generate Team" -> Go to Confirm
  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
       alert("Please select a player for every role.");
       return;
    }
    setStep('confirm');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: User confirms details -> Go to Success
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerName.trim()) {
        alert("Please enter a manager name.");
        return;
    }

    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSelectedPlayersData = () => {
      return Object.values(Role).map(role => {
          const pid = selections[role];
          const p = players.find(x => x.id === pid);
          return {
              Role: ROLE_LABELS[role],
              Player: p?.name || 'Unknown',
              Team: p?.team || 'Unknown'
          };
      });
  };

  const handleViewStandings = () => {
      window.open(GOOGLE_SHEET_URL, '_blank');
  };

  const scrollToBuilder = () => {
    const element = document.getElementById('builder-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return (
      <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-center">
             <div className="w-20 h-20 border-4 border-ikl-red border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
             <p className="text-gray-400 font-display tracking-widest text-xl animate-pulse">LOADING ASSETS</p>
          </div>
      </div>
  );

  // --- VIEW: CONFIRMATION ---
  if (step === 'confirm') {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4 pb-20 pt-10">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2 text-center">DOUBLE CHECK</h1>
            <p className="text-gray-400 mb-10 text-xl font-display tracking-wide uppercase">Confirm your roster before submitting</p>
            
            <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
                
                {/* Left: Roster Summary */}
                <div className="flex-1 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-md">
                    <h3 className="text-2xl font-display font-bold text-ikl-gold mb-6 tracking-widest border-b border-white/10 pb-4">YOUR ROSTER</h3>
                    <div className="space-y-4">
                        {getSelectedPlayersData().map((item) => (
                            <div key={item.Role} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">{item.Role}</span>
                                    <span className="text-white font-display text-3xl">{item.Player}</span>
                                </div>
                                <span className="text-gray-400 text-sm font-bold uppercase bg-white/5 px-2 py-1 rounded">{item.Team}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Submission Form */}
                <div className="flex-1 bg-ikl-panel p-8 rounded-xl border border-white/10 shadow-2xl">
                     <h3 className="text-2xl font-display font-bold text-white mb-6 tracking-widest border-b border-white/10 pb-4">MANAGER DETAILS</h3>
                     <form onSubmit={handleFinalSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Manager Name / IGN</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-black border border-white/20 rounded-lg p-4 text-white focus:border-ikl-red focus:outline-none text-lg font-bold"
                                placeholder="Enter your name"
                                value={managerName}
                                onChange={e => setManagerName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Instagram / WhatsApp (Optional)</label>
                            <input 
                                type="text" 
                                className="w-full bg-black border border-white/20 rounded-lg p-4 text-white focus:border-ikl-red focus:outline-none text-lg"
                                placeholder="@username or 08..."
                                value={contactInfo}
                                onChange={e => setContactInfo(e.target.value)}
                            />
                        </div>

                        <div className="pt-6 space-y-4">
                            <button 
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-ikl-red to-red-700 text-white font-display text-3xl font-bold rounded uppercase tracking-widest shadow-lg hover:shadow-[0_0_30px_rgba(255,42,42,0.4)] transition-all transform active:scale-95"
                            >
                                CONFIRM & SUBMIT
                            </button>
                            <button 
                                type="button"
                                onClick={() => setStep('builder')}
                                className="w-full py-4 bg-transparent border border-white/10 text-gray-400 font-display text-xl font-bold rounded uppercase tracking-widest hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Back to Edit
                            </button>
                        </div>
                     </form>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: SUCCESS ---
  if (step === 'success') {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(74,222,128,0.3)] animate-slide-up">
                <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-2 animate-slide-up">TEAM SUBMITTED</h1>
            <p className="text-gray-400 mb-10 text-xl font-display uppercase tracking-widest animate-slide-up">Good luck, Manager {managerName}!</p>
            
            <div className="flex flex-col gap-4 w-full max-w-md animate-slide-up">
                <button 
                    onClick={handleViewStandings}
                    className="flex items-center justify-center gap-3 px-8 py-6 bg-white text-black font-display text-3xl font-bold rounded hover:bg-gray-200 transition-colors uppercase tracking-widest shadow-xl transform hover:scale-105 duration-300"
                >
                   <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                   View Global Standings
                </button>

                <button 
                    onClick={() => { 
                        setStep('builder'); 
                        setSelections({}); 
                        setManagerName(''); 
                        setContactInfo('');
                    }} 
                    className="text-gray-500 hover:text-white mt-8 text-lg tracking-wide uppercase font-bold"
                >
                    Create Another Team
                </button>
            </div>
        </div>
      );
  }

  // --- VIEW: BUILDER ---
  return (
    <div className="animate-fade-in pb-32">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center -mt-8 mb-16 overflow-hidden">
           {/* Background FX */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[800px] md:h-[800px] bg-ikl-red/5 rounded-full blur-[100px] pointer-events-none"></div>
           
           <h1 className="text-[5rem] md:text-[10rem] font-display font-bold text-white mb-8 leading-[0.85] tracking-tighter drop-shadow-2xl select-none z-10">
              SEMUA BISA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-ikl-red to-red-900 animate-pulse drop-shadow-[0_0_20px_rgba(255,42,42,0.6)]">BIKIN TIM</span>
           </h1>
           
           <button 
             onClick={scrollToBuilder}
             className="group relative px-12 py-6 bg-white text-black font-display font-bold text-3xl uppercase tracking-widest overflow-hidden transition-all hover:bg-ikl-red hover:text-white rounded-sm shadow-xl hover:shadow-2xl hover:shadow-ikl-red/30 z-10 transform active:scale-95"
           >
             <span className="relative z-10 flex items-center gap-3">
                Mulai
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
             </span>
             <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
           </button>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div id="builder-section" className="scroll-mt-32 max-w-7xl mx-auto px-4">
          
          {/* Tabs - Mobile Friendly */}
          <div className="flex justify-center mb-16">
            <div className="w-full md:w-auto bg-black/40 border border-white/10 rounded-lg p-1.5 flex gap-2 overflow-x-auto">
               <button 
                 onClick={() => setActiveTab('builder')}
                 className={`flex-1 md:flex-none px-8 py-4 rounded font-display font-bold text-xl md:text-2xl uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'builder' ? 'bg-gradient-to-r from-red-900 to-ikl-red text-white shadow-[0_0_20px_rgba(255,42,42,0.4)] border border-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 Team Builder
               </button>
               <button 
                 onClick={() => setActiveTab('list')}
                 className={`flex-1 md:flex-none px-8 py-4 rounded font-display font-bold text-xl md:text-2xl uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'list' ? 'bg-gradient-to-r from-red-900 to-ikl-red text-white shadow-[0_0_20px_rgba(255,42,42,0.4)] border border-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 Player List
               </button>
            </div>
          </div>

          {activeTab === 'list' ? (
             <PlayerListTable players={players} teams={teams} />
          ) : (
            <>
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-12 border-b border-white/10 pb-6">
                  <h2 className="text-6xl md:text-7xl font-display font-bold text-white leading-none">PILIH <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ikl-red to-white">PLAYER</span></h2>
                  <p className="text-gray-400 font-display text-2xl mb-2 tracking-wide uppercase"> / Select 1 Player Per Role</p>
                </div>
                
                <form onSubmit={handleGenerateClick} className="space-y-12">
                  
                  {/* Roles Selection */}
                  <div className="space-y-4">
                      {Object.values(Role).map(role => (
                      <RoleSection 
                          key={role} 
                          role={role} 
                          players={players}
                          teams={teams}
                          selectedId={selections[role]} 
                          onSelect={(id) => handleSelection(role, id)}
                          error={errors.includes(role)}
                      />
                      ))}
                  </div>

                  {/* Submit Bar - Sticky on Mobile */}
                  <div className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-ikl-red/30 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
                          <div className="text-gray-400 font-display text-xl uppercase tracking-wider hidden md:block">
                              <span className={`text-3xl font-bold ${Object.keys(selections).length === 5 ? 'text-ikl-green' : 'text-white'}`}>{Object.keys(selections).length}</span> / 5 SELECTED
                          </div>
                          
                          {/* Mobile Counter */}
                          <div className="md:hidden flex flex-col justify-center">
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selected</span>
                              <span className={`text-2xl font-display font-bold ${Object.keys(selections).length === 5 ? 'text-ikl-green' : 'text-white'}`}>{Object.keys(selections).length}/5</span>
                          </div>

                          <button 
                            type="submit" 
                            className={`flex-1 md:flex-none md:w-auto px-8 py-4 md:px-16 md:py-5 text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.1em] rounded transition-all transform active:scale-95 ${Object.keys(selections).length === 5 ? 'bg-gradient-to-r from-ikl-red to-red-600 text-white shadow-[0_0_30px_rgba(255,42,42,0.5)] hover:shadow-[0_0_50px_rgba(255,42,42,0.7)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                            disabled={Object.keys(selections).length !== 5}
                          >
                            Generate Team
                          </button>
                      </div>
                  </div>
                  {/* Spacer for sticky footer */}
                  <div className="h-24 md:h-0"></div>
                </form>
            </>
          )}
      </div>
    </div>
  );
};