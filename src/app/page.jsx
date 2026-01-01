'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSport } from '@/contexts/SportsContext'
import {
  CalendarIcon,
  ActivityIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  Trophy,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const features = [
  {
    icon: <CalendarIcon className="w-8 h-8 text-cyan-400 animate-float" />,
    title: 'Easy Booking',
    description: 'Book courts in seconds with our intuitive calendar and time-slot selector.',
  },
  {
    icon: <ActivityIcon className="w-8 h-8 text-blue-500 animate-float" />,
    title: 'Live Scoring',
    description: 'Track real-time scores for all matches happening on campus.',
  },
  {
    icon: <MapPinIcon className="w-8 h-8 text-purple-500 animate-float" />,
    title: 'Occupancy Map',
    description: 'See which facilities are available with our interactive occupancy heatmap.',
  },
  {
    icon: <UsersIcon className="w-8 h-8 text-pink-500 animate-float" />,
    title: 'Team Building',
    description: 'Find players and build your team based on skill level and availability.',
  },
  {
    icon: <ClockIcon className="w-8 h-8 text-emerald-400 animate-float" />,
    title: 'QR Check-in',
    description: 'Quick and easy check-in with QR code scanning for confirmed bookings.',
  },
  {
    icon: <Trophy className="w-8 h-8 text-yellow-400 animate-float" />,
    title: 'Analytics',
    description: 'Easily check most occupied time of every sport.',
  },
]

function FeaturesSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gradient-premium"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            SportsBook provides all the tools you need to enhance your college sports experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="hover:bg-accent/5 transition-colors border-white/5 dark:border-white/5 border-black/5"
            >
              <CardContent className="p-8">
                <div className="mb-6 p-3 bg-accent/10 w-fit rounded-xl border border-white/10 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const sportImages = {
  'badminton': '/images/sports/badminton.jpg',
  'basketball': '/images/sports/basketball.jpg',
  'tennis': '/images/sports/tennis.jpg',
  'volleyball': '/images/sports/volleyball.jpg',
  'cricket': '/images/sports/cricket.jpg',
  'table tennis': '/images/sports/table-tennis.jpg',
  'lawn tennis': '/images/sports/lawn-tennis.jpg',
  'football': '/images/sports/football.jpg',
  'swimming': '/images/sports/swimming.webp',
  'gym': '/images/sports/gym.jpg',
  'squash': '/images/sports/squash.jpg',
}

function getSportImage(name) {
  if (!name) return '/images/sports/default-sport.jpg';
  const lowerName = name.toLowerCase();
  return sportImages[lowerName] || '/images/sports/default-sport.jpg';
}

export default function Home() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const { sports, loading } = useSport()

  const prev = () => setIndex(i => (i > 0 ? i - 1 : sports.length - 1))
  const next = () => setIndex(i => (i < sports.length - 1 ? i + 1 : 0))

  const selected = sports[index]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-16">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-cyan-600/10 rounded-full blur-[80px]" />
      </div>

      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-24 max-w-7xl mx-auto gap-12 min-h-[calc(100vh-64px)]">
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              College Sports, <br />
              <span className="text-gradient-premium">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Book courts, track live scores, join teams, and more. The definitive platform for the modern athlete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/book-court')}
                className="text-lg px-8"
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="text-lg px-8 border-foreground/20 hover:bg-foreground/10 text-foreground"
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
        {selected && (
          <div className="flex-1 w-full max-w-xl relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }} className="relative z-10" >
              <div className="flex justify-between items-center mb-4">
                <button onClick={prev} className="p-2 rounded-full hover:bg-foreground/10 transition text-foreground">
                  ‹
                </button>
                <span className="text-lg font-medium tracking-widest uppercase text-primary">{selected.name}</span>
                <button onClick={next} className="p-2 rounded-full hover:bg-foreground/10 transition text-foreground">
                  ›
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id || selected.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card border-white/10 dark:border-white/10 border-black/5 overflow-hidden shadow-2xl shadow-blue-900/20">
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <img
                        src={getSportImage(selected.name)}
                        alt={selected.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
                        <p className="text-gray-300 text-sm">Campus Facility</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Overall Status</p>
                            <div className="flex items-center gap-2">
                              {selected.maxCapacity ? (
                                <>
                                  <div className={`w-2 h-2 rounded-full ${(selected.numPlayers || 0) < selected.maxCapacity ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
                                  <span className="text-foreground font-medium">
                                    {selected.maxCapacity - (selected.numPlayers || 0)} / {selected.maxCapacity} Available
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className={`w-2 h-2 rounded-full ${selected.numberOfCourts - selected.courtsInUse > 0 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
                                  <span className="text-foreground font-medium">
                                    {selected.numberOfCourts - selected.courtsInUse} / {selected.numberOfCourts} Available
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => router.push('/book-court')}
                            className="shadow-lg shadow-blue-600/20"
                          >
                            Book Spot
                          </Button>
                        </div>

                        {selected.courtData && selected.courtData.length > 0 && (
                          <div className="pt-4 border-t border-white/5 dark:border-white/5 border-black/5">
                            {
                              selected && selected.name?.toLowerCase() !== "gym" && selected.name?.toLowerCase() !== "swimming" && (
                                <>
                                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Court Availability</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {selected.courtData.map((c, i) => {
                                      const [name, status] = c.split(':');
                                      const isOccupied = selected.maxCapacity ? (selected.numPlayers > 0) : (status === '1');
                                      return (
                                        <div
                                          key={i}
                                          className={`px-3 py-2 rounded-lg border text-[10px] font-bold text-center transition-all ${isOccupied
                                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                                            }`}
                                        >
                                          <div className="truncate">{name.replace('Court', 'C')}</div>
                                          <div className="opacity-50 font-medium">{isOccupied ? 'BUSY' : 'FREE'}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )
                            }

                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
          </div>
        )}
      </section>

      <FeaturesSection />
    </div>
  )
}
