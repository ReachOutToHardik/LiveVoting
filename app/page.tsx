'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Trophy } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function Home() {
  const teams = useQuery(api.teams.getTeams) ?? [];
  const currentTeamId = useQuery(api.teams.getCurrentTeam);
  const eventName = useQuery(api.teams.getEventName) ?? 'Creators Tank';
  const likeTeamMutation = useMutation(api.teams.likeTeam);
  
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const currentTeam = teams.find((t) => t._id === currentTeamId);

  // Reset liked when team changes
  useEffect(() => {
    setLiked(false);
  }, [currentTeamId]);

  const handleLike = async () => {
    if (!currentTeamId || liked) return;
    
    setLiked(true);
    await likeTeamMutation({ teamId: currentTeamId as Id<"teams"> });

    // Create particle effect
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setParticles(newParticles);

    setTimeout(() => setParticles([]), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-accent flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo/Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-neon-purple animate-float" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue bg-clip-text text-transparent">
              {eventName}
            </h1>
            <Sparkles className="w-12 h-12 text-neon-pink animate-float" />
          </div>
          <p className="text-gray-400 text-lg">Vote for your favorite team</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentTeam ? (
            <motion.div
              key={currentTeam._id}
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-dark-card to-dark-accent rounded-3xl p-8 shadow-2xl border border-neon-purple/20 relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-neon-pink/5 to-neon-blue/5 animate-glow" />

              <div className="relative z-10">
                {/* Team Name */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {currentTeam.name}
                </motion.h2>

                {/* Like Counter */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-center mb-8"
                >
                  <div className="inline-flex items-center gap-3 bg-dark-bg/50 rounded-full px-8 py-4 border border-neon-pink/30">
                    <Heart className="w-8 h-8 text-neon-pink fill-neon-pink" />
                    <span className="text-4xl font-bold text-neon-pink">
                      {currentTeam.likes}
                    </span>
                    <span className="text-gray-400 text-lg">likes</span>
                  </div>
                </motion.div>

                {/* Like Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center relative"
                >
                  <motion.button
                    onClick={handleLike}
                    disabled={liked}
                    whileHover={{ scale: liked ? 1 : 1.05 }}
                    whileTap={{ scale: liked ? 1 : 0.95 }}
                    className={`
                      relative px-12 py-6 rounded-2xl text-2xl font-bold
                      transition-all duration-300
                      ${liked 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-2xl hover:shadow-neon-purple/50'
                      }
                      flex items-center justify-center gap-3 mx-auto
                      border-2 border-white/20
                    `}
                  >
                    <Heart className={`w-8 h-8 ${liked ? 'fill-white' : ''}`} />
                    {liked ? 'Liked! ✓' : 'Like This Team'}
                  </motion.button>

                  {/* Particle effects */}
                  <AnimatePresence>
                    {particles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: particle.x,
                          y: particle.y,
                          opacity: 0,
                          scale: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 pointer-events-none"
                      >
                        <Heart className="w-6 h-6 text-neon-pink fill-neon-pink" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {liked && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6 text-emerald-400 font-semibold text-lg"
                  >
                    Thanks for voting! 🎉
                  </motion.p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-dark-card rounded-3xl p-16 border border-neon-purple/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-neon-purple" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-300 mb-4">
                Waiting for the next team...
              </h2>
              <p className="text-gray-500">The event will start soon!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>
  Made by{" "}
  <a
    href="https://instagram.com/hardik_joshi14"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline"
  >
    Hardik
  </a>{" "}
  - Real-time Voting
</p>
        </motion.div>
      </div>
    </div>
  );
}
