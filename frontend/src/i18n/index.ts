/**
 * I18n system for Xingolak frontend
 *
 * Provides React context and hooks for internationalization support.
 * Translations are loaded at runtime from the translations file.
 */

import { createContext, useContext } from 'react'
import { LanguageCode } from '../types/alignment'
import { type TranslationKey, translations } from './translations'

export interface I18nContextValue {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey, params?: { [key: string]: string | number }) => string
  availableLanguages: LanguageCode[]
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

/**
 * Hook to access i18n functionality
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

/**
 * Translation function that interpolates parameters
 */
export function createTranslationFunction(language: LanguageCode) {
  return function t(key: TranslationKey, params?: { [key: string]: string | number }): string {
    let translation = translations[language][key] || translations[LanguageCode.EN][key] || key

    // Simple parameter interpolation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value))
      })
    }

    return translation
  }
}

/**
 * Get language name in the current language
 */
export function getLanguageName(targetLang: LanguageCode, currentLang: LanguageCode): string {
  const t = createTranslationFunction(currentLang)
  return t(`lang.${targetLang}` as TranslationKey)
}

/**
 * Detect browser language preference, fallback to English
 */
export function detectBrowserLanguage(): LanguageCode {
  const browserLang = navigator.language.toLowerCase().split('-')[0]

  // Check if browser language is supported
  const supportedLanguages = Object.values(LanguageCode) as string[]
  if (supportedLanguages.includes(browserLang)) {
    return browserLang as LanguageCode
  }

  // Default to English
  return LanguageCode.EN
}

export * from './translations'
