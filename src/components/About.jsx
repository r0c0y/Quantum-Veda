import { motion } from "framer-motion";
import { Rocket, Atom, Globe, FlaskConical } from "lucide-react";

export default function About() {
    const values = [
        {
            icon: <Rocket className="text-soft-teal" />,
            title: "Exploration",
            desc: "Pushing the boundaries of what high schoolers can achieve in aerospace."
        },
        {
            icon: <Atom className="text-cosmic-purple" />,
            title: "Research",
            desc: "Conducting high-altitude experiments and data collection for atmospheric study."
        },
        {
            icon: <Globe className="text-blue-400" />,
            title: "Community",
            desc: "Building a global network of young space enthusiasts and researchers."
        }
    ];

    return (
        <section id="about" className="py-24 px-6 bg-white text-near-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-soft-teal font-mono tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
                        <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
                            Bridging Today's Youth with Tomorrow's Space.
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                            Quantum Veda (TQV) started as a dream in a high school physics lab. We believe that age shouldn't limit the height of one's aspirations—literally.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-10">
                            Our team focuses on the design, build, and launch of model rockets equipped with scientific payloads. We aren't just launching rockets; we're launching careers, curiosity, and a commitment to scientific rigor.
                        </p>

                        <div className="grid grid-cols-2 gap-8 py-8 border-t border-gray-100">
                            <div>
                                <h4 className="text-3xl font-display font-bold">1st</h4>
                                <p className="text-gray-500 text-sm">Model Rocket Launch</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-display font-bold">15+</h4>
                                <p className="text-gray-500 text-sm">Active Researchers</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 gap-6"
                    >
                        {values.map((v, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-gray-50 flex gap-6 hover:bg-gray-100 transition-colors group">
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
