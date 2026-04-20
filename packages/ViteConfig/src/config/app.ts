import { defineConfig, mergeConfig } from 'vite';
import type { UserConfig, UserConfigExport } from 'vite';
import { getBaseConfig } from './base';
import type { ViteConfigExport } from '../types';

/**
 * 构建 Web App 应用专用的 Vite 配置文件
 *
 * @example
 * // 对象形式
 * export default createAppConfig({ vue: true })
 *
 * export default createAppConfig(({ mode }) => ({
 *   vue: true,
 *   viteConfig: {
 *     base: mode === 'development' ? '/' : '/app/',
 *   }
 * }))
 */
export function createAppConfig(config: ViteConfigExport = {}): UserConfigExport {
  return defineConfig(async (env) => {
    const userOptions = typeof config === 'function' ? await config(env) : config;
    const baseConfig = await getBaseConfig(userOptions);
    const viteConfigExt = userOptions.viteConfig || {};

    const appConfig: UserConfig = {
      build: {
        // 现代 Vite 默认采用 Rollup 优秀的自动 Code-splitting 策略 (按 Entry 与动态 import 拆分)
        // 废弃过去强行把 node_modules 统统塞入巨大的 `vendor.js` 的低效缓存反模式
        rollupOptions: {
          output: {}
        }
      }
    };

    return mergeConfig(mergeConfig(baseConfig, appConfig), viteConfigExt);
  });
}
