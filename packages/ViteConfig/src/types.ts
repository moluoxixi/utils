import type { UserConfig } from 'vite';
import type VuePlugin from '@vitejs/plugin-vue';
import type ReactPlugin from '@vitejs/plugin-react';
import type { VitePWA } from 'vite-plugin-pwa';
import type AutoImportPlugin from 'unplugin-auto-import/vite';
import type ComponentsPlugin from 'unplugin-vue-components/vite';
import type VueRouterPlugin from 'unplugin-vue-router/vite';
import type VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import type VueDevToolsPlugin from 'vite-plugin-vue-devtools';
import type MarkdownPlugin from 'unplugin-vue-markdown/vite';
import type UnocssPlugin from 'unocss/vite';
import type VueLayoutsPlugin from 'vite-plugin-vue-layouts';
import type { ViteSSGOptions } from 'vite-ssg';
import type { InlineConfig as VitestConfig } from 'vitest/node';
import type { PluginOptions } from '@moluoxixi/core';

/**
 * All supported addon identifiers (camelCase, matches ViteConfigOptions keys)
 */
export type AddonName =
  | 'vue'
  | 'react'
  | 'unocss'
  | 'tailwindcss'
  | 'vueRouter'
  | 'vueLayouts'
  | 'autoImport'
  | 'components'
  | 'i18n'
  | 'devtools'
  | 'pwa'
  | 'markdown'
  | 'vitest'
  | 'viteSsg';

/**
 * Addon-specific options map — each key corresponds to the underlying plugin's
 * native options type, extracted via PluginOptions<typeof Plugin>.
 * Passing `false` disables that addon entirely.
 */
export interface ViteConfigOptions extends UserConfig {
  vue?: PluginOptions<typeof VuePlugin> | boolean;
  react?: PluginOptions<typeof ReactPlugin> | boolean;
  unocss?: PluginOptions<typeof UnocssPlugin> | boolean;
  /** Tailwindcss v4 Vite plugin takes no options; this passes through to the v4 PostCSS plugin or v3 Config object */
  tailwindcss?: Record<string, unknown> | boolean;
  vueRouter?: PluginOptions<typeof VueRouterPlugin> | boolean;
  vueLayouts?: PluginOptions<typeof VueLayoutsPlugin> | boolean;
  autoImport?: PluginOptions<typeof AutoImportPlugin> | boolean;
  components?: PluginOptions<typeof ComponentsPlugin> | boolean;
  i18n?: PluginOptions<typeof VueI18nPlugin> | boolean;
  devtools?: PluginOptions<typeof VueDevToolsPlugin> | boolean;
  pwa?: PluginOptions<typeof VitePWA> | boolean;
  markdown?: PluginOptions<typeof MarkdownPlugin> | boolean;
  vitest?: VitestConfig | boolean;
  viteSsg?: ViteSSGOptions | boolean;
}
