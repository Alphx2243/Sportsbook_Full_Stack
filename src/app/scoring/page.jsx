'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Trash2, Edit2, CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react';
import service from '@/lib/service';
import Button from '@/components/ui/Button';

export default function ScoringAdmin() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        sportName: '', team1: '',
        team2: '', score1: '0',
        score2: '0', status: 'live',
    });

    const fetchMatches = async () => {
        try {
            const res = await service.getMatches();
            if (res.success) setMatches(res.documents);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await service.createMatch(formData);
            if (res.success) {
                setShowAddForm(false);
                setFormData({ sportName: '', team1: '', team2: '', score1: '0', score2: '0', status: 'live' });
                fetchMatches();
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const res = await service.updateMatch(id, data);
            if (res.success) {
                setEditingId(null);
                fetchMatches();
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this match?')) return;
        try {
            const res = await service.deleteMatch(id);
            if (res.success) fetchMatches();
        }
        catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gradient-premium tracking-tighter">Match Management</h1>
                        <p className="text-gray-400">Update scores and manage match statuses in real-time.</p>
                    </div>
                    <Button variant="glow" onClick={() => setShowAddForm(true)}>
                        <Plus className="w-5 h-5 mr-2" /> New Match
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel p-8 border border-primary/30 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500">Sport Name</label>
                                        <input
                                            required
                                            value={formData.sportName}
                                            onChange={e => setFormData({ ...formData, sportName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-all"
                                            placeholder="e.g. Football"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500">Team 1 Name</label>
                                        <input
                                            required
                                            value={formData.team1}
                                            onChange={e => setFormData({ ...formData, team1: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-all"
                                            placeholder="Team A"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500">Team 2 Name</label>
                                        <input
                                            required
                                            value={formData.team2}
                                            onChange={e => setFormData({ ...formData, team2: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-all"
                                            placeholder="Team B"
                                        />
                                    </div>
                                    <div className="flex gap-4 md:col-span-2">
                                        <Button type="submit" variant="primary" className="flex-1">Create Match</Button>
                                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowAddForm(false)}>Cancel</Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {matches.map(match => (
                        <MatchRow
                            key={match.id}
                            match={match}
                            isEditing={editingId === match.id}
                            onEdit={() => setEditingId(match.id)}
                            onCancel={() => setEditingId(null)}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MatchRow({ match, isEditing, onEdit, onCancel, onUpdate, onDelete }) {
    const [score1, setScore1] = useState(match.score1);
    const [score2, setScore2] = useState(match.score2);
    const [status, setStatus] = useState(match.status);

    return (
        <div className={`glass-panel p-6 border transition-all ${isEditing ? 'border-primary/50 bg-primary/5' : 'border-white/5'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">{match.sportName}</span>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <h3 className="text-xl font-bold">{match.team1}</h3>
                        <span className="text-gray-600 italic">vs</span>
                        <h3 className="text-xl font-bold">{match.team2}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    value={score1}
                                    onChange={e => setScore1(e.target.value)}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg p-2 text-center text-xl font-bold outline-none"
                                />
                                <span className="text-2xl font-bold">:</span>
                                <input
                                    type="number"
                                    value={score2}
                                    onChange={e => setScore2(e.target.value)}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg p-2 text-center text-xl font-bold outline-none"
                                />
                            </>
                        ) : (
                            <div className="text-3xl font-black tracking-tighter">
                                {match.score1} <span className="opacity-20">:</span> {match.score2}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        {isEditing ? (
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg p-2 text-xs font-bold outline-none uppercase"
                            >
                                <option value="live">Live</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                            </select>
                        ) : (
                            <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border text-center ${match.status === 'live' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                match.status === 'upcoming' ? 'bg-primary/10 text-primary border-primary/20' :
                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                }`}>
                                {match.status}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => onUpdate(match.id, { score1, score2, status })}
                                className="p-3 bg-green-500/20 text-green-500 rounded-xl hover:bg-green-500/30 transition-all shadow-lg shadow-green-500/10"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onCancel}
                                className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition-all shadow-lg shadow-red-500/10"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onEdit}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                            >
                                <Edit2 className="w-5 h-5 text-gray-400" />
                            </button>
                            <button
                                onClick={() => onDelete(match.id)}
                                className="p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/5 transition-all group"
                            >
                                <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
