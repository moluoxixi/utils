import { describe, it, expect } from 'vitest';
import { isString, isObject, isEmpty, deepClone } from '../src/index';

describe('Core Utilities', () => {
  it('isString', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
  });

  it('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(new Date())).toBe(false);
    expect(isObject(/test/)).toBe(false);
  });

  it('isEmpty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    
    const map = new Map();
    map.set('key', 'value');
    expect(isEmpty(map)).toBe(false);
  });

  it('deepClone', () => {
    const origin = {
      a: 1,
      b: 'string',
      c: { d: 2 },
      e: [1, 2, { f: 3 }],
      g: new Date('2023-01-01'),
      h: /test/gi
    };
    
    const cloned = deepClone(origin);
    
    expect(cloned).toEqual(origin);
    expect(cloned).not.toBe(origin);
    expect(cloned.c).not.toBe(origin.c);
    expect(cloned.e).not.toBe(origin.e);
    expect(cloned.g).not.toBe(origin.g);
    expect(cloned.h).not.toBe(origin.h);
  });
});
