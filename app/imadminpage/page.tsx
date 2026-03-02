'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Trash2, Flag, RotateCcw, Play } from 'lucide-react';

export default function AdminPage() {
  const teams = useQuery(api.teams.getTeams) || [];
  const eventState = useQuery(api.teams.getEventState);
  
  const setCurrentTeamMutation = useMutation(api.teams.setCurrentTeam);
  const startEventMutation = useMutation(api.teams.startEvent);
  const resetEventMutation = useMutation(api.teams.resetEvent);

  const handleStart = async () => {
    if (confirm('Are you sure you want to start the event?')) {
      await startEventMutation();
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to STOP/RESET the event? Audience will see waiting screen.')) {
      await resetEventMutation();
    }
  };

  const handleSetTeam = async (teamId: any) => {
    await setCurrentTeamMutation({ teamId });
  };

  if (!eventState) return <div className="p-8 text-white">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Admin Control
            </h1>
            <p className="text-gray-400 mt-1">Event: {eventState.eventName}</p>
          </div>
          <div className="flex gap-2">
            {!eventState.isStarted ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20"
              >
                <Play size={20} /> Start Event
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all shadow-lg shadow-red-900/20"
              >
                <RotateCcw size={20} /> Stop Event
              </button>
            )}
          </div>
        </header>

        <div className="grid gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Current Status</h2>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${eventState.isStarted ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className="text-lg">
                {eventState.isStarted 
                  ? `Live: Feature Team ID: ${eventState.currentTeamId ? 'Selected' : 'None'}` 
                  : 'Waiting for Start'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Teams Management</h2>
          {teams.map((team: any) => (
            <div 
              key={team._id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                eventState.currentTeamId === team._id 
                  ? 'bg-blue-900/30 border-blue-500 shadow-blue-900/20 shadow-lg scale-[1.01]' 
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-mono">#{team.order + 1}</span>
                <h3 className="text-lg font-bold">{team.name}</h3>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-sm text-gray-400">Likes</span>
                  <span className="text-xl font-bold text-pink-500">{team.likes}</span>
                </div>
                
                <button
                  onClick={() => handleSetTeam(team._id)}
                  disabled={eventState.currentTeamId === team._id}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    eventState.currentTeamId === team._id
                      ? 'bg-blue-600 text-white cursor-default'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  {eventState.currentTeamId === team._id ? 'Live Now' : 'Set Live'}
                </button>
              </div>
            </div>
          ))}

          {teams.length === 0 && (
            <div className="text-center p-8 text-gray-500 bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-700">
              No teams found. Go to /imsetup to add teams.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
