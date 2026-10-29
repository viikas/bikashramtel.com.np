/**
 * Element id named by a URL hash. Malformed percent-encoding (e.g. "#%")
 * falls back to the raw text instead of throwing.
 */

export function hashTarget(hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}
