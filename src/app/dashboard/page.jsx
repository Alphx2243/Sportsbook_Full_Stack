'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users,
    Activity, Trophy,
    ArrowRight, Clock,
    MapPin, QrCode,
    Timer, CheckCircle2,
    Plus, LogOut
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import service from '@/lib/service';
import ExtendTimerModal from '@/components/ui/ExtendTimerModal';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [showExtensionModal, setShowExtensionModal] = useState(false);

    const fetchActiveBooking = async () => {
        if (!user?.id) return;
        try {
            const res = await service.getBookings({
                userId: user.id,
                status: 'active'
            });
            if (res.documents && res.documents.length > 0) {
                const booking = res.documents[0];
                setActiveBooking(booking);

                // Generate QR URL from qrDetail
                if (booking.qrDetail) {
                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(booking.qrDetail)}`;
                    setQrUrl(url);
                }
            } else {
                setActiveBooking(null);
            }
        } catch (err) {
            console.error('Error fetching active booking:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchActiveBooking();
        }
    }, [user]);

    useEffect(() => {
        if (!activeBooking) return;

        let isExpiring = false;

        const calculateTimeLeft = () => {
            if (isExpiring) return;

            const now = new Date();
            const endDateTimeStr = `${activeBooking.date}T${activeBooking.endTime}`;
            const endDateTime = new Date(activeBooking.endDate ? `${activeBooking.endDate}T${activeBooking.endTime}` : endDateTimeStr);

            const difference = endDateTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft('Time Up');
                isExpiring = true;
                clearInterval(timer);
                service.expireBooking(activeBooking.id).then(() => {
                    fetchActiveBooking();
                    isExpiring = false;
                });
                return;
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)));
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [activeBooking]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const quickStats = [
        { label: 'Active Bookings', value: activeBooking ? '1' : '0', icon: Calendar, color: 'text-cyan-400' },
    ];

    const quickActions = [
        { title: 'Book a Court', icon: Calendar, href: '/book-court', desc: 'Reserve your spot now' },
        { title: 'Find Players', icon: Users, href: '/playersearch', desc: 'Build your squad' },
        { title: 'Live Scores', icon: Activity, href: '/live-scores', desc: 'Track ongoing matches' },
        { title: 'Occupancy', icon: Activity, href: '/rto', desc: 'View real time occupancy' },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 px-6 pb-12 relative overflow-hidden text-foreground">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute right-[-10%] top-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gradient-premium mb-2 tracking-tight">
                            Hello, {user.name?.split(' ')[0] || 'Athlete'}
                        </h1>
                        <p className="text-muted-foreground text-lg font-light tracking-wide">Welcome back to your command center.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {!activeBooking && (
                            <Button variant="" onClick={() => router.push('/book-court')}>
                                New Booking
                            </Button>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {quickStats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <Card className="glass-card glass-card-hover border-white/5 dark:border-white/5 border-black/5">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
                                    </div>
                                    <div className={`p-4 rounded-xl bg-white/5 ${stat.color} shadow-lg`}>
                                        <stat.icon className="w-8 h-8 animate-float" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">

                        <AnimatePresence>
                            {activeBooking && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative"
                                >
                                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        <QrCode className="w-6 h-6 text-primary" />
                                        Active Booking
                                    </h2>
                                    <div className="glass-panel overflow-hidden border border-primary/20 rounded-3xl relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Calendar className="w-64 h-64 -rotate-12" />
                                        </div>

                                        <div className="flex flex-col md:flex-row p-8 gap-8 items-center relative z-10">
                                            {/* QR Section */}
                                            <div className="bg-white p-4 rounded-2xl shadow-2xl relative group">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                                                <img
                                                    src={qrUrl}
                                                    alt="Booking QR"
                                                    className="w-40 h-40 relative z-10"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-6 text-center md:text-left">
                                                <div>
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-2 inline-block">
                                                        Confirmed Booking
                                                    </span>
                                                    <h3 className="text-4xl font-black text-foreground tracking-tighter">
                                                        {activeBooking.sportName}
                                                        <span className="ml-3 text-primary/50">Court {activeBooking.courtNo}</span>
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Start Time</p>
                                                        <p className="text-lg font-bold text-foreground">{activeBooking.startTime}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">End Time</p>
                                                        <p className="text-lg font-bold text-foreground">{activeBooking.endTime}</p>
                                                    </div>
                                                    <div className="space-y-1 col-span-2 md:col-span-1">
                                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</p>
                                                        <div className="flex items-center gap-2 justify-center md:justify-start">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                            <p className="text-lg font-bold text-green-400 capitalize">{activeBooking.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-4 pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary hover:bg-primary/10 border-primary/20"
                                                        onClick={() => setShowExtensionModal(true)}
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Extend Time
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:bg-red-500/10 border-red-500/20"
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to end this session?')) {
                                                                await service.expireBooking(activeBooking.id);
                                                                fetchActiveBooking();
                                                            }
                                                        }}
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        End Session
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Timer Section */}
                                            <div className="md:border-l border-white/5 md:pl-8 flex flex-col items-center justify-center min-w-[150px]">
                                                <Timer className="w-8 h-8 text-primary mb-2 opacity-50" />
                                                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Time Left</p>
                                                <p className={`text-4xl font-black tracking-tighter ${timeLeft === 'Time Up' ? 'text-red-500' : 'text-primary'}`}>
                                                    {timeLeft}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-primary" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quickActions.map((action, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    >
                                        <div
                                            className="glass-card glass-card-hover cursor-pointer border-white/5 dark:border-white/5 border-black/5 hover:border-primary/50 transition-all duration-300 group rounded-xl bg-card"
                                            onClick={() => router.push(action.href)}
                                        >
                                            <div className="p-6 flex items-center gap-4">
                                                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 border border-white/5 shadow-inner">
                                                    <action.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{action.title}</h3>
                                                    <p className="text-sm text-muted-foreground font-light">{action.desc}</p>
                                                </div>
                                                <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <ExtendTimerModal
                isOpen={showExtensionModal}
                onClose={() => setShowExtensionModal(false)}
                booking={activeBooking}
                onSuccess={fetchActiveBooking}
            />
        </div>
    );
}
