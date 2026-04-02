import { useState, useEffect } from 'react'

/**
 * Hook that fetches images for a list of items using a provided fetch function.
 * Returns a Map of title → imageUrl.
 *
 * Usage:
 *   const images = useImages(games, fetchAllGameImages)
 *   <img src={images.get(game.title)} />
 */
export function useImages(items, batchFetchFn) {
  const [images, setImages] = useState(new Map())

  useEffect(() => {
    if (!items || items.length === 0) return

    let cancelled = false

    batchFetchFn(items).then((urls) => {
      if (cancelled) return
      const map = new Map()
      items.forEach((item, i) => {
        if (urls[i]) map.set(item.title, urls[i])
      })
      setImages(map)
    })

    return () => { cancelled = true }
  }, [items])

  return images
}
