import { SettingKey } from '@/providers';

export function getSetting<T>(env: Record<string, string>, key: SettingKey): T {
  const value: string = env[`VITE_${key}`];
  if (!value) {
    throw new Error(`Missing environment variable: VITE_${key}`);
  }

  return value as T;
}
