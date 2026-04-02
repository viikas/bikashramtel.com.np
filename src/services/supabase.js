import { config } from './config'

/**
 * Lightweight Supabase REST client — no SDK dependency needed.
 * Uses the PostgREST auto-generated API that every Supabase project exposes.
 *
 * To set up your Supabase tables:
 *   1. Create a Supabase project at https://supabase.com
 *   2. Create tables: gaming, anime, movies, diy_projects, artworks, about
 *   3. Insert your data via the Table Editor (it's like a spreadsheet)
 *   4. Copy your project URL and anon key into config.js
 *   5. Set USE_SUPABASE to true
 */

const headers = {
  apikey: config.SUPABASE_ANON_KEY,
  Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

async function query(table) {
  const res = await fetch(`${config.SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers,
  })
  if (!res.ok) throw new Error(`Supabase query failed: ${table}`)
  return res.json()
}

export async function fetchGaming() {
  const [games, stats] = await Promise.all([
    query('games'),
    query('gaming_stats'),
  ])
  const currently = games.find((g) => g.status === 'In Progress')
  return {
    currentlyPlaying: currently || null,
    favorites: games.filter((g) => g.is_favorite),
    stats: stats[0] || {},
  }
}

export async function fetchAnime() {
  const [items, stats] = await Promise.all([
    query('anime'),
    query('anime_stats'),
  ])
  const currently = items.find((a) => a.status === 'Watching')
  return {
    currentlyWatching: currently || null,
    favorites: items.filter((a) => a.is_favorite),
    stats: stats[0] || {},
  }
}

export async function fetchMovies() {
  const [items, stats] = await Promise.all([
    query('movies'),
    query('movie_stats'),
  ])
  const currently = items.find((m) => m.status === 'Watching')
  return {
    currentlyWatching: currently || null,
    favorites: items.filter((m) => m.is_favorite),
    stats: stats[0] || {},
  }
}

export async function fetchDIYProjects() {
  const [projects, stats] = await Promise.all([
    query('diy_projects'),
    query('diy_stats'),
  ])
  return { projects, stats: stats[0] || {} }
}

export async function fetchArtworks() {
  const [pieces, stats] = await Promise.all([
    query('artworks'),
    query('art_stats'),
  ])
  return { pieces, stats: stats[0] || {} }
}

export async function fetchAbout() {
  const rows = await query('about')
  return rows[0] || {}
}
