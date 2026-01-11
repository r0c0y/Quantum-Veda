import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  Share2,
  Twitter,
  MessageCircle,
  Check,
  Video,
  ExternalLink,
  FileText,
} from "lucide-react";

import { storage, STORAGE_KEYS } from "../utils/storage";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const articles = storage.get(STORAGE_KEYS.ARTICLES) || [];
    const found = articles.find((a) => a.id.toString() === id);

    // Fallback Mock Data if not found in storage (for demo)
    if (!found) {
      // Check mock data from MediaGallery default
      const mockArticles = [
        {
          id: 1,
          title: "Ethics of Space Research",
          excerpt:
            "Exploring the philosophical implications of private space exploration...",
          date: "Dec 12, 2024",
          author: "Dr. A. Sharma",
          content:
            "Space exploration brings with it a host of ethical questions. As we push further into the cosmos, we must ask ourselves: who owns space? The Outer Space Treaty of 1967 provides a framework, but the rise of private entities challenges these old norms...",
        },
        {
          id: 2,
          title: "Solid Fuel vs Liquid Fuel",
          excerpt:
            "A deep dive into why we chose solid propellants for our first launch...",
          date: "Nov 28, 2024",
          author: "TQV Propulsion Team",
          content:
            "When designing TQV-1, the propulsion system was the most critical decision. Liquid engines offer control and efficiency, but solid motors provide reliability and simplicity, which is paramount for our first high-altitude attempt...",
        },
      ];
      const mock = mockArticles.find((a) => a.id.toString() === id);
      if (mock) setArticle(mock);
    } else {
      setArticle(found);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <Link to="/" className="text-soft-teal hover:underline">
            Return to Mission Control
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white pb-20">
      {/* Header Image / Hero */}
      <div className="min-h-[50vh] bg-near-black relative overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black to-transparent" />

        <div className="max-w-4xl mx-auto px-6 w-full relative z-10 pb-12">
          <Link
            to="/#media"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors pt-36"
          >
            <ArrowLeft size={16} /> Back to Media
          </Link>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-white/50 text-sm font-mono">
            <span className="flex items-center gap-2">
              <Calendar size={14} /> {article.date}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} /> {article.author || "TQV Team"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <div className="
            prose prose-lg max-w-none
            font-serif text-lg leading-relaxed text-gray-700
            [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-gray-900 [&_h1]:leading-tight [&_h1]:font-sans
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-800 [&_h2]:leading-snug [&_h2]:font-sans
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-800 [&_h3]:font-sans
            [&_p]:mb-5 [&_p]:leading-[1.8]
            [&_a]:text-soft-teal [&_a]:underline [&_a]:decoration-soft-teal/30 [&_a]:underline-offset-2 [&_a]:hover:decoration-soft-teal [&_a]:transition-colors
            [&_mark]:bg-yellow-100 [&_mark]:text-gray-900 [&_mark]:px-1 [&_mark]:rounded
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
            [&_li]:leading-[1.7]
            [&_blockquote]:border-l-4 [&_blockquote]:border-soft-teal [&_blockquote]:pl-6 [&_blockquote]:py-3 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-gray-50 [&_blockquote]:rounded-r-xl
            [&_hr]:my-12 [&_hr]:border-t-2 [&_hr]:border-gray-100
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-lg [&_iframe]:my-8
            [&_.image-wrapper]:my-8 [&_.image-wrapper]:text-center
            [&_.document-wrapper]:my-6 [&_.document-wrapper]:p-5 [&_.document-wrapper]:bg-gradient-to-r [&_.document-wrapper]:from-gray-50 [&_.document-wrapper]:to-white [&_.document-wrapper]:border [&_.document-wrapper]:border-gray-200 [&_.document-wrapper]:rounded-xl [&_.document-wrapper]:shadow-sm
            [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:mt-3 [&_figcaption]:italic [&_figcaption]:text-center
            [&_figure]:my-8
            [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:mx-auto
            [&_strong]:font-semibold [&_strong]:text-gray-800
            [&_em]:italic
            selection:bg-soft-teal/20 selection:text-gray-900
          ">
            {/* Rendering content with sanitization */}
            {article.content ? (
              article.content.trim().startsWith("<") ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: article.content,
                  }}
                />
              ) : (
                article.content.split("\n").map((para, i) => (
                  <p key={i} className="mb-6">
                    {para}
                  </p>
                ))
              )
            ) : (
              <p>{article.excerpt} (Full content pending update...)</p>
            )}
          </div>

          {/* Resources Section */}
          {article.resources && article.resources.length > 0 && (
            <>
              <hr className="my-12 border-gray-100" />

              <div className="mb-12">
                <h3 className="text-2xl font-bold text-near-black mb-6 flex items-center gap-2">
                  <FileText className="text-soft-teal" size={24} />
                  Additional Resources
                </h3>

                {/* Categorize resources */}
                {(() => {
                  const videos = article.resources.filter(r => r.type === 'video');
                  const links = article.resources.filter(r => r.type === 'link');
                  const docs = article.resources.filter(r => r.type === 'document');

                  return (
                    <div className="space-y-8">
                      {/* Videos */}
                      {videos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Video size={16} className="text-soft-teal" />
                            Videos ({videos.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {videos.map((resource) => {
                              // Extract YouTube video ID for thumbnail
                              let videoId = '';
                              if (resource.url.includes('youtube.com/watch?v=')) {
                                videoId = resource.url.split('v=')[1]?.split('&')[0];
                              } else if (resource.url.includes('youtu.be/')) {
                                videoId = resource.url.split('youtu.be/')[1]?.split('?')[0];
                              } else if (resource.url.includes('youtube.com/embed/')) {
                                videoId = resource.url.split('embed/')[1]?.split('?')[0];
                              }

                              const thumbnail = videoId
                                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                                : 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400';

                              return (
                                <a
                                  key={resource.id}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                >
                                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                                    <img
                                      src={thumbnail}
                                      alt={resource.title}
                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-soft-teal group-hover:scale-110 transition-all shadow-lg">
                                        <Video className="text-near-black group-hover:text-white ml-1" size={28} fill="currentColor" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4">
                                    <h5 className="font-bold text-gray-800 group-hover:text-soft-teal transition-colors mb-1 line-clamp-1">
                                      {resource.title}
                                    </h5>
                                    {resource.description && (
                                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {resource.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-soft-teal font-medium">
                                      <span>Watch on YouTube</span>
                                      <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      {links.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ExternalLink size={16} className="text-soft-teal" />
                            External Links ({links.length})
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {links.map((resource) => (
                              <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-soft-teal"
                              >
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-soft-teal/10 flex items-center justify-center group-hover:bg-soft-teal group-hover:scale-110 transition-all">
                                  <ExternalLink className="text-soft-teal group-hover:text-white" size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-gray-800 group-hover:text-soft-teal transition-colors mb-1">
                                    {resource.title}
                                  </h5>
                                  {resource.description && (
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                      {resource.description}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-400 truncate">
                                    {resource.url}
                                  </p>
                                </div>
                                <ExternalLink
                                  size={16}
                                  className="flex-shrink-0 text-gray-400 group-hover:text-soft-teal group-hover:translate-x-1 transition-all mt-1"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      {docs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-soft-teal" />
                            Documents ({docs.length})
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {docs.map((resource) => (
                              <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-soft-teal"
                              >
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-soft-teal/10 flex items-center justify-center group-hover:bg-soft-teal group-hover:scale-110 transition-all">
                                  <FileText className="text-soft-teal group-hover:text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-800 group-hover:text-soft-teal transition-colors">
                                    {resource.title}
                                  </h5>
                                  {resource.description && (
                                    <p className="text-sm text-gray-500">
                                      {resource.description}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-soft-teal px-3 py-1 bg-soft-teal/10 rounded-full group-hover:bg-soft-teal group-hover:text-white transition-all">
                                  Download
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          <hr className="my-12 border-gray-100" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Share this transmission
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-near-black hover:text-white transition-all relative group"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied && (
                  <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
