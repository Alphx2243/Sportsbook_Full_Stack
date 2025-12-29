"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) { setTheme(savedTheme); }
            else if (window.matchMedia("(prefers-color-scheme: light)").matches) { setTheme("light"); }
        }
        catch (e) {
            console.warn("localStorage is not available:", e);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        try { localStorage.setItem("theme", theme); }
        catch (e) { console.warn("Failed to save theme to localStorage:", e); }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
