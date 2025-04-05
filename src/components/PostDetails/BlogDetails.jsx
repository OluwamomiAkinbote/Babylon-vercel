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

    axios
      .get(`${API_URL}/news/${slug}/`)
      .then((response) => {
        if (response.data && response.data.post) {
          setPost(response.data.post);
          setAdvert(response.data.advert);
        } else {
          setError("Post not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching blog post:", error);
        setError("Failed to load blog post.");
      });
  }, [slug]);

  const handleMediaChange = (index) => {
    setCurrentMediaIndex(index);
  };

  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!post) return null;

  const mediaItems = Array.isArray(post.media) ? post.media : [post.media];
  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <div className="bg-white mt-32 font-robotoCondensed">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 overflow-hidden">
        <div className="p-2 sm:col-span-2 overflow-hidden">
          {/* Breadcrumb */}
          <nav className="mb-4 text-md sm:text-md md:text-base">
            <ol className="list-none p-0 flex flex-wrap">
              <li className="flex items-center">
                <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
                <i className="fas fa-angle-double-right mx-2 text-green-800"></i>
              </li>
              {post.category && (
                <li className="flex items-center">
                  <a
                    href={`/category/${post.category.slug}`}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    {post.category.name}
                  </a>
                </li>
              )}
            </ol>
          </nav>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h2>

          {/* Author & Date Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-700 font-medium">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <div className="w-5 h-5 rounded-full bg-gray-200">
                  <img
                    src={`${API_URL}/static/images/logo2.png`}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Newstropy</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                <i className="fas fa-calendar-day text-green-700"></i>
                <p>{formatDate(post.date)}</p>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          {mediaItems && mediaItems.length > 0 && (
            <div>
              {/* Media Display */}
              <div className="relative my-4 w-full">
                {/* Display current media based on type */}
                {currentMedia.type === "video" ? (
                  <video
                    src={`${API_URL}${currentMedia.media_url}`}
                    controls
                    className="w-full h-auto max-h-[600px] object-cover"
                  ></video>
                ) : (
                  <img
                    src={`${API_URL}${currentMedia.media_url}`}
                    alt={`Media ${currentMediaIndex + 1}`}
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                )}
              </div>

              {/* Caption for current media */}
              {currentMedia.caption && (
                <div className="text-center text-sm text-gray-600 mt-2 italic">
                  {currentMedia.caption}
                </div>
              )}

              {/* Controls and Index Below Media */}
              {mediaItems.length > 1 && (
                <div className="flex justify-between items-center mt-2">
                  {/* Media Index on the Left */}
                  <div className="text-gray-800 text-sm">
                    {`Media ${currentMediaIndex + 1} of ${mediaItems.length}`}
                  </div>

                  {/* Pagination Controllers on the Right */}
                  <div className="flex space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handleMediaChange(currentMediaIndex - 1)}
                      className={`text-green-800 hover:text-green-600 px-3 py-1 ${currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={currentMediaIndex === 0}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {/* Next Button */}
                    <button
                      onClick={() => handleMediaChange(currentMediaIndex + 1)}
                      className={`text-green-800 hover:text-green-600 px-3 py-1 ${currentMediaIndex === mediaItems.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={currentMediaIndex === mediaItems.length - 1}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blog Content with Styled First Letter */}
          <div id="contentContainer" className="py-0 overflow-hidden my-8">
            <p
              className="leading-relaxed text-lg text-gray-800"
              style={{ maxWidth: "800px", margin: "auto", lineHeight: "1.75" }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: advert.replace(/\n/g, "<br>"),
                }}
              ></span>
            </p>
          </div>

          {/* Advert & Shop Section Placeholder */}
          <div className="shop my-8">{/* Include Shop Component Here */}</div>

          {/* Comments Section */}
          <div className="mt-6">{/* Include Comments Component Here */}</div>
        </div>

        {/* Sidebar with Related Posts */}
        <div>
          {/* Sidebar Ad & Related Posts */}
          <div className="mt-4">{/* Include Sidebar Component Here */}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;