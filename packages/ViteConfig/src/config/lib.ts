import path from 'node:path';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { detectDependencies } from '@utils/core';
import { getBaseConfig } from './base';
import type { ViteConfigOptions } from '../types';

/**
 * 构建 Library（库项目）专用的 Vite 配置文件
 */
export async function createLibConfig(userConfig: ViteConfigOptions = {}): Promise<UserConfig> {
  const baseConfig = await getBaseConfig(userConfig);
  const { deps, peerDependencies } = detectDependencies();
  
  const root = userConfig.root || process.cwd();

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
  
  return mergeConfig(mergeConfig(baseConfig, libConfig), userConfig);
}
