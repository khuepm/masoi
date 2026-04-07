import en, { Translations, TranslationKeys } from './en';
import vi from './vi';

export type Language = 'en' | 'vi';

export const languages: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
};

const translations: Record<Language, Translations> = { en, vi };

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export type { Translations, TranslationKeys };
