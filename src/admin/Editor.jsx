import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Link,
  Video,
  Highlighter,
  X,
  Check,
  Trash2,
  Image,
  FileText,
  ExternalLink as ExternalLinkIcon,
  Eye,
  EyeOff,
  Info,
  Smile,
  Quote,
  Minus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  List,
  ListOrdered,
  Undo,
  Redo,
  Save,
  Clock,
  Sparkles,
} from "lucide-react";
import { createPortal } from "react-dom";
import { compressImage } from "../utils/performance";

const HIGHLIGHT_COLORS = [
  { name: "Soft Teal", value: "#C4E1E1" },
  { name: "Lavender", value: "#E8D4F0" },
  { name: "Sunshine", value: "#FDF2C0" },
  { name: "Mint", value: "#C4E1D0" },
  { name: "Coral", value: "#FFD4CC" },
  { name: "Sky", value: "#CCE5FF" },
];

// Popular emojis for articles
const EMOJI_CATEGORIES = {
  "Popular": ["🚀", "✨", "🔥", "💡", "⭐", "🎯", "💫", "🌟", "⚡", "🎉", "👏", "💪"],
  "Science": ["🔬", "🧬", "⚗️", "🔭", "🌍", "🌙", "☀️", "🪐", "🛸", "🛰️", "🌌", "💎"],
  "Tech": ["💻", "📱", "⚙️", "🔧", "📡", "🤖", "📊", "📈", "💾", "🖥️", "⌨️", "🔌"],
  "Nature": ["🌱", "🌿", "🍃", "🌺", "🦋", "🐦", "🌊", "🏔️", "🌈", "☁️", "🌸", "🍀"],
  "Symbols": ["✅", "❌", "⚠️", "💯", "🎯", "📌", "🔗", "💡", "❓", "❗", "➡️", "⬆️"],
  "Faces": ["😊", "🤔", "😎", "🙌", "👀", "🤩", "😍", "🥳", "😂", "🤯", "😮", "🫡"],
};

