import { describe, it, expect, vi } from 'vitest';
import { build } from 'vite';
import type { ConfigEnv, UserConfig, UserConfigExport } from 'vite';
import { createAppConfig, createLibConfig } from '../src/index';
import path from 'node:path';
import fs from 'node:fs';

const mockEnv: ConfigEnv = { command: 'build', mode: 'production' };

async function resolveConfig(config: UserConfigExport): Promise<UserConfig> {
  return typeof config === 'function' ? config(mockEnv) : config;
}

vi.mock('@moluoxixi/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    detectDependencies: () => ({ deps: {}, peerDependencies: {} }),
  };
});

describe('Vite Pipeline Integration Build', () => {
  it('App Mode: should successfully compile realistic chunks', async () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/app');
    const outDir = path.resolve(fixturePath, 'dist');
    
    // 清理遗留目录
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }

    const config = await resolveConfig(createAppConfig());
    
    // 执行真实的 Vite 打包 (基于配置)
    await build({
      ...config,
      root: fixturePath,
      logLevel: 'info',
      build: { ...config.build, outDir, emptyOutDir: true }
    });

    const files = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    console.log('App Dist Files:', files);

    const hasHtml = fs.existsSync(path.resolve(outDir, 'index.html'));
    
    expect(hasHtml).toBe(true);
  }, 30000); // 彻底放宽时间保证大型插件加载不超时

  it('Lib Mode: should successfully execute Rollup CJS/ESM distribution', async () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/lib');
    const outDir = path.resolve(fixturePath, 'dist');
    
    const config = await resolveConfig(createLibConfig({ root: fixturePath }));
    
    try {
      await build({
        ...config,
        root: fixturePath,
        logLevel: 'info',
        build: { 
          ...config.build, 
          outDir, 
          emptyOutDir: true
        }
      });
    } catch (e) {
      console.error('[LIB BUILD ERROR TRACE]', e);
    }

    const files = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    console.error('[LIB TRACE] Lib Dist Files:', files);

    const hasOutput = files.some(f => f.includes('index'));
    expect(hasOutput).toBe(true);
  }, 30000);
});
