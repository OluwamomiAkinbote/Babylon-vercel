import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaRenderer from "./MediaRenderer";
import { API_URL } from "../config";

const LatestNews = () => {
  const [mainPost, setMainPost] = useState(null);
  const [nonExclusivePosts, setNonExclusivePosts] = useState([]);
  const [exclusivePosts, setExclusivePosts] = useState([]);
  const [nonExclusiveIndex, setNonExclusiveIndex] = useState(0);
  const [exclusiveIndex, setExclusiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5;

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

  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/main-exclusive/`);
        setMainPost(response.data.main_post);
        setNonExclusivePosts(response.data.non_exclusive_posts || []);
        setExclusivePosts(response.data.exclusive_posts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const nextNonExclusive = () => {
    if (nonExclusiveIndex + postsPerPage < nonExclusivePosts.length) {
      setNonExclusiveIndex(nonExclusiveIndex + postsPerPage);
    }
  };

  const prevNonExclusive = () => {
    if (nonExclusiveIndex - postsPerPage >= 0) {
      setNonExclusiveIndex(nonExclusiveIndex - postsPerPage);
    }
  };

  const nextExclusive = () => {
    if (exclusiveIndex + postsPerPage < exclusivePosts.length) {
      setExclusiveIndex(exclusiveIndex + postsPerPage);
    }
  };

  const prevExclusive = () => {
    if (exclusiveIndex - postsPerPage >= 0) {
      setExclusiveIndex(exclusiveIndex - postsPerPage);
    }
  };

  const handleMediaClick = (slug) => {
    window.location.href = `/news/${slug}`;
  };

  const getMediaUrl = (url) => {
    return url?.startsWith('http') ? url : `${API_URL}${url}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading latest news...</div>;
  }

  return (
    <div className="px-2 py-4 bg-white font-poppins">
      {/* Heading Section */}
      <div className="section">
        <div className="heading">
          <h2 className="text-2xl font-bold">LATEST NEWS</h2>
        </div>
        <div className="line">
          <div className="highlight h-1 bg-red-600 w-20"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Main Post */}
        {mainPost && (
          <div className="col-span-1 md:col-span-3 lg:col-span-1">
            <div className="mb-6">
              <div className="relative">
                <MediaRenderer 
                  media={mainPost.media} 
                  className="w-full h-auto cursor-pointer"
                  onClick={() => handleMediaClick(mainPost.slug)}
                />
                <span className="absolute bottom-0 left-0 bg-red-600 text-white text-xs px-2 py-1">
                  NEWS
                </span>
              </div>
              <div className="mt-4">
                <a 
                  href={`/news/${mainPost.slug}`} 
                  className="text-xl font-medium text-gray-800 hover:underline font-robotoCondensed"
                >
                  {mainPost.title.length > 80 ? `${mainPost.title.substring(0, 80)}...` : mainPost.title}
                </a>
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={getMediaUrl("/static/images/logo2.png")} 
                        alt="Author" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `${API_URL}/static/images/default-avatar.png`;
                        }}
                      />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">Newstropy</p>
                  </div>
                  <div className="flex items-center text-gray-700 text-sm">
                    <span className="text-red-500 mr-1">•</span>
                    <p>{formatDate(mainPost.date)}</p>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">
                    {stripHtml(mainPost.content)?.slice(0, 160)}...
                  </p>
                  <a 
                    href={`/news/${mainPost.slug}`} 
                    className="inline-block text-red-600 hover:underline mt-4 rounded-md shadow px-4 py-2 capitalize font-semibold bg-gray-100"
                  >
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-Exclusive Posts */}
        <div className="col-span-1 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Non-Exclusive</h3>
          {nonExclusivePosts.length > 0 ? (
            <>
              {nonExclusivePosts.slice(nonExclusiveIndex, nonExclusiveIndex + postsPerPage).map((post) => (
                <div key={post.id} className="flex border-b pb-4">
                  <div className="w-24 h-20 flex-shrink-0">
                    <MediaRenderer 
                      media={post.media} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleMediaClick(post.slug)}
                    />
                  </div>
                  <div className="ml-3">
                    <a 
                      href={`/news/${post.slug}`} 
                      className="text-lg font-medium text-gray-900 hover:underline block mb-1"
                    >
                      {post.title.length > 75 ? `${post.title.substring(0, 75)}...` : post.title}
                    </a>
                    <div className="flex items-center text-gray-700 text-xs">
                      <span className="text-red-500 mr-1">•</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={prevNonExclusive}
                  disabled={nonExclusiveIndex === 0}
                  className={`p-1 rounded ${nonExclusiveIndex === 0 ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextNonExclusive}
                  disabled={nonExclusiveIndex + postsPerPage >= nonExclusivePosts.length}
                  className={`p-1 rounded ${nonExclusiveIndex + postsPerPage >= nonExclusivePosts.length ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No non-exclusive posts available</p>
          )}
        </div>

        {/* Exclusive Posts */}
        <div className="col-span-1 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Exclusive</h3>
          {exclusivePosts.length > 0 ? (
            <>
              {exclusivePosts.slice(exclusiveIndex, exclusiveIndex + postsPerPage).map((post) => (
                <div key={post.id} className="border-b pb-4">
                  <a 
                    href={`/news/${post.slug}`} 
                    className="text-lg font-medium text-gray-900 hover:underline block mb-1"
                  >
                    {post.title.length > 80 ? `${post.title.substring(0, 80)}...` : post.title}
                  </a>
                  <div className="flex items-center text-gray-700 text-xs">
                    <span className="text-red-500 mr-1">•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={prevExclusive}
                  disabled={exclusiveIndex === 0}
                  className={`p-1 rounded ${exclusiveIndex === 0 ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextExclusive}
                  disabled={exclusiveIndex + postsPerPage >= exclusivePosts.length}
                  className={`p-1 rounded ${exclusiveIndex + postsPerPage >= exclusivePosts.length ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No exclusive posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestNews;