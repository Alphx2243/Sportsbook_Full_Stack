'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, Plus, Timer, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Button from './Button'
import { extendBooking } from '@/actions/bookings'

export default function ExtendTimerModal({ isOpen, onClose, booking, onSuccess }) {
    const [extension, setExtension] = useState(30)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen || !booking) return null

    const handleExtend = async () => {
        setIsProcessing(true)
        setError('')
        try {
            const res = await extendBooking(booking.id, extension)
            if (res.success) {
                onSuccess(res.booking)
                onClose()
            } else {
                setError(res.error || 'Failed to extend booking')
            }
        } catch (err) {
            setError('An unexpected error occurred')
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const options = [15, 30, 60, 120]

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <Timer className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Extend Time</h2>
                                <p className="text-sm text-gray-400">Add more time to your session</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setExtension(opt)}
                                    className={`py-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${extension === opt
                                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_-5px_var(--color-primary)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                >
                                    <span className="text-xl font-black">{opt}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Minutes</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Note: Total session duration cannot exceed <span className="text-white font-bold">4 hours</span>. Extension is subject to court availability.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                            >
                                <AlertCircle className="shrink-0 w-5 h-5" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={onClose}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="glow"
                                className="flex-2"
                                onClick={handleExtend}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    'Confirm Extension'
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
