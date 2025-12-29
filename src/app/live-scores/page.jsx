'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, Clock, AlertCircle } from 'lucide-react';
import service from '@/lib/service';

export default function LiveScoring() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await service.getMatches();
        if (res.success) {
          setMatches(res.documents);
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const liveGames = matches.filter(g => g.status === 'live');
  const completedGames = matches.filter(g => g.status === 'completed');
  const upcomingGames = matches.filter(g => g.status === 'upcoming');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden pt-24 pb-12">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-gradient-premium tracking-tighter">Live Scoring</h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">Real-time updates from the college arena. Stay ahead of the game.</p>
        </motion.div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">Live Now</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {liveGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {liveGames.map(game => (
                  <ScoreCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <EmptyState message="No live matches at the moment." />
            )}
          </AnimatePresence>
        </section>

        {upcomingGames.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-8 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Upcoming Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75">
              {upcomingGames.map(game => (
                <ScoreCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-8 text-gray-500 flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            Recently Concluded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedGames.map(game => (
              <ScoreCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ScoreCard({ game }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="glass-panel overflow-hidden border border-white/5 hover:border-primary/30 transition-all group relative"
    >
      <div className="absolute top-0 left-0 px-4 py-1 bg-white/5 border-b border-r border-white/5 rounded-br-xl text-[10px] font-black uppercase tracking-widest text-primary/70">
        {game.sportName}
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="text-center flex-1">
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide truncate">{game.team1}</h4>
            <p className="text-5xl font-black text-foreground tracking-tighter">{game.score1}</p>
          </div>

          <div className="flex flex-col items-center gap-1 opacity-20">
            <div className="w-0.5 h-8 bg-gradient-to-t from-transparent via-white to-transparent" />
            <span className="text-xs font-bold italic">VS</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>

          <div className="text-center flex-1">
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide truncate">{game.team2}</h4>
            <p className="text-5xl font-black text-foreground tracking-tighter">{game.score2}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${game.status === 'live'
            ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
            : game.status === 'upcoming'
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
            {game.status}
          </div>

          <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-1">
            Stats <Activity className="w-3 h-3" />
          </button>
        </div>
      </div>

      {game.status === 'live' && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-primary to-red-500 bg-[length:200%_auto] animate-gradient-x" />
      )}
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="p-12 glass-panel border border-white/5 text-center flex flex-col items-center gap-4">
      <AlertCircle className="w-12 h-12 text-gray-600 opacity-30" />
      <p className="text-gray-500 font-light text-lg">{message}</p>
    </div>
  );
}