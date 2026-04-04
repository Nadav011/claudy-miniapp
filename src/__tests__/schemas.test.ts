import { describe, expect, it } from 'vitest';
import { cronResponseSchema, healthSchema, systemInfoSchema } from '@/api/schemas';

describe('API schemas', () => {
  it('parses health response', () => {
    const data = { status: 'ok', uptime: 1234.5 };
    const result = healthSchema.parse(data);
    expect(result.status).toBe('ok');
    expect(result.uptime).toBe(1234.5);
  });

  it('parses system info', () => {
    const data = {
      hostname: 'MSI',
      platform: 'linux',
      arch: 'x64',
      cpus: 16,
      loadAvg: { '1m': 19.3, '5m': 21.5, '15m': 21.3 },
      memory: {
        total: 67111018496,
        free: 35897249792,
        used: 31213768704,
        usePct: '46.5',
      },
      disk: { total: '460G', used: '342G', available: '95G', usePct: '79%' },
      nodeVersion: 'v24.14.0',
    };
    const result = systemInfoSchema.parse(data);
    expect(result.hostname).toBe('MSI');
    expect(result.cpus).toBe(16);
  });

  it('parses cron response with schedule object', () => {
    const data = {
      jobs: [
        {
          id: 'morning-briefing',
          name: 'בריפינג בוקר',
          enabled: true,
          schedule: {
            kind: 'cron',
            timezone: 'Asia/Jerusalem',
            expr: '0 8 * * *',
          },
        },
      ],
    };
    const result = cronResponseSchema.parse(data);
    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].schedule?.expr).toBe('0 8 * * *');
  });
});
