/**
 * 魔法萃取：安全提取外部框架插件工厂函数的第一入参配置对象类型 (Zero Any)
 */
export type PluginOptions<T extends (...args: any) => any> = NonNullable<Parameters<T>[0]>;
