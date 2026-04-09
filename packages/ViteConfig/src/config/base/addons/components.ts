import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';

/**
 * 业务组件按需拉取挂载
 */
export default async function (): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: Components } = await import('unplugin-vue-components/vite');

  const resolvers: Array<unknown> = [];

  if (deps['element-plus']) {
    const { ElementPlusResolver } = await import('unplugin-vue-components/resolvers');
    resolvers.push(ElementPlusResolver());
  }

  return {
    plugins: [
      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        ...(resolvers.length > 0 ? { resolvers: resolvers as Exclude<NonNullable<Parameters<typeof Components>[0]>['resolvers'], undefined> } : {}),
        dts: 'src/typings/components.d.ts',
      })
    ]
  };
}
