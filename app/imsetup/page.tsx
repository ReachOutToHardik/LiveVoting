'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Rocket, Plus, Trash2 } from 'lucide-react';

export default function SetupPage() {
  const [eventName, setEventName] = useState('Creators Tank');
  const [teams, setTeams] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const initializeTeamsMutation = useMutation(api.teams.initializeTeams);

  const addTeam = () => {
    setTeams([...teams, '']);
  };

  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const updateTeam = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  const handleInitialize = async () => {
    if (!eventName.trim()) {
      alert('Please enter an event name!');
      return;
    }
    
    const validTeams = teams.filter(t => t.trim() !== '');
    if (validTeams.length === 0) {
      alert('Please add at least one team!');
      return;
    }

    setLoading(true);
    try {
      await initializeTeamsMutation({ teamNames: validTeams, eventName: eventName.trim() });
      setSuccess(true);
    } catch (error) {
      console.error('Error initializing teams:', error);
      alert('Error initializing teams. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-accent flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-dark-card rounded-3xl p-12 border border-green-500/20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Rocket className="w-24 h-24 text-green-500" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Setup Complete! 🎉</h2>
          <p className="text-gray-400 mb-8">Your Creators Tank is ready to go!</p>
          <a
            href="/imadminpage"
            className="inline-block px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            Go to Admin Panel
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-accent p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-4">
            Initial Setup
          </h1>
          <p className="text-gray-400 text-lg">Add your teams to get started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card rounded-3xl p-8 border border-neon-purple/20"
        >
          {/* Event Name Input */}
          <div className="mb-8">
            <label className="block text-gray-400 mb-2 font-semibold">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Creators Tank, Battle of Bands, etc."
              className="w-full px-6 py-4 bg-dark-accent rounded-xl text-white placeholder-gray-500 border border-neon-purple/30 focus:border-neon-purple focus:outline-none text-lg font-semibold"
            />
          </div>

          <h3 className="text-xl font-bold text-white mb-4">Team Names</h3>
          <div className="space-y-4 mb-6">
            {teams.map((team, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={team}
                  onChange={(e) => updateTeam(index, e.target.value)}
                  placeholder={`Team ${index + 1} name`}
                  className="flex-1 px-6 py-4 bg-dark-accent rounded-xl text-white placeholder-gray-500 border border-neon-purple/30 focus:border-neon-purple focus:outline-none"
                />
                {teams.length > 1 && (
                  <button
                    onClick={() => removeTeam(index)}
                    className="px-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <button
            onClick={addTeam}
            className="w-full py-4 bg-dark-accent hover:bg-dark-accent/80 rounded-xl font-semibold flex items-center justify-center gap-2 mb-6 border border-neon-purple/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Another Team
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInitialize}
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-neon-purple/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Rocket className="w-6 h-6" />
            {loading ? 'Initializing...' : 'Initialize Database'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