// Stickers/Icons (using emoji combinations and decorative elements)
const STICKERS = [
  { emoji: "🎯", label: "Target" },
  { emoji: "💡", label: "Idea" },
  { emoji: "⚡", label: "Energy" },
  { emoji: "🔥", label: "Hot" },
  { emoji: "✨", label: "Magic" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📌", label: "Pin" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "💪", label: "Strong" },
  { emoji: "🏆", label: "Trophy" },
  { emoji: "🎨", label: "Creative" },
];

export default function Editor({
  value,
  onChange,
  placeholder,
  resources = [],
  onResourcesChange,
  articleId = null, // For draft saving
}) {
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const highlightButtonRef = useRef(null);

  // Font options - 3 readable fonts max
  const FONT_OPTIONS = [
    { name: "System", value: "system-ui, -apple-system, sans-serif", label: "System Default" },
    { name: "Georgia", value: "Georgia, serif", label: "Georgia (Elegant)" },
    { name: "Inter", value: "'Inter', sans-serif", label: "Inter (Modern)" },
  ];

  // UI States
  const [bubbleMenu, setBubbleMenu] = useState({ show: false, x: 0, y: 0 });
  const [showHighlights, setShowHighlights] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("Popular");
  const [emojiPickerPos, setEmojiPickerPos] = useState({ x: 0, y: 0 });
  const [highlightPickerPos, setHighlightPickerPos] = useState({ x: 0, y: 0 });
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[1].value); // Default: Georgia
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Stats
  const [lineCount, setLineCount] = useState(1);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Auto-save states
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Input Mode state for Link
  const [inputMode, setInputMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [savedRange, setSavedRange] = useState(null);

  // Resources state
  const [showResourcesPanel, setShowResourcesPanel] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  const isLocalUpdate = useRef(false);

  // Calculate line count and sync scroll
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerText || "";
    const lines = content.split('\n');
    setLineCount(Math.max(lines.length, 1));

    // Word count (excluding empty strings)
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);

    // Character count (excluding HTML)
    setCharCount(content.length);
  }, []);

  // Sync scroll between editor and line numbers
  const handleEditorScroll = useCallback(() => {
    if (lineNumbersRef.current && editorRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges || !value) return;

    const autoSaveTimer = setTimeout(() => {
      setIsSaving(true);
      // Save to localStorage as draft
      const draftKey = `tqv_draft_${articleId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify({
        content: value,
        savedAt: new Date().toISOString(),
      }));

      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }, 500);
    }, 5000); // Auto-save after 5 seconds of no changes

    return () => clearTimeout(autoSaveTimer);
  }, [value, hasUnsavedChanges, articleId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `tqv_draft_${articleId || 'new'}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !value) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.content && editorRef.current) {
          editorRef.current.innerHTML = draft.content;
          onChange(draft.content);
          setLastSaved(new Date(draft.savedAt));
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, [articleId]);

  // Content sync
  useEffect(() => {
    if (!editorRef.current) return;
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }

    const incomingValue = value || "";
    if (incomingValue !== editorRef.current.innerHTML) {
      const isFocused = document.activeElement === editorRef.current;
      if (!isFocused || Math.abs(incomingValue.length - editorRef.current.innerHTML.length) > 10) {
        editorRef.current.innerHTML = incomingValue;
      }
    }
    updateStats();
  }, [value, updateStats]);

  // Bubble Menu Logic
  useEffect(() => {
    const handleSelectionChange = () => {
      if (inputMode || isPreviewMode) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        if (!showHighlights) setBubbleMenu((prev) => ({ ...prev, show: false }));
        return;
      }

      if (!editorRef.current || !editorRef.current.contains(selection.anchorNode)) {
        if (!showHighlights) setBubbleMenu((prev) => ({ ...prev, show: false }));
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let x = rect.left + rect.width / 2;
      let y = rect.top - 12;
      if (x < 20) x = 20;
      if (y < 20) y = rect.bottom + 10;

      setBubbleMenu({ show: true, x, y });
    };

    let timeoutId;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSelectionChange, 10);
    };

    document.addEventListener("selectionchange", debouncedHandler);
    return () => {
      document.removeEventListener("selectionchange", debouncedHandler);
      clearTimeout(timeoutId);
    };
  }, [inputMode, showHighlights, isPreviewMode]);

  const handleChange = () => {
    if (editorRef.current) {
      isLocalUpdate.current = true;
      const content = editorRef.current.innerHTML;
      onChange(content);
      setHasUnsavedChanges(true);
      updateStats();
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleChange();
  };

  // Insert text at cursor
  const insertTextAtCursor = (text) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      handleChange();
    }
  };

  // Format as heading
  const formatHeading = (level) => {
    execCommand("formatBlock", `h${level}`);
  };

  // Insert or toggle quote block
  const insertQuote = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // No selection, insert a new quote block
      const quoteHtml = `<blockquote class="border-l-4 border-soft-teal pl-6 py-3 my-6 italic text-gray-600 bg-gray-50/80 rounded-r-lg" contenteditable="true">Type your quote here...</blockquote><p><br/></p>`;
      insertAtCursor(quoteHtml);
    } else {
      // Try to use formatBlock for toggling
      const parentBlock = selection.anchorNode?.parentElement;
      if (parentBlock?.closest('blockquote')) {
        // Already in a quote, remove it
        execCommand("formatBlock", "p");
      } else {
        // Wrap in quote
        execCommand("formatBlock", "blockquote");
      }
    }
  };

  // Remove quote (convert to paragraph)
  const removeQuote = () => {
    execCommand("formatBlock", "p");
  };

  // Insert divider
  const insertDivider = () => {
    const dividerHtml = `<hr class="my-8 border-t-2 border-gray-200" /><p><br/></p>`;
    insertAtCursor(dividerHtml);
  };

  // Link Handling
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    if (savedRange) {
      selection.addRange(savedRange);
    }
  };

  const startInput = (mode) => {
    saveSelection();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setBubbleMenu((prev) => ({
        ...prev,
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 12,
      }));
    }
    setInputMode(mode);
    setInputValue("");
  };

  const confirmInput = () => {
    restoreSelection();
    if (inputMode === "link" && inputValue) {
      execCommand("createLink", inputValue);
    }
    closeInput();
  };

  const closeInput = () => {
    setInputMode(null);
    setInputValue("");
    setSavedRange(null);
    setShowHighlights(false);
  };

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Video Insertion
  const confirmVideo = () => {
    if (videoUrlInput) {
      let embedUrl = videoUrlInput;
      if (videoUrlInput.includes("watch?v="))
        embedUrl = videoUrlInput.replace("watch?v=", "embed/");
      else if (videoUrlInput.includes("youtu.be/"))
        embedUrl = videoUrlInput.replace("youtu.be/", "www.youtube.com/embed/");

      const iframe = `<div class="video-wrapper my-8 relative group rounded-xl overflow-hidden shadow-lg" contenteditable="false">
        <iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-xl"></iframe>
      </div><p><br/></p>`;

      if (editorRef.current) {
        editorRef.current.innerHTML += iframe;
        handleChange();
      }
      setShowVideoInput(false);
      setVideoUrlInput("");
    }
  };

  // Image Upload with Compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const compressedDataUrl = await compressImage(file, 1920, 0.85);
        const imageHtml = `<figure class="image-wrapper my-8 text-center">
          <img src="${compressedDataUrl}" alt="Article image" class="max-w-full h-auto rounded-xl shadow-lg mx-auto" style="max-height: 500px; object-fit: contain;" contenteditable="false" />
          <figcaption class="text-sm text-gray-500 mt-3 italic cursor-text hover:text-gray-700" contenteditable="true">Click to add caption...</figcaption>
        </figure><p><br/></p>`;
        insertAtCursor(imageHtml);
      } catch (error) {
        console.error('Image compression failed:', error);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageHtml = `<figure class="image-wrapper my-8 text-center">
            <img src="${event.target.result}" alt="Article image" class="max-w-full h-auto rounded-xl shadow-lg mx-auto" style="max-height: 500px; object-fit: contain;" contenteditable="false" />
            <figcaption class="text-sm text-gray-500 mt-3 italic cursor-text hover:text-gray-700" contenteditable="true">Click to add caption...</figcaption>
          </figure><p><br/></p>`;
          insertAtCursor(imageHtml);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = "";
  };

  // Document Upload
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const docHtml = `<div class="document-wrapper my-6 p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4" contenteditable="false">
            <div class="w-12 h-12 rounded-lg bg-soft-teal/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-soft-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 truncate" contenteditable="true">${file.name}</p>
              <p class="text-sm text-gray-500">${(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <a href="${event.target.result}" download="${file.name}" style="background-color: #5EEAD4 !important; color: #1a1a1a !important; padding: 8px 16px; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none !important; display: inline-block;">Download</a>
          </div>
        </div><p><br/></p>`;
        insertAtCursor(docHtml);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Insert content at cursor
  const insertAtCursor = (html) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && editorRef.current && editorRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = html;
      const fragment = document.createDocumentFragment();
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
      range.insertNode(fragment);
      handleChange();
    } else if (editorRef.current) {
      editorRef.current.innerHTML += html;
      handleChange();
    }
  };

  // Resources Management
  const addResource = () => {
    if (newResourceTitle && newResourceUrl && onResourcesChange) {
      const newResource = {
        id: Date.now(),
        title: newResourceTitle,
        url: newResourceUrl,
        type: newResourceUrl.includes("youtube.com") || newResourceUrl.includes("youtu.be") ? "video" : "link",
      };
      onResourcesChange([...resources, newResource]);
      setNewResourceTitle("");
      setNewResourceUrl("");
    }
  };

  const removeResource = (id) => {
    if (onResourcesChange) {
      onResourcesChange(resources.filter((r) => r.id !== id));
    }
  };

  // Format time since last save
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const seconds = Math.floor((new Date() - lastSaved) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="relative w-full group flex flex-col bg-white rounded-xl overflow-hidden shadow-inner">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-soft-teal/5 to-purple-50 border-b border-gray-100 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Type size={12} />
            <span className="font-medium">{wordCount}</span> words
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <AlignLeft size={12} />
            <span className="font-medium">{lineCount}</span> lines
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="font-medium">{charCount}</span> chars
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="flex items-center gap-1.5 text-soft-teal animate-pulse">
              <Save size={12} className="animate-spin" />
              Saving...
            </span>
          )}
          {!isSaving && lastSaved && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Clock size={12} />
              Saved {formatLastSaved()}
            </span>
          )}
          {hasUnsavedChanges && !isSaving && (
            <span className="w-2 h-2 rounded-full bg-yellow-400" title="Unsaved changes" />
          )}
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50 flex-wrap">
        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all mr-2 ${isPreviewMode
            ? "bg-soft-teal text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
        >
          {isPreviewMode ? <EyeOff size={14} /> : <Eye size={14} />}
          {isPreviewMode ? "Edit" : "Preview"}
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Font Selector */}
        {!isPreviewMode && (
          <div className="relative">
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="px-2 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-soft-teal/20"
              title="Font Family"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Formatting Tools - Hidden in Preview */}
        {!isPreviewMode && (
          <>
            {/* Text Formatting */}
            <button
              onMouseDown={(e) => { e.preventDefault(); execCommand("bold"); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Bold (Ctrl+B)"
            >
              <Bold size={16} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); execCommand("italic"); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Italic (Ctrl+I)"
            >
              <Italic size={16} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Headings */}
            <button
              onMouseDown={(e) => { e.preventDefault(); formatHeading(1); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Heading 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); formatHeading(2); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); formatHeading(3); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Heading 3"
            >
              <Heading3 size={16} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Lists */}
            <button
              onMouseDown={(e) => { e.preventDefault(); execCommand("insertUnorderedList"); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); execCommand("insertOrderedList"); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Quote & Divider */}
            <button
              onMouseDown={(e) => { e.preventDefault(); insertQuote(); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Quote Block"
            >
              <Quote size={16} />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); insertDivider(); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Divider"
            >
              <Minus size={16} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Highlight */}
            <div className="relative">
              <button
                ref={highlightButtonRef}
                onClick={() => {
                  if (highlightButtonRef.current) {
                    const rect = highlightButtonRef.current.getBoundingClientRect();
                    setHighlightPickerPos({ x: rect.left, y: rect.top - 10 });
                  }
                  setShowHighlights(!showHighlights);
                }}
                className={`p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all ${showHighlights ? "bg-yellow-100 text-yellow-600" : "text-gray-600 hover:text-gray-900"}`}
                title="Highlight"
              >
                <Highlighter size={16} />
              </button>
            </div>

            {/* Link */}
            <button
              onMouseDown={(e) => { e.preventDefault(); startInput("link"); }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 hover:text-gray-900"
              title="Insert Link"
            >
              <Link size={16} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Media */}
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Image size={14} />
              Image
            </button>

            <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={handleDocUpload} className="hidden" />
            <button
              onClick={() => docInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText size={14} />
              Doc
            </button>

            <button
              onClick={() => setShowVideoInput(!showVideoInput)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              <Video size={14} />
              Video
            </button>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                ref={emojiButtonRef}
                onClick={() => {
                  if (emojiButtonRef.current) {
                    const rect = emojiButtonRef.current.getBoundingClientRect();
                    setEmojiPickerPos({ x: rect.right - 288, y: rect.top - 10 }); // 288 = picker width
                  }
                  setShowEmojiPicker(!showEmojiPicker);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${showEmojiPicker ? "bg-yellow-100 text-yellow-600" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  }`}
              >
                <Smile size={14} />
                Emoji
              </button>
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Line Numbers Toggle */}
        {!isPreviewMode && (
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${showLineNumbers ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Lines
          </button>
        )}

        {/* Resources */}
        <button
          onClick={() => setShowResourcesPanel(!showResourcesPanel)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors"
        >
          <ExternalLinkIcon size={14} />
          Resources ({resources.length})
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 min-h-[500px] overflow-hidden">
        {/* Line Numbers */}
        {showLineNumbers && !isPreviewMode && (
          <div
            ref={lineNumbersRef}
            className="w-12 bg-gray-50 border-r border-gray-100 flex flex-col text-xs text-gray-400 font-mono select-none overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {Array.from({ length: Math.max(lineCount, 30) }, (_, i) => (
                <div
                  key={i + 1}
                  className="h-7 flex items-center justify-center border-b border-gray-50 text-right pr-2"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div
          ref={editorRef}
          className={`flex-1 p-8 focus:outline-none overflow-y-auto bg-white
            font-serif text-lg leading-relaxed text-gray-700
            [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-gray-900 [&_h1]:leading-tight [&_h1]:font-sans
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-800 [&_h2]:leading-snug [&_h2]:font-sans
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-800 [&_h3]:font-sans
            [&_p]:mb-5 [&_p]:leading-[1.8]
            [&_a]:text-soft-teal [&_a]:underline [&_a]:decoration-soft-teal/30 [&_a]:underline-offset-2 [&_a]:hover:decoration-soft-teal
            [&_mark]:bg-yellow-100 [&_mark]:text-gray-900 [&_mark]:px-1 [&_mark]:rounded
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
            [&_li]:leading-[1.7]
            [&_blockquote]:border-l-4 [&_blockquote]:border-soft-teal [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-gray-50 [&_blockquote]:rounded-r-lg
            [&_hr]:my-10 [&_hr]:border-t-2 [&_hr]:border-gray-200
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-lg [&_iframe]:my-8
            [&_.image-wrapper]:my-8 [&_.image-wrapper]:text-center
            [&_.document-wrapper]:my-6
            [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:mt-3 [&_figcaption]:italic
            selection:bg-soft-teal/20 selection:text-gray-900
            ${isPreviewMode ? 'cursor-default ring-2 ring-soft-teal/20 rounded-lg m-2' : ''}`}
          style={{ fontFamily: selectedFont }}
          contentEditable={!isPreviewMode}
          onInput={handleChange}
          onScroll={handleEditorScroll}
          suppressContentEditableWarning
          data-placeholder={placeholder || "Start writing your story..."}
        />
      </div>

      {/* Empty State Placeholder */}
      {!value && !isPreviewMode && (
        <div className="absolute top-40 left-20 text-gray-300 pointer-events-none text-lg italic font-serif">
          Start writing your story...
        </div>
      )}

      {/* Preview Mode Indicator */}
      {isPreviewMode && (
        <div className="absolute bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-soft-teal text-white text-xs font-medium rounded-full shadow-lg">
          <Eye size={12} />
          Preview Mode — Readers will see this
        </div>
      )}

      {/* Bubble Menu Portal */}
      {bubbleMenu.show && !isPreviewMode &&
        createPortal(
          <div
            className="fixed z-[9999] flex items-center bg-gray-900 text-white rounded-full shadow-2xl border border-white/10 px-3 py-2"
            style={{
              left: bubbleMenu.x,
              top: bubbleMenu.y,
              transform: "translate(-50%, -100%) translateY(-10px)",
            }}
            onMouseDown={preventDefault}
          >
            {inputMode ? (
              <div className="flex items-center gap-2 px-1">
                <input
                  autoFocus
                  type="text"
                  className="bg-transparent border-b border-white/20 text-sm py-1 px-1 focus:outline-none focus:border-soft-teal w-48 text-white placeholder-gray-500"
                  placeholder={inputMode === "link" ? "Paste Link (https://...)" : "Input..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmInput()}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <button onClick={confirmInput} className="text-soft-teal hover:text-white p-1">
                  <Check size={16} />
                </button>
                <button onClick={closeInput} className="text-red-400 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onMouseDown={(e) => { e.preventDefault(); execCommand("bold"); }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); execCommand("italic"); }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <button
                  onMouseDown={(e) => { e.preventDefault(); formatHeading(2); }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Heading"
                >
                  <Heading2 size={16} />
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); startInput("link"); }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Link"
                >
                  <Link size={16} />
                </button>
                <div className="relative">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      // Use the portal-based picker instead
                      if (highlightButtonRef.current) {
                        const rect = highlightButtonRef.current.getBoundingClientRect();
                        setHighlightPickerPos({ x: rect.left, y: rect.top - 10 });
                      }
                      setShowHighlights(!showHighlights);
                    }}
                    className={`p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors ${showHighlights ? "text-soft-teal" : ""}`}
                    title="Highlight"
                  >
                    <Highlighter size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Video Input Modal */}
      {showVideoInput && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-white p-5 rounded-xl shadow-2xl border border-gray-200 w-96">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Video size={16} className="text-red-500" />
            Embed YouTube Video
          </h4>
          <input
            type="text"
            autoFocus
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmVideo()}
            className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg px-3 py-2.5 mb-3 focus:outline-none focus:border-soft-teal focus:ring-2 focus:ring-soft-teal/20"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVideoInput(false)}
              className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmVideo}
              className="px-4 py-2 text-xs font-bold bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              Embed Video
            </button>
          </div>
        </div>
      )}

      {/* Resources Panel */}
      {showResourcesPanel && (
        <div className="absolute top-16 right-4 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Additional Resources</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Resource Title"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-soft-teal"
              />
              <input
                type="url"
                placeholder="Resource URL (https://...)"
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addResource()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-soft-teal"
              />
              <button
                onClick={addResource}
                className="w-full px-4 py-2 bg-soft-teal text-white rounded-lg hover:bg-soft-teal/80 transition-colors text-sm font-medium"
              >
                Add Resource
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {resources.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No resources added yet</p>
            ) : (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-soft-teal transition-colors"
                  >
                    {resource.type === "video" ? (
                      <Video size={16} className="text-soft-teal flex-shrink-0" />
                    ) : (
                      <ExternalLinkIcon size={16} className="text-soft-teal flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{resource.title}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-soft-teal truncate block"
                      >
                        {resource.url}
                      </a>
                    </div>
                    <button
                      onClick={() => removeResource(resource.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={() => setShowResourcesPanel(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Highlight Picker Portal */}
      {showHighlights &&
        createPortal(
          <div
            className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-3"
            style={{
              left: highlightPickerPos.x,
              top: highlightPickerPos.y,
              transform: 'translateY(-100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-gray-500 mb-2 font-medium">Highlight Color</p>
            <div className="grid grid-cols-6 gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:scale-110 hover:border-gray-400 transition-all"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  onClick={() => {
                    execCommand("hiliteColor", c.value);
                    setShowHighlights(false);
                  }}
                />
              ))}
            </div>
            <button
              className="w-full text-xs text-gray-500 border-t border-gray-100 mt-2 pt-2 hover:text-gray-700"
              onClick={() => {
                execCommand("hiliteColor", "transparent");
                setShowHighlights(false);
              }}
            >
              Remove Highlight
            </button>
          </div>,
          document.body
        )}

      {/* Emoji Picker Portal */}
      {showEmojiPicker &&
        createPortal(
          <div
            className="fixed w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] overflow-hidden"
            style={{
              left: Math.max(10, emojiPickerPos.x),
              top: emojiPickerPos.y,
              transform: 'translateY(-100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Stickers */}
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1 font-medium">
                <Sparkles size={12} /> Quick Stickers
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {STICKERS.map((sticker, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      insertTextAtCursor(` ${sticker.emoji} `);
                      setShowEmojiPicker(false);
                    }}
                    className="w-9 h-9 text-xl bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
                    title={sticker.label}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </div>
            {/* Category Tabs */}
            <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveEmojiCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors font-medium ${activeEmojiCategory === cat
                    ? "bg-soft-teal text-white"
                    : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Emoji Grid */}
            <div className="p-3 grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto">
              {EMOJI_CATEGORIES[activeEmojiCategory].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    insertTextAtCursor(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="w-9 h-9 text-xl hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
