import type { UserConfig } from 'vite';

/**
 * 业务组件按需拉取挂载
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: Components } = await import('unplugin-vue-components/vite');
  return {
    plugins: [
      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      })
    ]
  };
}
