"use client";
import React, { useState, useEffect } from "react";
import { Search, Users, Brain } from "lucide-react";
import Matchmaking from "./Matchmaking";
import TeamMaking from "./TeamMaking";
import Assistance from "./Assisstance";
import authService from "@/lib/auth";
import Currentinvites from "./currentinvites";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
const PlayerSearch = () => {
  const [activeTab, setActiveTab] = useState("matchmaking");
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "./";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 pt-[8rem]">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-premium text-center mb-10">
          Player Search & Team Making
        </h1>

        <div className="glass-panel p-2 rounded-2xl flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {[
            { id: "matchmaking", label: "Matchmaking", icon: Search },
            { id: "teammaking", label: "Team Making", icon: Users },
            { id: "assistance", label: "Assistance", icon: Brain },
            { id: "currentinvites", label: "Invites", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_var(--color-primary)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 min-h-[500px] mb-8">
          {activeTab === "matchmaking" && <Matchmaking />}
          {activeTab === "teammaking" && <TeamMaking />}
          {activeTab === "assistance" && <Assistance />}
          {activeTab === "currentinvites" && <Currentinvites />}
        </div>
      </div>
    </div>
  );
};

export default PlayerSearch;
