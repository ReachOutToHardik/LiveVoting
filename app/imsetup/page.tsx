'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SetupPage() {
  const [eventName, setEventName] = useState('Creators Tank');
  const [teams, setTeams] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');
  
  const initializeTeams = useMutation(api.teams.initializeTeams);

  const handleSubmit = async () => {
    if (!eventName.trim() || !teams.some(t => t.trim())) return;
    setLoading(true);
    try {
      await initializeTeams({ 
        teamNames: teams.filter(t => t.trim()), 
        eventName: eventName.trim() 
      });
      setStatus('success');
    } catch (e) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 text-green-500">
          <CheckIcon />
        </div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Event Configured</h1>
        <a href="/imadminpage" className="text-sm font-medium text-zinc-400 hover:text-white underline underline-offset-4 transition-colors">
          Open Admin Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 sm:p-8 font-sans antialiased text-zinc-100">
      <div className="w-full max-w-lg space-y-12">
        <div className="space-y-2">
          <h1 className="text-xl font-medium tracking-tight">Event Setup</h1>
          <p className="text-sm text-zinc-500">Configure your broadcast details.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Event Name</label>
            <input 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
              placeholder="Enter event name..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold flex justify-between">
              Teams <span className="text-zinc-700">{teams.length} total</span>
            </label>
            
            <div className="space-y-2">
              {teams.map((team, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className="flex gap-2"
                >
                  <span className="flex items-center justify-center w-8 text-[10px] text-zinc-600 font-mono">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <input 
                    value={team}
                    onChange={(e) => {
                      const newTeams = [...teams];
                      newTeams[idx] = e.target.value;
                      setTeams(newTeams);
                    }}
                    className="flex-1 bg-zinc-900/30 border border-zinc-800/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-700 hover:border-zinc-800 transition-colors placeholder:text-zinc-800"
                    placeholder="Team Name"
                    autoFocus={idx === teams.length - 1}
                  />
                  {teams.length > 1 && (
                    <button 
                      onClick={() => setTeams(teams.filter((_, i) => i !== idx))}
                      className="text-zinc-700 hover:text-red-500 px-2 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => setTeams([...teams, ''])}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 py-2 transition-colors"
            >
              <Plus size={12} /> Add Team
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-zinc-100 hover:bg-white text-black font-medium py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Initialize Event'}
            {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
