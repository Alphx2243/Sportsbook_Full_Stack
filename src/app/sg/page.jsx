'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volleyball, Clock, Calendar, History, TrendingUp, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getGymStats } from '@/actions/gym'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: custom => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.1, duration: 0.5 }
    }),
    hover: { scale: 1.02 }
}

const StatCard = ({ heading, value, index, icon: Icon }) => (
    <motion.div
        className="glass-panel hover:border-primary/50 relative overflow-hidden w-full h-36 rounded-2xl p-6 flex flex-col justify-center border border-white/5"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover="hover"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none flex items-center justify-center p-4">
            {Icon && <Icon className="text-primary/20 w-12 h-12 rotate-12" />}
        </div>
        <p className="text-sm text-gray-400 font-medium relative z-10 flex items-center gap-2">
            {heading}
        </p>
        <p className="text-4xl font-black mt-1 text-foreground relative z-10 tracking-tight">{value}</p>
    </motion.div>
)

const GrowthCard = ({ index, qrCode, userId }) => {
    const [viewmenu, setViewMenu] = useState(false)
    const staticQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${userId}`

    return (
        <>
            {
                viewmenu ? <ChooseActivity qrCode={qrCode || staticQr} /> :
                    (
                        <motion.div
                            className="glass-panel hover:border-primary/50 rounded-2xl p-8 flex flex-col justify-center min-h-[350px] border border-white/5 group relative overflow-hidden"
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            whileHover="hover"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                                <Volleyball className="text-white w-10 h-10 animate-float" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground text-center tracking-tight">Ready to Grow?</h2>
                            <p className="text-base text-gray-400 text-center mt-2 mb-8">Quickly scan to start or end your fitness session</p>
                            <button
                                onClick={() => setViewMenu(true)}
                                className="px-8 py-4 bg-foreground text-background font-black rounded-xl cursor-pointer hover:bg-primary hover:text-white transition-all shadow-xl mx-auto flex items-center gap-2"
                            >
                                Get My Gym QR
                            </button>
                        </motion.div>
                    )
            }
        </>
    )
}

const SessionHistoryCard = ({ index, history = [] }) => (
    <motion.div
        className="glass-panel rounded-2xl p-8 flex flex-col min-h-[350px] border border-white/5"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={index}
    >
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <History className="text-primary w-6 h-6" /> Session History
                </p>
                <p className="text-sm text-gray-400 mt-1">Reflect on your consistency</p>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {history.length > 0 ? (
                history.map((session, i) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${session.status === 'Active' ? 'bg-orange-500/10 text-orange-400 animate-pulse' : 'bg-green-500/10 text-green-400'}`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-0.5">{session.date}</p>
                                <p className="text-xs text-gray-500">{session.entryTime} - {session.exitTime}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-black ${session.status === 'Active' ? 'text-orange-400' : 'text-primary'}`}>
                                {session.duration}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">{session.status}</p>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                        <Volleyball className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No sessions yet</p>
                    <p className="text-xs text-gray-600 mt-1 max-w-[200px]">Complete your first workout to see progress!</p>
                </div>
            )}
        </div>
    </motion.div>
)

function ChooseActivity({ qrCode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl p-10 shadow-3xl text-center flex flex-col items-center justify-center border border-white/10"
        >
            <div className="mb-6">
                <h2 className="text-3xl font-black text-foreground tracking-tight">Your Attendance QR</h2>
                <p className="text-gray-400 mt-2 max-w-xs">
                    Scan this code at the gym entrance to log your session
                </p>
            </div>

            <div className='relative group'>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                <div className='relative border-8 border-white rounded-3xl bg-white p-6 shadow-2xl max-w-[280px] mx-auto overflow-hidden'>
                    {qrCode ? (
                        <img src={qrCode} className='w-full h-auto object-contain' alt="Attendance QR" />
                    ) : (
                        <div className='w-48 h-48 flex items-center justify-center text-black font-medium'>
                            No QR Available
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Info size={14} className="text-primary" />
                Valid for today
            </div>
        </motion.div>
    )
}

const Page = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalHours: '0.0',
        weeklyHours: '0.0',
        sessionsCount: 0,
        history: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id) return
            try {
                const data = await getGymStats(user.id)
                if (data) setStats(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [user?.id])

    return (
        <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-16 pt-[8rem] relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 transition-all">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 mb-4 inline-block">
                        Fitness Journey
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gradient-premium mb-4 tracking-tighter">Self Growth Hub</h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">Consistency is the key to athletic excellence. Track every drop of sweat.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { heading: 'Total Sweat Hours', value: `${stats.totalHours}h`, icon: TrendingUp },
                        { heading: 'Consistency Streak', value: `${stats.weeklyHours}h`, icon: Calendar },
                        { heading: 'Total Sessions', value: stats.sessionsCount, icon: History }
                    ].map((stat, i) => (
                        <StatCard key={i} {...stat} index={i + 1} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GrowthCard index={4} qrCode={user?.qrCodePath} userId={user?.id} />
                    <SessionHistoryCard index={5} history={stats.history} />
                </div>
            </div>
        </main>
    )
}

export default Page
