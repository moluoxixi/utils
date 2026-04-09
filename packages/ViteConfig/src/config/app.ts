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
      // 现代 Vite 默认采用 Rollup 优秀的自动 Code-splitting 策略 (按 Entry 与动态 import 拆分)
      // 废弃过去强行把 node_modules 统统塞入巨大的 `vendor.js` 的低效缓存反模式
      rollupOptions: {
        output: {}
      }
    },
    esbuild: {
      // 最佳实践：Vite 默认采用 esbuild，使用 esbuild 剔除 console 会比 terser 快很多倍
      drop: ['console', 'debugger'],
    }
  };
  
  return mergeConfig(mergeConfig(baseConfig, appConfig), userConfig);
}
