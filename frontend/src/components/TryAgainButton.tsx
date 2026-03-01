import classNames from 'classnames'
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
      className={
        className ||
        classNames(
          'px-4',
          'py-2',
          'bg-teal-700',
          'text-white',
          'rounded-lg',
          'hover:bg-teal-800',
          'transition-colors'
        )
      }
      type="button"
    >
      {t('error.try_again')}
    </button>
  )
}
