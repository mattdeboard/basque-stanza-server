/**
 * Hook for managing translation requests to the backend
 */

import { useState, useCallback } from 'react'
import { submitTranslationRequest, type AnalysisRequest } from '../services/alignmentApi'
import type { AlignmentData, LanguageCode } from '../types/alignment'

export type UseTranslationRequestResult = {
  data: AlignmentData | null
  loading: boolean
  error: string | null
  submitRequest: (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => Promise<void>
  reset: () => void
}

/**
 * Hook for submitting translation requests and managing their state
 */
export function useTranslationRequest(): UseTranslationRequestResult {
  const [data, setData] = useState<AlignmentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitRequest = useCallback(async (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => {
    try {
      setLoading(true)
      setError(null)
      
      const request: AnalysisRequest = {
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
        sentence_id: crypto.randomUUID(),
      }
      
      const result = await submitTranslationRequest(request)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze translation'
      setError(errorMessage)
      console.error('Translation request failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    submitRequest,
    reset,
  }
}