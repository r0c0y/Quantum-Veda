import { useState, useEffect } from "react";
import { MoveRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Achievements", href: "#achievements" },
        { name: "Media", href: "#media" },
        { name: "Newsletter", href: "#newsletter" },
    ];

    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-near-black/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                    <img src="/logo.jpg" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-base sm:text-lg tracking-tight">TQV ADMIN</span>
                </Link>
                <Link to="/" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline">View Website</span>
                    <span className="sm:hidden">Website</span>
                    <MoveRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
            </nav>
        );
    }

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-12",
                isScrolled ? "py-3 sm:py-4 bg-white/90 backdrop-blur-md text-near-black shadow-sm" : "py-4 sm:py-6 lg:py-8 text-white"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
                    <img src="/logo.jpg" alt="TQV Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full group-hover:rotate-12 transition-transform shadow-lg" />
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-base sm:text-lg lg:text-xl tracking-tighter leading-none">QUANTUM VEDA</span>
                        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] font-mono opacity-60 uppercase">Space Organization</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium hover:opacity-60 transition-opacity"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#newsletter"
                        className={cn(
                            "px-5 lg:px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95",
                            isScrolled ? "bg-near-black text-white hover:bg-near-black/90" : "bg-white text-near-black hover:bg-white/90"
                        )}
                    >
                        Connect
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 -mr-2 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu - Full Screen Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-near-black/60 backdrop-blur-sm md:hidden"
                            style={{ top: isScrolled ? '60px' : '80px' }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[280px] bg-white border-l border-gray-100 flex flex-col p-6 md:hidden text-near-black shadow-2xl"
                            style={{ top: isScrolled ? '60px' : '80px' }}
                        >
                            <div className="flex flex-col gap-2 mb-8">
                                {navLinks.map((link, index) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="text-lg font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </motion.a>
                                ))}
                            </div>

                            <motion.a
                                href="#newsletter"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full py-4 bg-near-black text-white text-center rounded-xl font-bold hover:bg-near-black/90 active:scale-[0.98] transition-all shadow-lg mt-auto"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Connect with us
                            </motion.a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
