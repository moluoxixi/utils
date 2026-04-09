import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';

/**
 * API 自动按需引入最佳实践 (严格类型安全、零 any)
 */
export default async function (): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: AutoImport } = await import('unplugin-auto-import/vite');

  // 构建核心配置数组
  const imports: Array<string | Record<string, unknown>> = [];

  // 按路径动态 Push 核心框架与热门宏
  if (deps['vue']) imports.push('vue');
  if (deps['react']) imports.push('react');
  if (deps['vue-i18n']) imports.push('vue-i18n');
  if (deps['@vueuse/core']) imports.push('@vueuse/core');
  if (deps['vitest']) imports.push('vitest');

  const resolvers: Array<unknown> = [];

  // 按路径动态 Push 插件宏
  if (deps['unplugin-vue-router'] || deps['vue-router']) {
    const { VueRouterAutoImports } = await import('unplugin-vue-router');
    imports.push(VueRouterAutoImports as Record<string, unknown>);
    imports.push({ 'vue-router/auto': ['useLink'] });
  }

  if (deps['@unhead/vue']) {
    const { unheadVueComposablesImports } = await import('@unhead/vue');
    imports.push(unheadVueComposablesImports as Record<string, unknown>);
  }

  if (deps['element-plus'] && deps['unplugin-vue-components']) {
    const { ElementPlusResolver } = await import('unplugin-vue-components/resolvers');
    resolvers.push(ElementPlusResolver());
  }

  return {
    plugins: [
      AutoImport({
        include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: imports as Exclude<NonNullable<Parameters<typeof AutoImport>[0]>['imports'], undefined>,
        ...(resolvers.length > 0 ? { resolvers: resolvers as Exclude<NonNullable<Parameters<typeof AutoImport>[0]>['resolvers'], undefined> } : {}),
        dts: 'src/typings/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores'],
        vueTemplate: true,
      })
    ]
  };
}
