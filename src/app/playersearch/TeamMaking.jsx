'use client'
import React, { useState, useEffect } from 'react';
import service from '@/lib/service';
import { useAuth } from '../../contexts/AuthContext'
import { useSport } from '@/contexts/SportsContext';

const TeamMaking = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const { user, loading: userLoading } = useAuth()
  const [time, setTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [eligiblePlayers, setEligiblePlayers] = useState([]);
  const { sports, loading, setSports } = useSport();
  useEffect(() => {
    setShowInviteForm(false);
    setEligiblePlayers([]);
  }, [selectedSport]);
  const [sportsOptions, setSportsOptions] = useState([])

  useEffect(() => {
    if (!sports) return;
    const options = sports.map((sport) => sport.name);
    setSportsOptions(options);
  }, [sports]);

  const loadEligiblePlayers = async () => {
    if (!selectedSport) {
      alert('Please select a sport.');
      return;
    }

    try {
      const res = await service.getUsers([]);
      const docs = res?.documents || [];
      const sportKey = selectedSport?.toLowerCase() + ':';
      const players = [];
      for (const doc of docs) {
        if (user && doc.email === user.email) continue;

        const list = doc.sportsExperience || [];

        const allUserSports = list.map(entry => {
          const [sp, sk] = entry.toLowerCase().split(':');
          return { sport: sp, skill: sk };
        });

        const isEligible = list.some(e =>
          e.toLowerCase().startsWith(sportKey)
        );
        if (!isEligible) continue;

        players.push({
          id: doc.id,
          name: doc.name || 'Unknown',
          image: doc.qrCodePath || '/sblogo.png',
          phone: doc.phone || 'N/A',
          sports: allUserSports,
        });
      }

      setEligiblePlayers(players);
      setShowInviteForm(true);
    }
    catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users.');
    }
  };

  const sendInvites = async () => {
    try {
      if (!venue || !date || !time || !phoneNumber) {
        alert('Please fill out all details including a contact phone number.');
        return;
      }


      const dateStr = String(date);

      const payload = {
        sport: selectedSport, venue,
        date, email: user.email,
        time, name: user.name,
        mobilenumber: phoneNumber, show: true,
      }




      const res = await service.createInvite({
        sport: selectedSport, venue,
        date, time,
        email: user.email, show: true,
        name: user.name, mobilenumber: phoneNumber,

      })
      if (res) {
        alert("Invites Sent!");
        return;
      }
    }
    catch (error) {
      return;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-8 rounded-2xl shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Create a Team</h2>
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="w-full px-4 py-3 mb-6 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
        >
          <option value="">Select Sport</option>
          {sportsOptions.map((sport, index) => (
            <option key={index} value={sport.toLowerCase()}>
              {sport}
            </option>
          ))}
        </select>

        <button
          onClick={loadEligiblePlayers}
          className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] transition-all transform hover:scale-[1.01] font-bold"
        >
          Show Eligible Players
        </button>
      </div>

      {showInviteForm && (
        <>
          <div className="glass-panel p-8 rounded-2xl shadow-xl mb-8">
            <p className="text-primary font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Eligible Players Found: <span className="text-foreground">{eligiblePlayers.length}</span>
            </p>

            <div className="grid gap-6 mb-8">
              <input
                type="text"
                placeholder="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <input
                type="tel"
                placeholder="Contact Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 text-foreground rounded-xl border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={sendInvites}
              className="w-full px-6 py-4 bg-primary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-[0_0_20px_-5px_var(--color-secondary)] transition-all transform hover:scale-[1.01] font-bold"
            >
              Send Invites
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {eligiblePlayers.map((player) => (
              <div
                key={player.id}
                className="glass-card hover:bg-accent/5 p-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 text-center border border-white/5 dark:border-white/5 border-black/5"
              >
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <img
                    src='/sblogo.png'
                    alt={player.name}
                    className="w-full h-full rounded-full object-cover border-2 border-primary/50"
                  />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{player.name}</h3>
                <div className="flex flex-col gap-2 mb-3">
                  {player.sports.map((item, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <p className="text-[10px] text-primary font-bold capitalize leading-none">{item.sport}</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground capitalize border border-white/5 dark:border-white/5 border-black/5 inline-block">
                        {item.skill}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground bg-white/5 rounded px-2 py-1 inline-block truncate max-w-full border border-white/5 dark:border-white/5 border-black/5">{player.phone}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamMaking;
