import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'

type LoadingIndicatorProps = {
  mode: 'input' | 'examples'
}

type ProgressStep = {
  name: string
  status: 'pending' | 'active' | 'completed'
}

export function LoadingIndicator({ mode }: LoadingIndicatorProps) {
  const { t } = useI18n()
  const [steps, setSteps] = useState<ProgressStep[]>([])

  // Initialize steps with translations
  useEffect(() => {
    setSteps([
      { name: t('loading.step_translating'), status: 'pending' },
      { name: t('loading.step_analyzing'), status: 'pending' },
      { name: t('loading.step_generating_alignments'), status: 'pending' },
    ])
  }, [t])

  useEffect(() => {
    if (mode !== 'input') return

    // Simulate realistic progress timing - but never reach 100%
    const intervals = [1500, 4000] // Transition between steps, but stay in progress

    const updateProgress = (stepIndex: number) => {
      setSteps((prev) =>
        prev.map((step, i) => ({
          ...step,
          status: i < stepIndex ? 'completed' : i === stepIndex ? 'active' : 'pending',
        }))
      )
    }

    // Start first step immediately
    updateProgress(0)

    const timeouts: NodeJS.Timeout[] = []

    intervals.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        updateProgress(index + 1)
      }, delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [mode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-tan-25 via-tan-50 to-tan-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light mb-2 text-slate-800 tracking-tight">
            Xingolak
          </h1>
          <h2 className="text-lg sm:text-xl font-light text-slate-500 mb-6 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            {t('app.loading.subtitle')}
          </h2>
        </header>

        <div className="flex flex-col items-center justify-center py-12">
          {/* Progress Spinner */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-700 rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-300 rounded-full animate-spin animate-reverse"
              style={{ animationDuration: '1.5s' }}
            ></div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {mode === 'input'
                  ? t('loading.analyzing_translation')
                  : t('loading.loading_alignment_data')}
              </h3>
              <p className="text-sm text-slate-600">
                {mode === 'input' ? t('loading.processing_text') : t('loading.loading_examples')}
              </p>
            </div>

            {mode === 'input' && (
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.name} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {step.status === 'completed' ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title id="step-completed-icon">Step Completed Icon</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : step.status === 'active' ? (
                        <div className="w-3 h-3 bg-teal-700 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        step.status === 'completed'
                          ? 'text-green-700 font-medium'
                          : step.status === 'active'
                            ? 'text-slate-700'
                            : 'text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-4 max-w-sm text-center">
            {t('loading.time_estimate')}
          </p>
        </div>
      </div>
    </div>
  )
}
