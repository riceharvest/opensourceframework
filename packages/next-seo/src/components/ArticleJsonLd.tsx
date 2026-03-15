import { JsonLdScript } from '~/core/JsonLdScript';
import type { ArticleJsonLdProps } from '~/types/article.types';
import {
  processAuthor,
  processImage,
  processPublisher,
  processMainEntityOfPage,
} from '~/utils/processors';

export default function ArticleJsonLd({
  type = 'Article',
  scriptId,
  scriptKey,
  headline,
  title, // Compatibility alias for v6
  url,
  author,
  authorName, // Compatibility alias for v6
  datePublished,
  dateModified,
  image,
  images, // Compatibility alias for v6
  publisher,
  publisherName, // Compatibility alias for v6
  publisherLogo, // Compatibility alias for v6
  description,
  isAccessibleForFree,
  mainEntityOfPage,
}: ArticleJsonLdProps & {
  title?: string;
  authorName?: string | string[];
  images?: string[];
  publisherName?: string;
  publisherLogo?: string;
}) {
  const actualHeadline = headline || title;
  const actualAuthor =
    author ||
    (authorName
      ? Array.isArray(authorName)
        ? authorName.map((n) => ({ name: n }))
        : authorName
      : undefined);
  const actualImage = image || images;
  const actualPublisher =
    publisher || (publisherName ? { name: publisherName, logo: publisherLogo } : undefined);

  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: actualHeadline,
    ...(url && { url }),
    ...(actualAuthor && {
      author: Array.isArray(actualAuthor)
        ? actualAuthor.map(processAuthor)
        : processAuthor(actualAuthor),
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    // If dateModified is not provided but datePublished is, use datePublished
    ...(!dateModified && datePublished && { dateModified: datePublished }),
    ...(actualImage && {
      image: Array.isArray(actualImage) ? actualImage.map(processImage) : processImage(actualImage),
    }),
    ...(actualPublisher && { publisher: processPublisher(actualPublisher as any) }),
    ...(description && { description }),
    ...(isAccessibleForFree !== undefined && { isAccessibleForFree }),
    ...(mainEntityOfPage && {
      mainEntityOfPage: processMainEntityOfPage(mainEntityOfPage),
    }),
  };

  return (
    <JsonLdScript data={data} id={scriptId} scriptKey={scriptKey || `article-jsonld-${type}`} />
  );
}

export type { ArticleJsonLdProps };
