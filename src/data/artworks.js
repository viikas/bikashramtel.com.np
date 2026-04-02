/**
 * Each piece has a unique CSS art style defined by multiple layered properties.
 * These create abstract generative visuals using pure CSS.
 */
export const artworks = {
  pieces: [
    {
      title: 'Mountain Sunrise',
      medium: 'Acrylic on Canvas',
      year: 2025,
      css: {
        background: `
          radial-gradient(ellipse 80% 50% at 50% 100%, #e8a04d55 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 30% 70%, #e85d4044 0%, transparent 60%),
          radial-gradient(ellipse 50% 30% at 70% 60%, #e8a04d33 0%, transparent 50%),
          linear-gradient(180deg, #0a0812 0%, #1a0f1e 40%, #2a1520 70%, #0a0812 100%)
        `,
      },
    },
    {
      title: 'Abstract Flow',
      medium: 'Watercolor',
      year: 2024,
      css: {
        background: `
          radial-gradient(circle at 20% 80%, #4de8c444 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #e8a04d33 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #4de8c422 0%, transparent 70%),
          conic-gradient(from 180deg at 50% 50%, #0a1a2a, #1a0a2a, #0a2a1a, #0a1a2a)
        `,
      },
    },
    {
      title: 'Kathmandu Nights',
      medium: 'Oil on Canvas',
      year: 2024,
      css: {
        background: `
          radial-gradient(ellipse 30% 50% at 15% 50%, #e8a04d22 0%, transparent 100%),
          radial-gradient(ellipse 25% 40% at 45% 30%, #4de8c418 0%, transparent 100%),
          radial-gradient(ellipse 20% 35% at 75% 65%, #e85d4018 0%, transparent 100%),
          repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(232, 160, 77, 0.03) 40px, rgba(232, 160, 77, 0.03) 41px),
          linear-gradient(160deg, #08060f 0%, #0f0a18 50%, #0a0610 100%)
        `,
      },
    },
    {
      title: 'The Wanderer',
      medium: 'Acrylic',
      year: 2025,
      css: {
        background: `
          radial-gradient(ellipse 100% 60% at 50% 0%, #e8a04d18 0%, transparent 60%),
          radial-gradient(ellipse 80% 80% at 50% 100%, #0a1a0a 0%, transparent 70%),
          linear-gradient(0deg, #0a1208 0%, #141a10 30%, #1a1408 60%, #0a0f0a 100%)
        `,
      },
    },
    {
      title: 'Digital Chaos',
      medium: 'Digital Art',
      year: 2025,
      css: {
        background: `
          repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(232, 160, 77, 0.04) 8px, rgba(232, 160, 77, 0.04) 9px),
          repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(77, 232, 196, 0.03) 12px, rgba(77, 232, 196, 0.03) 13px),
          radial-gradient(circle at 30% 70%, #e85d4022 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, #4de8c422 0%, transparent 50%),
          linear-gradient(135deg, #0a080f 0%, #120a14 50%, #0a0f12 100%)
        `,
      },
    },
    {
      title: 'Still Life — Workspace',
      medium: 'Pencil Sketch',
      year: 2024,
      css: {
        background: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(240, 236, 228, 0.015) 2px, rgba(240, 236, 228, 0.015) 3px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(240, 236, 228, 0.01) 2px, rgba(240, 236, 228, 0.01) 3px),
          radial-gradient(ellipse 60% 60% at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)
        `,
      },
    },
    {
      title: 'Ember Tide',
      medium: 'Mixed Media',
      year: 2025,
      css: {
        background: `
          radial-gradient(circle at 25% 25%, #e85d4033 0%, transparent 40%),
          radial-gradient(circle at 75% 75%, #e8a04d33 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, #e85d4011 0%, transparent 70%),
          conic-gradient(from 45deg at 50% 50%, #0a0808, #1a0a0a, #0a0808, #120a08, #0a0808)
        `,
      },
    },
    {
      title: 'Neon Drift',
      medium: 'Digital Art',
      year: 2025,
      css: {
        background: `
          radial-gradient(ellipse 40% 80% at 0% 50%, #4de8c422 0%, transparent 100%),
          radial-gradient(ellipse 40% 80% at 100% 50%, #e8a04d22 0%, transparent 100%),
          repeating-linear-gradient(180deg, transparent, transparent 30px, rgba(77, 232, 196, 0.02) 30px, rgba(77, 232, 196, 0.02) 31px),
          linear-gradient(90deg, #080a10 0%, #0a0810 50%, #100a08 100%)
        `,
      },
    },
  ],
  stats: {
    totalPieces: 24,
    favMedium: 'Acrylic',
    style: 'Semi-Abstract',
  },
}
