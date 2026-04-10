import type { UserConfig } from 'vite';
import type { ViteConfigOptions } from '../../../types';

/**
 * 完整对齐 Vitesse 的 Markdown 解析系统设定 (Shiki + LinkAttributes)
 */
export default async function (options: Exclude<ViteConfigOptions['markdown'], boolean> = {}): Promise<UserConfig> {
  const { default: Markdown } = await import('unplugin-vue-markdown/vite');
  const { default: Shiki } = await import('@shikijs/markdown-it');
  const { default: LinkAttributes } = await import('markdown-it-link-attributes');
  
  return {
    plugins: [
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        async markdownItSetup(md: any) {
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          });
          md.use(await Shiki({
            defaultColor: false,
            themes: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          }));
        },
      })
    ]
  };
}
