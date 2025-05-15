import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../components/config';
import { Link } from 'react-router-dom';
import BlogPostCard from './BlogPostCard';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiHome } from 'react-icons/fi';

const CategoryPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [categoryData, setCategoryData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSubcatOpen, setMobileSubcatOpen] = useState(false);
  const postsPerPage = 8;

  // Function to format date in Nigeria time (WAT)
  const formatNigeriaTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Lagos'
    };
    return new Date(dateString).toLocaleString('en-NG', options);
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/${slug}/`);
        const formattedData = {
          ...response.data,
          posts: response.data.posts.map(post => ({
            ...post,
            formattedDate: formatNigeriaTime(post.date)
          }))
        };
        setCategoryData(formattedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!categoryData) return null;

  const gridPosts = categoryData.posts.slice(3);
  const totalGridPages = Math.ceil(gridPosts.length / postsPerPage);
  const currentGridPosts = gridPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Get current path segments for breadcrumb
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-robotoCondensed">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-sm text-gray-600">
        <Link to="/" className="flex items-center hover:text-gray-900">
          <FiHome className="mr-1" /> Home
        </Link>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const name = segment.replace(/-/g, ' ');
          
          return (
            <React.Fragment key={index}>
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-900 font-medium capitalize">{name}</span>
              ) : (
                <Link to={path} className="hover:text-gray-900 capitalize">
                  {name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Category Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryData.category.name}</h1>
        {categoryData.category.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">
            {categoryData.category.description}
          </p>
        )}
      </div>

      {/* Subcategories Section - Desktop */}
      {categoryData.subcategories?.length > 0 && (
        <div className="mb-8">
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-2 border-b pb-4">
              {categoryData.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  to={`/category/${subcategory.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname === `/category/${subcategory.slug}`
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setMobileSubcatOpen(!mobileSubcatOpen)}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg"
            >
              <span className="font-medium">Browse {categoryData.category.name}</span>
              {mobileSubcatOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {mobileSubcatOpen && (
              <div className="mt-2 space-y-1 pl-2">
                {categoryData.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    to={`/category/${subcategory.slug}`}
                    className={`block px-4 py-2 rounded text-sm ${
                      location.pathname === `/category/${subcategory.slug}`
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* First 3 posts - Centered */}
      <div className="flex justify-center mb-3">
        <div className="max-w-4xl w-full">
          <div className="mb-8">
            {categoryData.posts.length > 0 && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <BlogPostCard post={categoryData.posts[0]} index={0} formattedDate={categoryData.posts[0].formattedDate} />
                </div>
                <div className="md:w-1/2 flex flex-col gap-6">
                  {categoryData.posts.length > 1 && (
                    <BlogPostCard post={categoryData.posts[1]} index={1} formattedDate={categoryData.posts[1].formattedDate} />
                  )}
                  {categoryData.posts.length > 2 && (
                    <BlogPostCard post={categoryData.posts[2]} index={2} formattedDate={categoryData.posts[2].formattedDate} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid posts with pagination */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">More News</h2>
          {totalGridPages > 1 && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 mx-2">
                {currentPage}/{totalGridPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalGridPages, p + 1))}
                disabled={currentPage === totalGridPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentGridPosts.map((post, index) => (
            <BlogPostCard 
              key={post.id} 
              post={post} 
              index={index + 3} 
              formattedDate={post.formattedDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;