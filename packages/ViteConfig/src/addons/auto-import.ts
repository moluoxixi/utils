import type { UserConfig } from 'vite';

/**
 * API 自动按需引入最佳实践 (无需手动 import ref, computed 等)
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: AutoImport } = await import('unplugin-auto-import/vite');
  return {
    plugins: [
      AutoImport({
        include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'vue-i18n', '@vueuse/core', 'vue-router'],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores'],
        vueTemplate: true,
      })
    ]
  };
}
