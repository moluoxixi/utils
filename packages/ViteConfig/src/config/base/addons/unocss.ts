import type { UserConfig } from 'vite';

/**
 * UnoCSS 最佳实践配置
 * （核心规则建议由业务测提供 uno.config.ts）
 */
export default async function (): Promise<UserConfig> {
  const { default: unocss } = await import('unocss/vite');
  return {
    plugins: [
      unocss()
    ]
  };
}
