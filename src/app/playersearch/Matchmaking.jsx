'use client'
import React, { useEffect, useState } from 'react'
import service from '@/lib/service'
import { useAuth } from '@/contexts/AuthContext'
import { useSport } from '@/contexts/SportsContext';

const Matchmaking = () => {
  const { user: currentUser } = useAuth()
  const [allPlayers, setAllPlayers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sportFilter, setSportFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const playersPerPage = 20
  const { sports, setsports, loading } = useSport();
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await service.getUsers();
      const docs = res?.documents;
      if (!docs?.length) {
        setAllPlayers([]);
        return;
      }

      const spFilter = sportFilter?.toLowerCase();
      const skFilter = skillFilter?.toLowerCase();
      const players = [];

      for (const doc of docs) {
        if (currentUser && doc.email === currentUser.email) continue;

        const list = Array.isArray(doc.sportsExperience)
          ? doc.sportsExperience
          : [];

        const userSports = [];
        list.forEach((entry) => {
          const [sp, sk] = entry.toLowerCase().split(':');
          if (spFilter && sp !== spFilter) return;
          if (skFilter && sk !== skFilter) return;

          userSports.push({
            sport: sp,
            skill: sk
          });
        });

        if (userSports.length === 0) continue;

        players.push({
          id: doc.id,
          name: doc.name || 'Unknown',
          image: doc.qrCodePath || '/sblogo.png',
          sports: userSports,
        });
      }

      setAllPlayers(players);
    };

    fetchUsers();
  }, [sportFilter, skillFilter, service]);




  const [sportsOptions, setSportsOptions] = useState([])

  useEffect(() => {
    if (!sports) return;
    const options = sports.map((sport) => sport.name);
    setSportsOptions(options);
  }, [sports]);


  const filteredPlayers = allPlayers.filter((player) => {
    const matchesName = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesName
  })

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)
  const currentPlayers = filteredPlayers.slice((currentPage - 1) * playersPerPage, currentPage * playersPerPage)

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Search players by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
        />
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
        >
          <option value="">All Sports</option>
          {sportsOptions.map((sport, index) => (
            <option key={index} value={sport.toLowerCase()}>
              {sport}
            </option>
          ))}
        </select>

        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-8">
        {currentPlayers.map((player) => (
          <div
            key={player.id}
            className="glass-card hover:bg-accent/5 p-4 rounded-2xl shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center border border-white/5 dark:border-white/5 border-black/5"
          >
            <div className="relative w-20 h-20 mx-auto mb-3">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full rounded-full object-cover border-2 border-primary/50 group-hover:border-primary transition-colors"
              />
            </div>

            <h3 className="text-sm font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">{player.name}</h3>

            <div className="flex flex-col gap-2">
              {player.sports.map((item, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <p className="text-[10px] text-primary font-bold capitalize leading-none">{item.sport}</p>
                  <div className="flex justify-center">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground capitalize border border-white/5 dark:border-white/5 border-black/5">
                      {item.skill}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 dark:border-white/10 border-black/10 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Previous
          </button>
          <span className="text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 dark:border-white/10 border-black/10 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Matchmaking
