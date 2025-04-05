import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from '../config';

// Function to format date for Lagos, Africa
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

const TrendingPosts = () => {
  const [trends, setTrends] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5; // Number of posts per view

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get(`${API_URL}/trends/`);
        setTrends(response.data.recent_trends);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Handle next and prev clicks
  const nextPosts = () => {
    if (currentIndex + postsPerPage < trends.length) {
      setCurrentIndex(currentIndex + postsPerPage);
    }
  };

  const prevPosts = () => {
    if (currentIndex - postsPerPage >= 0) {
      setCurrentIndex(currentIndex - postsPerPage);
    }
  };

  return (
    <div className="text-gray-900 p-3 rounded-xs relative">
      {/* Header with Arrows */}
      <div className="flex justify-between items-center border-b-2 border-green-600 pb-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Trending</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevPosts}
            className={`p-2 rounded-full ${
              currentIndex === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-900 hover:bg-gray-200"
            }`}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextPosts}
            className={`p-2 rounded-full ${
              currentIndex + postsPerPage >= trends.length ? "text-gray-400 cursor-not-allowed" : "text-gray-900 hover:bg-gray-200"
            }`}
            disabled={currentIndex + postsPerPage >= trends.length}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Trending Posts */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading trends...</p>
        ) : trends.length > 0 ? (
          trends.slice(currentIndex, currentIndex + postsPerPage).map((post, index) => (
            <div key={post.id} className="flex items-start space-x-3">
              <span className="text-red-500 text-3xl font-bold">
                {currentIndex + index + 1}
              </span>
              <div className="border-b border-gray-700 pb-2 w-full">
                <a
                  href={`/trend/${post.slug}`}
                  className="md:text-xl text-lg font-medium text-gray-800 hover:text-red-500"
                >
                  {post.title.length > 80
                    ? post.title.substring(0, 80) + "..."
                    : post.title}
                </a>
                <p className="text-gray-700 text-md mb-2">{formatDate(post.date)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No trending posts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingPosts;