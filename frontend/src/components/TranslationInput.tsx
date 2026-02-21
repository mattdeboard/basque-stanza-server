import { useState } from 'react'
import { LanguageCode } from '../types/alignment'

type TranslationInputProps = {
  onSubmit: (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => void
  loading: boolean
}

const LANGUAGE_OPTIONS = [
  { code: LanguageCode.EN, name: 'English', flag: '🇺🇸' },
  { code: LanguageCode.EU, name: 'Basque', flag: '🏴' },
] as const

export function TranslationInput({ onSubmit, loading }: TranslationInputProps) {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState<LanguageCode>(LanguageCode.EN)
  const [targetLang, setTargetLang] = useState<LanguageCode>(LanguageCode.EU)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim(), sourceLang, targetLang)
  }

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
  }

  return (
    <div className="content-card max-w-4xl mx-4 sm:mx-auto p-4 sm:p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <label htmlFor="source-lang" className="text-sm font-medium text-slate-600 mb-2">
              Source Language
            </label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as LanguageCode)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
              disabled={loading}
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
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
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l-4-4" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <label htmlFor="target-lang" className="text-sm font-medium text-slate-600 mb-2">
              Target Language
            </label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 transition-all duration-200"
              disabled={loading}
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
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
          <div className="text-xs text-slate-500 mt-1 text-right">
            {text.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="px-6 py-3 bg-sage-500 text-white font-medium rounded-lg hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Translation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}