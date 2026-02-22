/**
 * API service for loading alignment data from backend or fixtures.
 * Designed to easily switch between fixture data and backend API.
 */

import { config } from '../config'
import {
  type AlignmentData,
  AlignmentDataSchema,
  type DataSourceConfig,
  type LanguageCode,
  SentencePairSchema,
  TranslationRequestSchema,
} from '../schemas/validation'

/**
 * Request model for translation analysis
 */
export type AnalysisRequest = {
  text: string
  source_lang: LanguageCode
  target_lang: LanguageCode
  sentence_id?: string
}

/**
 * Default configuration loaded from environment variables
 */
const DEFAULT_CONFIG: DataSourceConfig = {
  useFixtures: config.useFixtures,
  apiBaseUrl: config.apiBaseUrl,
}

/**
 * Load alignment data from fixtures (JSON file)
 */
async function loadFixtureData(): Promise<AlignmentData> {
  const response = await fetch('/resources/fixtures.json')
  if (!response.ok) {
    throw new Error(`Failed to load fixture data: ${response.statusText}`)
  }

  const data = await response.json()
  const parsed = AlignmentDataSchema.safeParse(data)

  if (!parsed.success) {
    console.error('Fixture data validation failed:', parsed.error)
    throw new Error(`Invalid fixture data format: ${parsed.error.message}`)
  }

  return parsed.data
}

/**
 * Load alignment data from backend API
 * Matches the backend alignment server endpoints
 */
async function loadApiData(config: DataSourceConfig): Promise<AlignmentData> {
  const url = `${config.apiBaseUrl}/sentences`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const parsed = AlignmentDataSchema.safeParse(data)

  if (!parsed.success) {
    console.error('API response validation failed:', parsed.error)
    throw new Error(`Invalid API response format: ${parsed.error.message}`)
  }

  return parsed.data
}

/**
 * Main function to fetch alignment data based on configuration
 */
export async function fetchAlignmentData(
  config: DataSourceConfig = DEFAULT_CONFIG
): Promise<AlignmentData> {
  if (config.useFixtures) {
    return loadFixtureData()
  }
  return loadApiData(config)
}

/**
 * Get current data source configuration
 */
export function getDataSourceConfig(): DataSourceConfig {
  return DEFAULT_CONFIG
}

/**
 * Utility to create a configuration for API mode
 */
export function createApiConfig(apiBaseUrl = '/api'): DataSourceConfig {
  return {
    useFixtures: false,
    apiBaseUrl,
  }
}

/**
 * Utility to create a configuration for fixture mode
 */
export function createFixtureConfig(): DataSourceConfig {
  return {
    useFixtures: true,
  }
}

/**
 * Submit text for translation analysis and alignment
 */
export async function submitTranslationRequest(request: AnalysisRequest): Promise<AlignmentData> {
  // Validate request before sending
  const validationResult = TranslationRequestSchema.safeParse({
    text: request.text,
    source_language: request.source_lang,
    target_language: request.target_lang,
  })

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues.map((issue) => issue.message).join(', ')
    throw new Error(`Invalid request: ${errorMessage}`)
  }

  const url = `${config.apiBaseUrl}/analyze-and-scaffold`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text,
      source_lang: request.source_lang,
      target_lang: request.target_lang,
      sentence_id: request.sentence_id || crypto.randomUUID(),
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage =
      errorData.detail || `API request failed: ${response.status} ${response.statusText}`
    throw new Error(errorMessage)
  }

  const rawData = await response.json()

  // Log the server response for debugging
  console.log('Server response:', rawData)

  // Validate the sentence pair response
  const sentencePairResult = SentencePairSchema.safeParse(rawData)
  if (!sentencePairResult.success) {
    console.error('Server response validation failed:', sentencePairResult.error)
    throw new Error(`Invalid server response format: ${sentencePairResult.error.message}`)
  }

  // The backend returns a single SentencePair, but we need AlignmentData format
  const alignmentData = {
    sentences: [sentencePairResult.data],
  }

  // Final validation of the complete response
  const finalResult = AlignmentDataSchema.safeParse(alignmentData)
  if (!finalResult.success) {
    console.error('Final alignment data validation failed:', finalResult.error)
    throw new Error(`Invalid alignment data format: ${finalResult.error.message}`)
  }

  return finalResult.data
}
