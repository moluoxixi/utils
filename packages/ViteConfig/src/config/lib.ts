import path from 'node:path';
import { defineConfig, mergeConfig } from 'vite';
import type { UserConfig, UserConfigExport } from 'vite';
import { detectDependencies } from '@moluoxixi/core';
import { getBaseConfig } from './base';
import type { ViteConfigExport } from '../types';

/**
 * 构建 Library（库项目）专用的 Vite 配置文件
 *
 * @example
 * // 对象形式
 * export default createLibConfig()
 *
 * export default createLibConfig(({ mode }) => ({
 *   viteConfig: {
 *     build: { sourcemap: mode !== 'production' },
 *   }
 * }))
 */
export function createLibConfig(config: ViteConfigExport = {}): UserConfigExport {
  return defineConfig(async (env) => {
    const userOptions = typeof config === 'function' ? await config(env) : config;
    const baseConfig = await getBaseConfig(userOptions);
    const viteConfigExt = userOptions.viteConfig || {};
    const { deps, peerDependencies } = detectDependencies();
    
    const root = viteConfigExt.root || process.cwd();

    // 最佳实践：库开发过程中必须将业务依赖项 external 剔除出去，否则会打进包内造成膨胀
    const external = [
      ...Object.keys(deps || {}),
      ...Object.keys(peerDependencies || {})
    ];

    const libConfig: UserConfig = {
      build: {
        lib: {
          entry: path.resolve(root, 'src/index.ts'),
          formats: ['es', 'cjs'],
          fileName: 'index'
        },
        rollupOptions: {
          external,
        }
      }
    };
    
    return mergeConfig(mergeConfig(baseConfig, libConfig), viteConfigExt);
  });
}
