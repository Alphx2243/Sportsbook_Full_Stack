"use client";

import { motion } from "framer-motion";

export default function Input({ className, ...props }) {
    return (
        <motion.input
            whileFocus={{ scale: 1.01 }}
            className={`flex h-11 w-full rounded-md border border-input bg-accent/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all duration-200 ${className || ""}`}
            {...props}
        />
    );
}
