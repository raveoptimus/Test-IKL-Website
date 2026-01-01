import React, { useEffect, useState } from 'react';
import { Match, Team } from '../types';
import { getMatches, getTeams } from '../services/api';

export const Schedule: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatches(), getTeams()]).then(([matchData, teamData]) => {
      setMatches(matchData);
      setTeams(teamData);
      setLoading(false);
    });
  }, []);

  const getLogo = (teamName: string) => {
    const t = teams.find(team => team.name === teamName);
    return t?.logo || null;
  };

  if (loading) return (
      <div className="flex h-[50vh] items-center justify-center">
          <div className="w-16 h-16 border-4 border-ikl-red border-t-transparent rounded-full animate-spin"></div>
      </div>
  );

  return (
    <div className="animate-fade-in pb-16 px-4 md:px-0">
        <div className="text-center mb-10 md:mb-16">
            <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-4 uppercase tracking-tighter">MATCH SCHEDULE</h1>
            <div className="h-2 w-32 bg-ikl-red mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {matches.map(match => (
                <div key={match.id} className="relative bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-ikl-red/50 transition-all duration-300 group">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-ikl-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Live Indicator */}
                    {match.status === 'Live' && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full animate-pulse z-10">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
                            <span className="text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-widest">LIVE NOW</span>
                        </div>
                    )}

                    <div className="p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        {/* Meta Info */}
                        <div className="text-center md:text-left min-w-[120px] order-3 md:order-1 border-t border-white/5 md:border-none pt-4 md:pt-0 w-full md:w-auto">
                            <div className="text-ikl-gold font-display text-xl md:text-2xl tracking-widest mb-1">{match.date}</div>
                            <div className="text-white font-bold text-base md:text-lg">{match.time}</div>
                            <div className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2 bg-white/5 px-2 py-1 rounded inline-block">{match.stage}</div>
                        </div>

                        {/* Matchup */}
                        <div className="flex-1 flex items-center justify-center gap-4 md:gap-12 w-full order-1 md:order-2">
                            {/* Team A */}
                            <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 text-right">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 rounded-full border border-white/10 p-2 flex items-center justify-center relative overflow-hidden">
                                     {getLogo(match.teamA) ? (
                                         <img src={getLogo(match.teamA)!} alt={match.teamA} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                     ) : (
                                         <span className="font-display text-2xl md:text-3xl text-gray-700">{match.teamA.substring(0,2)}</span>
                                     )}
                                </div>
                                <span className="font-display text-xl md:text-4xl font-bold text-white uppercase tracking-wide truncate w-full text-center">{match.teamA}</span>
                            </div>

                            {/* VS / Score */}
                            <div className="flex flex-col items-center">
                                {match.status === 'Upcoming' ? (
                                    <span className="font-display text-3xl md:text-6xl font-bold text-gray-700 italic px-2">VS</span>
                                ) : (
                                    <div className="flex items-center gap-2 md:gap-4 bg-black/50 px-4 py-1 md:px-6 md:py-2 rounded-lg border border-white/10">
                                        <span className={`font-display text-3xl md:text-5xl font-bold ${match.scoreA > match.scoreB ? 'text-ikl-green' : match.scoreA < match.scoreB ? 'text-red-500' : 'text-white'}`}>{match.scoreA}</span>
                                        <span className="text-gray-600 font-bold">-</span>
                                        <span className={`font-display text-3xl md:text-5xl font-bold ${match.scoreB > match.scoreA ? 'text-ikl-green' : match.scoreB < match.scoreA ? 'text-red-500' : 'text-white'}`}>{match.scoreB}</span>
                                    </div>
                                )}
                                <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 md:mt-2">{match.format}</span>
                            </div>

                            {/* Team B */}
                            <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 text-left">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 rounded-full border border-white/10 p-2 flex items-center justify-center relative overflow-hidden">
                                     {getLogo(match.teamB) ? (
                                         <img src={getLogo(match.teamB)!} alt={match.teamB} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                     ) : (
                                         <span className="font-display text-2xl md:text-3xl text-gray-700">{match.teamB.substring(0,2)}</span>
                                     )}
                                </div>
                                <span className="font-display text-xl md:text-4xl font-bold text-white uppercase tracking-wide truncate w-full text-center">{match.teamB}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {matches.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-display text-2xl tracking-widest border border-dashed border-white/10 rounded-xl">
                    NO UPCOMING MATCHES SCHEDULED
                </div>
            )}
        </div>
    </div>
  );
};