"use client";
import { motion } from "framer-motion";
export default function Button({
    className, variant = "primary", size = "md", children, ...props
}) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_var(--color-primary)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glow: "bg-black border border-primary/50 text-primary shadow-[0_0_15px_-3px_var(--color-primary)] hover:bg-primary/10",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-8 py-2 text-sm",
        lg: "h-14 px-8 text-base",
    };

    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variantStyles} ${sizeStyles}  cursor-pointer ${className || ""}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
