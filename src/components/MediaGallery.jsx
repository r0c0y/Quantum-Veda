import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  FileText,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Pin,
} from "lucide-react";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { useAudio } from "../utils/audio";

export default function MediaGallery() {
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'articles'
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoScrollRef = useRef(null);
  const articleScrollRef = useRef(null);

  // Audio hook for click sounds
  const { playClick } = useAudio();

  // Helper for sorting: Pinned First, then Newest First
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      // 1. Pinned checks
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // 2. Date checks (Newest first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Descending
    });
  };

  // Memoized data loading to avoid re-renders
  const { videos, articles } = useMemo(() => {
    // Load from storage
    const storedVideos = storage.get(STORAGE_KEYS.VIDEOS) || [];
    const storedArticles = storage.get(STORAGE_KEYS.ARTICLES) || [];

    // Default data if empty (Seed Data)
    let finalVideos = storedVideos;
    if (storedVideos.length === 0) {
      finalVideos = [
        {
          id: 1,
          title: "Static Fire Test - TQV-1",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumb:
            "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800",
          date: "Dec 15, 2024",
          isPinned: true,
        }, // Example pinned
        {
          id: 2,
          title: "Aerodynamics Simulation",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumb:
            "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
          date: "Nov 20, 2024",
        },
      ];
    }

    let finalArticles = storedArticles;
    if (storedArticles.length === 0) {
      finalArticles = [
        {
          id: 1,
          title: "Ethics of Space Research",
          excerpt:
            "Exploring the philosophical implications of private space exploration...",
          date: "Dec 12, 2024",
          status: "published",
          isPinned: true,
        },
        {
          id: 2,
          title: "Solid Fuel vs Liquid Fuel",
          excerpt:
            "A deep dive into why we chose solid propellants for our first launch...",
          date: "Nov 28, 2024",
          status: "published",
        },
      ];
    } else {
      // Only show published
      finalArticles = storedArticles.filter(
        (art) => !art.status || art.status === "published"
      );
    }

    return {
      videos: sortItems(finalVideos),
      articles: sortItems(finalArticles),
    };
  }, []);

  // Scroll Handler (Generic)
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="media"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-50 overflow-hidden min-h-screen"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
        {/* Header & Toggles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div>
            <span className="text-soft-teal font-mono tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4 block">
              Archive
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-near-black">
              Media & Insights
            </h2>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 w-full md:w-auto">
            <button
              onClick={() => {
                playClick();
                setActiveTab("videos");
              }}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === "videos"
                ? "bg-near-black text-white shadow-lg"
                : "text-gray-400 hover:text-near-black"
                }`}
            >
              Videos
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveTab("articles");
              }}
              className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === "articles"
                ? "bg-near-black text-white shadow-lg"
                : "text-gray-400 hover:text-near-black"
                }`}
            >
              Articles
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* VIDEOS TAB */}
            {activeTab === "videos" && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="hidden sm:flex items-center justify-end mb-6 gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      scroll(videoScrollRef, "left");
                    }}
                    className="p-2.5 sm:p-3 border border-gray-300 bg-white rounded-full text-black hover:bg-near-black hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      scroll(videoScrollRef, "right");
                    }}
                    className="p-2.5 sm:p-3 border border-gray-300 bg-white rounded-full text-black hover:bg-near-black hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div
                  ref={videoScrollRef}
                  className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videos.map((vid) => (
                    <motion.div
                      key={vid.id}
                      className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[450px] snap-center group relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-near-black cursor-pointer border-2 sm:border-4 border-transparent hover:border-soft-teal/20 transition-all active:scale-[0.98]"
                      onClick={() => {
                        playClick();
                        setSelectedVideo(vid);
                      }}
                    >
                      <img
                        src={
                          vid.thumb ||
                          `https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800`
                        }
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
                        alt={vid.title}
                      />
                      {vid.isPinned && (
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-soft-teal text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg flex items-center gap-1 sm:gap-1.5 tracking-wider">
                          <Pin size={9} className="sm:w-2.5 sm:h-2.5" fill="currentColor" /> FEATURED
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/30 mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-soft-teal group-hover:border-soft-teal">
                          <Play className="text-white fill-current w-6 h-6 sm:w-8 sm:h-8 ml-0.5 sm:ml-1" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-white mb-2 line-clamp-2 drop-shadow-md px-2">
                          {vid.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ARTICLES TAB */}
            {activeTab === "articles" && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="hidden sm:flex items-center justify-end mb-6 gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      scroll(articleScrollRef, "left");
                    }}
                    className="p-2.5 sm:p-3 border border-gray-300 bg-white rounded-full text-black hover:bg-near-black hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      scroll(articleScrollRef, "right");
                    }}
                    className="p-2.5 sm:p-3 border border-gray-300 bg-white rounded-full text-black hover:bg-near-black hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div
                  ref={articleScrollRef}
                  className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[400px] snap-center p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group relative flex flex-col min-h-[340px] sm:h-[380px]"
                    >
                      <Link
                        to={`/article/${art.id}`}
                        className="absolute inset-0 z-10"
                      />
                      <div className="flex justify-between items-start mb-6 sm:mb-8">
                        <div className="p-2.5 sm:p-3 bg-soft-teal/5 rounded-xl sm:rounded-2xl text-soft-teal">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        {art.isPinned && (
                          <span className="bg-soft-teal text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-md">
                            <Pin size={9} className="sm:w-2.5 sm:h-2.5" fill="currentColor" /> PINNED
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] sm:text-xs font-mono text-gray-400 mb-2 sm:mb-3 block tracking-wide">
                        {art.date}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-soft-teal transition-colors line-clamp-2 leading-tight">
                        {art.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-auto line-clamp-3">
                        {art.excerpt}
                      </p>

                      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 flex items-center justify-between text-near-black group-hover:text-soft-teal transition-colors">
                        <span className="text-xs sm:text-sm font-bold">
                          Read Full Article
                        </span>
                        <ExternalLink
                          size={14}
                          className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-near-black/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
            <iframe
              src={selectedVideo.url}
              className="w-full h-full border-0"
              allowFullScreen
              title={selectedVideo.title}
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}
