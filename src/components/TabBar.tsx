const TABS = [
  { id: 'dashboard', label: 'בית', icon: '🏠' },
  { id: 'expenses', label: 'הוצאות', icon: '₪' },
  { id: 'reminders', label: 'תזכורות', icon: '🔔' },
  { id: 'weather', label: 'מזג אוויר', icon: '🌤️' },
  { id: 'news', label: 'חדשות', icon: '📰' },
  { id: 'cron', label: 'תזמון', icon: '⏰' },
  { id: 'settings', label: 'הגדרות', icon: '⚙️' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-tg-section-bg border-t border-tg-secondary-bg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center flex-1 min-w-[56px]
                min-h-11 py-1 px-1 transition-colors
                ${isActive ? 'text-tg-button' : 'text-tg-hint'}
              `}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
