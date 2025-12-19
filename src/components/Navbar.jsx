import { useState, useEffect } from "react";
import { MoveRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Achievements", href: "#achievements" },
        { name: "Media", href: "#media" },
        { name: "Newsletter", href: "#newsletter" },
    ];

    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-near-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-lg tracking-tight">TQV ADMIN</span>
                </Link>
                <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    View Website <MoveRight size={16} />
                </Link>
            </nav>
        );
    }

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
                isScrolled ? "py-4 bg-white/80 backdrop-blur-md text-near-black shadow-sm" : "py-8 text-white"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <img src="/logo.jpg" alt="TQV Logo" className="w-10 h-10 rounded-full group-hover:rotate-12 transition-transform shadow-lg" />
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-xl tracking-tighter leading-none">QUANTUM VEDA</span>
                        <span className="text-[10px] tracking-[0.3em] font-mono opacity-60 uppercase">Space Organization</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
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
                            "px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95",
                            isScrolled ? "bg-near-black text-white hover:bg-near-black/90" : "bg-white text-near-black hover:bg-white/90"
                        )}
                    >
                        Connect
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 flex flex-col p-6 gap-4 md:hidden text-near-black shadow-xl animate-in slide-in-from-top duration-300">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium border-b border-gray-50 pb-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#newsletter"
                        className="w-full py-4 bg-near-black text-white text-center rounded-xl font-bold"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Connect with us
                    </a>
                </div>
            )}
        </nav>
    );
}
