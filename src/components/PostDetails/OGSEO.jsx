import React from "react";
import { Helmet } from "react-helmet";

const OGSEO = ({ seoData }) => {
  const { title, description, image_url, url } = seoData;

  return (
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image_url} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />

      {/* Twitter Card Meta */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image_url} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default OGSEO;
