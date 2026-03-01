/**
 * Animated title component for Xingolak easter egg
 *
 * Pure CSS typing animation of "Ribbons" in all supported languages when hovered
 */

import classNames from 'classnames'
import './AnimatedTitle.css'

interface AnimatedTitleProps {
  className?: string
}

export function AnimatedTitle({ className = '' }: AnimatedTitleProps) {
  return (
    <h1
      className={classNames(className, 'animated-title')}
      title="Hover to see 'Ribbons' in all supported languages!"
    >
      <span className="animated-text">Xingolak</span>
    </h1>
  )
}
