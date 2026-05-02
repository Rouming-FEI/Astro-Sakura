import zh from './zh';
import ja from './ja';
import fr from './fr';

const dictionaries = { zh, ja, fr };
type Lang = keyof typeof dictionaries;

export function getDict(lang: string): typeof zh {
  return dictionaries[lang as Lang] ?? dictionaries.zh;
}

export const locales = ['zh', 'ja', 'fr'] as const;
export const defaultLocale = 'zh';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  return locales.includes(lang as (typeof locales)[number]) ? lang : defaultLocale;
}

export function useTranslations(lang: string) {
  return getDict(lang);
}

export function localizedPath(path: string, lang: string): string {
  const clean = path.replace(/^\//, '');
  return `/${lang}/${clean}`;
}
