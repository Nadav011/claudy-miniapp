import { useCronJobs, useHealth, useSkills, useSystemInfo } from '@/api/hooks';
import { CronJobRow } from '@/components/CronJobRow';
import { StatusCard } from '@/components/StatusCard';

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `${d} ימים, ${h % 24} שעות`;
  }
  return `${h} שעות, ${m} דקות`;
}

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
}

export function Dashboard() {
  const health = useHealth();
  const skills = useSkills();
  const cron = useCronJobs();
  const system = useSystemInfo();

  const isLoading = health.isLoading || skills.isLoading;
  const isError = health.isError && system.isError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-tg-destructive text-lg">שגיאת חיבור</p>
        <p className="text-tg-hint text-sm mt-2">לא ניתן להתחבר לשרת</p>
        <button
          type="button"
          onClick={() => health.refetch()}
          className="mt-4 px-6 py-2 rounded-lg bg-tg-button text-tg-button-text min-h-11"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  const healthStatus = health.data?.status === 'ok' ? 'ok' : 'error';
  const enabledCrons = cron.data?.filter((j) => j.enabled) ?? [];

  return (
    <div className="p-4 space-y-4">
      <header className="mb-2">
        <h1 className="text-xl font-bold">לוח בקרה</h1>
        <p className="text-sm text-tg-hint">קלודי — OpenClaw</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatusCard
          title="סטטוס"
          value={healthStatus === 'ok' ? 'פעיל' : 'לא זמין'}
          icon="🟢"
          status={healthStatus as 'ok' | 'error'}
        />
        <StatusCard
          title="זמן פעילות"
          value={health.data ? formatUptime(health.data.uptime) : '—'}
          icon="⏱️"
        />
        <StatusCard title="מיומנויות" value={skills.data?.length ?? 0} icon="🧩" />
        <StatusCard
          title="מעבדים"
          value={system.data?.cpus ?? '—'}
          subtitle={system.data ? `עומס: ${system.data.loadAvg['1m'].toFixed(1)}` : undefined}
          icon="🖥️"
        />
      </div>

      {system.data?.memory && (
        <StatusCard
          title="זיכרון"
          value={`${formatBytes(system.data.memory.used)} / ${formatBytes(system.data.memory.total)}`}
          icon="💾"
        />
      )}

      <section>
        <h2 className="text-base font-semibold mb-2">משימות מתוזמנות ({enabledCrons.length})</h2>
        <div className="rounded-xl bg-tg-section-bg px-4">
          {enabledCrons.length === 0 ? (
            <p className="py-4 text-center text-tg-hint text-sm">אין משימות פעילות</p>
          ) : (
            enabledCrons.map((job) => <CronJobRow key={job.id} job={job} />)
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-7 w-32 bg-tg-secondary-bg rounded" />
      <div className="h-4 w-48 bg-tg-secondary-bg rounded" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`skel-${i}`} className="h-24 bg-tg-secondary-bg rounded-xl" />
        ))}
      </div>
      <div className="h-32 bg-tg-secondary-bg rounded-xl" />
    </div>
  );
}
