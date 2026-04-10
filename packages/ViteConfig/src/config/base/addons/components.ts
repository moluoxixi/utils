import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';
import { detectDependencies } from '@utils/core';

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

  const defaultPluginOptions = {
    extensions: ['vue', 'md'],
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    ...(resolvers.length > 0 ? { resolvers: resolvers as Exclude<NonNullable<Parameters<typeof Components>[0]>['resolvers'], undefined> } : {}),
    dts: 'src/typings/components.d.ts',
  };

  return {
    plugins: [
      Components(defu(options, defaultPluginOptions) as ComponentsOptions)
    ]
  };
}
