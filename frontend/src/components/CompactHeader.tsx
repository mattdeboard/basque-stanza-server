import classNames from 'classnames'
import { config } from '../config'
import { useI18n } from '../i18n'
import { AnimatedTitle } from './AnimatedTitle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ModeToggle } from './ModeToggle'

type SentenceOption = { id: string; source: { text: string } }

type CompactHeaderProps = {
  mode: 'input' | 'examples'
  onSwitchToInput: () => void
  onSwitchToExamples: () => void
  selectedId: string | null
  availableSentences: SentenceOption[]
  onSelectSentence: (id: string) => void
}

export function CompactHeader({
  mode,
  onSwitchToInput,
  onSwitchToExamples,
  selectedId,
  availableSentences,
  onSelectSentence,
}: CompactHeaderProps) {
  const { t } = useI18n()

  return (
    <div
      className={classNames(
        'sticky',
        'top-0',
        'z-40',
        'bg-tan-25/90',
        'backdrop-blur-md',
        'border-b',
        'border-slate-200/60',
        'mb-4',
        'mx-[-1rem]',
        'sm:mx-[-1.5rem]',
        'lg:mx-[-2rem]',
        'px-4',
        'sm:px-6',
        'lg:px-8'
      )}
    >
      <div className={classNames('flex', 'items-center', 'gap-3', 'h-14')}>
        <AnimatedTitle
          className={classNames(
            'text-xl',
            'font-display',
            'font-light',
            'text-slate-800',
            'tracking-tight',
            'shrink-0'
          )}
        />
        <div className="flex-1" />

        {/* Sentence selector inline when in examples mode */}
        {mode === 'examples' && config.useFixtures && (
          <select
            value={selectedId || ''}
            onChange={(e) => onSelectSentence(e.target.value)}
            className={classNames(
              'text-sm',
              'border',
              'border-slate-200',
              'rounded-lg',
              'bg-white/80',
              'backdrop-blur-sm',
              'px-2',
              'py-1.5',
              'max-w-48',
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
        )}

        <ModeToggle
          mode={mode}
          onSwitchToInput={onSwitchToInput}
          onSwitchToExamples={onSwitchToExamples}
          compact
        />

        <LanguageSwitcher compact />
      </div>
    </div>
  )
}
