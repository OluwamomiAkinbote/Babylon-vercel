import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

const MetaTags = ({
  title = "Default Title | Your Site",
  description = "Default description for your site",
  imageUrl = "/default-og-image.jpg",
  url = null,
  type = "website",
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph (Facebook/LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl || ""} />
      <meta property="og:type" content={type} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetaTags;
