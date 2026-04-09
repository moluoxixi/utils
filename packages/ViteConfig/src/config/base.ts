import path from 'node:path';
import type { UserConfig, PluginOption } from 'vite';
import { detectDependencies } from '../utils/env';

/**
 * 依据项目依赖自动挂载的 Vite 插件映射表
 * 最佳实践：后续若新增识别库，只需在此处追加一行映射即可，真正遵守 OCP（开闭原则）
 */
const pluginMap: Record<string, () => Promise<any>> = {
  vue: () => import('@vitejs/plugin-vue'),
  react: () => import('@vitejs/plugin-react'),
  unocss: () => import('unocss/vite'),
};

/**
 * 加载可选的官方核心业务框架插件
 */
async function loadFrameworkPlugins(plugins: PluginOption[]) {
  const { deps } = detectDependencies();

  for (const [depName, importFn] of Object.entries(pluginMap)) {
    if (deps[depName]) {
      try {
        // 采用动态引入机制，无需在根目录强硬挂载所有的包
        const { default: pluginFactory } = await importFn();
        plugins.push(pluginFactory());
        console.log(`[ViteConfig] Auto-mounted Vite plugin for ${depName}.`);
      } catch {
        console.warn(`[ViteConfig] ${depName} detected but its Vite plugin is missing or failed to load.`);
      }
    }
  }
}

/**
 * 获取底层通用基础配置
 */
export async function getBaseConfig(): Promise<UserConfig> {
  const plugins: PluginOption[] = [];

  // 通过异步探测，组合所需要的构建插件
  await loadFrameworkPlugins(plugins);

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
  };
}
