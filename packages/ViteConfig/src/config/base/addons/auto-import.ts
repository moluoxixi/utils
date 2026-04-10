import type { UserConfig } from 'vite';
import type AutoImportPlugin from 'unplugin-auto-import/vite';
import { detectDependencies } from '@utils/core';
import type { PluginOptions } from '@utils/core';
import { defu } from 'defu';

type AutoImportOptions = PluginOptions<typeof AutoImportPlugin>;

/**
 * API 自动按需引入最佳实践 (严格类型安全、零 any)
 */
export default async function (options: AutoImportOptions = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: AutoImport } = await import('unplugin-auto-import/vite');

  // 构建核心配置数组
  const imports: Exclude<AutoImportOptions['imports'], undefined> = [];

  // 按路径动态 Push 核心框架与热门宏
  if (deps['vue']) imports.push('vue');
  if (deps['react']) imports.push('react');
  if (deps['vue-i18n']) imports.push('vue-i18n');
  if (deps['@vueuse/core']) imports.push('@vueuse/core');
  if (deps['vitest']) imports.push('vitest');

  // 按路径动态 Push 插件宏
  if (deps['unplugin-vue-router'] || deps['vue-router']) {
    const { VueRouterAutoImports } = await import('unplugin-vue-router');
    imports.push(VueRouterAutoImports);
    imports.push({ 'vue-router/auto': ['useLink'] });
  }

  if (deps['@unhead/vue']) {
    const { unheadVueComposablesImports } = await import('@unhead/vue');
    imports.push(unheadVueComposablesImports);
  }

  const resolvers: AutoImportOptions['resolvers'] = [];

  if (deps['element-plus']) {
    const { ElementPlusResolver } = await import('unplugin-vue-components/resolvers');
    resolvers.push(ElementPlusResolver() as any);
  }

  const defaultPluginOptions: AutoImportOptions = {
    include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
    imports,
    ...(resolvers!.length > 0 ? { resolvers } : {}),
    dts: 'src/typings/auto-imports.d.ts',
    dirs: ['src/composables', 'src/stores'],
    vueTemplate: true,
  };

  return {
    plugins: [
      AutoImport(defu(options, defaultPluginOptions) as AutoImportOptions)
    ]
  };
}
