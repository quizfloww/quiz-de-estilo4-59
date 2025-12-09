/**
 * Supabase helper utilities
 */

/**
 * Check if Supabase is properly configured and available
 */
export const isSupabaseAvailable = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
};
