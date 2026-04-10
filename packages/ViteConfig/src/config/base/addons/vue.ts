import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';
import { detectDependencies } from '@utils/core';

import { defu } from 'defu';

export default async function (options: Exclude<ViteConfigOptions['vue'], boolean> = {}): Promise<UserConfig> {
  const { deps } = detectDependencies();
  const { default: vue } = await import('@vitejs/plugin-vue');

  const defaultPluginOptions = {
    include: [/\.vue$/, /\.md$/],
  };

  const vuePlugin = vue(defu(options, defaultPluginOptions));

  // 最佳实践：如果项目中存在 VueMacros，VueMacros 必须包裹 Vue 插件而不是并排运行
  if (deps['unplugin-vue-macros']) {
    const { default: VueMacros } = await import('unplugin-vue-macros/vite');
    return {
      plugins: [
        VueMacros({
          plugins: {
            vue: vuePlugin,
          },
        })
      ]
    };
  }

  // 默认直接返回 Vue
  return { plugins: [vuePlugin] };
}
