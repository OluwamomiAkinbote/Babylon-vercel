import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TrendingPosts from "./TrendingPosts";
import MediaRenderer from "./MediaRenderer";
import { API_URL } from '../config';

const Hero = () => {
  const [heroPosts, setHeroPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeroPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/hero-posts/`);
        if (response.data.hero_posts?.length > 0) {
          setHeroPosts(response.data.hero_posts);
        }
      } catch (error) {
        console.error("Error fetching hero posts:", error);
      }
    };

    fetchHeroPosts();
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (heroPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroPosts.length]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (heroPosts.length === 0) return null;

  return (
    <section className="relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 mt-20">
        <div className="hero col-span-2">
          <div className="relative font-barlow">
            {/* Carousel Container */}
            <div className="relative h-64 md:h-96 overflow-hidden">
              {/* Slides */}
              {heroPosts.map((post, index) => (
                <div
                  key={post.id || index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <MediaRenderer
                    media={post.media}
                    className="w-full h-full object-cover"
                    onClick={() => window.location.href = `/news/${post.slug}`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                    <div className="text-white p-4">
                      <span className="bg-red-500 px-2 py-1 text-sm uppercase font-bold">
                        {formatDate(post.date)}
                      </span>
                      <a href={`/news/${post.slug}`} className="hover:underline">
                        <h1 className="md:text-3xl text-xl font-bold mt-4 md:w-2/3">{post.title}</h1>
                      </a>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden border-2 bg-black border-white shadow-lg">
                          <img 
                            src={`${API_URL}/static/images/logo2.png`} 
                            alt="Author" 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <p className="text-lg font-semibold">Newstropy</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2">
                {heroPosts.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full border border-white transition-colors ${
                      index === currentIndex ? "bg-red-500" : "bg-transparent"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Sidebar */}
        <div className="trending col-span-1">
          <TrendingPosts />
        </div>
      </div>
    </section>
  );
};

export default Hero;