'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import service from '@/lib/service'
import { Calendar, Clock, History, Trophy, User, ArrowLeft, Layers } from 'lucide-react'

export default function PastBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return
      try {
        const response = await service.getBookings({ userId: user.id })
        setBookings(response.documents || [])
      }
      catch (error) {
        console.error('Error fetching bookings:', error)
      }
      finally {
        setLoading(false)
      }
    }

    if (user) { fetchBookings() }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden pb-12">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <header className="pt-24 pb-12 px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
            <History className="w-3 h-3" /> Booking History
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-gradient-premium tracking-tighter">
            Your Past Sessions
          </h1>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto mb-8">
            A history of your sweat, determination, and consistency. Every game counts.
          </p>

          <Link href="/dashboard">
            <motion.button
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-bold px-6 py-2 rounded-full text-xs transition-all mx-auto"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </header>

      <main className="px-6 relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking, idx) => (
                <BookingCard key={booking.id || idx} booking={booking} index={idx} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-24 glass-panel border border-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Layers className="w-8 h-8 text-gray-600 opacity-30" />
              </div>
              <h3 className="text-xl font-bold mb-2">No history found</h3>
              <p className="text-gray-500 font-light">Time to hit the court and start your first session!</p>
              <Link href="/book-court">
                <button className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-xs uppercase tracking-widest">
                  Book Now
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function BookingCard({ booking, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel group overflow-hidden border border-white/5 hover:border-primary/20 transition-all relative"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600 opacity-20 group-hover:opacity-100 transition-opacity" />

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${booking.status === 'active'
                ? 'bg-green-500/10 text-green-500 border-green-500/20 animate-pulse'
                : 'bg-white/5 text-gray-500 border-white/5'
                }`}>
                {booking.status}
              </span>
              <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Court {booking.courtNo}</span>
            </div>
            <h3 className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
              {booking.sportName}
            </h3>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{booking.startTime} - {booking.endTime}</span>
              </div>
            </div>
          </div>

          <div className="md:border-l border-white/5 md:pl-8 flex flex-col justify-center min-w-[150px]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Equipment</span>
            <div className="flex flex-wrap gap-2">
              {booking.issuedEquipments && booking.issuedEquipments.length > 0 ? (
                booking.issuedEquipments.map((item, i) => {
                  const [name, qty] = item.split(':')
                  return (
                    <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold">
                      {name} <span className="text-primary font-black ml-1">x{qty}</span>
                    </span>
                  )
                })
              ) : (
                <span className="text-gray-600 text-[10px] italic">No equipment issued</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
