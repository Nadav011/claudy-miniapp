import { useQueryClient } from '@tanstack/react-query';
import { useCronJobs, useHealth, useSkills, useSystemInfo } from '@/api/hooks';
import { CronJobRow } from '@/components/CronJobRow';
import { LastUpdated } from '@/components/LastUpdated';
import { PullToRefresh } from '@/components/PullToRefresh';
import { StatusCard } from '@/components/StatusCard';
import {
  cpuStatus,
  cpuStatusLabel,
  formatMemory,
  formatUptime,
  haptic,
  loadPct,
} from '@/lib/dashboardUtils';

export function Dashboard() {
  const qc = useQueryClient();
  const health = useHealth();
  const skills = useSkills();
  const cron = useCronJobs();
  const system = useSystemInfo();

  const isLoading = health.isLoading || skills.isLoading;
  const isError = health.isError && system.isError;

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-tg-destructive text-lg">שגיאת חיבור</p>
        <p className="text-tg-hint text-sm mt-2">לא ניתן להתחבר לשרת</p>
        <button
          type="button"
          onClick={() => {
            haptic();
            void health.refetch();
          }}
          className="mt-4 px-6 py-2 rounded-lg bg-tg-button text-tg-button-text min-h-11"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  const healthStatus = health.data?.status === 'ok' ? 'ok' : 'error';
  const enabledCrons = cron.data?.filter((j) => j.enabled) ?? [];
  const dataAge = health.dataUpdatedAt ?? Date.now();

  const load = system.data ? loadPct(system.data.loadAvg['1m']) : 0;
  const cpuLabel = system.data ? `${load.toFixed(0)}%` : '—';
  const cpuSub = system.data ? `${system.data.cpus} ליבות · ${cpuStatusLabel(load)}` : undefined;

  return (
    <PullToRefresh onRefresh={() => void qc.invalidateQueries()}>
      <div className="p-4 space-y-4" dir="rtl">
        <header className="mb-2 animate-card">
          <h1 className="text-xl font-bold">לוח בקרה</h1>
          <p className="text-sm text-tg-hint">קלודי — OpenClaw</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <StatusCard
            title="סטטוס"
            value={healthStatus === 'ok' ? 'פעיל' : 'לא זמין'}
            icon="🟢"
            status={healthStatus}
            className="[animation-delay:0ms]"
          />
          <StatusCard
            title="זמן פעילות"
            value={health.data ? formatUptime(health.data.uptime) : '—'}
            icon="⏱️"
            className="[animation-delay:60ms]"
          />
          <StatusCard
            title="מיומנויות"
            value={skills.data?.length ?? '—'}
            icon="🧩"
            className="[animation-delay:120ms]"
          />
          <StatusCard
            title="מעבד"
            value={cpuLabel}
            subtitle={cpuSub}
            icon="🖥️"
            status={system.data ? cpuStatus(load) : undefined}
            className="[animation-delay:180ms]"
          />
        </div>

        {system.data?.memory && (
          <StatusCard
            title="זיכרון"
            value={formatMemory(system.data.memory.used, system.data.memory.total)}
            icon="💾"
            subtitle={system.data.memory.usePct ? `${system.data.memory.usePct} בשימוש` : undefined}
            className="[animation-delay:220ms]"
          />
        )}

        <section className="animate-card [animation-delay:260ms]">
          <h2 className="text-base font-semibold mb-2">משימות מתוזמנות ({enabledCrons.length})</h2>
          <div className="rounded-xl bg-tg-section-bg px-4">
            {enabledCrons.length === 0 ? (
              <p className="py-4 text-center text-tg-hint text-sm">אין משימות פעילות</p>
            ) : (
              enabledCrons.map((job) => <CronJobRow key={job.id} job={job} />)
            )}
          </div>
        </section>

        <LastUpdated timestamp={dataAge} />
      </div>
    </PullToRefresh>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4" dir="rtl">
      <div className="h-7 w-32 animate-shimmer rounded" />
      <div className="h-4 w-48 animate-shimmer rounded" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <div key={i} className="h-24 animate-shimmer rounded-xl" />
        ))}
      </div>
      <div className="h-16 animate-shimmer rounded-xl" />
      <div className="h-32 animate-shimmer rounded-xl" />
    </div>
  );
}
