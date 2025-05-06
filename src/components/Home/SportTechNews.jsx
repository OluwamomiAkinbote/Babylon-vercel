import React, { useEffect, useState } from "react";
import axios from "axios";
import MediaRenderer from "./MediaRenderer";
import { API_URL } from '../config';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
};

const stripHtmlTags = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const SportTechNews = () => {
  const [activeTab, setActiveTab] = useState("sports");
  const [sportsNews, setSportsNews] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/sports-tech/`);
        setSportsNews(response.data.sport_posts);
        setTechNews(response.data.tech_posts);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const currentPosts = activeTab === "sports" ? sportsNews : techNews;

  return (
    <div className="mx-auto py-6 font-robotoCondensed">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-md ${
            activeTab === "sports"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("sports")}
        >
          SPORTS
        </button>
        <span className="py-2 px-1 text-gray-400">|</span>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "tech"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("tech")}
        >
          TECHNOLOGY
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading news...</p>
      ) : currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Column - Latest Post */}
          <div className="col-span-1">
            {currentPosts[0] && (
              <div>
                <h2 className="sm:text-lg font-medium text-gray-800 mb-2">
                  <a
                    href={`/news/${currentPosts[0].slug}`}
                    className="hover:underline"
                  >
                    {currentPosts[0].title}
                  </a>
                </h2>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {stripHtmlTags(currentPosts[0].content) || "No content available"}
                </p>
                <div className="text-sm text-gray-600">
                  {formatDate(currentPosts[0].date)}
                </div>
              </div>
            )}
          </div>

          {/* Second Column - Media */}
          <div className="col-span-1">
            {currentPosts[0] && (
              <MediaRenderer 
                media={currentPosts[0].media} 
                className="w-full h-80 object-cover"
                onClick={() => window.location.href = `/news/${currentPosts[0].slug}`}
              />
            )}
          </div>

          {/* Third Column - Other Posts */}
          <div className="col-span-1">
            {currentPosts.slice(1).map((post) => (
              <div key={post.id} className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-20 h-20">
                    <MediaRenderer 
                      media={post.media}
                      className="w-full h-full object-cover"
                      onClick={() => window.location.href = `/news/${post.slug}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">
                      <a
                        href={`/news/${post.slug}`}
                        className="hover:underline sm:text-md font-medium text-gray-800"
                      >
                        {post.title}
                      </a>
                    </h3>
                    <div className="text-sm text-gray-600">
                      {formatDate(post.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No {activeTab === "sports" ? "sports" : "technology"} news found.
        </p>
      )}
    </div>
  );
};

export default SportTechNews;