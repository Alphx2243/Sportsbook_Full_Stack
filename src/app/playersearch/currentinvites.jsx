'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircle, Trash2, CheckCircle2, XCircle, Brain, GraduationCap } from 'lucide-react'
import service from '@/lib/service'
import { useAuth } from '../../contexts/AuthContext'

const Post = ({ id, mobilenumber, name, time, sportname, venue, date, onDelete, email }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { user } = useAuth()

  const toggleMenu = () => setMenuOpen(prev => !prev)

  const handleAction = (status) => {
    onDelete(id, status)
    setMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card hover:bg-accent/5 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 text-foreground max-w-xl w-full mx-auto mt-6 relative border border-white/5 dark:border-white/5 border-black/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 border border-white/10 dark:border-white/10 border-black/10 rounded-full">
            <UserCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{name}</h3>
            <span className="text-sm text-primary font-medium">Scheduled time : {time}</span>
          </div>
        </div>
        {user?.email === email ? (
          <div ref={menuRef} className="relative">
            <button
              className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-all focus:outline-none"
              onClick={toggleMenu}
              aria-label="Actions"
            >
              <Trash2 className="w-5 h-5 cursor-pointer" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-popover border border-white/10 dark:border-white/10 border-black/5 rounded-lg shadow-xl overflow-hidden z-20"
                >
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-accent/10 transition cursor-pointer text-sm font-medium text-popover-foreground"
                    onClick={() => handleAction('completed')}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Completed
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-accent/10 transition cursor-pointer text-sm font-medium text-popover-foreground"
                    onClick={() => handleAction('cancelled')}
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    Cancelled
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}

      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div className="space-y-2">
          <p><span className="font-semibold text-foreground">Sport:</span> {sportname}</p>
          <p><span className="font-semibold text-foreground">Venue:</span> {venue}</p>
        </div>
        <div className="space-y-2">
          <p><span className="font-semibold text-foreground">Date:</span> {date}</p>
          <p><span className="font-semibold text-foreground">Contact:</span> {mobilenumber}</p>
        </div>
      </div>
    </motion.div>
  )
}

const ApplicationCard = ({ id, option, sportName, level, description, time, avDays, email, onDelete }) => {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card hover:bg-accent/5 p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 text-foreground max-w-xl w-full mx-auto mt-6 relative border border-white/5 dark:border-white/5 border-black/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 border border-white/10 dark:border-white/10 border-black/10 rounded-full">
            {option === 'mentor' ? (
              <GraduationCap className="w-8 h-8 text-blue-400" />
            ) : (
              <Brain className="w-8 h-8 text-pink-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground capitalize">
              {option === 'mentor' ? 'Mentorship Offer' : 'Coaching Request'}
            </h3>
            <span className="text-sm text-primary font-medium">{sportName ? sportName.charAt(0).toUpperCase() + sportName.slice(1) : ''} • {level}</span>
          </div>
        </div>
        {user?.email === email && (
          <button
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-all focus:outline-none"
            onClick={() => onDelete(id)}
            aria-label="Delete"
          >
            <Trash2 className="w-5 h-5 cursor-pointer" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
          <p className="italic">"{description}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="font-semibold text-foreground mb-1">Schedule:</p>
            <p>{time}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Available Days:</p>
            <p>{Array.isArray(avDays) ? avDays.join(', ') : avDays}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-muted-foreground/70">Contact: {email}</span>
        </div>
      </div>
    </motion.div>
  )
}

const CurrentInvites = () => {
  const { user } = useAuth()
  const [invites, setInvites] = useState([])
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('invites')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invitesData, appsData] = await Promise.all([
          service.getInvites(),
          service.getApplications()
        ])
        setInvites(invitesData || [])
        setApplications(appsData || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleDeleteInvite = async (id, status) => {
    try {
      if (status === 'completed') {
        await service.editInvite(id);
      }
      else {
        await service.deleteInvite(id);
      }
      setInvites(prev => prev.filter(invite => invite.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteApplication = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await service.deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('invites')}
          className={`px-6 py-2 rounded-full transition-all ${activeTab === 'invites'
            ? 'bg-primary text-primary-foreground font-bold shadow-lg'
            : 'bg-accent/10 text-muted-foreground hover:bg-accent/20'
            }`}
        >
          Game Invites
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2 rounded-full transition-all ${activeTab === 'requests'
            ? 'bg-primary text-primary-foreground font-bold shadow-lg'
            : 'bg-accent/10 text-muted-foreground hover:bg-accent/20'
            }`}
        >
          Mentorship & Assistance
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'invites' ? (
          <motion.div
            key="invites"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {invites.length === 0 ? (
              <p className="text-center text-muted-foreground text-lg py-12">No active game invites found.</p>
            ) : (
              invites.map((post) => (
                post.show && (
                  <Post
                    key={post.id}
                    {...post}
                    sportname={post.sport}
                    onDelete={handleDeleteInvite}
                  />
                )
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground text-lg py-12">No mentorship offers or assistance requests found.</p>
            ) : (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  {...app}
                  onDelete={handleDeleteApplication}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CurrentInvites
