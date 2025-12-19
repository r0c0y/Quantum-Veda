import { motion } from "framer-motion";
import { Award, Target, Zap, Waves } from "lucide-react";

export default function Achievements() {
    const items = [
        {
            icon: <Award className="text-yellow-500" />,
            title: "Design Validation",
            date: "Dec 2024",
            desc: "Successfully passed the peer review for the TQV-1 structural integrity and aerodynamics."
        },
        {
            icon: <Target className="text-orange-500" />,
            title: "Propulsion Milestone",
            date: "Nov 2024",
            desc: "Static fire test of the solid-fuel motor completed with 100% telemetry success."
        },
        {
            icon: <Zap className="text-blue-500" />,
            title: "Avionics Integration",
            date: "Oct 2024",
            desc: "Completed the flight computer software with real-time GPS and altitude tracking."
        },
        {
            icon: <Waves className="text-soft-teal" />,
            title: "Community Growth",
            date: "Aug 2024",
            desc: "Reached 100+ active members in our student-led space research community."
        }
    ];

    return (
        <section id="achievements" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-near-black text-white relative overflow-hidden">
            {/* Background Dots Pattern */}
            <div className="absolute inset-0 bg-dots opacity-20" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-soft-teal font-mono tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4 block"
                    >
                        Our Journey
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black"
                    >
                        Milestones Reached
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 sm:p-8 glass-card group hover:border-white/30 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                {item.icon}
                            </div>
                            <span className="text-xs font-mono text-white/40 mb-2 block">{item.date}</span>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
