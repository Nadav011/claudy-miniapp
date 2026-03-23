import { useState } from 'react';

type Priority = 'high' | 'medium' | 'low';

interface Reminder {
  id: number;
  title: string;
  dueDate: string; // ISO datetime
  done: boolean;
  priority: Priority;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'דחוף',
  medium: 'בינוני',
  low: 'נמוך',
};
const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const INITIAL: Reminder[] = [
  {
    id: 1,
    title: 'לקנות חלב',
    dueDate: '2026-03-24T09:00',
    done: false,
    priority: 'low',
  },
  {
    id: 2,
    title: 'פגישה עם לקוח',
    dueDate: '2026-03-24T14:30',
    done: false,
    priority: 'high',
  },
  {
    id: 3,
    title: 'לשלם חשבון חשמל',
    dueDate: '2026-03-25T12:00',
    done: false,
    priority: 'medium',
  },
  {
    id: 4,
    title: 'לקנות מתנה ליום הולדת',
    dueDate: '2026-03-26T18:00',
    done: true,
    priority: 'medium',
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Reminders() {
  const [items, setItems] = useState<Reminder[]>(INITIAL);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const toggle = (id: number) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  const add = () => {
    if (!title.trim() || !due) return;
    setItems((prev) =>
      [
        ...prev,
        {
          id: Date.now(),
          title: title.trim(),
          dueDate: due,
          done: false,
          priority,
        },
      ].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    );
    setTitle('');
    setDue('');
  };

  const active = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <h1 className="text-xl font-bold">תזכורות</h1>

      {/* Quick-add form */}
      <div className="rounded-xl bg-tg-section-bg p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="כותרת תזכורת..."
          className="w-full rounded-lg bg-tg-secondary-bg px-3 py-2 text-tg-text placeholder:text-tg-hint min-h-11 outline-none text-sm"
        />
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="flex-1 rounded-lg bg-tg-secondary-bg px-3 py-2 text-tg-text min-h-11 outline-none text-sm"
            dir="ltr"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg bg-tg-secondary-bg px-3 py-2 text-tg-text min-h-11 outline-none text-sm"
          >
            <option value="high">דחוף</option>
            <option value="medium">בינוני</option>
            <option value="low">נמוך</option>
          </select>
        </div>
        <button
          type="button"
          onClick={add}
          className="w-full rounded-lg bg-tg-button text-tg-button-text min-h-11 font-medium text-sm"
        >
          + הוסף תזכורת
        </button>
      </div>

      {/* List */}
      <div className="rounded-xl bg-tg-section-bg divide-y divide-tg-secondary-bg">
        {active.length === 0 ? (
          <p className="py-8 text-center text-tg-hint text-sm">אין תזכורות פעילות</p>
        ) : (
          active.map((r) => (
            <div key={r.id} className="flex items-start gap-3 px-4 py-3 min-h-11">
              <input
                type="checkbox"
                checked={r.done}
                onChange={() => toggle(r.id)}
                className="mt-1 w-5 h-5 accent-tg-button shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${r.done ? 'line-through text-tg-hint' : 'text-tg-text'}`}
                >
                  {r.title}
                </p>
                <p className="text-xs text-tg-hint mt-0.5" dir="ltr">
                  {fmtDate(r.dueDate)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLOR[r.priority]}`}
              >
                {PRIORITY_LABEL[r.priority]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
