/**
 * I18n Provider component for Xingolak
 *
 * Manages language state and provides translation functionality to the app
 */

import { type ReactNode, useEffect, useState } from 'react'
import { LanguageCode } from '../types/alignment'
import {
  createTranslationFunction,
  detectBrowserLanguage,
  I18nContext,
  type I18nContextValue,
} from './index'

interface I18nProviderProps {
  children: ReactNode
}

const LANGUAGE_STORAGE_KEY = 'xingolak-language'

export function I18nProvider({ children }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    // Try to load saved language preference, fallback to browser detection
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved && Object.values(LanguageCode).includes(saved as LanguageCode)) {
      return saved as LanguageCode
    }
    return detectBrowserLanguage()
  })

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  const t = createTranslationFunction(currentLanguage)

  const availableLanguages = Object.values(LanguageCode)

  // Update document title when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  const contextValue: I18nContextValue = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}
