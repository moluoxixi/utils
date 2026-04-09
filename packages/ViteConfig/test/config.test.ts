import { describe, it, expect, vi } from 'vitest';
import { getBaseConfig, createAppConfig, createLibConfig } from '../src/index';

vi.mock('@utils/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    detectDependencies: () => ({ deps: {}, peerDependencies: {} }),
  };
});

describe('ViteConfig Builders', () => {
  it('getBaseConfig successfully resolves dynamic addons based on Env', async () => {
    const config = await getBaseConfig();
    expect(config).toBeDefined();
    expect(config.resolve?.alias).toBeDefined();
    // 应该是一个包含了所有生效 Addon Config 的 plugins 数组 (如果有的话)
    if (config.plugins) {
      expect(Array.isArray(config.plugins)).toBe(true);
    }
  });

  it('createAppConfig overrides specific chunking behaviors natively', async () => {
    const customOptions = { base: '/app-test/' };
    const config = await createAppConfig(customOptions);
    
    expect(config.base).toBe('/app-test/');
    expect(config.build?.rollupOptions?.output).toBeDefined();
    // 断言剥离 console 和 debugger 被成功传递并映射成 esbuild 规范
    expect(config.esbuild).toBeDefined();
    expect((config.esbuild as any).drop).toContain('console');
  });

  it('createLibConfig injects accurate external dependencies', async () => {
    const config = await createLibConfig({
      build: { outDir: 'lib-dist' }
    });
    
    expect(config.build?.outDir).toBe('lib-dist');
    expect(config.build?.lib).toBeDefined();
    expect(config.build?.rollupOptions?.external).toBeDefined();
    expect(Array.isArray(config.build?.rollupOptions?.external)).toBe(true);
  });
});
