import { useEffect, useState } from 'react';

interface LastUpdatedProps {
  timestamp: number; // ms since epoch
}

function formatAge(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `לפני ${sec} שניות`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `לפני ${min} דקות`;
  return `לפני ${Math.floor(min / 60)} שעות`;
}

export function LastUpdated({ timestamp }: LastUpdatedProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      className="text-center text-xs text-tg-hint pb-2 animate-card"
      style={{ animationDelay: '300ms' }}
    >
      עודכן {formatAge(now - timestamp)}
    </p>
  );
}
