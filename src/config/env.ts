/**
 * A utility function to return the current
 * Vite mode. Mostly introduced to be able
 * to mock the mode in Vitest tests.
 */
export const env = () => {
  return import.meta.env.MODE
}

/**
 * Checks if the current Vite mode is production.
 * @returns true if the current mode is production, else false.
 */
export const isProduction = (): boolean => {
  return env() === 'production'
}