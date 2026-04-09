import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';

/**
 * 将 package.json 中的依赖包名称映射到特定的 addon 配置名
 * 如果有多个包对应同一个 addon 功能，可指向统一的映射
 */
const addonMappings: Record<string, string> = {
  'vue': 'vue',
  '@vitejs/plugin-vue': 'vue',
  'react': 'react',
  '@vitejs/plugin-react': 'react',
  'unocss': 'unocss',
  'tailwindcss': 'tailwindcss',
  '@tailwindcss/vite': 'tailwindcss',
  '@tailwindcss/postcss': 'tailwindcss',
  'unplugin-vue-router': 'vue-router',
  'vite-plugin-vue-layouts': 'vue-layouts',
  'unplugin-auto-import': 'auto-import',
  'unplugin-vue-components': 'components',
  '@intlify/unplugin-vue-i18n': 'i18n',
  'vite-plugin-vue-devtools': 'devtools',
  'vite-plugin-pwa': 'pwa',
  'unplugin-vue-markdown': 'markdown',
  'vitest': 'vitest',
  'vite-ssg': 'vite-ssg',
};

/**
 * 对应 addon 的真实加载器
 */
const addonImporters: Record<string, () => Promise<{ default: () => Promise<UserConfig> | UserConfig }>> = {
  'vue': () => import('./vue'),
  'react': () => import('./react'),
  'unocss': () => import('./unocss'),
  'tailwindcss': () => import('./tailwindcss'),
  'vue-router': () => import('./vue-router'),
  'vue-layouts': () => import('./vue-layouts'),
  'auto-import': () => import('./auto-import'),
  'components': () => import('./components'),
  'i18n': () => import('./i18n'),
  'devtools': () => import('./devtools'),
  'pwa': () => import('./pwa'),
  'markdown': () => import('./markdown'),
  'vitest': () => import('./vitest'),
  'vite-ssg': () => import('./vite-ssg'),
};

/**
 * 获取基于依赖侦测计算后的融合 Config
 */
export async function getAddonsConfig(): Promise<UserConfig> {
  const { deps } = detectDependencies();
  let combinedConfig: UserConfig = {};
  const appliedAddons = new Set<string>();

  // 1. 扫描当前 package.json 依赖
  for (const depName of Object.keys(deps)) {
    const addonName = addonMappings[depName];
    if (addonName) {
      appliedAddons.add(addonName);
    }
  }

  // 2. 加载每个命中的模块，且每个模块都能返回局部的 Vite UserConfig 以支持 PostCSS、Server 等属性合并
  for (const addon of appliedAddons) {
    if (addonImporters[addon]) {
      try {
        const { default: buildConfig } = await addonImporters[addon]();
        const configFragment = await buildConfig();
        combinedConfig = mergeConfig(combinedConfig, configFragment);
        console.log(`[ViteConfig] Applied addon configuration: \x1b[36m${addon}\x1b[0m`);
      } catch (e) {
        console.warn(`[ViteConfig] Failed to load addon configuration for: ${addon}`, e);
      }
    }
  }

  return combinedConfig;
}
