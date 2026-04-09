import type { UserConfig } from 'vite';

/**
 * TailwindCSS 最佳支持策略：
 * 自动适配 Tailwind v4 (Vite 或 PostCSS) 以及降级 v3 (PostCSS + Autoprefixer)
 */
export default async function (): Promise<UserConfig> {
  // 第 1 梯队：V4 尝试使用官方性能最高的原生 Vite 插件
  try {
    const { default: tailwindVite } = await import('@tailwindcss/vite');
    return {
      plugins: [
        tailwindVite()
      ]
    };
  } catch {}

  // 第 2 梯队：V4 尝试使用最新的官方 PostCSS 插件（适用于某些必须在 PostCSS 链路中处理的情况）
  try {
    const { default: tailwindPostcss } = await import('@tailwindcss/postcss');
    return {
      css: {
        postcss: {
          plugins: [
            (tailwindPostcss as unknown as () => import('postcss').AcceptedPlugin)()
          ]
        }
      }
    };
  } catch {}

  // 第 3 梯队：V3 兜底使用原本的传统 PostCSS 方案 (需绑定 autoprefixer)
  const { default: tailwindcss } = await import('tailwindcss');
  const { default: autoprefixer } = await import('autoprefixer');
  
  return {
    css: {
      postcss: {
        plugins: [
          (tailwindcss as unknown as () => import('postcss').AcceptedPlugin)(),
          (autoprefixer as unknown as () => import('postcss').AcceptedPlugin)(),
        ]
      }
    }
  };
}
