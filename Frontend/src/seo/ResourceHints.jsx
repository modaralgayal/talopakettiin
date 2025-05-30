import React from 'react';
import { Helmet } from 'react-helmet-async';

export const ResourceHints = () => {
  return (
    <Helmet>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload critical assets */}
      <link 
        rel="preload" 
        href="/fonts/your-main-font.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      
      {/* Prefetch resources that will be needed soon */}
      <link rel="prefetch" href="/images/hero-image.webp" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://api.talopakettiin.fi" />
    </Helmet>
  );
}; 