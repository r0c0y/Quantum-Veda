import { motion } from "framer-motion";
import { MoveDown, Rocket, Sparkles } from "lucide-react";
import StarField from "./StarField";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
            <StarField />

            <div className="relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-8 backdrop-blur-sm"
                >
                    <Sparkles size={14} className="text-soft-teal" />
                    <span>Launching TQV-1 Payload Soon</span>
                    <div className="w-2 h-2 rounded-full bg-soft-teal animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-5xl md:text-8xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter"
                >
                    Pioneering <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">The Final Frontier</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-body"
                >
                    We are a team of visionary high schoolers at Quantum Veda, dedicated to making space accessible through student-led aerospace engineering and research.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a href="#about" className="btn-primary flex items-center gap-2 px-8">
                        Explore Mission <Rocket size={18} />
                    </a>
                    <a href="#newsletter" className="btn-outline px-8 backdrop-blur-sm">
                        Join Community
                    </a>
                </motion.div>
            </div>


        </section>
    );
}
