interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  status?: 'ok' | 'warn' | 'error';
  /** Extra class on the root div (e.g. animation-delay) */
  className?: string;
}

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warn: 'bg-yellow-500',
  error: 'bg-red-500',
} as const;

export function StatusCard({
  title,
  value,
  subtitle,
  icon,
  status,
  className = '',
}: StatusCardProps) {
  return (
    <div
      className={`rounded-2xl bg-tg-section-bg/70 backdrop-blur-sm border border-tg-secondary-bg/30 p-4 flex items-start gap-3 animate-card hover:bg-tg-section-bg/90 transition-colors duration-200 ${className}`}
    >
      {icon && <span className="text-2xl leading-none">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-tg-hint">{title}</h3>
          {status && (
            <span
              className={`inline-block w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status]} ${status === 'ok' ? 'animate-status-pulse' : ''}`}
            />
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
