import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import {
  type CronJob,
  cronResponseSchema,
  type Health,
  healthSchema,
  type Metrics,
  metricsSchema,
  type Session,
  type Skill,
  type SystemInfo,
  sessionsResponseSchema,
  skillSchema,
  systemInfoSchema,
  type Task,
  taskSchema,
} from './schemas';

export function useHealth() {
  return useQuery<Health>({
    queryKey: ['health'],
    queryFn: async () => {
      const data = await apiClient<unknown>('/health');
      return healthSchema.parse(data);
    },
    refetchInterval: 15_000,
  });
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const data = await apiClient<unknown[]>('/skills');
      return data.map((s) => skillSchema.parse(s));
    },
    staleTime: 60_000,
  });
}

export function useCronJobs() {
  return useQuery<CronJob[]>({
    queryKey: ['cron'],
    queryFn: async () => {
      const data = await apiClient<unknown>('/cron');
      const parsed = cronResponseSchema.parse(data);
      return parsed.jobs;
    },
    refetchInterval: 30_000,
  });
}

export function useSystemInfo() {
  return useQuery<SystemInfo>({
    queryKey: ['system'],
    queryFn: async () => {
      const data = await apiClient<unknown>('/ops/system');
      return systemInfoSchema.parse(data);
    },
    staleTime: 30_000,
  });
}

export function useMetrics() {
  return useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: async () => {
      const data = await apiClient<unknown>('/metrics');
      return metricsSchema.parse(data);
    },
    refetchInterval: 15_000,
  });
}

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const data = await apiClient<unknown>('/ops/sessions');
      const parsed = sessionsResponseSchema.parse(data);
      return parsed.sessions;
    },
    refetchInterval: 30_000,
  });
}

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const data = await apiClient<unknown[]>('/tasks');
      return data.map((t) => taskSchema.parse(t));
    },
    staleTime: 10_000,
  });
}

export function useToggleCron() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await apiClient(`/cron/${id}`, { method: 'PATCH', body: { enabled } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cron'] }),
  });
}

export function useRunCronNow() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient(`/cron/${id}/run`, { method: 'POST' });
    },
  });
}
