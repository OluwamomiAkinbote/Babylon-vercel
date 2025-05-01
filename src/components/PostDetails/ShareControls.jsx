import React, { useState, useRef, useEffect } from 'react';

const ShareControls = ({ title, url, lead, contentRef, slug }) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [currentTextSizeIndex, setCurrentTextSizeIndex] = useState(2); // Default to "Large"
  const dropdownRef = useRef(null);
  const fontButtonRef = useRef(null);
  const sizeButtonRef = useRef(null);
  const shareButtonRef = useRef(null);

  const fonts = [
    { name: "Roboto Condensed", value: "'Roboto Condensed', sans-serif" },
    { name: "Inter", value: "'Inter', sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Courier New", value: "'Courier New', monospace" }
  ];

  const textSizes = [
    { name: "Small", class: "text-sm md:text-sm" },
    { name: "Normal", class: "text-base md:text-base" },
    { name: "Large", class: "text-lg md:text-lg" },
    { name: "Extra Large", class: "text-xl md:text-xl" },
    { name: "XX Large", class: "text-2xl md:text-2xl" }
  ];

  useEffect(() => {
    const savedFontIndex = localStorage.getItem('fontPreference');
    const savedSizeIndex = localStorage.getItem('sizePreference');
    
    if (savedFontIndex !== null && contentRef?.current) {
      const index = parseInt(savedFontIndex);
      setCurrentFontIndex(index);
      contentRef.current.style.fontFamily = fonts[index].value;
    }
    
    if (savedSizeIndex !== null && contentRef?.current) {
      const index = parseInt(savedSizeIndex);
      setCurrentTextSizeIndex(index);
      contentRef.current.classList.add(textSizes[index].class.split(' '));
    }
  }, []);

  const handleCopy = () => {
    
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.newstropy.online";
    const shortLink = `${baseUrl}/news/${slug}`;

    // Prepare the full text to copy
    let textToCopy = `${lead}\n\n${shortLink}`;

    // Check for available space and truncate for Twitter (max 280 chars)
    const maxTwitterChars = 330;
    const remainingChars = maxTwitterChars - shortLink.length - 2; // 2 for \n\n

    if (textToCopy.length > maxTwitterChars) {
        // For text truncation: trim the lead text to fit the character limit
        let allowedLeadLength = remainingChars > 0 ? remainingChars : 0;
        let trimmedLead = lead.slice(0, allowedLeadLength);
        
        // Trim to the last full word
        const lastSpaceIndex = trimmedLead.lastIndexOf(" ");
        if (lastSpaceIndex > -1) {
            trimmedLead = trimmedLead.slice(0, lastSpaceIndex);
        }

        // Final copy text for Twitter
        textToCopy = `${trimmedLead}...\n\n${shortLink}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
};


  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      if (!shareButtonRef.current.contains(e.target)) setShowShareDropdown(false);
      if (!fontButtonRef.current.contains(e.target)) setShowFontDropdown(false);
      if (!sizeButtonRef.current.contains(e.target)) setShowSizeDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const changeFont = (index) => {
    setCurrentFontIndex(index);
    setShowFontDropdown(false);
    if (contentRef?.current) {
      contentRef.current.style.fontFamily = fonts[index].value;
      localStorage.setItem('fontPreference', index);
    }
  };

  const changeTextSize = (index) => {
    setCurrentTextSizeIndex(index);
    setShowSizeDropdown(false);
    if (contentRef?.current) {
      textSizes.forEach(size => {
        size.class.split(' ').forEach(cls => {
          contentRef.current.classList.remove(cls);
        });
      });
      textSizes[index].class.split(' ').forEach(cls => {
        contentRef.current.classList.add(cls);
      });
      localStorage.setItem('sizePreference', index);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 mt-6">
      {/* Share Button */}
      <div className="relative">
        <button
          ref={shareButtonRef}
          onClick={() => setShowShareDropdown(!showShareDropdown)}
          className="p-2 bg-gray-800 text-white rounded-sm flex items-center gap-2 hover:bg-gray-900 transition-colors"
          aria-label="Share options"
        >
          <i className="fas fa-share-alt"></i>
          <span className="font-semibold text-sm">Share</span>
        </button>

        {showShareDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-400 z-10 py-1 flex flex-col "
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label="Share on Twitter"
            >
              <i className="fab fa-twitter mr-2 text-xl" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label="Share on Facebook"
            >
              <i className="fab fa-facebook mr-2 text-xl" />
              <span className="text-sm">Facebook</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label="Share on WhatsApp"
            >
              <i className="fab fa-whatsapp mr-2 text-xl" />
              <span className="text-sm">WhatsApp</span>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label="Share on LinkedIn"
            >
              <i className="fab fa-linkedin mr-2 text-xl" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label="Share on Instagram"
            >
              <i className="fab fa-instagram mr-2 text-xl" />
              <span className="text-sm">Instagram</span>
            </a>
            <button
              onClick={handleCopy}
              className="p-2 flex items-center text-gray-700 hover:bg-gray-100"
              aria-label={copied ? "Link copied" : "Copy link"}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-link'} mr-2 text-xl`} />
              <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Font Selector */}
      <div className="relative">
        <button
          ref={fontButtonRef}
          onClick={() => setShowFontDropdown(!showFontDropdown)}
          className="p-2 bg-gray-800 text-white rounded-sm flex items-center gap-2 hover:bg-gray-900 transition-colors"
        >
          <i className="fas fa-font mr-2"></i>
          <i className="fas fa-chevron-down ml-2 text-xs"></i>
        </button>

        {showFontDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-400 z-10 py-1 max-h-60 overflow-auto"
          >
            {fonts.map((font, index) => (
              <button
                key={font.name}
                onClick={() => changeFont(index)}
                className={`block w-full text-left px-4 py-2 text-sm ${currentFontIndex === index ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Size Selector */}
      <div className="relative">
        <button
          ref={sizeButtonRef}
          onClick={() => setShowSizeDropdown(!showSizeDropdown)}
          className="p-2 bg-gray-800 text-white rounded-sm flex items-center gap-2 hover:bg-gray-900 transition-colors"
        >
          <i className="fas fa-text-height mr-2"></i>
          <i className="fas fa-chevron-down ml-2 text-xs"></i>
        </button>

        {showSizeDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-400 z-10 py-1"
          >
            {textSizes.map((size, index) => (
              <button
                key={size.name}
                onClick={() => changeTextSize(index)}
                className={`block w-full text-left px-4 py-2 text-sm ${currentTextSizeIndex === index ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareControls;
