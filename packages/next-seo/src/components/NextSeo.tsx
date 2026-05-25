import React from 'react';

export interface NextSeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
  twitter?: {
    handle?: string;
    site?: string;
    cardType?: string;
  };
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * NextSeo component for backwards compatibility.
 *
 * Note: In Next.js App Router, it is recommended to use the `generateMetadata` API
 * instead of this component.
 */
export const NextSeo: React.FC<NextSeoProps> = (_props) => {
  // In App Router, standard meta tags should be handled by generateMetadata.
  // This component is provided for backwards compatibility and transition safety.
  // It doesn't do anything in App Router as tags are managed by Next.js.
  // But we keep the export so code doesn't break.
  return null;
};

export default NextSeo;
