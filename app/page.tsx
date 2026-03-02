'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const eventState = useQuery(api.teams.getEventState);
  const teams = useQuery(api.teams.getTeams);
  const likeTeamMutation = useMutation(api.teams.likeTeam);

  const [hasVoted, setHasVoted] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const updatePresence = useMutation(api.presence.updatePresence);
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('creator_tank_user_id');
      if (!id) {
        id = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('creator_tank_user_id', id);
      }
      return id;
    }
    return 'temp-' + Math.random();
  });

  // Heartbeat for presence
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      updatePresence({ userId });
    }, 5000); // Pulse every 5 seconds
    updatePresence({ userId }); // Initial pulse
    return () => clearInterval(interval);
  }, [updatePresence, userId]);

  const currentTeam = teams?.find((t) => t._id === eventState?.currentTeamId);

  useEffect(() => {
    setHasVoted(false);
    if (currentTeam) {
      setLocalLikes(currentTeam.likes);
      // Check local storage for vote persistence
      const voteKey = `voted_${currentTeam._id}`;
      if (typeof window !== 'undefined' && localStorage.getItem(voteKey)) {
        setHasVoted(true);
      }
    }
  }, [currentTeam?._id, currentTeam?.likes]);

  const handleVote = () => {
    if (!currentTeam || hasVoted) return;

    // Optimistic update
    setLocalLikes((prev) => prev + 1);
    setHasVoted(true);
    
    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`voted_${currentTeam._id}`, 'true');
    }

    // Actual mutation
    likeTeamMutation({ teamId: currentTeam._id });
  };

  if (!eventState || !teams) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="animate-spin text-zinc-600" size={24} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-white font-sans antialiased selection:bg-zinc-800 selection:text-zinc-200">
      
      {/* Subtle Ambient light */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!eventState.isStarted ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 flex flex-col items-center justify-center h-full space-y-12 px-6 text-center"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase">Stand By</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-zinc-100 max-w-3xl leading-tight">
                {eventState.eventName || "Event"}
              </h1>
              <p className="text-zinc-500 text-sm tracking-[0.2em] font-light uppercase">
                Broadcast Starting Soon
              </p>
            </div>
            
            {/* Minimal loader line */}
            <div className="w-24 h-[1px] bg-zinc-800 overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-zinc-500 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="voting"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="z-10 w-full max-w-md flex flex-col items-center justify-between min-h-[60vh] py-12"
          >
            {/* Header Area */}
            <div className="flex flex-col items-center gap-6 w-full px-6">
              <div className="flex items-center gap-2 opacity-80">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
                  Live On Stage
                </span>
              </div>
              
              <div className="text-center w-full min-h-[120px] flex items-center justify-center">
                {currentTeam ? (
                  <motion.h1
                    key={currentTeam._id}
                    initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-semibold text-zinc-100 tracking-tighter leading-none"
                  >
                    {currentTeam.name}
                  </motion.h1>
                ) : (
                  <span className="text-xl text-zinc-600 font-light italic tracking-wide">
                    Transitioning...
                  </span>
                )}
              </div>
            </div>

            {/* Interaction Area */}
            {currentTeam && (
              <div className="flex flex-col items-center gap-16 mt-8">
                <motion.button
                  whileHover={!hasVoted ? { scale: 1.05 } : {}}
                  whileTap={!hasVoted ? { scale: 0.95 } : {}}
                  onClick={handleVote}
                  disabled={hasVoted}
                  className={`
                    group relative flex items-center justify-center w-32 h-32 rounded-full
                    transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
                    ${hasVoted 
                      ? 'bg-zinc-900 border border-zinc-800 cursor-default opacity-80' 
                      : 'bg-zinc-100 text-black hover:bg-white cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.15)]'
                    }
                  `}
                >
                  <Heart
                    className={`w-10 h-10 transition-all duration-500 ${
                      hasVoted 
                        ? 'fill-zinc-700 text-zinc-700 scale-100' 
                        : 'fill-transparent stroke-black scale-90 group-hover:scale-110'
                    }`}
                    strokeWidth={1.5}
                  />
                  {!hasVoted && (
                    <span className="absolute -bottom-12 text-[10px] uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Tap to Vote
                    </span>
                  )}
                  {hasVoted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-[#09090b]" />
                    </motion.div>
                  )}
                </motion.button>

                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
                    Current Score
                  </span>
                  <div className="text-3xl text-zinc-200 font-mono tracking-tighter tabular-nums">
                    {localLikes.toString().padStart(3, '0')}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-8 left-0 w-full text-center">
        <p className="text-[10px] font-medium tracking-widest text-zinc-800 uppercase">
          Made by Hardik • <a href="https://instagram.com/hardik_joshi14" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 transition-colors">@hardik</a>
        </p>
      </div>
    </main>
  );
}

