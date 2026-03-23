import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import { apiClient } from '@/api/client';
import { useCronJobs } from '@/api/hooks';
import type { CronJob } from '@/api/schemas';

const newJobSchema = z.object({
  name: z.string().min(1, 'שם נדרש'),
  schedule: z.string().min(1, 'לוח זמנים נדרש'),
  message: z.string().min(1, 'הודעה נדרשת'),
});

function formatNextRun(ms: number | undefined): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('he-IL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function JobCard({ job }: { job: CronJob }) {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: () =>
      apiClient(`/cron/${job.id}`, {
        method: 'PATCH',
        body: { enabled: !job.enabled },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cron'] }),
  });
  const runNow = useMutation({
    mutationFn: () => apiClient(`/cron/${job.id}/run`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cron'] }),
  });

  return (
    <div className="flex items-start gap-3 py-3 border-b border-tg-secondary-bg last:border-b-0">
      <div
        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${job.enabled ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{job.name}</p>
        {job.schedule?.expr && (
          <p className="text-xs text-tg-hint mt-0.5" dir="ltr">
            {job.schedule.expr}
          </p>
        )}
        <p className="text-xs text-tg-subtitle mt-0.5">
          הרצה הבאה: <span dir="ltr">{formatNextRun(job.nextRunAtMs)}</span>
        </p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => toggle.mutate()}
          disabled={toggle.isPending}
          className={`text-xs px-3 min-h-11 rounded-lg font-medium transition-opacity disabled:opacity-50 ${
            job.enabled ? 'bg-tg-secondary-bg text-tg-hint' : 'bg-tg-button text-tg-button-text'
          }`}
        >
          {job.enabled ? 'השבת' : 'הפעל'}
        </button>
        <button
          type="button"
          onClick={() => runNow.mutate()}
          disabled={runNow.isPending}
          className="text-xs px-3 min-h-11 rounded-lg bg-tg-secondary-bg text-tg-accent font-medium transition-opacity disabled:opacity-50"
        >
          {runNow.isPending ? '...' : 'הרץ'}
        </button>
      </div>
    </div>
  );
}

function CreateJobForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [fields, setFields] = useState({
    name: '',
    schedule: '0 8 * * *',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: (body: typeof fields) => apiClient('/cron', { method: 'POST', body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cron'] });
      onClose();
    },
    onError: (e) => setError(e instanceof Error ? e.message : 'שגיאה'),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = newJobSchema.safeParse(fields);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    create.mutate(fields);
  }

  const inputCls =
    'w-full rounded-lg bg-tg-secondary-bg px-3 py-2 text-sm text-tg-text min-h-11 outline-none focus:ring-1 focus:ring-tg-button';

  return (
    <form onSubmit={submit} className="rounded-xl bg-tg-section-bg p-4 space-y-3">
      <h2 className="text-base font-semibold">משימה חדשה</h2>
      <input
        className={inputCls}
        placeholder="שם המשימה"
        value={fields.name}
        onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="לוח זמנים (cron)"
        dir="ltr"
        value={fields.schedule}
        onChange={(e) => setFields((f) => ({ ...f, schedule: e.target.value }))}
      />
      <input
        className={inputCls}
        placeholder="הודעה לשליחה"
        value={fields.message}
        onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
      />
      {error && <p className="text-xs text-tg-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={create.isPending}
          className="flex-1 min-h-11 rounded-lg bg-tg-button text-tg-button-text text-sm font-medium disabled:opacity-50"
        >
          {create.isPending ? 'יוצר...' : 'צור'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 min-h-11 rounded-lg bg-tg-secondary-bg text-tg-hint text-sm"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}

export function CronJobs() {
  const { data: jobs, isLoading, isError, refetch } = useCronJobs();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`sk-${i}`} className="h-20 bg-tg-secondary-bg rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-tg-destructive">שגיאה בטעינת המשימות</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 px-6 min-h-11 rounded-lg bg-tg-button text-tg-button-text text-sm"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">משימות מתוזמנות</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="min-h-11 px-4 rounded-lg bg-tg-button text-tg-button-text text-sm font-medium"
        >
          {showForm ? 'סגור' : '+ חדש'}
        </button>
      </div>

      {showForm && <CreateJobForm onClose={() => setShowForm(false)} />}

      <div className="rounded-xl bg-tg-section-bg px-4">
        {!jobs?.length ? (
          <p className="py-6 text-center text-tg-hint text-sm">אין משימות מוגדרות</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
