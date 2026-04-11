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
  if (deps['@vueuse/math']) imports.push('@vueuse/math');
  if (deps['@vueuse/head']) imports.push('@vueuse/head');
  if (deps['vitest']) imports.push('vitest');
  if (deps['pinia']) imports.push('pinia');
  if (deps['preact']) imports.push('preact');
  if (deps['quasar']) imports.push('quasar');
  if (deps['react-router']) imports.push('react-router');
  if (deps['react-router-dom']) imports.push('react-router-dom');
  if (deps['rxjs']) imports.push('rxjs');
  if (deps['solid-js']) imports.push('solid-js');
  if (deps['svelte']) imports.push('svelte');

  // 按路径动态 Push 插件宏
  if (deps['unplugin-vue-router']) {
    const { VueRouterAutoImports } = await import('unplugin-vue-router');
    imports.push(VueRouterAutoImports);
    imports.push({ 'vue-router/auto': ['useLink'] });
  } else if (deps['vue-router']) {
    imports.push('vue-router');
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

  const includePatterns = [/\.[jt]sx?$/];
  if (deps['vue']) {
    includePatterns.push(/\.vue$/, /\.vue\?vue/);
  }
  if (deps['svelte']) {
    includePatterns.push(/\.svelte$/);
  }
  if (deps['unplugin-vue-markdown'] || deps['vite-plugin-md'] || deps['vite-plugin-vue-markdown']) {
    includePatterns.push(/\.md$/);
  }

  const defaultPluginOptions: AutoImportOptions = {
    include: includePatterns,
    imports,
    ...(resolvers!.length > 0 ? { resolvers } : {}),
    dts: 'src/typings/auto-imports.d.ts',
    dirs: ['src/composables', 'src/stores', 'src/utils'],
    vueTemplate: !!deps['vue'], // 仅在存在 vue 依赖时开启 Vue 模板解析
  };

  return {
    plugins: [
      AutoImport(defu(options, defaultPluginOptions) as AutoImportOptions)
    ]
  };
}
