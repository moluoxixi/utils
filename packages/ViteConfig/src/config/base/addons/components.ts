import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';
import { detectDependencies } from '@moluoxixi/core';

import { defu } from 'defu';

type ComponentsOptions = Exclude<ViteConfigOptions['components'], boolean>;
/**
 * 业务组件按需拉取挂载
 */
export default async function (options: ComponentsOptions = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: Components } = await import('unplugin-vue-components/vite');

  const resolvers: Array<unknown> = [];

  if (deps['element-plus']) {
    const { ElementPlusResolver } = await import('unplugin-vue-components/resolvers');
    resolvers.push(ElementPlusResolver());
  }

  const extensions: string[] = [];
  const includePatterns: RegExp[] = [];

  if (deps['vue']) {
    extensions.push('vue');
    includePatterns.push(/\.vue$/, /\.vue\?vue/);
  }

  if (deps['svelte']) {
    extensions.push('svelte');
    includePatterns.push(/\.svelte$/);
  }

  if (deps['unplugin-vue-markdown'] || deps['vite-plugin-md'] || deps['vite-plugin-vue-markdown']) {
    extensions.push('md');
    includePatterns.push(/\.md$/);
  }

  const defaultPluginOptions = {
    extensions,
    include: includePatterns,
    ...(resolvers.length > 0 ? { resolvers: resolvers as Exclude<NonNullable<Parameters<typeof Components>[0]>['resolvers'], undefined> } : {}),
    dts: 'src/typings/components.d.ts',
  };

  return {
    plugins: [
      Components(defu(options, defaultPluginOptions) as ComponentsOptions)
    ]
  };
}
