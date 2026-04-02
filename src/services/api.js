import { config } from './config'

/**
 * Unified data API.
 *
 * When USE_SUPABASE is false (default), data comes from local JS files.
 * When USE_SUPABASE is true, data is fetched from your Supabase backend.
 *
 * All functions return the same shape regardless of source.
 */

export async function getGaming() {
  if (config.USE_SUPABASE) {
    const { fetchGaming } = await import('./supabase')
    return fetchGaming()
  }
  const { gaming } = await import('../data/gaming')
  return gaming
}

export async function getAnime() {
  if (config.USE_SUPABASE) {
    const { fetchAnime } = await import('./supabase')
    return fetchAnime()
  }
  const { anime } = await import('../data/anime')
  return anime
}

export async function getMovies() {
  if (config.USE_SUPABASE) {
    const { fetchMovies } = await import('./supabase')
    return fetchMovies()
  }
  const { movies } = await import('../data/movies')
  return movies
}

export async function getDIYProjects() {
  if (config.USE_SUPABASE) {
    const { fetchDIYProjects } = await import('./supabase')
    return fetchDIYProjects()
  }
  const { diy } = await import('../data/diy')
  return diy
}

export async function getArtworks() {
  if (config.USE_SUPABASE) {
    const { fetchArtworks } = await import('./supabase')
    return fetchArtworks()
  }
  const { artworks } = await import('../data/artworks')
  return artworks
}

export async function getAbout() {
  if (config.USE_SUPABASE) {
    const { fetchAbout } = await import('./supabase')
    return fetchAbout()
  }
  const { about } = await import('../data/about')
  return about
}

export async function getSkills() {
  if (config.USE_SUPABASE) {
    const { fetchSkills } = await import('./supabase')
    return fetchSkills()
  }
  const { skills } = await import('../data/skills')
  return skills
}
