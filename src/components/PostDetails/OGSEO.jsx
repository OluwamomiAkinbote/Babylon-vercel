import { Helmet } from "react-helmet";
import { API_URL } from "../config";

const OGSEO = ({ title, description, media }) => {
  const defaultImage = `${API_URL}/static/images/Breakingnews.png`;

  // Normalize media to an array
  const mediaItems = Array.isArray(media) && media.length > 0
    ? media
    : media && typeof media === "object"
    ? [media]
    : [];

  const firstMedia = mediaItems.length > 0 ? mediaItems[0] : null;

  const mediaUrl = firstMedia?.media_url || defaultImage;
  const isVideo = firstMedia?.type === "video";

  const imageWidth = 1200;
  const imageHeight = 630;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph Meta */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={isVideo ? "video.other" : "article"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={mediaUrl} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />

      {isVideo && (
        <>
          <meta property="og:video" content={mediaUrl} />
          <meta property="og:video:type" content="video/mp4" />
        </>
      )}

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mediaUrl} />
    </Helmet>
  );
};

export default OGSEO;
