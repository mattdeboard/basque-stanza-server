import { z } from 'zod'

/**
 * Zod validation schemas for runtime type safety
 * Based on types from frontend/src/types/alignment.ts
 */

export const LanguageCodeSchema = z.enum(['eu', 'en', 'es', 'fr'], {
  message: 'Language must be one of: eu (Basque), en (English), es (Spanish), fr (French)',
})

export const LayerTypeSchema = z.enum(['lexical', 'grammatical_relations', 'features'])

export const TokenSchema = z.object({
  id: z.string().min(1, 'Token ID is required'),
  form: z.string().min(1, 'Token form is required'),
  lemma: z.string().min(1, 'Token lemma is required'),
  pos: z.string().min(1, 'Token POS is required'),
  features: z.array(z.string()).default([]),
})

export const TokenizedSentenceSchema = z.object({
  lang: LanguageCodeSchema,
  text: z.string().min(1, 'Sentence text is required'),
  tokens: z.array(TokenSchema),
})

export const AlignmentSchema = z.object({
  source: z.array(z.string().min(1)).min(1, 'Source tokens are required'),
  target: z.array(z.string().min(1)).min(1, 'Target tokens are required'),
  label: z.string().min(1, 'Alignment label is required'),
})

export const AlignmentLayersSchema = z.object({
  lexical: z.array(AlignmentSchema).default([]),
  grammatical_relations: z.array(AlignmentSchema).default([]),
  features: z.array(AlignmentSchema).default([]),
})

export const SentencePairSchema = z.object({
  id: z.string().min(1, 'Sentence pair ID is required'),
  source: TokenizedSentenceSchema,
  target: TokenizedSentenceSchema,
  layers: AlignmentLayersSchema,
})

export const AlignmentDataSchema = z.object({
  sentences: z.array(SentencePairSchema),
})

/**
 * Translation request validation schema with Basque constraint
 */
export const TranslationRequestSchema = z
  .object({
    text: z.string().min(1, 'Text is required').max(500, 'Text must be 500 characters or less'),
    source_language: LanguageCodeSchema,
    target_language: LanguageCodeSchema,
  })
  .refine((data) => data.source_language === 'eu' || data.target_language === 'eu', {
    message: 'Either source or target language must be Basque (eu)',
    path: ['language_constraint'],
  })
  .refine((data) => data.source_language !== data.target_language, {
    message: 'Source and target languages must be different',
    path: ['language_match'],
  })

/**
 * Configuration schema
 */
export const DataSourceConfigSchema = z.object({
  useFixtures: z.boolean().default(false),
  apiBaseUrl: z.string().url().optional(),
})

/**
 * Hook return type schemas
 */
export const UseAlignmentDataResultSchema = z.object({
  data: AlignmentDataSchema.nullable(),
  loading: z.boolean(),
  error: z.string().nullable(),
  refetch: z.function(),
})

// Export inferred types for use in components
export type LanguageCode = z.infer<typeof LanguageCodeSchema>
export type LayerType = z.infer<typeof LayerTypeSchema>
export type Token = z.infer<typeof TokenSchema>
export type TokenizedSentence = z.infer<typeof TokenizedSentenceSchema>
export type Alignment = z.infer<typeof AlignmentSchema>
export type AlignmentLayers = z.infer<typeof AlignmentLayersSchema>
export type SentencePair = z.infer<typeof SentencePairSchema>
export type AlignmentData = z.infer<typeof AlignmentDataSchema>
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>
export type DataSourceConfig = z.infer<typeof DataSourceConfigSchema>
