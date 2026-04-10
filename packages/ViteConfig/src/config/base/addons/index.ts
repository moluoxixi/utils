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
} satisfies Record<AddonName, () => Promise<{ default: (options?: any) => Promise<UserConfig> | UserConfig }>>;

/**
 * 获取基于依赖侦测计算后的融合 Config
 */
export async function getAddonsConfig(options: ViteConfigOptions = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  let combinedConfig: UserConfig = {};

  // 1. 扫描当前 package.json 依赖，记录命中的 addon
  const detectedAddons = new Set<AddonName>();
  for (const depName of Object.keys(deps)) {
    const addonName = addonMappings[depName];
    if (addonName) {
      detectedAddons.add(addonName);
    }
  }

  // 2. 遍历所有可用的 Addon，根据配置和依赖情况决定是否启用
  for (const addon of Object.keys(addonImporters) as AddonName[]) {
    const addonOption = options[addon];
    const isObject = typeof addonOption === 'object' && addonOption !== null;

    // 判定是否启用：1. 显式对象 2. 显式为 true 3. 未定义但依赖命中
    if (!isObject && addonOption !== true && !(addonOption === undefined && detectedAddons.has(addon))) {
      continue;
    }

    try {
      // 加载并应用 Addon 配置
      const mod = await addonImporters[addon]();
      const configFragment = await mod.default((isObject ? addonOption : undefined) as any);
      combinedConfig = mergeConfig(combinedConfig, configFragment);
      console.log(`[ViteConfig] Applied addon configuration: \x1b[36m${addon}\x1b[0m`);
    } catch (e) {
      console.warn(`[ViteConfig] Failed to load addon configuration for: ${addon}`, e);
    }
  }

  return combinedConfig;
}
