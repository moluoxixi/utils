import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';
import type { AddonName, ViteConfigOptions } from '../../../types';

/**
 * 将 package.json 中的依赖包名称映射到特定的 addon 配置名
 */
const addonMappings: Record<string, AddonName> = {
  'vue': 'vue',
  '@vitejs/plugin-vue': 'vue',
  'react': 'react',
  '@vitejs/plugin-react': 'react',
  'unocss': 'unocss',
  'tailwindcss': 'tailwindcss',
  '@tailwindcss/vite': 'tailwindcss',
  '@tailwindcss/postcss': 'tailwindcss',
  'unplugin-vue-router': 'vueRouter',
  'vite-plugin-vue-layouts': 'vueLayouts',
  'unplugin-auto-import': 'autoImport',
  'unplugin-vue-components': 'components',
  '@intlify/unplugin-vue-i18n': 'i18n',
  'vite-plugin-vue-devtools': 'devtools',
  'vite-plugin-pwa': 'pwa',
  'unplugin-vue-markdown': 'markdown',
  'vitest': 'vitest',
  'vite-ssg': 'viteSsg',
};

/**
 * Addon 加载器 — satisfies 仅用于确认 key 完整覆盖 AddonName，不约束函数签名（各 addon 参数类型各异，受各自模块内部保证）
 */
const addonImporters = {
  'vue': () => import('./vue'),
  'react': () => import('./react'),
  'unocss': () => import('./unocss'),
  'tailwindcss': () => import('./tailwindcss'),
  'vueRouter': () => import('./vue-router'),
  'vueLayouts': () => import('./vue-layouts'),
  'autoImport': () => import('./auto-import'),
  'components': () => import('./components'),
  'i18n': () => import('./i18n'),
  'devtools': () => import('./devtools'),
  'pwa': () => import('./pwa'),
  'markdown': () => import('./markdown'),
  'vitest': () => import('./vitest'),
  'viteSsg': () => import('./vite-ssg'),
} satisfies Record<AddonName, () => Promise<object>>;

/**
 * 获取基于依赖侦测计算后的融合 Config
 */
export async function getAddonsConfig(options: ViteConfigOptions = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  let combinedConfig: UserConfig = {};
  const appliedAddons = new Set<AddonName>();

  // 1. 扫描当前 package.json 依赖
  for (const depName of Object.keys(deps)) {
    const addonName = addonMappings[depName];
    if (addonName) {
      appliedAddons.add(addonName);
    }
  }

  // 2. 加载每个命中的模块，下发类型安全的 options[addon]（由 AddonName → ViteConfigOptions 保证语义正确性）
  for (const addon of appliedAddons) {
    const addonOptions = options[addon];

    if (addonOptions === false) {
      console.log(`[ViteConfig] Addon \x1b[33m${addon}\x1b[0m is disabled via configuration.`);
      continue;
    }

    try {
      type AddonOpts = Exclude<ViteConfigOptions[typeof addon], false>;
      const mod = await addonImporters[addon]() as { default: (options?: AddonOpts) => Promise<UserConfig> | UserConfig };
      const configFragment = await mod.default(addonOptions as AddonOpts ?? {});
      combinedConfig = mergeConfig(combinedConfig, configFragment);
      console.log(`[ViteConfig] Applied addon configuration: \x1b[36m${addon}\x1b[0m`);
    } catch (e) {
      console.warn(`[ViteConfig] Failed to load addon configuration for: ${addon}`, e);
    }
  }

  return combinedConfig;
}
