import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight } from "lucide-react";
import { storage, STORAGE_KEYS } from "../utils/storage";

export default function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simple auth for MVP
        // In production, these should be env variables and validated on backend
        if (username === "tqv_admin" && password === "rocket2025") {
            setTimeout(() => {
                storage.set(STORAGE_KEYS.ADMIN_SESSION, {
                    token: 'mock-jwt-token',
                    username,
                    expiresAt: Date.now() + 86400000
                });
                onLogin(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setError("Invalid credentials. Trajectory aborted.");
                setIsLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-near-black flex items-center justify-center p-6 bg-dots">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <img src="/logo.jpg" className="w-20 h-20 rounded-full mx-auto mb-6 ring-2 ring-white/10 p-1" alt="Logo" />
                    <h1 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">TQV Control Center</h1>
                    <p className="text-white/40 text-sm font-mono">AUTHORIZED PERSONNEL ONLY</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2 block">Operator ID</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-soft-teal/50 transition-all placeholder:text-white/10"
                                    placeholder="Username"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2 block">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-soft-teal/50 transition-all placeholder:text-white/10"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 text-xs font-mono"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-near-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-near-black/20 border-t-near-black rounded-full animate-spin" />
                            ) : (
                                <>Establish Link <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-white/20 text-[10px] font-mono tracking-widest uppercase">
                    Quantum Veda Security Protocol v4.2
                </p>
            </motion.div>
        </div>
    );
}
