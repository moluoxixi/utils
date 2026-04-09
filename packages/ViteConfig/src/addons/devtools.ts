import type { UserConfig } from 'vite';

/**
 * 开发者调试工具条
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: VueDevTools } = await import('vite-plugin-vue-devtools');
  return {
    plugins: [
      VueDevTools()
    ]
  };
}
