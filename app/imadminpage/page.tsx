'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Play, Square, Loader2, Check, BarChart2, Users, Trophy, Activity } from 'lucide-react';

export default function AdminPage() {
  const teams = useQuery(api.teams.getTeams) || [];
  const eventState = useQuery(api.teams.getEventState);
  const onlineCount = useQuery(api.presence.getOnlineCount) || 0;
  
  const setCurrentTeamMutation = useMutation(api.teams.setCurrentTeam);
  const startEventMutation = useMutation(api.teams.startEvent);
  const resetEventMutation = useMutation(api.teams.resetEvent);

  const handleStart = async () => startEventMutation();
  const handleReset = async () => {
    if(confirm("Stop event?")) resetEventMutation();
  };
  const handleSetTeam = async (teamId: any) => setCurrentTeamMutation({ teamId });

  const totalVotes = teams.reduce((acc: number, curr: any) => acc + curr.likes, 0);
  const maxVotes = Math.max(...teams.map((t: any) => t.likes), 1); // Avoid div/0

  if (!eventState) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-zinc-600"/></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-zinc-800 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex justify-between items-start border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-white">Event Control</h1>
            <p className="text-sm text-zinc-500 font-mono">{eventState.eventName}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              eventState.isStarted 
                ? 'bg-green-950/30 border-green-900/50 text-green-500' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${eventState.isStarted ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`} />
              {eventState.isStarted ? 'LIVE BROADCAST' : 'OFFLINE'}
            </div>

            {!eventState.isStarted ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-black hover:bg-white rounded-md text-sm font-medium transition-colors"
              >
                <Play size={14} /> Start Event
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-md text-sm font-medium transition-colors text-zinc-400 hover:text-white"
              >
                <Square size={14} /> Stop Event
              </button>
            )}
          </div>
        </header>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Live Audience</p>
                    <h2 className="text-3xl font-mono text-white">{onlineCount}</h2>
                </div>
                <Users className="text-zinc-700" size={32} />
            </div>
            
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Total Votes</p>
                    <h2 className="text-3xl font-mono text-white">{totalVotes}</h2>
                </div>
                <Activity className="text-zinc-700" size={32} />
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Leading Team</p>
                    <h2 className="text-xl font-medium text-white truncate max-w-[150px]">
                        {teams.reduce((max: any, t: any) => t.likes > (max?.likes || -1) ? t : max, null)?.name || "-"}
                    </h2>
                </div>
                <Trophy className="text-amber-600/50" size={32} />
            </div>
        </div>

        {/* Teams & Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vote Distribution Graph */}
            <div className="lg:col-span-1 bg-zinc-900/20 border border-zinc-800 rounded-xl p-6 h-fit">
                <h3 className="text-sm font-medium text-zinc-400 mb-6 flex items-center gap-2">
                    <BarChart2 size={16} /> Vote Distribution
                </h3>
                <div className="space-y-4">
                    {teams.map((team: any) => (
                        <div key={team._id} className="space-y-1 group">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-300 group-hover:text-white transition-colors">{team.name}</span>
                                <span className="text-zinc-500 font-mono">{Math.round((team.likes / (totalVotes || 1)) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-zinc-500 group-hover:bg-white transition-all duration-500"
                                    style={{ width: `${(team.likes / maxVotes) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && <div className="text-zinc-600 text-xs text-center py-4">No data available</div>}
                </div>
            </div>

            {/* Team Controls */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team: any) => {
                const isLive = eventState.currentTeamId === team._id;
                
                return (
                <div 
                    key={team._id}
                    className={`
                    relative group p-6 rounded-xl border transition-all duration-300
                    ${isLive 
                        ? 'bg-zinc-900/60 border-zinc-700 shadow-xl shadow-black/20' 
                        : 'bg-[#09090b] border-zinc-800 hover:border-zinc-700'
                    }
                    `}
                >
                    <div className="flex justify-between items-start mb-6">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${isLive ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-600'}`}>
                        #{team.order + 1}
                    </span>
                    {isLive && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-green-500 uppercase animate-pulse">
                        <div className="w-1 h-1 bg-green-500 rounded-full"/> Live
                        </div>
                    )}
                    </div>

                    <h3 className={`text-xl font-medium mb-8 leading-tight ${isLive ? 'text-white' : 'text-zinc-400'}`}>
                    {team.name}
                    </h3>

                    <div className="flex items-end justify-between border-t border-zinc-800/50 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium mb-1">Votes</span>
                        <span className="text-2xl font-mono text-zinc-200">{team.likes}</span>
                    </div>

                    <button
                        onClick={() => handleSetTeam(team._id)}
                        disabled={isLive}
                        className={`
                        px-4 py-2 rounded-lg text-xs font-medium transition-all
                        ${isLive
                            ? 'bg-zinc-800 text-zinc-400 cursor-default'
                            : 'bg-zinc-100 text-black hover:bg-white hover:scale-105'
                        }
                        `}
                    >
                        {isLive ? 'Current' : 'Push Live'}
                    </button>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {teams.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No teams configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

