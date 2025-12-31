import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Player } from '../types';
import { getPlayers } from '../services/api';
import { ROLE_LABELS } from '../constants';

type SortDirection = 'asc' | 'desc';
type SortConfig = { key: string; direction: SortDirection } | null;

export const Stats: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'highlights' | 'roster'>('highlights');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'calcKDA', direction: 'desc' });

  useEffect(() => {
    getPlayers().then(data => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  // --- PREPARE DATA ---
  const playersWithKDA = players.map(p => ({
      ...p,
      calcKDA: Number(((p.stats.kill + p.stats.assist) / (p.stats.death || 1)).toFixed(2)),
      calcAvgKill: Number((p.stats.kill / (p.stats.matches || 1)).toFixed(2)),
      calcAvgAssist: Number((p.stats.assist / (p.stats.matches || 1)).toFixed(2))
  }));

  // --- SORTING LOGIC ---
  const sortedPlayers = React.useMemo(() => {
    let sortableItems = [...playersWithKDA];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a;
        let bValue: any = b;

        // Handle nested properties or computed values
        if (sortConfig.key.includes('.')) {
             const keys = sortConfig.key.split('.');
             aValue = keys.reduce((obj: any, key) => obj[key], a);
             bValue = keys.reduce((obj: any, key) => obj[key], b);
        } else {
             aValue = (a as any)[sortConfig.key];
             bValue = (b as any)[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [playersWithKDA, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'desc'; // Default to desc for stats usually
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
     if (sortConfig?.key !== columnKey) return <span className="opacity-20 ml-1">⇅</span>;
     return <span className="text-ikl-gold ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  // --- CHARTS DATA ---
  const topKDA = [...playersWithKDA].sort((a, b) => b.calcKDA - a.calcKDA).slice(0, 5);
  const topGPM = [...players].sort((a, b) => b.stats.gpm - a.stats.gpm).slice(0, 5);
  const topKills = [...players].sort((a, b) => b.stats.kill - a.stats.kill).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-ikl-gold/30 p-4 rounded shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <p className="font-display text-xl text-white tracking-wider">{label}</p>
          <p className="text-ikl-gold font-mono font-bold">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
     <div className="flex h-[50vh] items-center justify-center">
         <div className="w-16 h-16 border-4 border-ikl-red border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
       
       {/* Header */}
       <div className="text-center py-8 relative">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2 tracking-tighter drop-shadow-lg">
             STATS CENTER
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-ikl-red to-transparent mx-auto"></div>
       </div>

       {/* Tabs Navigation */}
       <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-lg backdrop-blur-md">
             <button
                onClick={() => setActiveTab('highlights')}
                className={`px-8 py-3 rounded-md font-display text-xl tracking-widest transition-all duration-300 ${
                    activeTab === 'highlights' 
                    ? 'bg-gradient-to-r from-red-900/80 to-ikl-red/80 text-white shadow-[0_0_15px_rgba(255,42,42,0.4)] border border-white/10' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
             >
                HIGHLIGHTS
             </button>
             <button
                onClick={() => setActiveTab('roster')}
                className={`px-8 py-3 rounded-md font-display text-xl tracking-widest transition-all duration-300 ${
                    activeTab === 'roster' 
                    ? 'bg-gradient-to-r from-yellow-900/80 to-ikl-gold/80 text-white shadow-[0_0_15px_rgba(251,191,36,0.4)] border border-white/10' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
             >
                FULL ROSTER
             </button>
          </div>
       </div>

       {/* --- HIGHLIGHTS TAB --- */}
       {activeTab === 'highlights' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
            
            {/* Top KDA Chart */}
            <div className="bg-gradient-to-br from-[#111] to-black p-6 rounded-xl border border-white/10 hover:border-ikl-red/30 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-32 h-32 text-ikl-red" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
               </div>
               <h3 className="text-3xl font-display text-white mb-1 tracking-wider relative z-10">HIGHEST <span className="text-ikl-red">KDA</span> RATIO</h3>
               <p className="text-gray-500 text-xs uppercase mb-6 tracking-widest relative z-10">Kill Death Assist Ratio</p>
               
               <div className="h-[300px] relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topKDA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                      <XAxis type="number" stroke="#555" tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{fontFamily: 'Teko', fontSize: 18, letterSpacing: '1px'}} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,42,42,0.1)'}} />
                      <Bar dataKey="calcKDA" barSize={18} radius={[0, 4, 4, 0]}>
                        {topKDA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ff2a2a' : '#991b1b'} />
                        ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Top GPM Chart */}
            <div className="bg-gradient-to-br from-[#111] to-black p-6 rounded-xl border border-white/10 hover:border-ikl-gold/30 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-32 h-32 text-ikl-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 className="text-3xl font-display text-white mb-1 tracking-wider relative z-10">HIGHEST <span className="text-ikl-gold">GPM</span></h3>
               <p className="text-gray-500 text-xs uppercase mb-6 tracking-widest relative z-10">Gold Per Minute</p>
               
               <div className="h-[300px] relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topGPM} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#fff" tick={{fontFamily: 'Teko', fontSize: 18, letterSpacing: '1px'}} />
                      <YAxis stroke="#555" tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(251,191,36,0.1)'}} />
                      <Bar dataKey="stats.gpm" barSize={40} radius={[4, 4, 0, 0]}>
                         {topGPM.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#b45309'} />
                        ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Top Kills Chart (Full Width) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#111] to-black p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group shadow-2xl relative overflow-hidden">
               <h3 className="text-3xl font-display text-white mb-1 tracking-wider relative z-10">MOST <span className="text-blue-500">KILLS</span> (TOTAL)</h3>
               <div className="h-[250px] relative z-10 mt-6">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topKills} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#fff" tick={{fontFamily: 'Teko', fontSize: 18}} />
                      <YAxis stroke="#555" />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(59,130,246,0.1)'}} />
                      <Bar dataKey="stats.kill" barSize={50} radius={[4, 4, 0, 0]}>
                          {topKills.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#1e3a8a'} />
                          ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>
       )}

       {/* --- FULL ROSTER TAB (SORTABLE TABLE) --- */}
       {activeTab === 'roster' && (
         <div className="bg-ikl-panel rounded-xl border border-white/5 overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-6 bg-gradient-to-r from-black via-[#111] to-black border-b border-white/10 flex justify-between items-center">
               <h3 className="text-3xl font-display text-white tracking-wider">LEAGUE PLAYER DATABASE</h3>
               <div className="text-xs text-gray-500 font-mono hidden md:block">CLICK HEADERS TO SORT</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-black/50 text-gray-400 uppercase text-xs tracking-widest border-b border-white/10">
                       <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>
                           Player <SortIcon columnKey="name" />
                       </th>
                       <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('team')}>
                           Team <SortIcon columnKey="team" />
                       </th>
                       <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('role')}>
                           Role <SortIcon columnKey="role" />
                       </th>
                       <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('stats.matches')}>
                           Matches <SortIcon columnKey="stats.matches" />
                       </th>
                       <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('stats.kill')}>
                           Kills <SortIcon columnKey="stats.kill" />
                       </th>
                       <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('stats.assist')}>
                           Assists <SortIcon columnKey="stats.assist" />
                       </th>
                       <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('calcKDA')}>
                           KDA <SortIcon columnKey="calcKDA" />
                       </th>
                       <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('stats.gpm')}>
                           GPM <SortIcon columnKey="stats.gpm" />
                       </th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {sortedPlayers.map((p, idx) => (
                       <tr key={p.id} className={`hover:bg-white/5 transition-colors group ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
                          <td className="p-4 font-display text-xl text-white group-hover:text-ikl-red transition-colors">{p.name}</td>
                          <td className="p-4 text-gray-400 text-sm font-bold">{p.team}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-white/10 border border-white/5 rounded text-[10px] uppercase text-gray-300 font-bold tracking-wider">{ROLE_LABELS[p.role]}</span></td>
                          <td className="p-4 text-right font-mono text-gray-500">{p.stats.matches}</td>
                          <td className="p-4 text-right font-mono text-gray-400">{p.stats.kill}</td>
                          <td className="p-4 text-right font-mono text-gray-400">{p.stats.assist}</td>
                          <td className="p-4 text-right font-mono font-bold text-white">
                              <span className={p.calcKDA > 5 ? 'text-ikl-gold' : p.calcKDA > 3 ? 'text-ikl-red' : 'text-gray-300'}>
                                {p.calcKDA.toFixed(2)}
                              </span>
                          </td>
                          <td className="p-4 text-right font-mono text-ikl-gold">{p.stats.gpm}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>
       )}
    </div>
  );
};