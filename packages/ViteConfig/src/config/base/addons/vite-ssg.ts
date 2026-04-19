import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';
import { detectDependencies } from '@moluoxixi/core';

/**
 * Vite SSG 及 SSR 相关 Vitesse 特殊解耦配置
 */
export default async function (options: Exclude<ViteConfigOptions['viteSsg'], boolean> = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: generateSitemap } = await import('vite-ssg-sitemap');
  
  const noExternal: any[] = ['workbox-window'];
  if (deps['vue-i18n']) {
    noExternal.push(/vue-i18n/);
  }

  return {
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      beastiesOptions: {
        reduceInlineStyles: false,
      },
      onFinished() {
        generateSitemap();
      },
    },
    ssr: {
      noExternal,
    }
  } as any;
}
