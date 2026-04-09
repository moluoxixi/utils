import path from 'node:path';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { detectDependencies } from '../utils/env';
import { getBaseConfig } from './base';

/**
 * 构建 Library（库项目）专用的 Vite 配置文件
 */
export async function createLibConfig(userConfig: UserConfig = {}): Promise<UserConfig> {
  const baseConfig = await getBaseConfig();
  const { deps, peerDependencies } = detectDependencies();
  
  // 最佳实践：库开发过程中必须将业务依赖项 external 剔除出去，否则会打进包内造成膨胀
  const external = [
    ...Object.keys(deps || {}),
    ...Object.keys(peerDependencies || {})
  ];

  const libConfig: UserConfig = {
    build: {
      lib: {
        entry: path.resolve(process.cwd(), 'src/index.ts'),
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
