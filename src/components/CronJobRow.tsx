import type { CronJob } from '@/api/schemas';

function formatTime(ms: number | undefined): string {
  if (!ms) return '—';
  const date = new Date(ms);
  return date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(ms: number | undefined): string {
  if (!ms) return '';
  const date = new Date(ms);
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

interface CronJobRowProps {
  job: CronJob;
}

export function CronJobRow({ job }: CronJobRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-tg-secondary-bg last:border-b-0">
      <div
        className={`w-2.5 h-2.5 rounded-full shrink-0 ${job.enabled ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{job.name}</p>
        {job.schedule?.expr && (
          <p className="text-xs text-tg-hint mt-0.5" dir="ltr">
            {job.schedule.expr}
          </p>
        )}
      </div>
      <div className="text-end shrink-0">
        {job.nextRunAtMs && (
          <p className="text-xs text-tg-hint">
            <span dir="ltr">{formatTime(job.nextRunAtMs)}</span>
            <span className="block text-[10px]">{formatDate(job.nextRunAtMs)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
