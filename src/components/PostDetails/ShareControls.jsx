import React, { useState, useRef, useEffect } from 'react';

const ShareControls = ({ title, url, contentRef }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [currentTextSizeIndex, setCurrentTextSizeIndex] = useState(1);
  const dropdownRef = useRef(null);
  const shareButtonRef = useRef(null);

  const fonts = ["Poppins", "Georgia", "Arial", "Roboto", "Helvetica", "Times New Roman"];
  const textSizes = ["text-sm", "text-base", "text-lg", "text-xl"];

  const handleCopy = () => {
    const textToCopy = `${title}\n${url}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !shareButtonRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const changeFont = () => {
    const nextIndex = (currentFontIndex + 1) % fonts.length;
    setCurrentFontIndex(nextIndex);
    if (contentRef?.current) {
      contentRef.current.style.fontFamily = fonts[nextIndex];
    }
  };

  const changeTextSize = () => {
    const nextIndex = (currentTextSizeIndex + 1) % textSizes.length;
    if (contentRef?.current) {
      contentRef.current.classList.remove(...textSizes);
      contentRef.current.classList.add(textSizes[nextIndex]);
    }
    setCurrentTextSizeIndex(nextIndex);
  };

  return (
    <div className="flex flex-wrap items-center justify-start mb-2 space-x-4 relative">
      {/* Share Button */}
      <div className="relative">
        <button
          ref={shareButtonRef}
          onClick={toggleDropdown}
          className="px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-200 text-xs sm:text-sm md:text-base"
        >
          <i className="fas fa-share-alt"></i>
          <span className="ml-2">Share</span>
        </button>
      </div>

      {/* Font-Size Change Button */}
      <div className="relative group">
        <button
          onClick={changeFont}
          className="px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-200 text-xs sm:text-sm md:text-base"
        >
          <i className="fas fa-font mr-2"></i>
        </button>
        <div className="absolute hidden group-hover:block whitespace-nowrap top-full left-0 mt-1 px-2 py-1 bg-black text-gray-50 text-xs rounded-md shadow-md">
          Change Font
        </div>
      </div>

      {/* Text Size Change Button */}
      <div className="relative group">
        <button
          onClick={changeTextSize}
          className="px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition ease-in-out duration-200 text-xs sm:text-sm md:text-base"
        >
          <i className="fas fa-text-height mr-2"></i>
        </button>
        <div className="absolute hidden group-hover:block whitespace-nowrap top-full left-0 mt-1 px-2 py-1 bg-black text-gray-50 text-xs rounded-md shadow-md">
          Change Text Size
        </div>
      </div>

      {/* Share Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute mx-4 left-0 top-full mt-2 w-44 bg-white shadow-md rounded border border-gray-200 z-10"
        >
          <div className="p-2 text-xs">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-blue-500 hover:bg-blue-100"
            >
              <i className="fab fa-x-twitter text-xs mr-2"></i> X(Twitter)
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-blue-600 hover:bg-blue-100"
            >
              <i className="fab fa-facebook-f text-xs mr-2"></i> Facebook
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-blue-700 hover:bg-blue-100"
            >
              <i className="fab fa-linkedin-in text-xs mr-2"></i> LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-green-500 hover:bg-green-100"
            >
              <i className="fab fa-whatsapp text-xs mr-2"></i> WhatsApp
            </a>
            <button
              onClick={handleCopy}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-link text-xs mr-2"></i> {copied ? "Copied!" : "Copy Link"}
            </button>
            {copied && (
              <span className="text-green-500 text-sm ml-2">Link copied!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareControls;
