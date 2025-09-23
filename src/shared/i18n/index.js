import { vi } from './translations/vi.js';
import { en } from './translations/en.js';

// Available languages
export const languages = {
  vi: { name: 'Tiếng Việt', nativeName: 'Vietnamese', flag: 'VN' },
  en: { name: 'English', nativeName: 'English', flag: 'US' }
};

// Translation resources
export const translations = {
  vi,
  en
};

// Default language
export const defaultLanguage = 'vi';

// Get nested translation value
export const getNestedTranslation = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
};
