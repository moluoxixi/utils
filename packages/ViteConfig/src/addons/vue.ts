import type { UserConfig } from 'vite';

/**
 * Vue 最佳实践配置
 */
export default async function (): Promise<UserConfig> {
  const { default: vue } = await import('@vitejs/plugin-vue');
  return {
    plugins: [
      vue({
        // 最佳实践：兼容并支持让 md 等扩展名也可以作为 vue 组件来渲染
        include: [/\.vue$/, /\.md$/],
      })
    ]
  };
}
