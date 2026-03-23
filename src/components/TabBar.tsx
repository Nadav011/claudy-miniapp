const TABS = [
	{ id: "dashboard", label: "בית", icon: "🏠" },
	{ id: "expenses", label: "הוצאות", icon: "₪" },
	{ id: "reminders", label: "תזכורות", icon: "🔔" },
	{ id: "weather", label: "מזג אוויר", icon: "🌤️" },
	{ id: "news", label: "חדשות", icon: "📰" },
	{ id: "cron", label: "תזמון", icon: "⏰" },
	{ id: "settings", label: "הגדרות", icon: "⚙️" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface TabBarProps {
	activeTab: TabId;
	onTabChange: (tab: TabId) => void;
}

function haptic() {
	window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-50 bg-tg-section-bg/80 backdrop-blur-lg border-t border-tg-secondary-bg/50"
			style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
		>
			<div className="flex overflow-x-auto scrollbar-none">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => {
								haptic();
								onTabChange(tab.id);
							}}
							className={`
                flex flex-col items-center justify-center flex-1 min-w-[56px]
                min-h-11 py-1.5 px-1 transition-all duration-200
                ${isActive ? "text-tg-accent scale-105" : "text-tg-hint active:scale-95"}
              `}
						>
							<span
								className={`text-lg leading-none transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
							>
								{tab.icon}
							</span>
							<span
								className={`text-[10px] mt-0.5 truncate max-w-[56px] transition-all duration-200 ${isActive ? "font-semibold" : ""}`}
							>
								{tab.label}
							</span>
							{isActive && (
								<span className="absolute top-0 inset-x-0 h-0.5 bg-tg-accent rounded-full mx-auto w-8" />
							)}
						</button>
					);
				})}
			</div>
		</nav>
	);
}
