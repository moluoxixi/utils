import { describe, it, expect } from 'vitest';
import { readPackageJSON, detectDependencies } from '../src/env';

describe('Environment Utilities', () => {
  it('readPackageJSON should fetch manifest safely', () => {
    const pkg = readPackageJSON();
    expect(typeof pkg).toBe('object');
    // since we run this in the monorepo root or package dir, it should have a name or dependencies
    expect(pkg).toBeDefined();
  });

  it('detectDependencies should aggregate dependency map perfectly', () => {
    const { deps, peerDependencies } = detectDependencies();
    expect(typeof deps).toBe('object');
    expect(typeof peerDependencies).toBe('object');
  });
});
