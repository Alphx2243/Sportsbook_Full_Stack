"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/actions/auth";
import { useToast } from "@/contexts/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await requestPasswordReset(email);
            if (res.success) {
                showToast({ message: res.message, type: "success" });
                setTimeout(() => router.push("/login"), 3000);
            } else {
                showToast({ message: res.error, type: "error" });
            }
        } catch (err) {
            showToast({ message: "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden pt-16">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                className="w-full max-w-md relative z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-white/10 shadow-2xl bg-card/40 backdrop-blur-xl">
                    <CardHeader className="text-center pb-8 border-b border-border/50">
                        <CardTitle className="text-3xl font-bold text-gradient-premium">
                            Forgot Password
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                            Enter your email to receive a reset link
                        </p>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                                <Input
                                    type="email"
                                    placeholder="student@iiitd.ac.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-6 text-lg font-bold"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                        <div className="text-center mt-6">
                            <button
                                onClick={() => router.push("/login")}
                                className="text-sm text-primary hover:text-primary/80 transition cursor-pointer"
                            >
                                Back to Login
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
