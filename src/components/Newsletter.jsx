import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Mail, CheckCircle2 } from "lucide-react";
import { useAudio } from "../utils/audio";
import { storage, STORAGE_KEYS } from "../utils/storage";

export default function Newsletter() {
  const { playClick } = useAudio();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    playClick();
    setStatus("loading");

    // Save to localStorage
    setTimeout(() => {
      storage.add(STORAGE_KEYS.NEWSLETTER, { email, status: "active" });
      setStatus("success");
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const handleLinkClick = (platform) => {
    playClick();
    console.log(`Opening ${platform}`);
  };

  return (
    <section
      id="newsletter"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-near-black text-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-soft-teal to-transparent opacity-30" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-soft-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cosmic-purple/10 rounded-full blur-3xl" />

          <span className="text-soft-teal font-mono tracking-widest uppercase text-xs sm:text-sm mb-4 sm:mb-6 block">
            Stay Updated
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black mb-4 sm:mb-6">
            Join the Mission.
          </h2>
          <p className="text-white/50 text-base sm:text-lg mb-8 sm:mb-12 max-w-xl mx-auto">
            Get launch schedules, research updates, and exclusive content directly in your inbox.
          </p>

          {/* Email Newsletter Form */}
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto mb-8 sm:mb-12">
            <div className="relative">
              <Mail className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-4 pl-12 sm:pl-14 pr-24 sm:pr-32 focus:outline-none focus:ring-2 focus:ring-soft-teal/50 transition-all placeholder:text-white/30 text-white text-sm sm:text-base"
                required
                disabled={status === "success" || status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "success" || status === "loading"}
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-soft-teal text-white px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm hover:bg-soft-teal/80 transition-all flex items-center justify-center gap-1.5 sm:gap-2 hover:gap-2 sm:hover:gap-3 disabled:opacity-50 min-w-[80px] sm:min-w-[100px]"
              >
                {status === "loading" ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Sent!</span>
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-soft-teal font-medium"
            >
              🚀 Telemetry received! You're now part of Mission Control.
            </motion.p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-widest font-mono">
              Or Join Our Community
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Community Links */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto">
            {/* Discord Button */}
            <motion.a
              href="https://discord.gg/quantumveda"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('Discord')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 sm:px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </motion.a>

            {/* WhatsApp Button */}
            <motion.a
              href="https://wa.me/quantumveda"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('WhatsApp')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-5 sm:px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <MessageCircle size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
              WhatsApp
            </motion.a>
          </div>

          {/* Info Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5"
          >
            <p className="text-white/40 text-xs sm:text-sm max-w-2xl mx-auto mb-6 sm:mb-8">
              Join thousands of space enthusiasts. Get instant notifications about launches,
              research updates, and community events.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-soft-teal mb-1">5K+</p>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider">Members</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-soft-teal mb-1">24/7</p>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider">Active</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-soft-teal mb-1">Weekly</p>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider">Updates</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
