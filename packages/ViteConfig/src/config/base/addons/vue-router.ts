import type { UserConfig } from 'vite';

/**
 * 文件系统路由（Vue Router）最佳实践
 */
export default async function (): Promise<UserConfig> {
  const { default: vueRouter } = await import('unplugin-vue-router/vite');
  return {
    plugins: [
      vueRouter({
        extensions: ['.vue', '.md'],
        dts: 'src/route-map.d.ts',
      })
    ]
  };
}
