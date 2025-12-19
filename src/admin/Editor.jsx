import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Link,
  Video,
  Highlighter,
  X,
  Check,
  Trash2,
  ArrowRight,
  Image,
  FileText,
  Upload,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";
import { createPortal } from "react-dom";
import { compressImage } from "../utils/performance";

const HIGHLIGHT_COLORS = [
  { name: "Light Teal", value: "#C4E1E1" },
  { name: "Light Purple", value: "#E1C4E1" },
  { name: "Light Yellow", value: "#FDF2C0" },
  { name: "Light Green", value: "#C4E1D0" },
];

export default function Editor({
  value,
  onChange,
  placeholder,
  resources = [],
  onResourcesChange,
}) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [bubbleMenu, setBubbleMenu] = useState({ show: false, x: 0, y: 0 });
  const [showHighlights, setShowHighlights] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Input Mode state for Link
  const [inputMode, setInputMode] = useState(null); // 'link'
  const [inputValue, setInputValue] = useState("");
  const [savedRange, setSavedRange] = useState(null);

  // Resources state
  const [showResourcesPanel, setShowResourcesPanel] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  // Ref to track if the update came from local editing
  const isLocalUpdate = useRef(false);

  // 1. ROBUST SYNC LOGIC with Sanitization
  useEffect(() => {
    if (!editorRef.current) return;
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }

    // Simple content sync without sanitization for now
    const incomingValue = value || "";

    if (incomingValue !== editorRef.current.innerHTML) {
      const isFocused = document.activeElement === editorRef.current;
      // Only update if difference is significant or not focused, to avoid cursor jumps
      if (
        !isFocused ||
        Math.abs(incomingValue.length - editorRef.current.innerHTML.length) > 10
      ) {
        editorRef.current.innerHTML = incomingValue;
      }
    }
  }, [value]);

  // 2. ROBUST BUBBLE MENU LOGIC
  useEffect(() => {
    const handleSelectionChange = () => {
      if (inputMode) return;

      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        if (!showHighlights)
          setBubbleMenu((prev) => ({ ...prev, show: false }));
        return;
      }

      if (
        !editorRef.current ||
        !editorRef.current.contains(selection.anchorNode)
      ) {
        if (!showHighlights)
          setBubbleMenu((prev) => ({ ...prev, show: false }));
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let x = rect.left + rect.width / 2;
      let y = rect.top - 12; // slightly higher

      if (x < 20) x = 20;
      if (y < 20) y = rect.bottom + 10;

      setBubbleMenu({
        show: true,
        x: x,
        y: y,
      });
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
  }, [inputMode, showHighlights]);

  const handleChange = () => {
    if (editorRef.current) {
      isLocalUpdate.current = true;
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleChange();
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

  // Video Insertion Logic
  const confirmVideo = () => {
    if (videoUrlInput) {
      let embedUrl = videoUrlInput;
      if (videoUrlInput.includes("watch?v="))
        embedUrl = videoUrlInput.replace("watch?v=", "embed/");
      else if (videoUrlInput.includes("youtu.be/"))
        embedUrl = videoUrlInput.replace("youtu.be/", "www.youtube.com/embed/");

      // Secure the iframe slightly?
      const iframe = `<div class="video-wrapper my-8 relative group" contenteditable="false">
                <div class="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none z-10"></div>
                ${
                  /* Note: We rely on user deleting the block itself via backspace */ ""
        }
                <iframe width="100%" height="315" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div><p><br/></p>`;

      if (editorRef.current) {
        editorRef.current.innerHTML += iframe;
        handleChange();
      }
      setShowVideoInput(false);
      setVideoUrlInput("");
    }
  };

  // Image Upload Logic with Compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        // Show loading state (optional)
        const compressedDataUrl = await compressImage(file, 1920, 0.85);

        const imageHtml = `<div class="image-wrapper my-6 text-center" contenteditable="false">
                    <img src="${compressedDataUrl}" alt="Uploaded image" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" style="max-height: 500px; object-fit: contain;" />
                </div><p><br/></p>`;

        insertAtCursor(imageHtml);
      } catch (error) {
        console.error('Image compression failed:', error);
        // Fallback to original method
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageHtml = `<div class="image-wrapper my-6 text-center" contenteditable="false">
                      <img src="${event.target.result}" alt="Uploaded image" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" style="max-height: 500px; object-fit: contain;" />
                  </div><p><br/></p>`;
          insertAtCursor(imageHtml);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = ""; // Reset input
  };

  // Document Upload Logic
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const docHtml = `<div class="document-wrapper my-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3" contenteditable="false">
                        <svg class="w-6 h-6 text-soft-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <div class="flex-1">
                            <p class="font-medium text-gray-800">${file.name
          }</p>
                            <p class="text-sm text-gray-500">${(
            file.size / 1024
          ).toFixed(1)} KB</p>
                        </div>
                        <a href="${event.target.result}" download="${file.name
          }" class="px-3 py-1 bg-soft-teal text-white text-sm rounded-lg hover:bg-soft-teal/80 transition-colors no-underline">Download</a>
                    </div><p><br/></p>`;

        insertAtCursor(docHtml);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ""; // Reset input
  };

  // Insert content at cursor position
  const insertAtCursor = (html) => {
    const selection = window.getSelection();
    if (
      selection.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(selection.anchorNode)
    ) {
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
      // If no selection, append to end
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
        type:
          newResourceUrl.includes("youtube.com") ||
            newResourceUrl.includes("youtu.be")
            ? "video"
            : "link",
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

  return (
    <div className="relative w-full h-[600px] group flex flex-col">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${showLineNumbers
              ? "bg-soft-teal text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
          >
            Line Numbers
          </button>
          <div className="flex items-center gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Image size={16} />
              Image
            </button>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleDocUpload}
              className="hidden"
            />
            <button
              onClick={() => docInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              <FileText size={16} />
              Document
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowResourcesPanel(!showResourcesPanel)}
          className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
        >
          <ExternalLinkIcon size={16} />
          Resources ({resources.length})
        </button>
      </div>

      {/* Main Editor Area with Line Numbers */}
      <div className="flex flex-1 overflow-hidden">
        {showLineNumbers && (
          <div className="w-12 bg-gray-100 border-r border-gray-200 flex flex-col text-xs text-gray-500 font-mono">
            <div className="p-2 border-b border-gray-200 text-center font-bold">
              #
            </div>
            <div className="flex-1 overflow-y-auto">
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i + 1}
                  className="h-7 flex items-center justify-center border-b border-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          ref={editorRef}
          className="flex-1 p-8 text-lg text-gray-800 font-body focus:outline-none overflow-y-auto prose prose-lg prose-slate max-w-none 
                [&_p]:leading-relaxed [&_p]:mb-4
                [&_a]:text-blue-800 [&_a]:underline [&_a]:cursor-pointer [&_a]:font-bold [&_a]:bg-white/20 [&_a]:px-0.5 [&_a]:rounded
                [&_mark]:text-near-black [&_mark]:px-1 [&_mark]:rounded-sm
                [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-lg
                [&_.image-wrapper]:my-6 [&_.image-wrapper]:text-center
                [&_.document-wrapper]:my-4 [&_.document-wrapper]:p-4 [&_.document-wrapper]:bg-gray-50 [&_.document-wrapper]:border [&_.document-wrapper]:border-gray-200 [&_.document-wrapper]:rounded-lg
                selection:bg-soft-teal/30 selection:text-near-black"
          contentEditable
          onInput={handleChange}
          suppressContentEditableWarning
          placeholder={placeholder}
        />
      </div>

      {!value && (
        <div className="absolute top-8 left-8 text-gray-400 pointer-events-none text-lg italic">
          Start writing your story...
        </div>
      )}

      {/* Bubble Menu Portal */}
      {bubbleMenu.show &&
        createPortal(
          <div
            className="fixed z-[9999] flex items-center bg-gray-900 text-white rounded-full shadow-2xl border border-white/10 px-3 py-2 animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: bubbleMenu.x,
              top: bubbleMenu.y,
              transform: "translate(-50%, -100%) translateY(-10px)",
            }}
            onMouseDown={preventDefault}
          >
            {inputMode ? (
              /* Input Mode UI */
              <div className="flex items-center gap-2 px-1">
                <input
                  autoFocus
                  type="text"
                  className="bg-transparent border-b border-white/20 text-sm py-1 px-1 focus:outline-none focus:border-soft-teal w-48 text-white placeholder-gray-500"
                  placeholder={
                    inputMode === "link"
                      ? "Paste Link (https://...)"
                      : "Input..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmInput()}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <button
                  onClick={confirmInput}
                  className="text-soft-teal hover:text-white p-1"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={closeInput}
                  className="text-red-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              /* Standard Toolbar UI */
              <div className="flex items-center gap-1">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execCommand("bold");
                  }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Bold"
                >
                  <Bold size={18} />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execCommand("italic");
                  }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Italic"
                >
                  <Italic size={18} />
                </button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    imageInputRef.current?.click();
                  }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Insert Image"
                >
                  <Image size={18} />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    docInputRef.current?.click();
                  }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Insert Document"
                >
                  <FileText size={18} />
                </button>
                <div className="w-px h-4 bg-white/20 mx-1" />

                {/* Highlight Dropdown Trigger */}
                <div className="relative">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowHighlights(!showHighlights);
                    }}
                    className={`p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors ${showHighlights ? "text-soft-teal" : ""
                      }`}
                    title="Highlight"
                  >
                    <Highlighter size={18} />
                  </button>
                  {showHighlights && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-near-black border border-white/20 rounded-xl shadow-xl grid grid-cols-4 gap-1 w-32"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {HIGHLIGHT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                          style={{ backgroundColor: c.value }}
                          onClick={() => {
                            execCommand("hiliteColor", c.value);
                            setShowHighlights(false);
                          }}
                        />
                      ))}
                      <button
                        className="col-span-4 text-[10px] text-white/50 border-t border-white/10 mt-1 pt-1 hover:text-white"
                        onClick={() => {
                          execCommand("hiliteColor", "transparent");
                          setShowHighlights(false);
                        }}
                      >
                        None
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    startInput("link");
                  }}
                  className="p-1.5 hover:text-soft-teal hover:bg-white/10 rounded transition-colors"
                  title="Link"
                >
                  <Link size={18} />
                </button>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Custom Video Input Popover */}
      {showVideoInput && (
        <div className="absolute bottom-16 right-4 z-50 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 w-80 animate-in fade-in slide-in-from-bottom-2">
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Embed YouTube Video
          </h4>
          <input
            type="text"
            autoFocus
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmVideo()}
            className="w-full text-sm text-near-black border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-soft-teal"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVideoInput(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={confirmVideo}
              className="px-3 py-1.5 text-xs font-bold bg-near-black text-white hover:bg-soft-teal rounded-lg transition-colors"
            >
              Embed Video
            </button>
          </div>
        </div>
      )}

      {/* Floating 'Insert Video' Action - Now with Custom UI */}
      <div className="absolute bottom-4 right-4 z-40 bg-white/90 backdrop-blur rounded-full shadow-lg p-1 border border-gray-200">
        <button
          type="button"
          onClick={() => setShowVideoInput(!showVideoInput)}
          className="flex items-center gap-2 px-4 py-2 bg-near-black text-white hover:bg-near-black/80 rounded-full transition-all text-sm font-medium"
        >
          <Video size={16} />
          <span>Add Video to Bottom</span>
        </button>
      </div>

      {/* Resources Panel */}
      {showResourcesPanel && (
        <div className="absolute top-16 right-4 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Additional Resources
            </h3>
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
              <p className="text-gray-400 text-sm text-center py-8">
                No resources added yet
              </p>
            ) : (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-soft-teal transition-colors"
                  >
                    {resource.type === "video" ? (
                      <Video
                        size={16}
                        className="text-soft-teal flex-shrink-0"
                      />
                    ) : (
                      <ExternalLinkIcon
                        size={16}
                        className="text-soft-teal flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {resource.title}
                      </p>
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
    </div>
  );
}
