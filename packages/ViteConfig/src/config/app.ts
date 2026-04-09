import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { getBaseConfig } from './base';

/**
 * 构建 Web App 应用专用的 Vite 配置文件
 */
export async function createAppConfig(userConfig: UserConfig = {}): Promise<UserConfig> {
  const baseConfig = await getBaseConfig();

  const appConfig: UserConfig = {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 最佳实践：默认将所有 node_modules 下的内容拆分为独立的 vendor 包，提供更好的缓存命中率
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    esbuild: {
      // 最佳实践：Vite 默认采用 esbuild，使用 esbuild 剔除 console 会比 terser 快很多倍
      drop: ['console', 'debugger'],
    }
  };
  
  return mergeConfig(mergeConfig(baseConfig, appConfig), userConfig);
}
