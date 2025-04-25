import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import { API_URL } from "../config";
import MediaRenderer from "./MediaRenderer"; // ✅ Imported MediaRenderer

const categories = ['Business', 'Entertainment', 'Health', 'Energy'];

// Format date using Africa/Lagos timezone
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

const FeaturedCategories = () => {
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/featured-categories/`)
      .then(res => setCategoryData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map(category => {
        const posts = categoryData[category] || [];

        return (
          <div key={category} className="bg-white p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">{category}</h2>
              <a href="#" className="text-green-600 hover:text-blue-700">
                <ChevronRight size={26} />
              </a>
            </div>

            {/* First post with MediaRenderer */}
            {posts.length > 0 && (
              <div
                className="mb-4 cursor-pointer"
                onClick={() => window.location.href = `/news/${posts[0].slug}`}
              >
                <MediaRenderer
                  media={posts[0].media}
                  className="w-full h-40 object-cover mb-2"
                />
                <a
                  href={`/news/${posts[0].slug}`}
                  className="text-lg font-medium mb-2 text-gray-800 hover:underline block"
                >
                  {posts[0].title}
                </a>
                <p className="text-sm text-gray-500 mt-1">{formatDate(posts[0].date)}</p>
              </div>
            )}

            {/* Next 2 posts */}
            <div className="space-y-3">
              {posts.slice(1, 2).map(post => (
                <div key={post.id}>
                  <a
                    href={`/news/${post.slug}`}
                    className="text-lg font-medium mb-2 text-gray-800 hover:underline block"
                  >
                    {post.title}
                  </a>
                  <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedCategories;
