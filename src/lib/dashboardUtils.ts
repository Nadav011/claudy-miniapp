/** Returns formatted Hebrew uptime string */
export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d} ימים, ${h % 24} שעות`;
  }
  return `${h} שעות, ${m} דקות`;
}

/** Returns "X.X / Y.Y GB" memory string */
export function formatMemory(used: number, total: number): string {
  const toGb = (b: number) => (b / (1024 * 1024 * 1024)).toFixed(1);
  return `${toGb(used)} / ${toGb(total)} GB`;
}

/** Returns 0-100 load percentage from 1m load average (×10 convention) */
export function loadPct(load1m: number): number {
  return Math.min(load1m * 10, 100);
}

/** Maps load percentage to a TanStack-query-style status token */
export function cpuStatus(pct: number): 'ok' | 'warn' | 'error' {
  if (pct < 50) return 'ok';
  if (pct < 80) return 'warn';
  return 'error';
}

/** Hebrew label for CPU status */
export function cpuStatusLabel(pct: number): string {
  if (pct < 50) return 'תקין';
  if (pct < 80) return 'גבוה';
  return 'קריטי';
}

/** Fires Telegram haptic, silently no-ops outside Telegram */
export function haptic(style: 'light' | 'medium' = 'light') {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
}
