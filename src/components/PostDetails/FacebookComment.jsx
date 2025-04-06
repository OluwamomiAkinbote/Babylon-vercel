import React, { useEffect } from 'react';

const FacebookComment = ({ url }) => {
  useEffect(() => {
    // Dynamically load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse(); // Reparse the comments section after SDK is loaded
    } else {
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0&appId=376703375532188&autoLogAppEvents=1";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.FB) {
          window.FB.XFBML.parse(); // Reparse after script loads
        }
      };
      document.body.appendChild(script);
    }
  }, []); // Empty dependency array to load the script only once

  return (
    <div className="mx-12 mt-8 bg-gray-100 p-4">
      <p className="mb-6">
        By commenting, you agree to our{' '}
        <a href="/privacy-policy" className="text-blue-500">
          commenting policy
        </a>.
      </p>

      {/* Facebook Comments Section */}
      <div
        className="fb-comments"
        data-href={url} // Dynamically pass the URL for comments
        data-width="100%"
        data-numposts="5"
      ></div>
    </div>
  );
};

export default FacebookComment;
