'use client'
import React, { useEffect, useState } from 'react';
import service from '@/lib/service'
import { useAuth } from "@/contexts/AuthContext";
import { useSport } from '@/contexts/SportsContext';

const Assistance = () => {
  const { user, loading } = useAuth();
  const [option, setOption] = useState('');
  const [email, setEmail] = useState(user?.email);
  const [sportname, setSportname] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [avdays, setAvdays] = useState([]);
  const [resolved] = useState(false);
  const { sports, setSports } = useSport();

  const handleDayToggle = day =>
    setAvdays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );

  const handleSubmit = async () => {
    if (
      !option || !email ||
      !sportname || !level ||
      !description || !timeFrom ||
      !timeTo || avdays.length === 0
    ) {
      alert('Please fill out all fields.');
      return;
    }
    const payload = {
      option, email,
      sportname, level,
      description, time: `${timeFrom} - ${timeTo}`,
      avdays, resolved,
    };
    console.log('Submitting:', payload);
    alert(`Submitted ${option} for ${sportname}`);
    const response = await service.createApplication(payload);
    if (response) {
      alert('Application submitted successfully!');
    }
    else {
      alert('Failed to submit application.');
    }

  };

  const [sports2, setSportsOptions] = useState([])

  useEffect(() => {
    if (!sports) return;
    const options = sports.map((sport) => sport.name);
    setSportsOptions(options);
  }, [sports]);

  return (
    <div className="max-w-xl mx-auto p-6 glass-panel rounded-lg">
      <div className="space-y-4">
        <select
          value={option}
          onChange={e => setOption(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
        >
          <option value="">Select Option</option>
          <option value="mentor">Apply as Mentor</option>
          <option value="assistance">Request Coaching Assistance</option>
        </select>

        {option && (
          <>
            <select
              value={sportname}
              onChange={e => setSportname(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="">Select Sport</option>
              {sports2.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            {option === 'assistance' ? (
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            ) : (
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            )}

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe in detail"
              className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-24 placeholder:text-muted-foreground"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">From:</label>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={e => setTimeFrom(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">To:</label>
                <input
                  type="time"
                  value={timeTo}
                  onChange={e => setTimeTo(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 text-foreground rounded-md border border-white/10 dark:border-white/10 border-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Available Days:
              </label>
              <div className="flex flex-wrap gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={avdays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-foreground">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-primary cursor-pointer text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition shadow-[0_0_15px_-5px_var(--color-primary)]"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Assistance;
