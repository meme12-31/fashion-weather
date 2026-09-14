import { ARTICLE_CATALOG, type ArticleSlug } from "./catalog";
import { ARTICLE_BODIES } from "./bodies";
import type { Article } from "./types";

export type { Article, ArticleBlock, ArticleSection } from "./types";
export { ARTICLE_CATALOG };

export function getAllArticles(): Article[] {
  return ARTICLE_CATALOG.map((meta) => ({
    ...meta,
    sections: ARTICLE_BODIES[meta.slug],
  }));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const meta = ARTICLE_CATALOG.find((item) => item.slug === slug);
  if (!meta) return undefined;
  const sections = ARTICLE_BODIES[meta.slug as ArticleSlug];
  if (!sections) return undefined;
  return { ...meta, sections };
}

export function getArticleSlugs(): ArticleSlug[] {
  return ARTICLE_CATALOG.map((item) => item.slug);
}
