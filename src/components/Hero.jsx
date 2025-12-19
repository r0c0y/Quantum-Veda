import { motion } from "framer-motion";
import { MoveDown, Rocket, Sparkles } from "lucide-react";
import StarField from "./StarField";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 sm:pt-20">
            <StarField />

            <div className="relative z-10 max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs sm:text-sm mb-6 sm:mb-8 backdrop-blur-sm"
                >
                    <Sparkles size={12} className="text-soft-teal sm:w-3.5 sm:h-3.5" />
                    <span className="whitespace-nowrap">Launching TQV-1 Payload Soon</span>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-soft-teal animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white mb-4 sm:mb-6 leading-[0.9] tracking-tighter px-2"
                >
                    Pioneering <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">The Final Frontier</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-body px-2"
                >
                    We are a team of visionary high schoolers at Quantum Veda, dedicated to making space accessible through student-led aerospace engineering and research.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
                >
                    <a href="#about" className="btn-primary flex items-center justify-center gap-2 px-6 sm:px-8 w-full sm:w-auto">
                        Explore Mission <Rocket size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </a>
                    <a href="#newsletter" className="btn-outline px-6 sm:px-8 backdrop-blur-sm w-full sm:w-auto">
                        Join Community
                    </a>
                </motion.div>
            </div>


        </section>
    );
}
