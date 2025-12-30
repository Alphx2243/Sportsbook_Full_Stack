'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { getSports } from "@/actions/sports";
import { io } from "socket.io-client";

const SportsContext = createContext();

export const SportsProvider = ({ children }) => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSports = async (force = false) => {
        try {
            if (!force && sports !== null && sports.length > 0) {
                setLoading(false); return;
            }
            const sportsData = await getSports();
            setSports(sportsData.documents);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSports();
        let socket;
        try {
            socket = io();
            socket.on("connect", () => {
                console.log("Connected to socket server");
            });

            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });

            socket.on("OCCUPANCY_UPDATE", () => {
                console.log("Received OCCUPANCY_UPDATE, refreshing sports...");
                fetchSports(true);
            });
        } catch (error) {
            console.error("Failed to initialize socket:", error);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [])

    return (
        <SportsContext.Provider value={{ sports, loading, setSports, refreshSports: fetchSports }}>
            {children}
        </SportsContext.Provider>
    )
}

export const useSport = () => useContext(SportsContext);
