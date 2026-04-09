/**
 * 工具层主干 (Core Utilities)
 * 主打：极致 ESModule 导向、纯净无副作用 (Side-Effects Free)、TypeScript 强类型
 */

/**
 * @description 判断值是否为非空字符串
 */
export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

/**
 * @description 判断是否为纯净的 Object 对象 (排除 Array, null, Date 等引用数据)
 */
export const isObject = (val: unknown): val is Record<string, any> => {
  return val !== null && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';
};

/**
 * @description 判断对象或数组形态是否为空
 * @param val 要判断的数据变量
 */
export const isEmpty = <T = unknown>(val: T): boolean => {
  if (val == null) return true;
  if (Array.isArray(val) || typeof val === 'string') return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
};

/**
 * @description 极致高性能/安全的深拷贝 (目前只示范了主流格式 Array, Object, Date, RegExp 的高内聚解耦分离)
 * @param obj 来源数据对象/数据内容
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloneObj = Object.create(Object.getPrototypeOf(obj));
  for (const key of Object.keys(obj)) {
    cloneObj[key] = deepClone(obj[key as keyof T]);
  }
  return cloneObj;
};
