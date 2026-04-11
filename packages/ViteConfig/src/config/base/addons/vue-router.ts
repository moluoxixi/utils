import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';
import { detectDependencies } from '@utils/core';
import { defu } from 'defu';

/**
 * 文件系统路由（Vue Router）最佳实践
 */
export default async function (options: Exclude<ViteConfigOptions['vueRouter'], boolean> = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: vueRouter } = await import('unplugin-vue-router/vite');

  const extensions: string[] = [];
  if (deps['vue']) {
    extensions.push('.vue');
  }
  if (deps['unplugin-vue-markdown'] || deps['vite-plugin-md'] || deps['vite-plugin-vue-markdown']) {
    extensions.push('.md');
  }

  return {
    plugins: [
      vueRouter(defu(options, {
        extensions,
        dts: 'src/typings/route-map.d.ts',
      }))
    ]
  };
}
