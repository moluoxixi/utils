import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * Vite SSG 及 SSR 相关 Vitesse 特殊解耦配置
 */
export default async function (options: Exclude<ViteConfigOptions['viteSsg'], boolean> = {}): Promise<UserConfig> {
  const { default: generateSitemap } = await import('vite-ssg-sitemap');
  
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
      noExternal: ['workbox-window', /vue-i18n/],
    }
  } as any;
}
