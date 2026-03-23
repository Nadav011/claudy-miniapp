interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  status?: 'ok' | 'warn' | 'error';
}

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warn: 'bg-yellow-500',
  error: 'bg-red-500',
} as const;

export function StatusCard({ title, value, subtitle, icon, status }: StatusCardProps) {
  return (
    <div className="rounded-xl bg-tg-section-bg p-4 flex items-start gap-3">
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-tg-hint">{title}</h3>
          {status && (
            <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
          )}
        </div>
        <p className="text-xl font-semibold mt-0.5 truncate" dir="ltr">
          {value}
        </p>
        {subtitle && <p className="text-xs text-tg-subtitle mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
