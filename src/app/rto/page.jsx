"use client";
import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useSport } from "@/contexts/SportsContext";
import service from "@/lib/service";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, Percent, User } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const parseList = (arr = []) =>
  (Array.isArray(arr) ? arr : []).map((item) => {
    const [name, count] = item.split(":");
    return { name: name.trim(), count: Number(count) || 0 };
  });

const SportSelector = ({ value, onChange }) => {
  const { sports } = useSport();
  const options = optionsFromSports(sports);

  function optionsFromSports(sList) {
    if (!sList) return [];
    return sList.map(s => s.name);
  }

  return (
    <div className="mb-8 text-center bg-white/5 inline-block px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
      <label htmlFor="sportSelect" className="text-foreground font-medium mr-3">Select Sport:</label>
      <select
        id="sportSelect"
        value={value}
        onChange={onChange}
        className="bg-transparent text-foreground outline-none font-bold cursor-pointer"
      >
        {options.map((s) => (
          <option key={s} value={s} className="bg-zinc-900">{s}</option>
        ))}
      </select>
    </div>
  );
};

const OccupancyCard = ({ info }) => {
  if (!info || !info.equipmentsInUse) return null;
  const eqInUse = parseList(info.equipmentsInUse);
  const totalPlayers = info.numPlayers || 0;
  const rate = info.maxCapacity
    ? Math.round(((info.numPlayers || 0) / info.maxCapacity) * 100)
    : info.numberOfCourts
      ? Math.round((info.courtsInUse / info.numberOfCourts) * 100)
      : 0;

  const statusColor = rate < 50 ? "text-green-500" : rate < 80 ? "text-yellow-500" : "text-red-500";
  const statusBg = rate < 50 ? "bg-green-500/10 border-green-500/20" : rate < 80 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20";
  const statusText = rate < 50 ? "Available" : rate < 80 ? "Busy" : "Full";

  const equipment = parseList(info.totalEquipments).map((e) => {
    const used = eqInUse.find((u) => u.name === e.name)?.count || 0;
    return { name: e.name, used, total: e.count };
  });

  return (
    <div className="glass-panel rounded-2xl p-6 w-full max-w-lg shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01]">
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">{info.name}</h2>
        <span className={`${statusBg} ${statusColor} border px-3 py-1 rounded-full text-sm font-semibold`}>
          {statusText}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 flex items-center border border-white/5">
          <div className="p-3 rounded-full bg-blue-500/10 mr-3">
            <Users className="text-blue-500 h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Students</p>
            <p className="text-2xl font-bold text-foreground">{totalPlayers}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 flex items-center border border-white/5">
          <div className="p-3 rounded-full bg-purple-500/10 mr-3">
            <Percent className="text-purple-500 h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Occupancy</p>
            <p className="text-2xl font-bold text-foreground">{rate}%</p>
          </div>
        </div>
      </div>
      <h3 className="text-primary font-semibold mb-3">Equipment Usage</h3>
      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        {equipment.length ? (
          equipment.map((e) => (
            <div key={e.name} className="flex justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-400">{e.name}</span>
              <span className="text-foreground font-semibold">{e.used} <span className="text-gray-500 text-sm">/ {e.total}</span></span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No equipment data available.</p>
        )}
      </div>
    </div>
  );
};

const CourtVisualization = ({ info }) => {
  if (!info || !info.equipmentsInUse) return null;
  const players = info.numPlayers || 0;

  if (!players)
    return (
      <div className="glass-panel rounded-2xl p-6 w-full max-w-lg shadow-xl text-center flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">Court View</h3>
        <div className="w-full h-60 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 border border-white/5">
          No active players to visualize.
        </div>
      </div>
    );

  const cols = Math.ceil(Math.sqrt(players));
  const rows = Math.ceil(players / cols);
  const spots = Array.from({ length: players }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return { top: `${((row + 1) / (rows + 1)) * 100}%`, left: `${((col + 1) / (cols + 1)) * 100}%` };
  });

  return (
    <div className="glass-panel rounded-2xl p-6 w-full max-w-lg shadow-xl text-center">
      <h3 className="text-2xl font-bold text-foreground mb-4">Court View</h3>
      <div className="relative w-full h-60 bg-green-900/20 border-2 border-green-500/30 rounded-xl overflow-hidden shadow-inner">
        {spots.map((pos, idx) => (
          <div
            key={idx}
            className="absolute w-6 h-6 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center"
            style={pos}
          >
            <User size={14} className="text-green-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

const OccupancyLocation = ({ info }) => {
  console.log(info);
  if (info && (info.name?.toLowerCase() !== "gym") && (info.name?.toLowerCase() !== "swimming")) return (
    <div className="glass-panel w-full max-w-4xl mx-auto p-6 rounded-2xl mt-8">
      <h3 className="text-primary text-xl font-bold mb-4 flex items-center gap-2">
        COURT STATUS
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(info.courtData || []).map((c, i) => {
          const [name, status] = c.split(":");
          const isOccupied = info.maxCapacity
            ? info.numPlayers > 0
            : status === "1";

          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${isOccupied
                ? "bg-red-500/10 border-red-500/30"
                : "bg-green-500/10 border-green-500/30"
                } flex flex-col items-center justify-center text-center transition-all`}
            >
              <span
                className={`text-lg font-bold ${isOccupied ? "text-red-400" : "text-green-400"
                  }`}
              >
                {name}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {isOccupied ? "Occupied" : "Vacant"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
  else return null;
};


const TimeTable = ({ sport }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    if (sport) {
      service.getFileId(`${sport}-TimeTable.png`)
        .then((f) => {
          if (f && alive) setUrl(service.getFilePreview(f.$id));
          else if (alive) setUrl(null);
        })
        .catch(() => alive && setUrl(null));
    }
    return () => { alive = false; };
  }, [sport]);

  return (
    <div className="p-8 glass-panel rounded-2xl mt-8 w-full max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gradient-premium mb-6">Weekly Schedule</h2>
      {url ? (
        <img
          src={url}
          alt="timetable"
          className="w-full h-auto rounded-xl border border-white/10 shadow-2xl"
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-white/5 rounded-xl text-gray-400">
          No schedule available for this sport.
        </div>
      )}
    </div>
  );
};

const DataAnalysis = ({ sport }) => {
  const { theme } = useTheme();
  const [weeklyData, setWeeklyData] = useState([]);
  const [peakData, setPeakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchData() {
      if (!sport) return;
      setLoading(true);
      try {
        const { getSportAnalytics } = await import("@/actions/sports");
        const data = await getSportAnalytics(sport);
        setWeeklyData(data.weeklyAttendance);
        setPeakData(data.peakHours);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sport]);

  const chartColors = {
    stroke: isDark ? "#555" : "#ddd",
    text: isDark ? "#aaa" : "#555",
    tooltipBg: isDark ? "#111" : "#fff",
    tooltipBorder: isDark ? "#333" : "#eee",
    grid: isDark ? "#333" : "#eee",
    bar: "#3b82f6"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="glass-panel p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-center text-foreground">Weekly Attendance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="day" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, borderRadius: '8px', color: isDark ? '#fff' : '#000' }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend wrapperStyle={{ color: chartColors.text }} />
            <Bar dataKey="Students" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-panel p-6 rounded-2xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center text-foreground">Peak Hours (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="time" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, borderRadius: '8px', color: isDark ? '#fff' : '#000' }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend wrapperStyle={{ color: chartColors.text }} />
            <Bar dataKey="Users" fill="#8b5cf6" name="Average Users" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Occupancy() {
  const { sports, refreshSports } = useSport();
  const [selectedSport, setSelectedSport] = useState("");
  const [activeTab, setActiveTab] = useState("liveVacancy");

  useEffect(() => {
    let socket;

    refreshSports(true);

    try {
      socket = io();

      socket.on("connect", () => {
        // console.log("Connected to WebSocket");
      });

      socket.on("OCCUPANCY_UPDATE", () => {
        // console.log("Real-time occupancy update received");
        refreshSports(true);
      });
    }
    catch (err) {
      console.error("Socket connection failed", err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [refreshSports]);

  useEffect(() => {
    if (sports && sports.length > 0 && !selectedSport) {
      setSelectedSport(sports[0].name);
    }
  }, [sports]);

  const sportInfo = useMemo(
    () => sports.find((s) => s.name === selectedSport) || {},
    [sports, selectedSport]
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-[8rem] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-premium mb-8">Real-time Occupancy</h1>
        <div className="flex justify-center gap-4 mb-8">
          {[
            { key: "liveVacancy", label: "Live Vacancy" },
            { key: "timeTable", label: "Time Table" },
            { key: "dataAnalysis", label: "Data Analysis" },
          ].map((tabObj) => (
            <button
              key={tabObj.key}
              onClick={() => setActiveTab(tabObj.key)}
              className={`px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 ${activeTab === tabObj.key
                ? "bg-primary text-white shadow-lg shadow-blue-500/20 scale-105"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {tabObj.label}
            </button>
          ))}
        </div>

        {activeTab === "liveVacancy" && (
          <>
            <SportSelector
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            />
            <div className="flex flex-wrap gap-8 justify-center items-start">
              <OccupancyCard info={sportInfo} />
              <CourtVisualization info={sportInfo} />
            </div>
            <OccupancyLocation info={sportInfo} />
          </>
        )}

        {activeTab === "timeTable" && (
          <>
            <SportSelector
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            />
            <TimeTable sport={selectedSport} />
          </>
        )}

        {activeTab === "dataAnalysis" && (
          <>
            <SportSelector
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            />
            <DataAnalysis sport={selectedSport} />
          </>
        )}
      </div>
    </div>
  );
}

