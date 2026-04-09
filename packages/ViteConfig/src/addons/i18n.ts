import type { UserConfig } from 'vite';
import path from 'node:path';

/**
 * 全球化 (I18n) 构建编译时优化
 */
export default async function (): Promise<UserConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: VueI18n } = await import('@intlify/unplugin-vue-i18n/vite');
  return {
    plugins: [
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(process.cwd(), 'locales/**')],
      })
    ]
  };
}
