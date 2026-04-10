import path from 'node:path';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { getAddonsConfig } from './addons';
import type { ViteConfigOptions } from '../../types';

/**
 * 获取全局通用基础配置
 */
export async function getBaseConfig(options: ViteConfigOptions = {}): Promise<UserConfig> {
  // 基于插件目录(Addons)动态合并后的配置，将 options 字典透明下移
  const addonsConfig = await getAddonsConfig(options);

  // 兜底及固定写法的配置
  const rootConfig: UserConfig = {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '~/': `${path.resolve(process.cwd(), 'src')}/`,
      },
    },
  };

  // 通过 mergeConfig 完美融合 Addons 中的诸如 PostCSS、Plugins、Server 等复杂字段
  return mergeConfig(rootConfig, addonsConfig);
}
