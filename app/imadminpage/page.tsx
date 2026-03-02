'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Crown, 
  RefreshCw, 
  ChevronRight, 
  Trophy,
  Zap,
  TrendingUp 
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function AdminPanel() {
  const teams = useQuery(api.teams.getTeams) ?? [];
  const currentTeamId = useQuery(api.teams.getCurrentTeam);
  const setCurrentTeamMutation = useMutation(api.teams.setCurrentTeam);
  const resetAllLikesMutation = useMutation(api.teams.resetAllLikes);
  
  const [loading, setLoading] = useState(false);

  const handleSetCurrentTeam = async (teamId: Id<"teams">) => {
    setLoading(true);
    await setCurrentTeamMutation({ teamId });
    setLoading(false);
  };

  const handleNextTeam = async () => {
    const currentIndex = teams.findIndex((t) => t._id === currentTeamId);
    const nextIndex = (currentIndex + 1) % teams.length;
    if (teams[nextIndex]) {
      await handleSetCurrentTeam(teams[nextIndex]._id);
    }
  };

  const handleResetLikes = async () => {
    if (confirm('Are you sure you want to reset all likes to 0?')) {
      setLoading(true);
      await resetAllLikesMutation();
      setLoading(false);
    }
  };

  const topTeam = [...teams].sort((a, b) => b.likes - a.likes)[0];
  const totalLikes = teams.reduce((sum, team) => sum + team.likes, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-accent p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-yellow-500" />
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Admin Control
                </h1>
                <p className="text-gray-400 mt-1">Manage the Creators Tank event</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetLikes}
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              Reset All Likes
            </motion.button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-dark-card rounded-2xl p-6 border border-neon-purple/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-neon-purple" />
                <span className="text-gray-400">Total Teams</span>
              </div>
              <p className="text-4xl font-bold text-white">{teams.length}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-dark-card rounded-2xl p-6 border border-neon-pink/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-neon-pink" />
                <span className="text-gray-400">Total Likes</span>
              </div>
              <p className="text-4xl font-bold text-neon-pink">{totalLikes}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-dark-card rounded-2xl p-6 border border-yellow-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-400">Leading Team</span>
              </div>
              <p className="text-2xl font-bold text-white truncate">
                {topTeam?.name || 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Quick Actions
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNextTeam}
            disabled={loading || teams.length === 0}
            className="w-full bg-gradient-to-r from-neon-purple to-neon-pink py-6 rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-neon-purple/50 transition-all disabled:opacity-50"
          >
            <ChevronRight className="w-8 h-8" />
            Next Team
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </motion.div>

        {/* Teams List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">All Teams</h2>
          <div className="grid gap-4">
            <AnimatePresence>
              {teams.map((team, index) => {
                const isCurrent = team._id === currentTeamId;
                const isTop = team._id === topTeam?._id;
                
                return (
                  <motion.div
                    key={team._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSetCurrentTeam(team._id)}
                    className={`
                      relative bg-dark-card rounded-2xl p-6 cursor-pointer
                      transition-all border-2
                      ${isCurrent 
                        ? 'border-neon-purple shadow-lg shadow-neon-purple/50' 
                        : 'border-transparent hover:border-neon-purple/30'
                      }
                    `}
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="currentIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-2xl"
                      />
                    )}
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                          ${isCurrent 
                            ? 'bg-neon-purple text-white' 
                            : 'bg-dark-accent text-gray-400'
                          }
                        `}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold text-white">
                              {team.name}
                            </h3>
                            {isTop && (
                              <Crown className="w-5 h-5 text-yellow-500" />
                            )}
                            {isCurrent && (
                              <span className="px-3 py-1 bg-neon-purple rounded-full text-xs font-semibold">
                                NOW PLAYING
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Like count with animation */}
                        <motion.div
                          key={team.likes}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-3 bg-dark-accent rounded-full px-6 py-3"
                        >
                          <Heart className="w-6 h-6 text-neon-pink fill-neon-pink" />
                          <span className="text-3xl font-bold text-neon-pink">
                            {team.likes}
                          </span>
                        </motion.div>

                        <ChevronRight className={`
                          w-6 h-6 transition-colors
                          ${isCurrent ? 'text-neon-purple' : 'text-gray-600'}
                        `} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {teams.length === 0 && (
            <div className="text-center py-16 bg-dark-card rounded-2xl border border-neon-purple/20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl">No teams yet. Add teams to get started!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
