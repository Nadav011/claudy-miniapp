import type { ReactNode } from 'react';
import { useState } from 'react';
import { TabBar, type TabId } from '@/components/TabBar';
import { CronJobs } from '@/pages/CronJobs';
import { Dashboard } from '@/pages/Dashboard';
import { Expenses } from '@/pages/Expenses';
import { News } from '@/pages/News';
import { Reminders } from '@/pages/Reminders';
import { Settings } from '@/pages/Settings';
import { Weather } from '@/pages/Weather';

const PAGES: Record<TabId, () => ReactNode> = {
  dashboard: Dashboard,
  expenses: Expenses,
  reminders: Reminders,
  weather: Weather,
  news: News,
  cron: CronJobs,
  settings: Settings,
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const Page = PAGES[activeTab];

  return (
    <div className="min-h-dvh bg-tg-bg text-tg-text">
      <main key={activeTab} className="pb-4 animate-page">
        <Page />
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
