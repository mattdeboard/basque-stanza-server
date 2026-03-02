import classNames from 'classnames'
import { config } from '../config'
import { useI18n } from '../i18n'

type ModeToggleProps = {
  mode: 'input' | 'examples'
  onSwitchToInput: () => void
  onSwitchToExamples: () => void
  compact?: boolean
}

export function ModeToggle({
  mode,
  onSwitchToInput,
  onSwitchToExamples,
  compact = false,
}: ModeToggleProps) {
  const { t } = useI18n()

  if (!config.useFixtures) return null

  return (
    <div
      className={classNames(
        'bg-white/60',
        'backdrop-blur-sm',
        'border',
        'border-slate-200/60',
        'rounded-lg',
        compact ? 'p-0.5' : 'p-1',
        'flex',
        compact ? 'gap-0.5' : 'gap-1'
      )}
    >
      <button
        type="button"
        onClick={onSwitchToInput}
        className={classNames(
          'rounded-md',
          'font-medium',
          'transition-all',
          'duration-200',
          compact ? ['px-3', 'py-1.5', 'text-xs'] : ['px-4', 'py-2', 'text-sm'],
          mode === 'input' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
        )}
      >
        {t('mode.analyze_new_text')}
      </button>
      <button
        type="button"
        onClick={onSwitchToExamples}
        className={classNames(
          'rounded-md',
          'font-medium',
          'transition-all',
          'duration-200',
          compact ? ['px-3', 'py-1.5', 'text-xs'] : ['px-4', 'py-2', 'text-sm'],
          mode === 'examples'
            ? 'bg-teal-700 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        )}
      >
        {t('mode.browse_examples')}
      </button>
    </div>
  )
}
