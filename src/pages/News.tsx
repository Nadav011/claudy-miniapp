import { useState } from 'react';

type Category = 'כללי' | 'טכנולוגיה' | 'כלכלה';

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  minutesAgo: number;
  category: Category;
  url: string;
}

const CATEGORY_COLOR: Record<Category, string> = {
  כללי: 'bg-blue-100 text-blue-700',
  טכנולוגיה: 'bg-purple-100 text-purple-700',
  כלכלה: 'bg-emerald-100 text-emerald-700',
};

const ITEMS: NewsItem[] = [
  {
    id: 1,
    headline: 'הממשלה אישרה תקציב המדינה לשנת 2026',
    source: 'ynet',
    minutesAgo: 12,
    category: 'כללי',
    url: '#',
  },
  {
    id: 2,
    headline: 'אנתרופיק משיקה את קלוד 4 עם יכולות קוד מתקדמות',
    source: 'Calcalist',
    minutesAgo: 35,
    category: 'טכנולוגיה',
    url: '#',
  },
  {
    id: 3,
    headline: 'הבורסה בתל אביב עלתה ב-1.2% — מדד ת"א 35 שבר שיא',
    source: 'TheMarker',
    minutesAgo: 48,
    category: 'כלכלה',
    url: '#',
  },
  {
    id: 4,
    headline: 'אפל הכריזה על iPhone 17 עם ביצועי AI ללא חיבור לאינטרנט',
    source: 'Walla',
    minutesAgo: 70,
    category: 'טכנולוגיה',
    url: '#',
  },
  {
    id: 5,
    headline: 'שער הדולר ירד מתחת לארבעה שקלים לראשונה מאז 2024',
    source: 'גלובס',
    minutesAgo: 95,
    category: 'כלכלה',
    url: '#',
  },
  {
    id: 6,
    headline: 'פתיחת שנת הלימודים: 1.2 מיליון תלמידים חזרו לכיתות',
    source: 'Maariv',
    minutesAgo: 130,
    category: 'כללי',
    url: '#',
  },
  {
    id: 7,
    headline: 'גוגל מכריזה על Gemini 4 עם הקשר של 10 מיליון טוקנים',
    source: 'Calcalist',
    minutesAgo: 160,
    category: 'טכנולוגיה',
    url: '#',
  },
];

const TABS: Category[] = ['כללי', 'טכנולוגיה', 'כלכלה'];

function timeAgo(minutes: number): string {
  if (minutes < 60) return `לפני ${minutes} דקות`;
  const h = Math.floor(minutes / 60);
  return `לפני ${h} שעות`;
}

export function News() {
  const [tab, setTab] = useState<Category>('כללי');

  const filtered = ITEMS.filter((n) => n.category === tab);

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <h1 className="text-xl font-bold">חדשות</h1>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium min-h-9 transition-colors ${
              tab === t ? 'bg-tg-button text-tg-button-text' : 'bg-tg-secondary-bg text-tg-hint'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="rounded-xl bg-tg-section-bg divide-y divide-tg-secondary-bg">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-tg-hint text-sm">אין פריטים בקטגוריה זו</p>
        ) : (
          filtered.map((n) => (
            <a
              key={n.id}
              href={n.url}
              className="flex flex-col gap-1.5 px-4 py-3 min-h-11 active:bg-tg-secondary-bg transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-tg-text leading-snug flex-1">{n.headline}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[n.category]}`}
                >
                  {n.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-tg-hint">
                <span className="font-medium text-tg-subtitle">{n.source}</span>
                <span>·</span>
                <span dir="ltr">{timeAgo(n.minutesAgo)}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
