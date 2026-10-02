import React from "react";
import { Utensils, CookingPot, Calculator, Sun, CheckSquare } from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

const ALL_TOOLS: ToolItem[] = [
  {
    id: "recipe-calculator",
    name: "レシピ人数変更・調味料g変換 | ケーキ型サイズ変更",
    url: "https://hit-tool.com/recipe-calculator",
    description: "人数の変更やケーキ型のサイズ変更に伴う調味料・材料の分量を自動計算するツール",
    icon: <Utensils className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "zubora-recipe",
    name: "ズボラレシピ | 冷蔵庫のあまり物で簡単時短レシピ検索",
    url: "https://hit-tool.com/zubora-recipe",
    description: "冷蔵庫に残っている余り物から作れるズボラ飯・簡単レシピを提案するツール",
    icon: <CookingPot className="w-5 h-5 text-amber-500" />,
  },
  {
    id: "calcnote",
    name: "CalcNote | メモ＆手書きができる無料Web電卓アプリ",
    url: "https://hit-tool.com/calcnote",
    description: "テキストと一緒に計算式を残して自動計算・保存ができる計算メモツール",
    icon: <Calculator className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "fashion-weather",
    name: "今日の服装ナビ | 天気に合わせた服装提案",
    url: "https://hit-tool.com/fashion-weather",
    description: "気温や天候に合わせた最適なコーディネートや服装を提案できるツール",
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "travel-checklist",
    name: "持ち物チェックリスト | 国内外の旅行・出張・お出かけの準備を効率化",
    url: "https://hit-tool.com/travel-checklist",
    description: "旅行や出張の準備・持ち物を一覧でスマートにチェック・管理できるツール",
    icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
  },
];

interface Props {
  currentAppId: string;
}

export const RelatedToolsFooter: React.FC<Props> = ({ currentAppId }) => {
  const relatedTools = ALL_TOOLS.filter((tool) => tool.id !== currentAppId).slice(0, 4);

  return (
    <footer className="w-full bg-transparent border-t border-amber-100/80 mt-16 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* セクションヘッダー */}
        <div>
          <h3 className="text-base font-bold text-gray-800 tracking-wide flex items-center gap-2">
            おすすめの関連Webツール
          </h3>
        </div>

        {/* 1列縦並びリスト */}
        <div className="flex flex-col gap-3.5">
          {relatedTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full p-4 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-amber-400 transition-all duration-200 flex items-start gap-3.5"
            >
              <div className="p-2 rounded-lg bg-stone-50 group-hover:bg-amber-50 transition-colors">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm group-hover:text-amber-700 transition-colors break-words">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 break-words">
                  {tool.description}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* TOPページへ（画像ロゴのみのリンクボタン） ＆ コピーライト */}
        <div className="pt-6 border-t border-stone-200/60 flex flex-col items-center gap-4">
          <a
            href="https://hit-tool.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center p-3 sm:p-3.5 bg-white border border-stone-300 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
            title="hit-tool.com へ移動"
          >
            <img
              src="/fashion-weather/portal-banner.png"
              alt="hit-tool.com"
              width={891}
              height={182}
              className="h-10 sm:h-12 w-auto max-w-[260px] sm:max-w-[320px] object-contain group-hover:scale-105 transition-transform"
            />
          </a>
          <div className="text-[11px] text-gray-400">© hit-tool.com All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default RelatedToolsFooter;
