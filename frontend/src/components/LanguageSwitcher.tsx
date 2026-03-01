/**
 * Language switcher component for Xingolak
 */

import classNames from 'classnames'
import { getLanguageName, useI18n } from '../i18n'
import { LanguageCode } from '../types/alignment'

const LANGUAGE_FLAGS = {
  [LanguageCode.EN]: '🇺🇸',
  [LanguageCode.ES]: '🇪🇸',
  [LanguageCode.FR]: '🇫🇷',
  [LanguageCode.EU]: '🔴⚪🟢',
} as const

interface LanguageSwitcherProps {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, availableLanguages } = useI18n()

  if (compact) {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className={classNames(
          'px-2',
          'py-1',
          'text-xs',
          'border',
          'border-slate-200',
          'rounded-md',
          'bg-white/80',
          'backdrop-blur-sm',
          'focus:outline-none',
          'focus:border-teal-500',
          'focus:ring-1',
          'focus:ring-teal-200',
          'transition-all',
          'duration-200'
        )}
        aria-label="Select interface language"
      >
        {availableLanguages.map((langCode) => (
          <option key={langCode} value={langCode}>
            {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className={classNames('flex', 'items-center', 'gap-2')}>
      <span
        className={classNames(
          'text-xs',
          'font-medium',
          'text-slate-600',
          'uppercase',
          'tracking-wider'
        )}
      >
        Language
      </span>
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className={classNames(
          'px-3',
          'py-2',
          'border',
          'border-slate-200',
          'rounded-lg',
          'bg-white/80',
          'backdrop-blur-sm',
          'text-sm',
          'focus:outline-none',
          'focus:border-teal-500',
          'focus:ring-2',
          'focus:ring-teal-200',
          'transition-all',
          'duration-200'
        )}
        aria-label="Select interface language"
      >
        {availableLanguages.map((langCode) => (
          <option key={langCode} value={langCode}>
            {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
          </option>
        ))}
      </select>
    </div>
  )
}
