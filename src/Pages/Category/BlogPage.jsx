import { useState } from 'react';
import BlogPostCard from './BlogPostCard';

const BlogPage = ({ posts = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Featured section posts
  const featuredPost = currentPosts[0] || {};
  const secondaryFeaturedPosts = currentPosts.slice(1, 3);
  
  // Matrix section posts (4x2 grid)
  const matrixPosts = currentPosts.slice(3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* First container - full width featured post */}
          <div className="lg:col-span-2">
            <BlogPostCard 
              post={featuredPost} 
              isFeatured={true} 
            />
          </div>
          
          {/* Second container - 1x2 matrix */}
          <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {secondaryFeaturedPosts.map((post, index) => (
              <BlogPostCard 
                key={index}  // Now using index as key
                post={post} 
                isMedium={true} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4x2 Matrix Section */}
      <section>
        {/* Pagination at top-right */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={indexOfLastPost >= posts.length}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        {/* 4x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matrixPosts.map((post, index) => (
            <div key={index}>  {/* Now using index as key */}
              <BlogPostCard 
                post={post} 
                alternate={index % 2 !== 0} 
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;