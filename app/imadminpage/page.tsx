'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Play, Square, Loader2, Check, BarChart2 } from 'lucide-react';

export default function AdminPage() {
  const teams = useQuery(api.teams.getTeams) || [];
  const eventState = useQuery(api.teams.getEventState);
  
  const setCurrentTeamMutation = useMutation(api.teams.setCurrentTeam);
  const startEventMutation = useMutation(api.teams.startEvent);
  const resetEventMutation = useMutation(api.teams.resetEvent);

  const handleStart = async () => startEventMutation();
  const handleReset = async () => {
    if(confirm("Stop event?")) resetEventMutation();
  };
  const handleSetTeam = async (teamId: any) => setCurrentTeamMutation({ teamId });

  if (!eventState) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="animate-spin text-zinc-600"/></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-zinc-800 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
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

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => {
            const isLive = eventState.currentTeamId === team._id;
            
            return (
              <div 
                key={team._id}
                className={`
                  relative group p-6 rounded-xl border transition-all duration-300
                  ${isLive 
                    ? 'bg-zinc-900/40 border-zinc-700 shadow-xl shadow-black/20' 
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

        {teams.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No teams configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
