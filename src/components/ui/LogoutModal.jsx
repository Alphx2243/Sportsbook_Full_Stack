'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-sm overflow-hidden glass-panel rounded-2xl shadow-2xl border border-white/10 mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header/Banner */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                            <LogOut className="text-red-500" size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">
                            Ready to leave?
                        </h3>
                        <p className="text-gray-400 mb-8 px-2">
                            Are you sure you want to log out? You'll need to log back in to access your bookings.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/20 hover:shadow-red-500/30 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
