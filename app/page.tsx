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

  // Derive current team from state
  const currentTeam = teams?.find((t) => t._id === eventState?.currentTeamId);

  // Reset local vote state when team changes
  useEffect(() => {
    setHasVoted(false);
    if (currentTeam) {
      setLocalLikes(currentTeam.likes);
    }
  }, [currentTeam?._id, currentTeam?.likes]);

  const handleVote = () => {
    if (!currentTeam || hasVoted) return;

    // Optimistic update
    setLocalLikes((prev) => prev + 1);
    setHasVoted(true);

    // Actual mutation
    likeTeamMutation({ teamId: currentTeam._id });
  };

  if (!eventState || !teams) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 font-sans overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!eventState.isStarted ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 text-center space-y-12 flex flex-col items-center justify-center h-full w-full max-w-4xl px-4"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-2 tracking-tighter drop-shadow-lg">
                {eventState.eventName || "Event"}
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-lg blur opacity-20 -z-10"></div>
            </motion.div>
            
            <div className="relative inline-block group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative px-12 py-6 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                <span className="flex items-center space-x-5 px-6">
                  <span className="text-gray-100 font-bold text-2xl tracking-wide uppercase">Starting Soon</span>
                </span>
                <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200 flex gap-2">
                   <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="voting"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            className="z-10 w-full max-w-lg flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="text-center mb-10 w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400 mb-4"
              >
                Now Live
              </motion.div>
              
              <div className="min-h-[120px] flex items-center justify-center">
                {currentTeam ? (
                  <motion.h1
                    key={currentTeam._id}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    {currentTeam.name}
                  </motion.h1>
                ) : (
                  <div className="text-2xl text-gray-500 animate-pulse font-light">
                    Preparing next team...
                  </div>
                )}
              </div>
            </div>

            {currentTeam && (
              <div className="flex flex-col items-center gap-10 w-full">
                <motion.button
                  whileHover={!hasVoted ? { scale: 1.1, boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)" } : {}}
                  whileTap={!hasVoted ? { scale: 0.9 } : {}}
                  onClick={handleVote}
                  disabled={hasVoted}
                  className={`
                    group relative flex items-center justify-center w-40 h-40 rounded-full 
                    bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500
                    shadow-[0_0_30px_rgba(236,72,153,0.4)]
                    transition-all duration-300 border-4 border-white/10
                    ${hasVoted ? 'opacity-50 grayscale cursor-not-allowed shadow-none' : 'cursor-pointer'}
                  `}
                >
                  <div className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <Heart
                    className={`w-16 h-16 text-white drop-shadow-md transition-transform duration-300 ${
                      hasVoted ? 'scale-100' : 'group-hover:scale-125'
                    }`}
                    fill={hasVoted ? 'white' : 'transparent'}
                    strokeWidth={2.5}
                  />
                  {!hasVoted && (
                    <span className="absolute -bottom-10 text-sm font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
                      Tap to Vote
                    </span>
                  )}
                </motion.button>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 flex flex-col items-center min-w-[200px]">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Live Votes</span>
                  <motion.span 
                    key={localLikes}
                    initial={{ scale: 1.5, color: '#ec4899' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="text-5xl font-black font-mono"
                  >
                    {localLikes}
                  </motion.span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-6 text-gray-500 text-xs font-medium tracking-widest opacity-50 uppercase">
        Creators Tank Live • {eventState.eventName}
      </div>
    </main>
  );
}

