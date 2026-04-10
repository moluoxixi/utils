import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * React 基础支持配置
 */
export default async function (options: Exclude<ViteConfigOptions['react'], boolean> = {}): Promise<UserConfig> {
  const { default: react } = await import('@vitejs/plugin-react');
  return {
    plugins: [
      react()
    ]
  };
}
