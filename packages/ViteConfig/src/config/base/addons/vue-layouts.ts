import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * 路由布局系统挂载
 */
export default async function (options: Exclude<ViteConfigOptions['vueLayouts'], boolean> = {}): Promise<UserConfig> {
  const { default: Layouts } = await import('vite-plugin-vue-layouts');
  return {
    plugins: [
      Layouts()
    ]
  };
}
