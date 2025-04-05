import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const BlogDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [advert, setAdvert] = useState("");
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/news/${slug}/`);
        if (response.data?.post) {
          setPost(response.data.post);
          setAdvert(response.data.advert || "");
        } else {
          setError("Post not found");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleMediaChange = (index) => {
    setCurrentMediaIndex(Math.max(0, Math.min(index, mediaItems.length - 1)));
  };

  const getMediaUrl = (url) => {
    return url?.startsWith('https') ? url : `${API_URL}${url}`;
  };

  if (loading) {
    return <div className="text-center p-8">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-8">Post not found</div>;
  }

  const mediaItems = Array.isArray(post.media) ? post.media : [post.media].filter(Boolean);

  return (
    <div className="bg-white mt-32 font-robotoCondensed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                </li>
                <li className="text-gray-400">/</li>
                {post.category && (
                  <>
                    <li>
                      <a
                        href={`/category/${post.category.slug}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {post.category.name}
                      </a>
                    </li>
                    <li className="text-gray-400">/</li>
                  </>
                )}
                <li className="text-gray-900 truncate max-w-xs">{post.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <img
                     src={`${API_URL}/static/images/logo2.png`}
                    alt="Author"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `${API_URL}/static/images/default-avatar.png`;
                    }}
                  />
                </div>
                <span className="font-medium">Newstropy</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{formatDate(post.date)}</span>
            </div>

            {/* Media Gallery */}
            {mediaItems.length > 0 && (
              <div className="mb-8">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {mediaItems[currentMediaIndex].type === "video" ? (
                    <video
                      src={getMediaUrl(mediaItems[currentMediaIndex].media_url)}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={getMediaUrl(mediaItems[currentMediaIndex].media_url)}
                      alt={`Media ${currentMediaIndex + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = `${API_URL}/static/images/default-media.png`;
                      }}
                    />
                  )}
                </div>

                {mediaItems[currentMediaIndex].caption && (
                  <p className="mt-2 text-sm text-gray-600 text-center italic">
                    {mediaItems[currentMediaIndex].caption}
                  </p>
                )}

                {mediaItems.length > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">
                      {currentMediaIndex + 1} of {mediaItems.length}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMediaChange(currentMediaIndex - 1)}
                        disabled={currentMediaIndex === 0}
                        className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => handleMediaChange(currentMediaIndex + 1)}
                        disabled={currentMediaIndex === mediaItems.length - 1}
                        className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              {advert && (
                <div 
                  className="mb-8 p-4 bg-gray-50 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: advert }}
                />
              )}
              <div className="mt-8">
                {/* Additional content sections can be added here */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Related Posts Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                {/* Related posts would be rendered here */}
                <p className="text-gray-600">No related posts available</p>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-4">
                  Subscribe to our newsletter for the latest news
                </p>
                {/* Newsletter form would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;