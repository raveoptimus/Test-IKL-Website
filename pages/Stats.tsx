import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Player } from '../types';
import { getPlayers } from '../services/api';

export const Stats: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers().then(data => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20">Loading Stats...</div>;

  // Prepare data for charts
  const topKDA = [...players].sort((a, b) => b.stats.kda - a.stats.kda).slice(0, 5);
  const topGPM = [...players].sort((a, b) => b.stats.gpm - a.stats.gpm).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 p-4 rounded shadow-xl">
          <p className="font-display text-xl text-white">{label}</p>
          <p className="text-ikl-gold font-mono">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="border-b border-white/10 pb-6">
        <h1 className="text-5xl font-display font-bold text-white mb-2">PLAYER STATISTICS</h1>
        <p className="text-gray-400">Analyze performance metrics from IKL Fall 2025.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top KDA Chart */}
          <div className="bg-ikl-panel p-6 rounded-xl border border-white/5">
             <h3 className="text-2xl font-display text-ikl-red mb-6">Highest KDA Ratio</h3>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={topKDA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="name" type="category" stroke="#fff" width={80} tick={{fontFamily: 'Teko', fontSize: 18}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="stats.kda" fill="#ff2a2a" barSize={20} radius={[0, 4, 4, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Top GPM Chart */}
          <div className="bg-ikl-panel p-6 rounded-xl border border-white/5">
             <h3 className="text-2xl font-display text-ikl-gold mb-6">Highest Gold Per Minute</h3>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={topGPM} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#fff" tick={{fontFamily: 'Teko', fontSize: 18}} />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="stats.gpm" fill="#fbbf24" barSize={40} radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Detailed Table */}
       <div className="bg-ikl-panel rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 bg-white/5 border-b border-white/10">
             <h3 className="text-2xl font-display text-white">Full Player Roster Stats</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-black text-gray-400 uppercase text-sm">
                     <th className="p-4 font-bold">Player</th>
                     <th className="p-4 font-bold">Team</th>
                     <th className="p-4 font-bold">Role</th>
                     <th className="p-4 font-bold text-right">Matches</th>
                     <th className="p-4 font-bold text-right">KDA</th>
                     <th className="p-4 font-bold text-right">GPM</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {players.map(p => (
                     <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-display text-xl text-white">{p.name}</td>
                        <td className="p-4 text-gray-400">{p.team}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-white/10 rounded text-xs uppercase text-gray-300">{p.role}</span></td>
                        <td className="p-4 text-right font-mono text-gray-400">{p.stats.matches}</td>
                        <td className="p-4 text-right font-mono text-ikl-red">{p.stats.kda.toFixed(2)}</td>
                        <td className="p-4 text-right font-mono text-ikl-gold">{p.stats.gpm}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};