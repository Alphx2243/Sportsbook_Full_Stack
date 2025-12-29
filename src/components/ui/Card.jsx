"use client";

import { motion } from "framer-motion";

export function Card({ className, children, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`glass-card rounded-xl overflow-hidden shadow-lg ${className || ""}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={`p-6 pb-2 ${className || ""}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={`text-2xl font-bold leading-none tracking-tight text-foreground mb-2 ${className || ""}`} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }) {
    return (
        <p className={`text-sm text-gray-400 ${className || ""}`} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={`p-6 pt-2 ${className || ""}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={`flex items-center p-6 pt-0 ${className || ""}`} {...props}>
            {children}
        </div>
    );
}
