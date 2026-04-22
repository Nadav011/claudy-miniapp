import { useState } from "react";
import { useTasks } from "@/api/hooks";

const MONTHS = [
	"ינואר",
	"פברואר",
	"מרץ",
	"אפריל",
	"מאי",
	"יוני",
	"יולי",
	"אוגוסט",
	"ספטמבר",
	"אוקטובר",
	"נובמבר",
	"דצמבר",
] as const;

const CATEGORIES = [
	{ id: "food", label: "מזון", color: "bg-green-500" },
	{ id: "transport", label: "תחבורה", color: "bg-blue-500" },
	{ id: "fun", label: "בילויים", color: "bg-purple-500" },
	{ id: "shopping", label: "קניות", color: "bg-yellow-500" },
	{ id: "bills", label: "חשבונות", color: "bg-red-500" },
	{ id: "other", label: "אחר", color: "bg-gray-400" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface Expense {
	id: number;
	amount: number;
	category: CategoryId;
	desc: string;
	date: string;
}

const MOCK: Expense[] = [
	{ id: 1, amount: 240, category: "food", desc: "סופרמרקט", date: "23/03" },
	{ id: 2, amount: 180, category: "transport", desc: "דלק", date: "22/03" },
	{ id: 3, amount: 320, category: "fun", desc: "מסעדה", date: "21/03" },
	{ id: 4, amount: 85, category: "shopping", desc: "זאפה", date: "20/03" },
	{
		id: 5,
		amount: 890,
		category: "bills",
		desc: "חשמל + ארנונה",
		date: "19/03",
	},
	{ id: 6, amount: 55, category: "food", desc: "קפה", date: "19/03" },
	{ id: 7, amount: 210, category: "fun", desc: "קולנוע", date: "18/03" },
	{ id: 8, amount: 460, category: "shopping", desc: "בגדים", date: "17/03" },
	{
		id: 9,
		amount: 130,
		category: "transport",
		desc: "רכבת חודשי",
		date: "16/03",
	},
	{ id: 10, amount: 95, category: "other", desc: "שונות", date: "15/03" },
];

const BUDGET = 5000;
const NOW = new Date();

function taskToExpense(
	task: { id: string; title: string; description?: string; createdAt?: string },
	idx: number,
): Expense {
	const amount = Number(task.description?.match(/\d+/)?.[0] ?? 100 + idx * 10);
	const validCategories: CategoryId[] = [
		"food",
		"transport",
		"fun",
		"shopping",
		"bills",
		"other",
	];
	const category = (validCategories.find((c) => task.title.includes(c)) ??
		"other") as CategoryId;
	const date = task.createdAt
		? new Date(task.createdAt).toLocaleDateString("he-IL", {
				day: "2-digit",
				month: "2-digit",
			})
		: `${NOW.getDate()}/${NOW.getMonth() + 1}`;
	return { id: idx + 1, amount, category, desc: task.title, date };
}

export function Expenses() {
	const { data: tasks, isSuccess: tasksLoaded } = useTasks();
	const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState<CategoryId>("food");
	const [desc, setDesc] = useState("");

	const apiExpenses: Expense[] =
		tasksLoaded && tasks && tasks.length > 0
			? tasks
					.filter((t) => t.status === "expense" || t.status === "pending")
					.slice(0, 10)
					.map(taskToExpense)
			: [];

	const isMock = apiExpenses.length === 0;
	const baseExpenses = isMock ? MOCK : apiExpenses;
	const expenses = [...localExpenses, ...baseExpenses].slice(0, 10);

	const total = expenses.reduce((s, e) => s + e.amount, 0);
	const budgetPct = Math.min((total / BUDGET) * 100, 100);
	const byCategory = CATEGORIES.map((cat) => ({
		...cat,
		sum: expenses
			.filter((e) => e.category === cat.id)
			.reduce((s, e) => s + e.amount, 0),
	}));

	function addExpense() {
		const n = Number(amount);
		if (!n || n <= 0) return;
		setLocalExpenses((prev) =>
			[
				{
					id: Date.now(),
					amount: n,
					category,
					desc: desc.trim() || CATEGORIES.find((c) => c.id === category)!.label,
					date: `${NOW.getDate()}/${NOW.getMonth() + 1}`,
				},
				...prev,
			].slice(0, 5),
		);
		setAmount("");
		setDesc("");
	}

	return (
		<div className="p-4 space-y-4">
			<header>
				<div className="flex items-center gap-2">
					<p className="text-sm text-tg-hint">
						{MONTHS[NOW.getMonth()]} {NOW.getFullYear()}
					</p>
					{isMock && (
						<span className="text-[10px] bg-tg-section-bg text-tg-hint border border-tg-secondary-bg rounded-full px-2 py-0.5">
							נתונים לדוגמה
						</span>
					)}
				</div>
				<p className="text-4xl font-bold tracking-tight" dir="ltr">
					₪{total.toLocaleString()}
				</p>
				<p className="text-xs text-tg-hint mt-0.5">סה"כ הוצאות החודש</p>
			</header>

			{/* Budget bar */}
			<section className="rounded-xl bg-tg-section-bg p-3">
				<div className="flex justify-between text-xs text-tg-hint mb-1.5">
					<span>תקציב חודשי</span>
					<span dir="ltr">
						₪{total.toLocaleString()} / ₪{BUDGET.toLocaleString()}
					</span>
				</div>
				<div className="h-2 rounded-full bg-tg-secondary-bg overflow-hidden">
					<div
						className={`h-full rounded-full transition-all ${budgetPct >= 90 ? "bg-red-500" : budgetPct >= 70 ? "bg-yellow-500" : "bg-tg-button"}`}
						style={{ width: `${budgetPct}%` }}
					/>
				</div>
			</section>

			{/* Category breakdown */}
			<section>
				<h2 className="text-sm font-semibold text-tg-section-header mb-2">
					פירוט לפי קטגוריה
				</h2>
				<div className="rounded-xl bg-tg-section-bg divide-y divide-tg-secondary-bg">
					{byCategory
						.filter((c) => c.sum > 0)
						.map((cat) => (
							<div key={cat.id} className="flex items-center gap-3 px-4 py-2.5">
								<span
									className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}`}
								/>
								<span className="flex-1 text-sm">{cat.label}</span>
								<div className="w-20 h-1.5 rounded-full bg-tg-secondary-bg overflow-hidden">
									<div
										className={`h-full rounded-full ${cat.color}`}
										style={{ width: `${(cat.sum / total) * 100}%` }}
									/>
								</div>
								<span className="text-sm font-medium w-16 text-end" dir="ltr">
									₪{cat.sum.toLocaleString()}
								</span>
							</div>
						))}
				</div>
			</section>

			{/* Quick add */}
			<section className="rounded-xl bg-tg-section-bg p-4 space-y-3">
				<h2 className="text-sm font-semibold text-tg-section-header">
					הוסף הוצאה
				</h2>
				<div className="flex gap-2">
					<input
						type="number"
						inputMode="decimal"
						placeholder="סכום ₪"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="flex-1 rounded-lg bg-tg-secondary-bg px-3 min-h-11 text-sm text-end outline-none"
						dir="ltr"
					/>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value as CategoryId)}
						className="rounded-lg bg-tg-secondary-bg ps-2 pe-2 min-h-11 text-sm outline-none"
					>
						{CATEGORIES.map((c) => (
							<option key={c.id} value={c.id}>
								{c.label}
							</option>
						))}
					</select>
				</div>
				<input
					type="text"
					placeholder="תיאור (אופציונלי)"
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
					className="w-full rounded-lg bg-tg-secondary-bg px-3 min-h-11 text-sm text-end outline-none"
				/>
				<button
					type="button"
					onClick={addExpense}
					className="w-full min-h-11 rounded-xl bg-tg-button text-tg-button-text text-sm font-semibold active:opacity-80"
				>
					הוסף
				</button>
			</section>

			{/* Recent transactions */}
			<section>
				<h2 className="text-sm font-semibold text-tg-section-header mb-2">
					עסקאות אחרונות
				</h2>
				<div className="rounded-xl bg-tg-section-bg divide-y divide-tg-secondary-bg">
					{expenses.map((e) => {
						const cat = CATEGORIES.find((c) => c.id === e.category)!;
						return (
							<div key={e.id} className="flex items-center gap-3 px-4 py-3">
								<span
									className={`w-2 h-2 rounded-full shrink-0 ${cat.color}`}
								/>
								<div className="flex-1 min-w-0">
									<p className="text-sm truncate">{e.desc}</p>
									<p className="text-xs text-tg-hint">
										{cat.label} · {e.date}
									</p>
								</div>
								<span className="text-sm font-semibold shrink-0" dir="ltr">
									₪{e.amount.toLocaleString()}
								</span>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}
