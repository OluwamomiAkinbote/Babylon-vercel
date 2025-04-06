import React from "react";
import { API_URL } from "../config";

const BlogMedia = ({ media, currentMediaIndex, onMediaChange }) => {
  const mediaItems = Array.isArray(media) && media.length > 0
    ? media
    : media && typeof media === "object"
    ? [media]
    : [
        {
          type: "image",
          media_url: `${API_URL}/static/images/Breakingnews.png`,
          caption: "Breaking News",
        },
      ];

  const current = mediaItems[currentMediaIndex];

  return (
    <>
      <div className="relative my-4 w-full">
        {current.type === "video" ? (
          <video
            src={current.media_url}
            controls
            className="w-full h-auto max-h-[600px] object-cover"
          ></video>
        ) : (
          <img
            src={current.media_url}
            alt={`Media ${currentMediaIndex + 1}`}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        )}
      </div>

      {current.caption && (
        <div className="text-center text-sm text-gray-600 mt-2 italic">
          {current.caption}
        </div>
      )}

      {mediaItems.length > 1 && (
        <div className="flex justify-between items-center mt-2">
          <div className="text-gray-800 text-sm">
            {`Media ${currentMediaIndex + 1} of ${mediaItems.length}`}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onMediaChange(currentMediaIndex - 1)}
              className={`text-green-800 hover:text-green-600 px-3 py-1 ${
                currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentMediaIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <button
              onClick={() => onMediaChange(currentMediaIndex + 1)}
              className={`text-green-800 hover:text-green-600 px-3 py-1 ${
                currentMediaIndex === mediaItems.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentMediaIndex === mediaItems.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogMedia;
