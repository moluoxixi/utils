import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';

/**
 * API 自动按需引入最佳实践 (严格类型安全、零 any)
 */
export default async function (): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: AutoImport } = await import('unplugin-auto-import/vite');

  return {
    plugins: [
      AutoImport({
        include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: [
          'vue', 
          'vue-i18n', 
          '@vueuse/core',
          ...(deps['unplugin-vue-router'] || deps['vue-router'] 
              ? [ (await import('unplugin-vue-router')).VueRouterAutoImports, { 'vue-router/auto': ['useLink'] } ] 
              : []),
          ...(deps['@unhead/vue'] 
              ? [ (await import('@unhead/vue')).unheadVueComposablesImports ] 
              : [])
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores'],
        vueTemplate: true,
      })
    ]
  };
}
