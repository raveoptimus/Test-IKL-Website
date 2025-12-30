import React, { useState, useEffect } from 'react';
import { Player, Role, Team } from '../types';
import { getPlayers, getTeams, submitDreamTeam } from '../services/api';

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
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Player Database</h2>
            <p className="text-gray-500 text-sm">Analyze stats to build your perfect team.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             {/* Search */}
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Player or Team..." 
                  className="w-full md:w-64 bg-black/50 border border-white/20 rounded-lg py-2 px-4 pl-10 text-white focus:border-ikl-red focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             
             {/* Role Filter */}
             <select 
                className="bg-black/50 border border-white/20 rounded-lg py-2 px-4 text-white focus:border-ikl-red focus:outline-none uppercase"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
             >
                <option value="all">All Roles</option>
                {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
             </select>
          </div>
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                   <th className="pb-4 pl-2">Player</th>
                   <th className="pb-4">Role</th>
                   <th className="pb-4">Team</th>
                   <th className="pb-4 text-right">KDA</th>
                   <th className="pb-4 text-right pr-2">GPM</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-sm">
                {filteredPlayers.map(player => {
                   const teamLogo = teams.find(t => t.name === player.team)?.logo;
                   return (
                     <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-3 pl-2">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-900 rounded-full overflow-hidden border border-white/10 group-hover:border-ikl-red/50 transition-colors">
                                 {player.image ? (
                                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-display">
                                       {player.name.substring(0,1)}
                                    </div>
                                 )}
                              </div>
                              <span className="font-display text-xl text-white tracking-wide">{player.name}</span>
                           </div>
                        </td>
                        <td className="py-3">
                           <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] uppercase text-gray-300 tracking-wider">
                              {player.role}
                           </span>
                        </td>
                        <td className="py-3">
                           <div className="flex items-center gap-2 text-gray-400">
                              {teamLogo && <img src={teamLogo} alt="Team" className="w-4 h-4 object-contain opacity-70" />}
                              <span className="uppercase text-xs font-bold">{player.team}</span>
                           </div>
                        </td>
                        <td className="py-3 text-right font-mono text-ikl-red">{player.stats.kda.toFixed(1)}</td>
                        <td className="py-3 text-right pr-2 font-mono text-ikl-gold">{player.stats.gpm}</td>
                     </tr>
                   );
                })}
             </tbody>
          </table>
          {filteredPlayers.length === 0 && (
             <div className="text-center py-10 text-gray-500">No players found matching your filters.</div>
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
  
  // Mapping role to display name
  const roleDisplayNames: {[key in Role]: string} = {
      [Role.CLASH]: "CLASH LANE",
      [Role.JUNGLE]: "JUNGLER",
      [Role.MID]: "MID LANE",
      [Role.FARM]: "FARM LANE",
      [Role.ROAM]: "ROAMER"
  };

  return (
    <div className={`mb-12 rounded-xl p-6 transition-all duration-500 ${error ? 'bg-red-900/20 border border-red-500 shadow-[0_0_30px_rgba(255,42,42,0.3)]' : 'bg-white/5 border border-white/5'}`}>
      <div className="flex items-center mb-6 border-l-4 border-ikl-red pl-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-widest text-white uppercase">
          {roleDisplayNames[role]}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {players.filter(p => p.role === role).map((player) => {
           const isSelected = selectedId === player.id;
           const teamLogo = teams.find(t => t.name === player.team)?.logo;

           return (
            <div
              key={player.id}
              onClick={() => onSelect(player.id)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                isSelected 
                  ? 'border-ikl-green shadow-[0_0_20px_rgba(74,222,128,0.6)] bg-gradient-to-b from-ikl-green/10 to-transparent scale-105 z-10' 
                  : 'border-transparent bg-black/40 hover:border-ikl-red/50 hover:bg-white/5'
              }`}
            >
              {/* Image Container */}
              <div className="aspect-[4/5] bg-gray-900 relative">
                 {player.image ? (
                   <img src={player.image} alt={player.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-800 font-display text-6xl font-bold select-none">
                        {player.team.substring(0,2)}
                    </div>
                 )}
                 {/* Gradient Overlay for Text readability */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-ikl-green text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-pulse uppercase tracking-wider z-20">
                  Picked
                </div>
              )}
              
              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                <div className={`font-display text-2xl font-bold leading-none tracking-wide text-center mb-2 ${isSelected ? 'text-ikl-green' : 'text-white'}`}>
                    {player.name}
                </div>
                
                {/* Team Info */}
                <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-2">
                    {teamLogo ? (
                        <img src={teamLogo} alt={player.team} className="w-5 h-5 object-contain" />
                    ) : (
                        <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                    )}
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[80px]">
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'list'>('builder');
  
  const [formData, setFormData] = useState({
    email: '',
    week: '',
    instagram: ''
  });
  
  const [selections, setSelections] = useState<{ [key in Role]?: string }>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getPlayers(), getTeams()]).then(([playerData, teamData]) => {
      setPlayers(playerData);
      setTeams(teamData);
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
    return missingRoles.length === 0 && formData.email && formData.week && formData.instagram;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
       alert("Please fill all fields and select a player for every role.");
       return;
    }

    setSubmitting(true);
    
    // Construct player names map
    const finalSelections: any = {};
    Object.entries(selections).forEach(([role, id]) => {
        const p = players.find(x => x.id === id);
        if (p) finalSelections[role] = p.name;
    });

    await submitDreamTeam({
      ...formData,
      selections: finalSelections
    });

    setSubmitting(false);
    setSuccess(true);
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
             <div className="w-16 h-16 border-4 border-ikl-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-gray-500 font-display tracking-widest">LOADING ASSETS</p>
          </div>
      </div>
  );

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
        <div className="w-24 h-24 rounded-full bg-ikl-green flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(74,222,128,0.4)] animate-bounce">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-6xl font-display font-bold text-white mb-4">TEAM SUBMITTED</h1>
        <p className="text-xl text-gray-400 max-w-lg mb-10">Thanks for participating! Make sure to watch the stream to see how your team performs.</p>
        <button onClick={() => { setSuccess(false); setSelections({}); }} className="px-8 py-4 bg-white text-black font-display text-xl font-bold rounded hover:bg-gray-200 transition-colors uppercase tracking-widest">
          Create Another Team
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center -mt-8 mb-10">
           {/* Background FX */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-ikl-red/10 rounded-full blur-[100px] pointer-events-none"></div>
           
           <h1 className="text-7xl md:text-9xl font-display font-bold text-white mb-8 leading-none tracking-tighter drop-shadow-2xl select-none">
              SEMUA BISA <br />
              <span className="text-ikl-red animate-pulse drop-shadow-[0_0_15px_rgba(255,42,42,0.8)]">BIKIN TIM</span>
           </h1>
           
           <button 
             onClick={scrollToBuilder}
             className="group relative px-10 py-5 bg-white text-black font-display font-bold text-2xl uppercase tracking-widest overflow-hidden transition-all hover:bg-ikl-red hover:text-white rounded-sm shadow-xl hover:shadow-2xl hover:shadow-ikl-red/20"
           >
             <span className="relative z-10 flex items-center gap-2">
                Mulai
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
             </span>
             <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
           </button>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div id="builder-section" className="scroll-mt-24 max-w-6xl mx-auto px-4">
          
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-black/40 border border-white/10 rounded-lg p-1 flex gap-2">
               <button 
                 onClick={() => setActiveTab('builder')}
                 className={`px-8 py-3 rounded font-display font-bold text-xl uppercase tracking-wider transition-all ${activeTab === 'builder' ? 'bg-ikl-red text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 Team Builder
               </button>
               <button 
                 onClick={() => setActiveTab('list')}
                 className={`px-8 py-3 rounded font-display font-bold text-xl uppercase tracking-wider transition-all ${activeTab === 'list' ? 'bg-ikl-red text-white shadow-[0_0_15px_rgba(255,42,42,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 Player List
               </button>
            </div>
          </div>

          {activeTab === 'list' ? (
             <PlayerListTable players={players} teams={teams} />
          ) : (
            <>
                <div className="flex flex-col md:flex-row items-end gap-4 mb-10 border-b border-white/10 pb-4">
                  <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-none">PILIH <br/><span className="text-ikl-red">PLAYER</span></h2>
                  <p className="text-gray-500 font-display text-xl mb-2"> / SELECT 1 PLAYER PER ROLE</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-12">
                  
                  {/* Fan/Viewer Registration Card */}
                  <div className="bg-gradient-to-br from-white/5 to-black border border-white/10 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 bg-ikl-gold"></div>
                        <h3 className="text-2xl font-display text-white uppercase tracking-wider">Registrasi</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          required
                          className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white placeholder-gray-700 focus:border-ikl-red focus:outline-none transition-colors"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Week</label>
                        <div className="relative">
                            <select 
                              required
                              className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white appearance-none focus:border-ikl-red focus:outline-none transition-colors"
                              value={formData.week}
                              onChange={e => setFormData({...formData, week: e.target.value})}
                            >
                              <option value="">Select Week...</option>
                              {[1,2,3,4,5,6].map(w => <option key={w} value={`Week ${w}`}>Week {w}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram ID / Link</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white placeholder-gray-700 focus:border-ikl-red focus:outline-none transition-colors"
                          placeholder="@username or https://instagram.com/..."
                          value={formData.instagram}
                          onChange={e => setFormData({...formData, instagram: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Roles Selection */}
                  <div className="space-y-1">
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

                  {/* Submit Bar */}
                  <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-4 z-50 flex flex-col md:flex-row items-center justify-between px-4 md:px-20 gap-4">
                      <div className="hidden md:block text-sm text-gray-400">
                          <span className="text-white font-bold">{Object.keys(selections).length}</span> / 5 Players Selected
                      </div>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className={`w-full md:w-auto px-12 py-4 text-2xl font-display font-bold uppercase tracking-widest rounded-sm shadow-lg transition-all ${
                          submitting 
                          ? 'bg-gray-800 text-gray-500 cursor-wait' 
                          : 'bg-ikl-red hover:bg-red-600 text-white shadow-[0_0_30px_rgba(255,42,42,0.4)] hover:scale-105 hover:-translate-y-1'
                        }`}
                      >
                        {submitting ? 'Submitting...' : 'Confirm Team'}
                      </button>
                  </div>
                </form>
            </>
          )}
      </div>
    </div>
  );
};