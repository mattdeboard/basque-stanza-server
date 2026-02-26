import { useI18n } from '../i18n'

type TryAgainButtonProps = {
  onTryAgain: () => void
  className?: string
}

export function TryAgainButton({ onTryAgain, className }: TryAgainButtonProps) {
  const { t } = useI18n()

  return (
    <button
      onClick={onTryAgain}
      className={className || 'px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors'}
      type="button"
    >
      {t('error.try_again')}
    </button>
  )
}