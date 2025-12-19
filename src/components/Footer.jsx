import { Link } from "react-router-dom";
import { Twitter, Instagram, Send, Github, MessageCircle } from "lucide-react";
import { storage } from "../utils/storage";

export default function Footer() {
    const settings = storage.get('tqv_settings') || {};

    return (
        <footer className="py-16 px-6 bg-white text-near-black border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full shadow-lg group-hover:rotate-6 transition-transform" />
                            <div>
                                <span className="font-display font-black text-2xl tracking-tighter block leading-none">QUANTUM VEDA</span>
                                <span className="text-[10px] tracking-[0.4em] font-mono opacity-40 uppercase">TQV Aerospace Group</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                            A student-led initiative pushing the boundaries of high school aerospace research and development. From basement designs to atmospheric reach.
                        </p>
                        <div className="flex gap-4">
                            {settings.twitter && (
                                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-near-black hover:text-white transition-all">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {settings.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-near-black hover:text-white transition-all">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings.whatsapp && (
                                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-near-black hover:text-white transition-all">
                                    <MessageCircle size={18} />
                                </a>
                            )}
                            {settings.discord && (
                                <a href={settings.discord} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-near-black hover:text-white transition-all">
                                    <Send size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li><a href="#about" className="hover:text-near-black transition-colors">Our Mission</a></li>
                            <li><a href="#achievements" className="hover:text-near-black transition-colors">Milestones</a></li>
                            <li><a href="#media" className="hover:text-near-black transition-colors">Media Center</a></li>
                            <li><a href="#newsletter" className="hover:text-near-black transition-colors">Newsletter</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            {settings.discord && <li><a href={settings.discord} target="_blank" className="hover:text-near-black transition-colors">Discord Server</a></li>}
                            {settings.whatsapp && <li><a href={settings.whatsapp} target="_blank" className="hover:text-near-black transition-colors">WhatsApp Group</a></li>}
                            <li><a href="#newsletter" className="hover:text-near-black transition-colors">Collaborate</a></li>
                            <li><a href={settings.email ? `mailto:${settings.email}` : "#newsletter"} className="hover:text-near-black transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} TQV Organization. All trajectory rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <a href="#" className="hover:text-near-black">Privacy Policy</a>
                        <a href="#" className="hover:text-near-black">Terms of Research</a>
                        <Link to="/admin-tqv-control" className="hover:text-near-black opacity-0 hover:opacity-100 transition-opacity">Staff Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
