/**
 * Frontend configuration loaded from environment variables
 */

export const config = {
  useFixtures: import.meta.env.VITE_USE_FIXTURES === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
} as const
