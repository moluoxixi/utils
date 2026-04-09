import type { UserConfig } from 'vite';

/**
 * Vitest 测试配置
 */
export default async function (): Promise<UserConfig> {
  // vite 原生包含 UserConfig.test (借由 Vitest module augment 提供)
  // 此处强制转换为 any 后代入融合
  return {
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
    }
  } as any;
}
