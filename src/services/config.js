/**
 * Data source configuration.
 *
 * Set USE_SUPABASE to true and fill in your Supabase credentials
 * to fetch data from your Supabase backend instead of local files.
 */
export const config = {
  USE_SUPABASE: false,

  // Get these from: https://supabase.com/dashboard → your project → Settings → API
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',

  // ─── Image API Keys (loaded from .env) ────────────────────────────
  // Anime/Manga: No key needed (Jikan API) — works out of the box!

  // Games: Sign up at https://rawg.io/apidocs → get your free API key
  RAWG_API_KEY: import.meta.env.VITE_RAWG_API_KEY || 'f35b8e7c5e554cb6aabc2021e12b44cd',

  // Movies/TV: Sign up at https://www.themoviedb.org/settings/api → get your free API key
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY || 'fad90195141b5f42da969d252be440c9',
}
