/**
 * Image fetching service — pulls cover art from free APIs by title.
 *
 * - Anime/Manga: Jikan API (no key needed)
 * - Games: RAWG API (free key from rawg.io/apidocs)
 * - Movies/TV: TMDB API (free key from themoviedb.org)
 *
 * All results are cached in localStorage to avoid re-fetching.
 */

import { config } from './config'

const CACHE_PREFIX = 'img_cache_'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { url, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return url
  } catch {
    return null
  }
}

function setCache(key, url) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ url, ts: Date.now() }))
  } catch {
    // localStorage full or unavailable — ignore
  }
}

// ─── Anime / Manga (Jikan v4 — no key needed) ─────────────────────

export async function fetchAnimeImage(title) {
  const cacheKey = `anime_${title}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`,
    )
    if (!res.ok) return null
    const json = await res.json()
    const url = json.data?.[0]?.images?.jpg?.large_image_url || null
    if (url) setCache(cacheKey, url)
    return url
  } catch {
    return null
  }
}

export async function fetchMangaImage(title) {
  const cacheKey = `manga_${title}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(title)}&limit=1`,
    )
    if (!res.ok) return null
    const json = await res.json()
    const url = json.data?.[0]?.images?.jpg?.large_image_url || null
    if (url) setCache(cacheKey, url)
    return url
  } catch {
    return null
  }
}

export async function fetchAnimeOrMangaImage(title, type) {
  if (type === 'Manga') return fetchMangaImage(title)
  // For "Anime & Manga" or "Anime", search anime first
  const animeImg = await fetchAnimeImage(title)
  if (animeImg) return animeImg
  return fetchMangaImage(title)
}

// ─── Games (RAWG API — free key from rawg.io) ─────────────────────

export async function fetchGameImage(title) {
  if (!config.RAWG_API_KEY) return null

  const cacheKey = `game_${title}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${config.RAWG_API_KEY}&search=${encodeURIComponent(title)}&page_size=1`,
    )
    if (!res.ok) return null
    const json = await res.json()
    const url = json.results?.[0]?.background_image || null
    if (url) setCache(cacheKey, url)
    return url
  } catch {
    return null
  }
}

// ─── Movies & TV (TMDB API — free key from themoviedb.org) ────────

export async function fetchMovieImage(title, type = 'Movie') {
  if (!config.TMDB_API_KEY) return null

  const cacheKey = `movie_${title}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const endpoint = type === 'TV Series' ? 'search/tv' : 'search/movie'

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${config.TMDB_API_KEY}&query=${encodeURIComponent(title)}&page=1`,
    )
    if (!res.ok) return null
    const json = await res.json()
    const item = json.results?.[0]
    const path = item?.poster_path || item?.backdrop_path
    const url = path ? `https://image.tmdb.org/t/p/w500${path}` : null
    if (url) setCache(cacheKey, url)
    return url
  } catch {
    return null
  }
}

// ─── Batch helpers (with rate-limit spacing) ───────────────────────

async function batchFetch(items, fetchFn, delay = 350) {
  const results = []
  for (const item of items) {
    const url = await fetchFn(item)
    results.push(url)
    // Small delay to respect rate limits
    if (delay > 0) await new Promise((r) => setTimeout(r, delay))
  }
  return results
}

export async function fetchAllGameImages(games) {
  return batchFetch(games, (g) => fetchGameImage(g.title))
}

export async function fetchAllAnimeImages(animeList) {
  // Jikan has a 3 req/sec limit, so space out requests
  return batchFetch(animeList, (a) => fetchAnimeOrMangaImage(a.title, a.type), 400)
}

export async function fetchAllMovieImages(movies) {
  return batchFetch(movies, (m) => fetchMovieImage(m.title, m.type))
}
