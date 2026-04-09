import type { UserConfig } from 'vite';

/**
 * TailwindCSS 最佳支持策略：
 * 自动适配 Tailwind v4 (Vite) 和 v3 (PostCSS)
 */
export default async function (): Promise<UserConfig> {
  try {
    // V4: 优先尝试以 Vite 原生插件的方式拉起 TailwindCSS
    const { default: tailwindVite } = await import('@tailwindcss/vite');
    return {
      plugins: [
        tailwindVite()
      ]
    };
  } catch {
    // V3: 兜底使用 PostCSS 处理
    const { default: tailwindcss } = await import('tailwindcss');
    const { default: autoprefixer } = await import('autoprefixer');
    
    return {
      css: {
        postcss: {
          plugins: [
            tailwindcss(),
            autoprefixer(),
          ]
        }
      }
    };
  }
}
