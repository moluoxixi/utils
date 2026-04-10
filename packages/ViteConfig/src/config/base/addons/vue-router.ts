import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * 文件系统路由（Vue Router）最佳实践
 */
export default async function (options: Exclude<ViteConfigOptions['vueRouter'], boolean> = {}): Promise<UserConfig> {
  const { default: vueRouter } = await import('unplugin-vue-router/vite');
  return {
    plugins: [
      vueRouter({
        extensions: ['.vue', '.md'],
        dts: 'src/typings/route-map.d.ts',
      })
    ]
  };
}
