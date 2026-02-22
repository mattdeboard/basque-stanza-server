import { useEffect, useState } from 'react'
import { getLanguageName, useI18n } from '../i18n'
import { LanguageCode } from '../types/alignment'

type TranslationInputProps = {
  onSubmit: (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => void
  loading: boolean
  compact?: boolean
}

const LANGUAGE_FLAGS = {
  [LanguageCode.EN]: '🇺🇸',
  [LanguageCode.ES]: '🇪🇸',
  [LanguageCode.FR]: '🇫🇷',
  [LanguageCode.EU]: '🔴⚪🟢',
} as const

export function TranslationInput({ onSubmit, loading, compact = false }: TranslationInputProps) {
  const { t, currentLanguage } = useI18n()
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState<LanguageCode>(LanguageCode.EN)
  const [targetLang, setTargetLang] = useState<LanguageCode>(LanguageCode.EU)
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [validationError, setValidationError] = useState<string>('')

  // Check if current language pair is valid (one must be Basque)
  const isValidLanguagePair = sourceLang === LanguageCode.EU || targetLang === LanguageCode.EU
  const canSubmit = text.trim() && isValidLanguagePair

  const handleSourceLanguageChange = (newSourceLang: LanguageCode) => {
    setSourceLang(newSourceLang)

    // If new source is not Basque and target is not Basque, auto-set target to Basque
    if (newSourceLang !== LanguageCode.EU && targetLang !== LanguageCode.EU) {
      setTargetLang(LanguageCode.EU)
      setValidationError('')
    }
    // If new source equals target, swap them
    else if (newSourceLang === targetLang) {
      setTargetLang(sourceLang)
    }
    // Clear any validation errors if pair becomes valid
    else if (newSourceLang === LanguageCode.EU || targetLang === LanguageCode.EU) {
      setValidationError('')
    }
  }

  const handleTargetLanguageChange = (newTargetLang: LanguageCode) => {
    setTargetLang(newTargetLang)

    // If new target is not Basque and source is not Basque, auto-set source to Basque
    if (newTargetLang !== LanguageCode.EU && sourceLang !== LanguageCode.EU) {
      setSourceLang(LanguageCode.EU)
      setValidationError('')
    }
    // If new target equals source, swap them
    else if (newTargetLang === sourceLang) {
      setSourceLang(targetLang)
    }
    // Clear any validation errors if pair becomes valid
    else if (newTargetLang === LanguageCode.EU || sourceLang === LanguageCode.EU) {
      setValidationError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    // Validate language pair before submitting
    if (!isValidLanguagePair) {
      setValidationError('Either source or target language must be Basque') // TODO: Add translation key
      return
    }

    setValidationError('')
    onSubmit(text.trim(), sourceLang, targetLang)
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
  }

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && compact && isExpanded) {
        setIsExpanded(false)
      }
    }

    if (compact && isExpanded) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [compact, isExpanded])

  if (compact && !isExpanded) {
    // Floating Action Button (FAB) - minimal presence
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-sage-500 hover:bg-sage-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
          aria-label={t('mode.analyze_new_text')}
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title id="analyze-text-btn-icon">Analyze Text Button Icon</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    )
  }

  if (compact) {
    // Slide-out drawer from the right
    return (
      <>
        {/* Backdrop */}
        <button
          type="button"
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 border-none p-0 cursor-default"
          onClick={() => setIsExpanded(false)}
          aria-label="Close drawer"
        />

        {/* Drawer */}
        <div className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800">{t('mode.analyze_new_text')}</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200"
                type="button"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title id="drawer-close-btn-icon">Drawer Close Button Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Language Selection */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="source-lang"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t('input.source_language')}
                    </label>
                    <select
                      id="source-lang"
                      value={sourceLang}
                      onChange={(e) => handleSourceLanguageChange(e.target.value as LanguageCode)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
                      disabled={loading}
                    >
                      {Object.values(LanguageCode).map((langCode) => (
                        <option key={langCode} value={langCode}>
                          {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={swapLanguages}
                      disabled={loading}
                      className="p-2 rounded-full hover:bg-sage-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 disabled:opacity-50"
                      aria-label="Swap languages"
                    >
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title id="swap-language-btn-icon">Swap Language Button Icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l-4-4"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="target-lang"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t('input.target_language')}
                    </label>
                    <select
                      id="target-lang"
                      value={targetLang}
                      onChange={(e) => handleTargetLanguageChange(e.target.value as LanguageCode)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
                      disabled={loading}
                    >
                      {Object.values(LanguageCode).map((langCode) => (
                        <option key={langCode} value={langCode}>
                          {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Text Input */}
                <div>
                  <label
                    htmlFor="input-text"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Enter text to translate and analyze
                  </label>
                  <textarea
                    id="input-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your sentence here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm resize-none focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200 placeholder:text-slate-400"
                    disabled={loading}
                    maxLength={500}
                  />
                  <div className="text-xs text-slate-500 mt-1 text-right">
                    {text.length}/500 characters
                  </div>
                </div>

                {/* Validation Error Display */}
                {validationError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    {validationError}
                  </div>
                )}
              </form>
            </div>

            {/* Footer with Submit Button */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                type="submit"
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
                className="w-full bg-sage-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <title id="analyzing-spinner-icon">Analyzing Spinner Icon</title>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('input.analyzing_button')}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title id="analyze-btn-icon">Analyze Button Icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {t('input.analyze_button')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Normal mode - full form
  return (
    <div className="content-card max-w-4xl mx-4 sm:mx-auto p-4 sm:p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <label htmlFor="source-lang" className="text-sm font-medium text-slate-600 mb-2">
              {t('input.source_language')}
            </label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => handleSourceLanguageChange(e.target.value as LanguageCode)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
              disabled={loading}
            >
              {Object.values(LanguageCode).map((langCode) => (
                <option key={langCode} value={langCode}>
                  {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swapLanguages}
            disabled={loading}
            className="p-2 rounded-full hover:bg-sage-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-1 disabled:opacity-50"
            aria-label="Swap source and target languages"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title id="clear-text-btn-icon">Clear Text Button Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l-4-4"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <label htmlFor="target-lang" className="text-sm font-medium text-slate-600 mb-2">
              {t('input.target_language')}
            </label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => handleTargetLanguageChange(e.target.value as LanguageCode)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
              disabled={loading}
            >
              {Object.values(LanguageCode).map((langCode) => (
                <option key={langCode} value={langCode}>
                  {LANGUAGE_FLAGS[langCode]} {getLanguageName(langCode, currentLanguage)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label htmlFor="input-text" className="block text-sm font-medium text-slate-700 mb-2">
            Enter text to translate and analyze
          </label>
          <textarea
            id="input-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your sentence here..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-base resize-none focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200 placeholder:text-slate-400"
            disabled={loading}
            maxLength={500}
          />
          <div className="text-xs text-slate-500 mt-1 text-right">{text.length}/500 characters</div>
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            {validationError}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="px-6 py-3 bg-sage-500 text-white font-medium rounded-lg hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <title id="translation-spinner-icon">Translation Spinner Icon</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t('input.analyzing_button')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title id="analyze-translation-btn-icon">Analyze Translation button icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {t('input.analyze_button')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
