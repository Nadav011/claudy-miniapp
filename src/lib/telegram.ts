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
    // SDK init failed — graceful fallback (works outside Telegram iframe too)
    initialized = true;
  }
}

export function isTelegramEnv(): boolean {
  return typeof window !== 'undefined' && window.Telegram?.WebApp != null;
}

export function getRawInitData(): string {
  return window.Telegram?.WebApp?.initData ?? '';
}
