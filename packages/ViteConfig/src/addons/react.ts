import type { UserConfig } from 'vite';

/**
 * React 基础支持配置
 */
export default async function (): Promise<UserConfig> {
  const { default: react } = await import('@vitejs/plugin-react');
  return {
    plugins: [
      react()
    ]
  };
}
