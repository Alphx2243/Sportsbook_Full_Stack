'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, User, Clock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { handleGymScan } from '@/actions/gym'

export default function GymScannerPage() {
    const [userId, setUserId] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userId.trim()) return

        setIsProcessing(true)
        setError('')
        setResult(null)

        try {
            const res = await handleGymScan(userId.trim())
            if (res.success) {
                setResult(res)
                setUserId('')
            }
            else {
                setError(res.error || 'Failed to process scan')
            }
        }
        catch (err) {
            setError('An unexpected error occurred')
            console.error(err)
        }
        finally {
            setIsProcessing(false)
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground py-24 px-6 md:px-12 flex flex-col items-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
                        <Scan className="text-primary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient-premium">Gym Scanner</h1>
                    <p className="text-gray-400 mt-2">Process student entry and exit</p>
                </div>

                <motion.div
                    className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Student ID / Scan Code
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter or scan ID..."
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                    disabled={isProcessing}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing || !userId.trim()}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Process Scan <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                            >
                                <AlertCircle className="shrink-0 w-5 h-5" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6"
                            >
                                <div className={`p-6 rounded-xl border ${result.type === 'check-in' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg ${result.type === 'check-in' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">
                                                {result.type === 'check-in' ? 'Check-In Success' : 'Check-Out Success'}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{result.user}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Time</span>
                                            <span className="text-white font-medium">
                                                {new Date(result.log.updatedAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        {result.type === 'check-out' && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Duration</span>
                                                <span className="text-blue-400 font-bold">
                                                    {result.duration} hours
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <p className="text-center text-gray-500 text-xs mt-8 uppercase tracking-widest font-medium">
                    SportsBook Attendance System
                </p>
            </div>
        </main>
    )
}
