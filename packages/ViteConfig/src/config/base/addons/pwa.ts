import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

import { defu } from 'defu';

type PwaOptions = Exclude<ViteConfigOptions['pwa'], boolean>;
/**
 * 完全参考 Vitesse 的标准 PWA 设定
 */
export default async function (options: PwaOptions = {}): Promise<UserConfig> {
  const { VitePWA } = await import('vite-plugin-pwa');
  const defaultPluginOptions = {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
    manifest: {
      name: 'Vite App',
      short_name: 'Vite',
      theme_color: '#ffffff',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
  };

  return {
    plugins: [
      VitePWA(defu(options, defaultPluginOptions) as PwaOptions)
    ]
  };
}
