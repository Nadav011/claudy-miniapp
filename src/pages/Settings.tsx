import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useSystemInfo } from '@/api/hooks';

const MODELS = [
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'kimi-k2p5', label: 'Kimi K2P5' },
  { id: 'minimax-m2-7', label: 'MiniMax M2.7' },
  { id: 'gpt-5-4', label: 'GPT-5.4' },
] as const;

const THINKING_LEVELS = ['off', 'low', 'medium', 'high', 'xhigh'] as const;
type ThinkingLevel = (typeof THINKING_LEVELS)[number];

const THINKING_LABELS: Record<ThinkingLevel, string> = {
  off: 'כבוי',
  low: 'נמוך',
  medium: 'בינוני',
  high: 'גבוה',
  xhigh: 'מקסימום',
};

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function Settings() {
  const qc = useQueryClient();
  const system = useSystemInfo();
  const [model, setModel] = useState<string>('claude-opus-4-6');
  const [thinking, setThinking] = useState<number>(3); // index into THINKING_LEVELS
  const [confirmRestart, setConfirmRestart] = useState(false);

  const compact = useMutation({
    mutationFn: () => apiClient('/ops/compact', { method: 'POST' }),
  });

  const newSession = useMutation({
    mutationFn: () => apiClient('/ops/session/new', { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries(),
  });

  const restart = useMutation({
    mutationFn: () => apiClient('/ops/gateway/restart', { method: 'POST' }),
    onSuccess: () => {
      setConfirmRestart(false);
      qc.invalidateQueries();
    },
  });

  const sys = system.data;

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <h1 className="text-xl font-bold">הגדרות</h1>

      {/* Model selector */}
      <section className="rounded-xl bg-tg-section-bg">
        <p className="px-4 pt-3 pb-1 text-xs font-medium text-tg-section-header uppercase tracking-wide">
          מודל פעיל
        </p>
        <div className="px-4 pb-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full min-h-11 rounded-lg bg-tg-secondary-bg text-tg-text px-3 text-sm border-0 outline-none appearance-none"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Thinking level */}
      <section className="rounded-xl bg-tg-section-bg px-4 py-3 space-y-2">
        <p className="text-xs font-medium text-tg-section-header uppercase tracking-wide">
          עומק חשיבה
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={THINKING_LEVELS.length - 1}
            value={thinking}
            onChange={(e) => setThinking(Number(e.target.value))}
            className="flex-1 accent-tg-button"
          />
          <span className="text-sm font-medium text-tg-accent min-w-[4rem] text-start">
            {THINKING_LABELS[THINKING_LEVELS[thinking]]}
          </span>
        </div>
        <div className="flex justify-between">
          {THINKING_LEVELS.map((lvl, i) => (
            <span
              key={lvl}
              className={`text-[10px] ${i === thinking ? 'text-tg-accent font-semibold' : 'text-tg-hint'}`}
            >
              {THINKING_LABELS[lvl]}
            </span>
          ))}
        </div>
      </section>

      {/* Heartbeat */}
      <section className="rounded-xl bg-tg-section-bg px-4 py-3">
        <p className="text-xs font-medium text-tg-section-header uppercase tracking-wide mb-1">
          דופק
        </p>
        <p className="text-sm text-tg-text">
          כל{' '}
          <span className="font-semibold text-tg-accent" dir="ltr">
            15m
          </span>
        </p>
      </section>

      {/* Session controls */}
      <section className="rounded-xl bg-tg-section-bg px-4 py-3 space-y-2">
        <p className="text-xs font-medium text-tg-section-header uppercase tracking-wide mb-2">
          פקודות סשן
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={compact.isPending}
            onClick={() => compact.mutate()}
            className="min-h-11 rounded-lg bg-tg-button text-tg-button-text text-sm font-medium disabled:opacity-50"
          >
            {compact.isPending ? '...' : 'דחוס'}
          </button>
          <button
            type="button"
            disabled={newSession.isPending}
            onClick={() => newSession.mutate()}
            className="min-h-11 rounded-lg bg-tg-secondary-bg text-tg-text text-sm font-medium disabled:opacity-50"
          >
            {newSession.isPending ? '...' : 'סשן חדש'}
          </button>
        </div>
        {!confirmRestart ? (
          <button
            type="button"
            onClick={() => setConfirmRestart(true)}
            className="w-full min-h-11 rounded-lg text-tg-destructive border border-tg-destructive text-sm font-medium"
          >
            הפעל מחדש Gateway
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={restart.isPending}
              onClick={() => restart.mutate()}
              className="flex-1 min-h-11 rounded-lg bg-tg-destructive text-white text-sm font-medium disabled:opacity-50"
            >
              {restart.isPending ? '...' : 'אישור'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmRestart(false)}
              className="flex-1 min-h-11 rounded-lg bg-tg-secondary-bg text-tg-text text-sm font-medium"
            >
              ביטול
            </button>
          </div>
        )}
      </section>

      {/* System info */}
      <section className="rounded-xl bg-tg-section-bg px-4 py-3 space-y-2">
        <p className="text-xs font-medium text-tg-section-header uppercase tracking-wide mb-1">
          מידע מערכת
        </p>
        {system.isLoading && <p className="text-sm text-tg-hint">טוען...</p>}
        {sys && (
          <dl className="space-y-1 text-sm">
            {(
              [
                ['שם מחשב', sys.hostname],
                ['פלטפורמה', `${sys.platform} / ${sys.arch}`],
                ['מעבדים', String(sys.cpus)],
                [
                  'עומס',
                  `${sys.loadAvg['1m'].toFixed(2)} / ${sys.loadAvg['5m'].toFixed(2)} / ${sys.loadAvg['15m'].toFixed(2)}`,
                ],
                ...(sys.memory
                  ? [
                      [
                        'זיכרון',
                        `${formatBytes(sys.memory.used)} / ${formatBytes(sys.memory.total)}`,
                      ] as const,
                    ]
                  : []),
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-0.5">
                <dt className="text-tg-hint">{label}</dt>
                <dd className="font-medium" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
}
