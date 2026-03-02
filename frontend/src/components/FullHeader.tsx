import classNames from 'classnames'
import { config } from '../config'
import { useI18n } from '../i18n'
import type { LanguageCode } from '../types/alignment'
import { AnimatedTitle } from './AnimatedTitle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ModeToggle } from './ModeToggle'
import { TranslationInput } from './TranslationInput'

type SentenceOption = { id: string; source: { text: string } }

type FullHeaderProps = {
  mode: 'input' | 'examples'
  onSwitchToInput: () => void
  onSwitchToExamples: () => void
  translationLoading: boolean
  onSubmit: (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => void
  initialText: string
  initialSourceLang: LanguageCode | undefined
  initialTargetLang: LanguageCode | undefined
  selectedId: string | null
  availableSentences: SentenceOption[]
  onSelectSentence: (id: string) => void
}

export function FullHeader({
  mode,
  onSwitchToInput,
  onSwitchToExamples,
  translationLoading,
  onSubmit,
  initialText,
  initialSourceLang,
  initialTargetLang,
  selectedId,
  availableSentences,
  onSelectSentence,
}: FullHeaderProps) {
  const { t } = useI18n()

  return (
    <header className={classNames('text-center', 'mb-3', 'sm:mb-4')}>
      <div className={classNames('flex', 'justify-end', 'mb-4')}>
        <LanguageSwitcher compact />
      </div>
      <AnimatedTitle
        className={classNames(
          'text-3xl',
          'sm:text-4xl',
          'lg:text-5xl',
          'font-display',
          'font-light',
          'mb-2',
          'text-slate-800',
          'tracking-tight'
        )}
      />
      <h2
        className={classNames(
          'text-lg',
          'sm:text-xl',
          'font-light',
          'text-slate-500',
          'mb-3',
          'max-w-2xl',
          'mx-auto',
          'leading-relaxed',
          'px-4',
          'sm:px-0'
        )}
      >
        {t('app.subtitle')}
      </h2>

      {/* Mode Toggle */}
      <div className={classNames('flex', 'justify-center', 'mb-4')}>
        <ModeToggle
          mode={mode}
          onSwitchToInput={onSwitchToInput}
          onSwitchToExamples={onSwitchToExamples}
        />
      </div>

      {/* Translation Input Form */}
      {mode === 'input' && (
        <TranslationInput
          onSubmit={onSubmit}
          loading={translationLoading}
          compact={false}
          initialText={initialText}
          initialSourceLang={initialSourceLang}
          initialTargetLang={initialTargetLang}
        />
      )}

      {/* Example Sentence Selector */}
      {mode === 'examples' && config.useFixtures && (
        <div
          className={classNames(
            'content-card',
            'max-w-2xl',
            'mx-4',
            'sm:mx-auto',
            'p-4',
            'sm:p-6'
          )}
        >
          <div
            className={classNames(
              'flex',
              'flex-col',
              'sm:flex-row',
              'items-center',
              'justify-center',
              'gap-3',
              'sm:gap-6'
            )}
          >
            <label
              htmlFor="sentence-select"
              className={classNames(
                'font-medium',
                'text-slate-600',
                'text-xs',
                'sm:text-sm',
                'uppercase',
                'tracking-wider'
              )}
            >
              {t('examples.choose_sentence')}
            </label>
            <select
              id="sentence-select"
              value={selectedId || ''}
              onChange={(e) => onSelectSentence(e.target.value)}
              className={classNames(
                'px-3',
                'sm:px-4',
                'py-2',
                'sm:py-3',
                'border',
                'border-slate-200',
                'rounded-lg',
                'bg-white/80',
                'backdrop-blur-sm',
                'text-sm',
                'sm:text-base',
                'w-full',
                'sm:min-w-80',
                'focus:outline-none',
                'focus:border-teal-500',
                'focus:ring-2',
                'focus:ring-teal-200',
                'transition-all',
                'duration-200'
              )}
              aria-label={t('examples.choose_sentence_aria')}
            >
              {availableSentences.map((sentence) => (
                <option key={sentence.id} value={sentence.id}>
                  {sentence.id}: {sentence.source.text}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  )
}
