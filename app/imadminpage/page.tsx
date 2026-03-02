'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function AdminPanel() {
  const teams = useQuery(api.teams.getTeams) ?? [];
  const currentTeamId = useQuery(api.teams.getCurrentTeam);
  const eventName = useQuery(api.teams.getEventName) ?? 'Creators Tank';
  const isStarted = useQuery(api.teams.getIsStarted) ?? false;

  const setCurrentTeamMutation = useMutation(api.teams.setCurrentTeam);
  const resetAllLikesMutation = useMutation(api.teams.resetAllLikes);
  const startEventMutation = useMutation(api.teams.startEvent);
  const resetEventMutation = useMutation(api.teams.resetEvent);

  const [loading, setLoading] = useState(false);

  const currentIndex = teams.findIndex((t) => t._id === currentTeamId);
  const topTeam = [...teams].sort((a, b) => b.likes - a.likes)[0];
  const totalLikes = teams.reduce((sum, t) => sum + t.likes, 0);

  const handleSetTeam = async (teamId: Id<'teams'>) => {
    await setCurrentTeamMutation({ teamId });
  };

  const handleNext = async () => {
    if (teams.length === 0) return;
    const next = teams[(currentIndex + 1) % teams.length];
    await handleSetTeam(next._id);
  };

  const handleStart = async () => {
    setLoading(true);
    if (teams.length > 0 && !currentTeamId) {
      await handleSetTeam(teams[0]._id);
    }
    await startEventMutation();
    setLoading(false);
  };

  const handleReset = async () => {
    if (!confirm('Reset everything? This clears all likes and stops the event.')) return;
    setLoading(true);
    await resetAllLikesMutation();
    await resetEventMutation();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-400 mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl font-black tracking-tight">{eventName}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide ${
            isStarted
              ? 'border-green-500/40 text-green-400 bg-green-500/10'
              : 'border-zinc-700 text-zinc-500 bg-zinc-900'
          }`}>
            <motion.span
              className={`w-1.5 h-1.5 rounded-full ${isStarted ? 'bg-green-400' : 'bg-zinc-600'}`}
              animate={isStarted ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            {isStarted ? 'LIVE' : 'NOT STARTED'}
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold tracking-wide bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-900 rounded-xl transition-colors text-zinc-400 hover:text-red-400"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Teams', value: teams.length, color: 'text-white' },
            { label: 'Total Votes', value: totalLikes, color: 'text-red-400' },
            { label: 'Leading', value: topTeam?.name ?? '—', color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-2xl font-black truncate ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Start / Next button */}
        {!isStarted ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={loading || teams.length === 0}
            className="w-full py-7 rounded-2xl font-black text-2xl tracking-tight bg-yellow-400 text-black hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🚀  Start Event
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={loading || teams.length === 0}
            className="w-full py-7 rounded-2xl font-black text-2xl tracking-tight bg-white text-black hover:bg-zinc-100 transition-colors disabled:opacity-40"
          >
            Next Team  →
          </motion.button>
        )}

        {/* Teams list */}
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-600 mb-4">
            All Teams
          </p>

          <div className="space-y-2">
            <AnimatePresence>
              {teams.map((team, i) => {
                const isCurrent = team._id === currentTeamId;
                const isTop = team._id === topTeam?._id && team.likes > 0;

                return (
                  <motion.div
                    key={team._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleSetTeam(team._id)}
                    className={`
                      flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer
                      border transition-all duration-150
                      ${isCurrent
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-mono w-6 ${isCurrent ? 'text-black/50' : 'text-zinc-700'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-lg">{team.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-black tracking-widest uppercase bg-black text-white px-2 py-0.5 rounded-full">
                          LIVE
                        </span>
                      )}
                      {isTop && !isCurrent && (
                        <span className="text-[10px] font-bold text-yellow-400">★ Leading</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isCurrent ? 'text-red-500' : 'text-red-400'}`}>♥</span>
                      <motion.span
                        key={team.likes}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className={`font-black text-xl tabular-nums ${isCurrent ? 'text-black' : 'text-white'}`}
                      >
                        {team.likes}
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {teams.length === 0 && (
              <div className="text-center py-16 text-zinc-700">
                <p className="text-lg">No teams yet.</p>
                <a href="/imsetup" className="text-yellow-400 text-sm mt-2 inline-block hover:underline">
                  Go to Setup →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
