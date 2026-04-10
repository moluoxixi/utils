import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * 开发者调试工具条
 */
export default async function (options: Exclude<ViteConfigOptions['devtools'], boolean> = {}): Promise<UserConfig> {
  const { default: VueDevTools } = await import('vite-plugin-vue-devtools');
  return {
    plugins: [
      VueDevTools()
    ]
  };
}
