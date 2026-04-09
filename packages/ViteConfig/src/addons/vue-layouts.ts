import type { UserConfig } from 'vite';

/**
 * 路由布局系统挂载
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: Layouts } = await import('vite-plugin-vue-layouts');
  return {
    plugins: [
      Layouts()
    ]
  };
}
