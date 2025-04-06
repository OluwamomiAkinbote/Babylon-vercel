import { Helmet } from "react-helmet";
import { API_URL } from "../config";


const OGSEO = ({ title, description, media }) => {
  const defaultImage =  `${API_URL}/static/images/Breakingnews.png`;

  // Pick the first image from media or use the default
  const mediaUrl = media && media.length > 0
    ? media[0].media_url
    : defaultImage;

  // Facebook standard image size (1200x630)
  const imageWidth = 1200;
  const imageHeight = 630;

  const isVideo = media && media.length > 0 && media[0].type === "video";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={isVideo ? "video.other" : "article"} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content={mediaUrl} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />

      {isVideo && (
        <>
          <meta property="og:video" content={mediaUrl} />
          <meta property="og:video:type" content="video/mp4" />
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mediaUrl} />
    </Helmet>
  );
};

export default OGSEO;
