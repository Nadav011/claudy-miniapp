import { backButton, init, miniApp, themeParams } from '@telegram-apps/sdk';

let initialized = false;

export function initTelegramApp(): void {
  if (initialized) return;

  try {
    init();
    themeParams.mountSync();
    miniApp.mountSync();
    backButton.mount();

    miniApp.ready();
    themeParams.bindCssVars();
    miniApp.bindCssVars();

    initialized = true;
  } catch {
    // Outside Telegram — dev mode fallback (SDK unavailable)
    if (import.meta.env.DEV) {
      initialized = true;
      return;
    }
    throw new Error('Telegram Mini App SDK initialization failed');
  }
}

export function isTelegramEnv(): boolean {
  return typeof window !== 'undefined' && window.Telegram?.WebApp != null;
}

export function getRawInitData(): string {
  return window.Telegram?.WebApp?.initData ?? '';
}
