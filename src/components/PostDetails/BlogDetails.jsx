import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FacebookComment from "./FacebookComment";
import { API_URL } from "../config";
import OGSEO from "./OGSEO";
import ShareControls from "./ShareControls";
import BlogMedia from "./BlogMedia";

const currentUrl = window.location.href;

const BlogDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [advert, setAdvert] = useState("");
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const contentRef = useRef(null);

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
          setSeoData(response.data.seo);
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

  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!post) return null;

  return (
    <>
      <OGSEO seoData={seoData} />
      <div className="bg-white font-robotoCondensed">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 overflow-hidden">
          <div className="p-2 sm:col-span-2 overflow-hidden">
            {/* Breadcrumb */}
            <nav className="mb-4 text-md sm:text-md md:text-base">
              <ol className="list-none p-0 flex flex-wrap">
                <li className="flex items-center">
                  <a href="/" className="text-gray-700 hover:text-gray-900">
                    Home
                  </a>
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

            {/* Lead Paragraph (Bordered) */}
            {post.lead && (
              <div className="border-l-4 border-green-700 bg-green-50 px-4 py-3 mb-6 rounded-md">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {post.lead}
                </p>
              </div>
            )}

            {/* Author & Date */}
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
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    Newstropy
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                  <i className="fas fa-calendar-day text-green-700"></i>
                  <p>{formatDate(post.date)}</p>
                </div>
              </div>
            </div>

            {/* Media */}
            <BlogMedia
              media={post.media}
              currentMediaIndex={currentMediaIndex}
              onMediaChange={setCurrentMediaIndex}
            />

            {/* Share Controls */}
            <ShareControls
              title={post.title}
              url={window.location.href}
              lead={post.lead ? post.lead.replace(/<[^>]+>/g, "") : ""}
 
              media={post.media && post.media.length > 0
                ? post.media[0].media_url
                : `${API_URL}/static/images/Breakingnews.png`}
              contentRef={contentRef}
              slug={post.slug}
            />


            {/* Content */}
            <div
              id="contentContainer"
              className="py-0 overflow-hidden my-8"
              ref={contentRef}
              style={{ maxWidth: "1050px", margin: "auto", lineHeight: "1.75" }}
            >
              <p className="leading-relaxed text-gray-800">
                <span
                  dangerouslySetInnerHTML={{
                    __html: advert.replace(/\n/g, "<br>"),
                  }}
                ></span>
              </p>
            </div>

            {/* Comments */}
            <div className="mt-6">
              <FacebookComment url={currentUrl} />
            </div>
          </div>

          {/* Sidebar Placeholder */}
          <div className="mt-4">{/* Include Sidebar Component */}</div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
