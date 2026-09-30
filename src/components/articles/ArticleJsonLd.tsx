interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  image = "https://hit-tool.com/fashion-weather/og-image.png",
  datePublished = "2026-10-01",
  dateModified = "2026-10-01",
}: ArticleJsonLdProps) {
  const articleUrl = `https://hit-tool.com/fashion-weather/articles/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: description,
        image: image,
        datePublished: datePublished,
        dateModified: dateModified,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        author: {
          "@type": "Organization",
          name: "HITツールズ",
          url: "https://hit-tool.com/",
        },
        publisher: {
          "@type": "Organization",
          name: "HITツールズ",
          url: "https://hit-tool.com/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "HITツールズ",
            item: "https://hit-tool.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "服装ナビ コラム一覧",
            item: "https://hit-tool.com/fashion-weather/articles",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
