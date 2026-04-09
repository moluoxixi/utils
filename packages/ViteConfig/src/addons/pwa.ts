import type { UserConfig } from 'vite';

/**
 * 离线应用协议 (PWA) 支持
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { VitePWA } = await import('vite-plugin-pwa');
  return {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
      })
    ]
  };
}
