import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Video, FileText, Download, Trash2,
    ExternalLink, Plus, LogOut, CheckCircle,
    Search, Filter, ChevronRight, Settings, Save,
    Pin, PinOff
} from "lucide-react";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { convertToCSV, downloadCSV } from "../utils/csv";
import Editor from "./Editor";

export default function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState("subscribers");
    const [subscribers, setSubscribers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [articles, setArticles] = useState([]);
    const [settings, setSettings] = useState({
        discord: "",
        whatsapp: "",
        twitter: "",
        instagram: "",
        email: ""
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [saveStatus, setSaveStatus] = useState("");

    // Form states for adding content
    const [newVideo, setNewVideo] = useState({ title: "", url: "", thumb: "", isPinned: false });
    const [newArticle, setNewArticle] = useState({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        date: "", // Will be set on save
        status: "published",
        isPinned: false
    });

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setSubscribers(storage.get(STORAGE_KEYS.NEWSLETTER) || []);
        setVideos(storage.get(STORAGE_KEYS.VIDEOS) || []);
        setArticles(storage.get(STORAGE_KEYS.ARTICLES) || []);
        setSettings(storage.get('tqv_settings') || {
            discord: "",
            whatsapp: "",
            twitter: "",
            instagram: "",
            email: ""
        });
    };

    // Filter Logic
    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.author && a.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );


    const handleExportCSV = () => {
        const csv = convertToCSV(subscribers);
        downloadCSV(csv, `tqv-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleDelete = (key, id) => {
        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            storage.remove(key, id);
            refreshData();
        }
    };

    const handleTogglePin = (key, item) => {
        const updatedItem = { ...item, isPinned: !item.isPinned };
        storage.update(key, updatedItem);
        refreshData();
    };

    const handleAddVideo = (e) => {
        e.preventDefault();
        storage.add(STORAGE_KEYS.VIDEOS, { ...newVideo, isPinned: false });
        setNewVideo({ title: "", url: "", thumb: "", isPinned: false });
        setIsAddModalOpen(false);
        refreshData();
    };

    const handleAddArticle = (status = "published") => {
        const articleToAdd = {
            ...newArticle,
            status,
            date: new Date().toLocaleDateString(), // Auto-set date
            isPinned: newArticle.isPinned || false
        };
        storage.add(STORAGE_KEYS.ARTICLES, articleToAdd);
        setNewArticle({
            title: "",
            excerpt: "",
            content: "",
            author: "",
            date: "",
            status: "published",
            isPinned: false
        });
        setIsAddModalOpen(false);
        refreshData();
    };

    const openEditModal = (type, item) => {
        setIsEdit(true);
        setEditingId(item.id);
        if (type === 'video') {
            setNewVideo(item);
            setActiveTab('videos');
        } else {
            setNewArticle(item);
            setActiveTab('articles');
        }
        setIsAddModalOpen(true);
    };

    const handleEditSubmission = (status) => {
        // If status is passed (e.g. from button click), update it, otherwise keep existing
        const updatedStatus = typeof status === 'string' ? status : (newArticle.status || 'published');
        // Update date to now
        const updatedDate = new Date().toLocaleDateString();

        if (activeTab === "videos") {
            storage.update(STORAGE_KEYS.VIDEOS, { ...newVideo, id: editingId });
        } else {
            storage.update(STORAGE_KEYS.ARTICLES, {
                ...newArticle,
                status: updatedStatus,
                date: updatedDate, // Update date on edit
                id: editingId
            });
        }
        setIsAddModalOpen(false);
        setNewVideo({ title: "", url: "", thumb: "", isPinned: false });
        setNewArticle({ title: "", excerpt: "", content: "", author: "", date: "", status: "published", isPinned: false });
        setIsEdit(false);
        setEditingId(null);
        refreshData();
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        storage.set('tqv_settings', settings);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
    };

    const menuItems = [
        { id: "subscribers", icon: <Users size={18} />, label: "Subscribers" },
        { id: "videos", icon: <Video size={18} />, label: "Video Gallery" },
        { id: "articles", icon: <FileText size={18} />, label: "Articles" },
        { id: "settings", icon: <Settings size={18} />, label: "Social Links" },
    ];

    return (
        <div className="min-h-screen bg-near-black text-white flex flex-col md:flex-row pt-20">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-12">
                    <img src="/logo.jpg" className="w-10 h-10 rounded-full" alt="Logo" />
                    <div>
                        <span className="font-display font-bold block leading-none">TQV CONTROL</span>
                        <span className="text-[10px] text-soft-teal font-mono uppercase tracking-widest">Master Op</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-soft-teal text-white shadow-lg shadow-soft-teal/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm px-4">
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto h-[calc(100vh-80px)]">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2 capitalize">
                            {menuItems.find(m => m.id === activeTab)?.label}
                        </h1>
                        <p className="text-gray-400 text-sm">Manage your content and data.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        {(activeTab === "videos" || activeTab === "articles") && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-all w-64"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        )}

                        {(activeTab === "videos" || activeTab === "articles") && (
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setIsAddModalOpen(true);
                                    setEditingId(null);
                                    setNewVideo({ title: "", url: "", thumb: "", isPinned: false });
                                    setNewArticle({
                                        title: "",
                                        excerpt: "",
                                        content: "",
                                        author: "",
                                        date: "",
                                        status: "published",
                                        isPinned: false
                                    });
                                }}
                                className="flex items-center gap-2 bg-white text-near-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Add New
                            </button>
                        )}
                    </div>
                </header>

                {activeTab === "subscribers" && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <Users size={18} className="text-soft-teal" />
                                All Subscribers <span className="text-gray-500 text-sm font-normal">({subscribers.length})</span>
                            </h3>
                            <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <Download size={14} /> Export CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left bg-transparent">
                                <thead className="text-xs uppercase text-gray-500 bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Email Address</th>
                                        <th className="px-6 py-4 font-normal">Date Subscribed</th>
                                        <th className="px-6 py-4 font-normal text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {subscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-soft-teal">{sub.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{sub.date || "N/A"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(STORAGE_KEYS.NEWSLETTER, sub.id)}
                                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {subscribers.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic">No subscribers yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "videos" && (
                    <>
                        {filteredVideos.length === 0 && searchQuery && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
                                <Search size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No videos found matching "{searchQuery}"</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((vid) => (
                                <div key={vid.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-soft-teal/50 transition-all">
                                    <div className="aspect-video bg-black relative">
                                        <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Video className="text-white opacity-50" size={32} />
                                        </div>
                                        {vid.isPinned && (
                                            <div className="absolute top-2 right-2 bg-soft-teal text-white p-1 rounded-full shadow-lg" title="Pinned">
                                                <Pin size={12} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold truncate mb-1">{vid.title}</h4>
                                        <a href={vid.url} target="_blank" rel="noreferrer" className="text-xs text-soft-teal hover:underline flex items-center gap-1 mb-4">
                                            View Video <ExternalLink size={10} />
                                        </a>
                                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => openEditModal('video', vid)}
                                                className="flex-1 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleTogglePin(STORAGE_KEYS.VIDEOS, vid)}
                                                className={`p-2 rounded-lg transition-colors ${vid.isPinned ? 'bg-soft-teal text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                                title={vid.isPinned ? "Unpin" : "Pin to top"}
                                            >
                                                {vid.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(STORAGE_KEYS.VIDEOS, vid.id)}
                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "articles" && (
                    <>
                        {filteredArticles.length === 0 && searchQuery && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
                                <Search size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No articles found matching "{searchQuery}"</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            {filteredArticles.map((art) => (
                                <div key={art.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${art.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                                {art.status || 'published'}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">{art.date}</span>
                                            {art.isPinned && (
                                                <span className="flex items-center gap-1 text-[10px] bg-soft-teal/20 text-soft-teal px-2 py-0.5 rounded-full border border-soft-teal/30">
                                                    <Pin size={8} fill="currentColor" /> Pinned
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{art.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2">{art.excerpt}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openEditModal('article', art)}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleTogglePin(STORAGE_KEYS.ARTICLES, art)}
                                            className={`p-2 rounded-lg transition-colors ${art.isPinned ? 'bg-soft-teal/20 text-soft-teal' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                                            title={art.isPinned ? "Unpin Article" : "Pin Article"}
                                        >
                                            {art.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(STORAGE_KEYS.ARTICLES, art.id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "settings" && (
                    <div className="max-w-2xl">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6">Social Connections</h3>
                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Discord Invite URL</label>
                                    <input
                                        type="text"
                                        value={settings.discord}
                                        onChange={(e) => setSettings({ ...settings, discord: e.target.value })}
                                        className="w-full bg-near-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-colors"
                                        placeholder="https://discord.gg/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">WhatsApp Group/Channel</label>
                                    <input
                                        type="text"
                                        value={settings.whatsapp}
                                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                        className="w-full bg-near-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-colors"
                                        placeholder="https://chat.whatsapp.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Twitter/X Profile</label>
                                    <input
                                        type="text"
                                        value={settings.twitter}
                                        onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                        className="w-full bg-near-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-colors"
                                        placeholder="https://x.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Instagram Profile</label>
                                    <input
                                        type="text"
                                        value={settings.instagram}
                                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                        className="w-full bg-near-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-colors"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="border-t border-white/10 pt-6">
                                    <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full bg-near-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal transition-colors"
                                        placeholder="contact@quantumveda.com"
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="bg-white text-near-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                    {saveStatus === 'saved' && (
                                        <span className="text-green-400 flex items-center gap-1 text-sm animate-in fade-in">
                                            <CheckCircle size={14} /> Saved successfully!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-near-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-near-black border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold font-display">
                                    {isEdit ? "Edit Content" : "Add New Content"}
                                </h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <LogOut size={20} className="rotate-180" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                {/* Tab Switcher inside Modal if adding new and not editing specific */}
                                {!isEdit && (
                                    <div className="flex gap-4 mb-8">
                                        <button
                                            onClick={() => setActiveTab('videos')}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all border ${activeTab === 'videos' ? 'bg-white text-near-black border-white' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                                        >
                                            Add Video
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('articles')}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all border ${activeTab === 'articles' ? 'bg-white text-near-black border-white' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                                        >
                                            Add Article
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'videos' ? (
                                    <form onSubmit={isEdit ? (e) => { e.preventDefault(); handleEditSubmission(); } : handleAddVideo} className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Video Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={newVideo.title}
                                                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal"
                                                placeholder="e.g. TQV-1 Launch Day Highlights"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">YouTube Embed URL</label>
                                            <input
                                                required
                                                type="url"
                                                value={newVideo.url}
                                                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Must be an embed link (youtube.com/embed/ID)</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
                                            <input
                                                type="url"
                                                value={newVideo.thumb}
                                                onChange={(e) => setNewVideo({ ...newVideo, thumb: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <button className="w-full bg-soft-teal text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all mt-4">
                                            {isEdit ? "Update Video" : "Publish Video"}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Article Title</label>
                                            <input
                                                type="text"
                                                value={newArticle.title}
                                                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal font-display font-bold text-xl"
                                                placeholder="Enter a catchy title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Short Excerpt (Summary)</label>
                                            <textarea
                                                rows="2"
                                                value={newArticle.excerpt}
                                                onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal resize-none"
                                                placeholder="Brief description for the card preview..."
                                            />
                                        </div>

                                        {/* Author Field moved here */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Author</label>
                                            <input
                                                type="text"
                                                value={newArticle.author}
                                                onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-soft-teal"
                                                placeholder="Name"
                                            />
                                        </div>

                                        {/* Rich Text Editor */}
                                        <div className="border border-white/10 rounded-xl overflow-hidden">
                                            <Editor
                                                value={newArticle.content}
                                                onChange={(html) => setNewArticle({ ...newArticle, content: html })}
                                                placeholder="Write your article content here..."
                                            />
                                        </div>

                                        {/* Removed redundant Author field grid */}

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => isEdit ? handleEditSubmission('draft') : handleAddArticle('draft')}
                                                className="flex-1 border border-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
                                            >
                                                {isEdit ? "Update as Draft" : "Save as Draft"}
                                            </button>
                                            <button
                                                onClick={() => isEdit ? handleEditSubmission('published') : handleAddArticle('published')}
                                                className="flex-1 bg-soft-teal text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-soft-teal/20"
                                            >
                                                {isEdit ? "Update & Publish" : "Publish Now"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
