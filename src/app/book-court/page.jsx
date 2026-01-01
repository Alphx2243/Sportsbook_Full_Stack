"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import service from "@/lib/service";
import { useRouter } from "next/navigation";
import { useSport } from "@/contexts/SportsContext";

export default function AgniCodersBooking() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sportsData, setSportsData] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [numPlayers, setNumPlayers] = useState(1);
  const [initialInUse, setInitialInUse] = useState({});
  const [equipmentCounts, setEquipmentCounts] = useState({});
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const { showToast } = useToast();
  const { sports: spt, setSports } = useSport();

  useEffect(() => {
    const loadSports = () => {
      let raw;
      raw = spt;
      if (!raw) return;
      const data = raw;
      setSportsData(data);
      setSportsList(data.map((s) => s.name));
      if (data.length) initSport(data[selectedIndex], selectedIndex);
    };
    loadSports();
  }, [selectedIndex, spt]);

  const initSport = (sport, idx) => {
    setSelectedIndex(idx);
    setNumPlayers(1);
    const inUse = {};
    const eqInUseArr = sport.equipmentsInUse || [];
    eqInUseArr.forEach((item) => {
      const [name, count] = item.split(":");
      inUse[name] = parseInt(count, 10);
    });
    setInitialInUse(inUse);
    setEquipmentCounts({ ...inUse });

    const cData = sport.courtData || [];
    const courtArr =
      cData.length
        ? cData.map((item) => item.split(":")[0])
        : Array.from({ length: sport.numberOfCourts || 0 }, (_, i) => `Court${i + 1}`);
    setCourts(courtArr);
    setSelectedCourt(courtArr[0] || "");
  };

  const handleSportChange = (e) => {
    const idx = e.target.selectedIndex;
    initSport(sportsData[idx], idx);
  };

  const changeEquipment = (name, delta) => {
    setEquipmentCounts((prev) => {
      const totalStr = sportsData[selectedIndex].totalEquipments.find((i) => i.startsWith(name + ":"));
      const total = totalStr ? parseInt(totalStr.split(":")[1], 10) : 0;

      const usedInit = initialInUse[name] || 0;
      const maxAvailable = total - usedInit;
      const currentUsed = prev[name] || usedInit;
      const nextValue = Math.max(usedInit, Math.min(usedInit + maxAvailable, currentUsed + delta));
      return { ...prev, [name]: nextValue };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const now = new Date(); // crct
      // console.log("Date Now -> ", now);
      const currentdate = now.toLocaleDateString("en-CA");
      console.log("Date Now -> ", currentdate);
      const currenttime = now.toTimeString().split(" ")[0];
      const endDateTime = new Date(now.getTime() + 60 * 60 * 1000);
      const Enddate = endDateTime.toLocaleDateString("en-CA");
      const Endtime = endDateTime.toTimeString().split(" ")[0];

      const selectedSport = sportsData[selectedIndex];
      const isCapacityBased = selectedSport.maxCapacity && selectedSport.maxCapacity > 0;

      const payload = {
        userId: user.id,
        sportName: selectedSport.name,
        equipmentsIssued: Object.entries(equipmentCounts)
          .map(([name, count]) => {
            const diff = count - (initialInUse[name] || 0);
            return diff > 0 ? `${name}:${diff}` : null;
          }).filter(Boolean),
        numberOfPlayers: numPlayers,
        startTime: currenttime,
        endTime: Endtime,
        date: currentdate,
        status: "active",
        CourtNo: isCapacityBased ? "0" : String(selectedCourt.match(/(\d+)/)?.[0] || "0"),
        enddate: Enddate,
        qrdetail: JSON.stringify({
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber,
          sportName: selectedSport.name,
          playerCount: numPlayers,
          equipmentCounts: Object.fromEntries(
            Object.entries(equipmentCounts).map(([n, c]) => [n, c - (initialInUse[n] || 0)])
          ),
        }),
      };
      console.log(payload);
      const result = await service.secureBooking(payload);

      if (result.success) {
        showToast({ message: "Booking created successfully!", type: "success" });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        showToast({ message: result.error || "Failed to create booking", type: "error" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast({ message: "An unexpected error occurred", type: "error" });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) return null;

  const selectedSportData = sportsData[selectedIndex];
  const isCapacityBased = selectedSportData?.maxCapacity && selectedSportData.maxCapacity > 0;

  const availableCourts = isCapacityBased
    ? (selectedSportData.maxCapacity - (selectedSportData.numPlayers || 0))
    : (selectedSportData?.numberOfCourts || 0) - (selectedSportData?.courtsInUse || 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 mt-16 relative z-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gradient-premium mb-2">Court Booking</h1>
          <p className="text-muted-foreground">Reserve your spot and get in the game</p>
        </header>

        <section className="glass-panel rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" /> Player Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-accent/5 border border-white/5 dark:border-white/5 border-black/5">
              <span className="block text-sm text-muted-foreground mb-1">Name</span>
              <span className="font-medium text-lg">{user.name}</span>
            </div>
            <div className="p-4 rounded-xl bg-accent/5 border border-white/5 dark:border-white/5 border-black/5">
              <span className="block text-sm text-muted-foreground mb-1">Email</span>
              <span className="font-medium text-lg truncate" title={user.email}>{user.email}</span>
            </div>
            <div className="p-4 rounded-xl bg-accent/5 border border-white/5 dark:border-white/5 border-black/5">
              <span className="block text-sm text-muted-foreground mb-1">Roll Number</span>
              <span className="font-medium text-lg">{user.rollNumber || "-"}</span>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-8 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Select Sport</h3>
              <select
                value={sportsList[selectedIndex]}
                onChange={handleSportChange}
                className="w-full bg-accent/5 border border-white/10 dark:border-white/10 border-black/10 text-foreground rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              >
                {sportsList.map((s, i) => <option key={s} value={s} className="bg-background text-foreground">{s}</option>)}
              </select>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Number of Players</h3>
              <div className="flex items-center justify-between bg-accent/5 border border-white/10 dark:border-white/10 border-black/10 rounded-xl p-3">
                <button
                  onClick={() => setNumPlayers((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-xl font-bold text-primary transition-colors"
                >-</button>
                <span className="font-bold text-xl text-foreground">{numPlayers}</span>
                <button
                  onClick={() => setNumPlayers((p) => p + 1)}
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-xl font-bold text-primary transition-colors"
                >+</button>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                {isCapacityBased ? `Spots Left: ${availableCourts}` : `Available Courts: ${availableCourts}`}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Equipment Available</h3>
            <div className="space-y-3">
              {sportsData[selectedIndex]?.totalEquipments.map((item) => {
                const [name, total] = item.split(":");
                const used = equipmentCounts[name] || 0;
                const init = initialInUse[name] || 0;
                const maxAvail = parseInt(total, 10) - init;
                return (
                  <div key={name} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/50">
                    <span className="font-medium text-muted-foreground dark:text-gray-300">{name} <span className="text-xs text-muted-foreground/80 dark:text-gray-500 ml-1">(Max: {maxAvail})</span></span>
                    <div className="flex items-center space-x-3">
                      <button disabled={used <= init} onClick={() => changeEquipment(name, -1)} className="w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-primary/10 text-primary font-bold transition-colors">-</button>
                      <span className="w-6 text-center font-bold text-foreground">{used - init}</span>
                      <button disabled={used >= init + maxAvail} onClick={() => changeEquipment(name, 1)} className="w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-primary/10 text-primary font-bold transition-colors">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!isCapacityBased && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Select Court</h3>
              <div className="flex flex-wrap gap-4">
                {sportsData[selectedIndex]?.courtData?.map((item) => {
                  const [cName, flag] = item.split(":");
                  const booked = flag === "1";
                  return (
                    <label key={cName} className={`relative cursor-pointer group`}>
                      <input
                        type="radio"
                        name="court"
                        value={cName}
                        checked={selectedCourt === cName}
                        onChange={() => setSelectedCourt(cName)}
                        disabled={booked}
                        className="peer sr-only"
                      />
                      <div className={`
                          px-6 py-3 rounded-xl border transition-all duration-300 font-medium
                          ${booked ? 'bg-red-500/10 border-red-500/30 text-red-500 cursor-not-allowed opacity-60' :
                          'bg-accent/5 border-white/10 dark:border-white/10 border-black/10 hover:border-primary/50 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_15px_-5px_var(--color-primary)]'}
                      `}>
                        {cName}
                        {booked && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Booked</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_-5px_var(--color-primary)] transform hover:scale-[1.01] transition-all duration-300"
          >
            Generate QR Code
          </button>
        </section>
      </div>
    </div>
  );
}

