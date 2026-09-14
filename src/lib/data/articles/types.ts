export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "h3"; title: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ArticleSection {
  id: string;
  title: string;
  blocks: ArticleBlock[];
}

export interface Article {
  slug: string;
  title: string;
  emoji: string;
  tag: string;
  summary: string;
  sections: ArticleSection[];
}
