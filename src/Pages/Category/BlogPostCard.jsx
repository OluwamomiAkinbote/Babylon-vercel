import { Link } from 'react-router-dom';
import MediaRenderer from '../../components/Home/MediaRenderer';

const BlogPostCard = ({ post, index, formattedDate }) => {
  // Function to remove HTML tags from content
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  };

  // Use the formattedDate prop if available, otherwise fall back to local formatting
  const displayDate = formattedDate || formatDate(post.date);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Africa/Lagos'
    };
    return date.toLocaleDateString('en-NG', options) + ' WAT';
  }

  // First post - left side of 1x2 layout (now more compact)
  if (index === 0) {
    return (
      <div className="flex flex-col h-full">
        {/* Image container - now same size as grid posts */}
        <div className="relative pb-[56.25%] overflow-hidden mb-2"> {/* Removed rounded-lg */}
          <Link to={`/news/${post.slug}`} className="absolute inset-0 block">
            <MediaRenderer 
              media={post.media}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        
        <div className="flex justify-between items-start mb-1">
          {post.category && (
            <span className="text-xs uppercase text-gray-500">
              {post.category.name}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2"> {/* Reduced to text-lg */}
          <Link to={`/news/${post.slug}`}>{post.title}</Link>
        </h2>
        
        {post.content && (
          <p className="text-gray-600 mb-2 text-sm line-clamp-3">
            {stripHtml(post.content)}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{displayDate}</span>
        </div>
      </div>
    );
  }

  // Second and third posts - right side of 1x2 layout
  if (index < 3) {
    return (
      <div className="flex flex-col h-full">
        {/* Image container - same size as grid posts */}
        <div className="relative pb-[56.25%] overflow-hidden mb-2"> {/* Removed rounded-lg */}
          <Link to={`/news/${post.slug}`} className="absolute inset-0 block">
            <MediaRenderer 
              media={post.media}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-start mb-1">
            {post.category && (
              <span className="text-xs uppercase text-gray-500">
                {post.category.name}
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
            <Link to={`/news/${post.slug}`}>{post.title}</Link>
          </h2>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{displayDate}</span>
          </div>
        </div>
      </div>
    );
  }

  // For posts 4 and beyond - grid layout
  return (
    <div className="flex flex-col h-full">
      {/* Image container */}
      <div className="relative pb-[56.25%] overflow-hidden mb-2"> {/* Removed rounded-lg */}
        <Link to={`/news/${post.slug}`} className="absolute inset-0 block">
          <MediaRenderer 
            media={post.media}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="mt-auto">
        {post.category && (
          <span className="text-xs uppercase text-green-600 mb-1 block">
            {post.category.name}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
          <Link to={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        <span className="text-xs text-gray-500">{displayDate}</span>
      </div>
    </div>
  );
};

export default BlogPostCard;