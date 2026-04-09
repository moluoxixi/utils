import fs from 'node:fs';
import path from 'node:path';

/**
 * 判断当前执行目录下是否存在对应文件
 */
export function isFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * 读取当前项目的 package.json
 */
export function readPackageJSON(cwd: string = process.cwd()): Record<string, any> {
  const pkgPath = path.resolve(cwd, 'package.json');
  if (isFileExists(pkgPath)) {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  }
  return {};
}

/**
 * 侦测项目所包含的依赖
 */
export function detectDependencies() {
  const pkg = readPackageJSON();
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  return {
    deps,
    peerDependencies: pkg.peerDependencies || {}
  };
}
