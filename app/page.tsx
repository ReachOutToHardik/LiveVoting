'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function Home() {
  const teams = useQuery(api.teams.getTeams) ?? [];
  const currentTeamId = useQuery(api.teams.getCurrentTeam);
  const eventName = useQuery(api.teams.getEventName) ?? 'Creators Tank';
  const isStarted = useQuery(api.teams.getIsStarted) ?? false;
  const likeTeamMutation = useMutation(api.teams.likeTeam);

  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [dots, setDots] = useState('');

  const currentTeam = teams.find((t) => t._id === currentTeamId);
  const currentIndex = teams.findIndex((t) => t._id === currentTeamId);

  useEffect(() => {
    setLiked(false);
  }, [currentTeamId]);

  useEffect(() => {
    if (isStarted) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [isStarted]);

  const handleLike = async () => {
    if (!currentTeamId || liked) return;
    setLiked(true);
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    await likeTeamMutation({ teamId: currentTeamId as Id<'teams'> });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col select-none overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-400">
          {eventName}
        </span>
        {isStarted && currentTeam && (
          <span className="text-xs font-mono text-zinc-600">
            {String(currentIndex + 1).padStart(2, '0')} / {String(teams.length).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="h-px bg-zinc-900 mx-6" />

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── Waiting Screen ── */}
          {!isStarted && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center w-full max-w-md"
            >
              <div className="relative inline-flex items-center justify-center mb-10">
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-yellow-400/25"
                  animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-yellow-400/10"
                  animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center z-10">
                  <span className="text-4xl">🎬</span>
                </div>
              </div>

              <h1 className="text-5xl font-black tracking-tight mb-3 leading-none">
                {eventName}
              </h1>
              <p className="text-zinc-500 mb-6">Get your votes ready</p>

              <motion.div
                className="inline-flex items-center gap-2 border border-yellow-400/30 rounded-full px-5 py-2"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
                  Starting Soon{dots}
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ── Team Voting Screen ── */}
          {isStarted && currentTeam && (
            <motion.div
              key={currentTeam._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-md text-center"
            >
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-600 mb-5">
                Now Voting
              </p>

              <h2 className="text-6xl sm:text-7xl font-black tracking-tight leading-none mb-12">
                {currentTeam.name}
              </h2>

              {/* Like button */}
              <div className="relative inline-block mb-8">
                <motion.button
                  onClick={handleLike}
                  disabled={liked}
                  whileTap={{ scale: liked ? 1 : 0.9 }}
                  className="outline-none"
                >
                  <motion.div
                    animate={burst ? { scale: [1, 1.18, 1] } : {}}
                    transition={{ duration: 0.35 }}
                    className={`
                      w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2
                      transition-all duration-200 border-2
                      ${liked
                        ? 'bg-red-500 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 active:border-red-500'
                      }
                    `}
                  >
                    <motion.span
                      animate={burst ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.35 }}
                      className="text-5xl leading-none"
                    >
                      {liked ? '❤️' : '🤍'}
                    </motion.span>
                    <span className={`text-[11px] font-black tracking-[0.2em] uppercase ${liked ? 'text-white' : 'text-zinc-500'}`}>
                      {liked ? 'Voted!' : 'Vote'}
                    </span>
                  </motion.div>
                </motion.button>
              </div>

              {/* Vote count */}
              <motion.div
                key={currentTeam.likes}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 bg-zinc-950 border border-zinc-900 rounded-full px-6 py-3"
              >
                <span className="text-red-400">♥</span>
                <span className="text-white font-black text-xl tabular-nums">{currentTeam.likes}</span>
                <span className="text-zinc-600 text-sm">votes</span>
              </motion.div>

              {liked && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-zinc-600 text-sm mt-5"
                >
                  Your vote has been counted ✓
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ── Started but no team yet ── */}
          {isStarted && !currentTeam && (
            <motion.div
              key="no-team"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-zinc-600 text-lg">Waiting for next team…</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-6">
        <div className="h-px bg-zinc-900 mb-4" />
        <p className="text-center text-zinc-800 text-xs tracking-[0.2em] uppercase">
          Vote for your favorite team
        </p>
      </div>
    </div>
  );
}

