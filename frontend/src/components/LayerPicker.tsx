import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import { type TranslationKey, useI18n } from '../i18n'
import { LayerType } from '../types/alignment'

type LayerConfig = {
  name: string
  displayName: TranslationKey
  color: string
  colorLight: string // color at ~12% opacity composited over tan-50 (#fdf8f3)
}

export const LAYER_CONFIGS: Record<LayerType, LayerConfig> = {
  [LayerType.LEXICAL]: {
    name: LayerType.LEXICAL,
    displayName: 'layer.lexical',
    color: '#3a634b', // sage-700 (forest green, 6.5:1 contrast on tan-50 bg; active text 5.4:1)
    colorLight: '#e5e5de',
  },
  [LayerType.GRAMMATICAL_RELATIONS]: {
    name: LayerType.GRAMMATICAL_RELATIONS,
    displayName: 'layer.grammatical_relations',
    color: '#7b4fa5', // purple/violet (5.7:1 contrast on tan-50 bg)
    colorLight: '#ede3e9',
  },
  [LayerType.FEATURES]: {
    name: LayerType.FEATURES,
    displayName: 'layer.features',
    color: '#92400e', // amber-800 (deep amber, ~6:1 contrast on tan-50 bg)
    colorLight: '#f0e1d6',
  },
}

const LAYER_TOOLTIPS: Record<LayerType, TranslationKey> = {
  [LayerType.LEXICAL]: 'layer.lexical_tooltip',
  [LayerType.GRAMMATICAL_RELATIONS]: 'layer.grammatical_relations_tooltip',
  [LayerType.FEATURES]: 'layer.features_tooltip',
}

type LayerPickerProps = {
  currentLayer: LayerType
  setVizLayer: (layer: LayerType) => void
}

export function LayerPicker({ currentLayer, setVizLayer }: LayerPickerProps) {
  const { t } = useI18n()
  const tabListRef = useRef<HTMLDivElement>(null)

  // Focus the active tab when currentLayer changes (from external sources)
  useEffect(() => {
    const activeButton = tabListRef.current?.querySelector(
      `[aria-selected="true"]`
    ) as HTMLButtonElement
    if (activeButton && document.activeElement !== activeButton) {
      activeButton.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent, currentLayerKey: string) => {
    const layerEntries = Object.entries(LAYER_CONFIGS)
    const currentIndex = layerEntries.findIndex(([key]) => key === currentLayerKey)

    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (currentIndex + 1) % layerEntries.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (currentIndex - 1 + layerEntries.length) % layerEntries.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = layerEntries.length - 1
        break
      default:
        return
    }

    const nextLayer = layerEntries[nextIndex][0] as LayerType
    setVizLayer(nextLayer)

    // Focus will be handled by the useEffect above
  }
  return (
    <nav
      className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 mx-auto animate-on-load"
      style={{ animationDelay: '200ms' }}
      aria-label="Alignment layer selection"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          ref={tabListRef}
          className="flex-1 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start"
          role="tablist"
          aria-label="Choose alignment analysis layer"
        >
          {Object.entries(LAYER_CONFIGS).map(([layerKey, config]) => {
            const isActive = currentLayer === layerKey
            return (
              <button
                key={layerKey}
                onClick={() => setVizLayer(layerKey as LayerType)}
                className={classNames(
                  'px-2',
                  'sm:px-3',
                  'py-1',
                  'sm:py-1.5',
                  'rounded-full',
                  'text-xs',
                  'sm:text-sm',
                  'font-medium',
                  'flex',
                  'items-center',
                  'gap-1',
                  'sm:gap-2',
                  'min-h-10',
                  'transition-all',
                  'duration-200',
                  'border-2',
                  'focus:outline-none',
                  'focus:ring-2',
                  'focus:ring-offset-2',
                  'focus:ring-sage-400',
                  isActive ? 'shadow-md' : 'hover:shadow-sm focus:shadow-sm'
                )}
                role="tab"
                aria-selected={isActive}
                aria-controls="alignment-visualization"
                aria-label={`${t(config.displayName)} layer: ${t(LAYER_TOOLTIPS[layerKey as LayerType])}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onKeyDown={(e) => handleKeyDown(e, layerKey)}
                style={
                  isActive
                    ? {
                        backgroundColor: config.color,
                        borderColor: config.color,
                        color: config.colorLight,
                      }
                    : {
                        backgroundColor: `${config.color}20`,
                        borderColor: config.color,
                        color: config.color,
                      }
                }
              >
                <div
                  className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isActive ? config.colorLight : config.color }}
                />
                <span className={classNames('truncate', isActive && 'font-bold')}>
                  {t(config.displayName)}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex-1 hidden sm:flex items-center">
          <p
            key={currentLayer}
            className="text-lg font-display italic animate-fade-in"
            style={{ color: LAYER_CONFIGS[currentLayer].color }}
            aria-hidden="true"
          >
            {t(LAYER_TOOLTIPS[currentLayer])}
          </p>
        </div>
      </div>
    </nav>
  )
}
