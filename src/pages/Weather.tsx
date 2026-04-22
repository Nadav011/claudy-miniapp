import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { useSkills } from "@/api/hooks";

const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

interface DayForecast {
	date: Date;
	icon: string;
	tempHigh: number;
	tempLow: number;
	description: string;
}

interface WeatherData {
	city: string;
	temp: number;
	feelsLike: number;
	description: string;
	icon: string;
	windSpeed: number;
	humidity: number;
	condition: "sunny" | "cloudy" | "rain";
	updatedAt: Date;
	forecast: DayForecast[];
}

const MOCK: WeatherData = {
	city: "תל אביב",
	temp: 28,
	feelsLike: 31,
	description: "שמיים בהירים",
	icon: "☀️",
	windSpeed: 14,
	humidity: 62,
	condition: "sunny",
	updatedAt: new Date(),
	forecast: [
		{
			date: new Date(Date.now() + 86400000 * 1),
			icon: "⛅",
			tempHigh: 27,
			tempLow: 19,
			description: "מעונן חלקית",
		},
		{
			date: new Date(Date.now() + 86400000 * 2),
			icon: "🌧️",
			tempHigh: 22,
			tempLow: 16,
			description: "גשם",
		},
		{
			date: new Date(Date.now() + 86400000 * 3),
			icon: "🌦️",
			tempHigh: 24,
			tempLow: 17,
			description: "גשם קל",
		},
		{
			date: new Date(Date.now() + 86400000 * 4),
			icon: "☀️",
			tempHigh: 29,
			tempLow: 20,
			description: "שמשי",
		},
		{
			date: new Date(Date.now() + 86400000 * 5),
			icon: "☀️",
			tempHigh: 31,
			tempLow: 21,
			description: "שמשי וחם",
		},
	],
};

const GRADIENTS: Record<WeatherData["condition"], string> = {
	sunny: "from-amber-400 via-sky-400 to-sky-600",
	cloudy: "from-slate-400 via-slate-500 to-slate-600",
	rain: "from-slate-500 via-blue-700 to-blue-900",
};

function formatTime(d: Date): string {
	return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function dayName(d: Date): string {
	return DAYS_HE[d.getDay()];
}

export function Weather() {
	const qc = useQueryClient();
	const { data: skills } = useSkills();

	const hasWeatherSkill =
		skills?.some(
			(s) =>
				s.name.toLowerCase().includes("weather") ||
				s.name.toLowerCase().includes("מזג"),
		) ?? false;

	const triggerWeather = useMutation({
		mutationFn: async () => {
			await apiClient("/ops/webhook", {
				method: "POST",
				body: { skill: "weather", action: "refresh" },
			});
		},
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["skills"] });
		},
	});

	const isMock = true; // weather skill returns live data; until integrated, always mock
	const w = MOCK;
	const grad = GRADIENTS[w.condition];

	return (
		<div className="min-h-screen bg-tg-bg text-tg-text" dir="rtl">
			{/* Hero card */}
			<div className={`bg-gradient-to-b ${grad} text-white px-5 pt-8 pb-6`}>
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-2">
							<p className="text-sm font-medium opacity-80">📍 {w.city}</p>
							{isMock && (
								<span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 font-medium">
									נתונים לדוגמה
								</span>
							)}
						</div>
						<div className="flex items-end gap-2 mt-1">
							<span className="text-7xl font-thin leading-none" dir="ltr">
								{w.temp}°
							</span>
						</div>
						<p className="mt-1 text-base opacity-90">{w.description}</p>
					</div>
					<div className="flex flex-col items-end gap-2">
						<span className="text-6xl mt-1">{w.icon}</span>
						{hasWeatherSkill && (
							<button
								type="button"
								onClick={() => triggerWeather.mutate()}
								disabled={triggerWeather.isPending}
								className="text-xs bg-white/20 hover:bg-white/30 active:bg-white/10 rounded-full px-3 py-1.5 font-medium min-h-11 min-w-11 flex items-center gap-1 disabled:opacity-50 transition-colors"
							>
								{triggerWeather.isPending ? "⏳" : "🔄"} רענן
							</button>
						)}
					</div>
				</div>

				{/* Stats row */}
				<div className="flex gap-4 mt-5 text-sm">
					<div className="flex flex-col items-center">
						<span className="opacity-70 text-xs">תחושה</span>
						<span dir="ltr" className="font-semibold">
							{w.feelsLike}°
						</span>
					</div>
					<div className="w-px bg-white/30" />
					<div className="flex flex-col items-center">
						<span className="opacity-70 text-xs">לחות</span>
						<span dir="ltr" className="font-semibold">
							{w.humidity}%
						</span>
					</div>
					<div className="w-px bg-white/30" />
					<div className="flex flex-col items-center">
						<span className="opacity-70 text-xs">רוח</span>
						<span dir="ltr" className="font-semibold">
							{w.windSpeed} קמ"ש
						</span>
					</div>
				</div>

				<p className="mt-4 text-xs opacity-60">
					עדכון אחרון: <span dir="ltr">{formatTime(w.updatedAt)}</span>
				</p>
			</div>

			{/* 5-day forecast */}
			<section className="px-4 pt-5">
				<h2 className="text-sm font-semibold text-tg-section-header mb-3">
					תחזית 5 ימים
				</h2>
				<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
					{w.forecast.map((day, i) => (
						<div
							key={`day-${i}`}
							className="flex-shrink-0 flex flex-col items-center gap-1 bg-tg-section-bg rounded-2xl px-4 py-3 min-w-[72px]"
						>
							<span className="text-xs font-medium text-tg-hint">
								{dayName(day.date)}
							</span>
							<span className="text-2xl">{day.icon}</span>
							<span className="text-xs text-tg-text" dir="ltr">
								{day.tempHigh}°
							</span>
							<span className="text-xs text-tg-subtitle" dir="ltr">
								{day.tempLow}°
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Detail cards */}
			<section className="px-4 pt-4 pb-6 grid grid-cols-2 gap-3">
				{[
					{ label: "מהירות רוח", value: `${w.windSpeed} קמ"ש`, icon: "💨" },
					{ label: "לחות אוויר", value: `${w.humidity}%`, icon: "💧" },
					{ label: "תחושה בגוף", value: `${w.feelsLike}°`, icon: "🌡️" },
					{ label: "תנאי מזג אוויר", value: w.description, icon: w.icon },
				].map(({ label, value, icon }) => (
					<div key={label} className="bg-tg-section-bg rounded-2xl p-4">
						<div className="flex items-center gap-2 mb-1">
							<span>{icon}</span>
							<span className="text-xs text-tg-hint">{label}</span>
						</div>
						<p className="font-semibold text-base" dir="ltr">
							{value}
						</p>
					</div>
				))}
			</section>
		</div>
	);
}
