/**
 * Scanline pseudo-3D road (the classic Road Rash / OutRun trick).
 *
 * Each screen row below the horizon maps to a world depth `z`. The road's
 * half-width shrinks with 1/z, and stripes alternate by floor((z + offset) / stripeLength),
 * so advancing `offset` makes the stripes rush toward the viewer.
 */

const mod = (a, n) => ((a % n) + n) % n

// Fraction of half the screen the road covers at the bottom row (~90% of screen width).
const BOTTOM_FILL = 0.9

// How far (as a fraction of screen width) a full curve swings the road at the horizon.
const CURVE_SWING = 0.6

/**
 * Road curvature (-1 left … 1 right) at a point along the track. Two slow
 * sines so bends don't repeat on an obvious beat; 0 at the start line.
 */
export function curveAt(offset) {
  return 0.7 * Math.sin(offset / 5200) + 0.3 * Math.sin(offset / 2100)
}

export function projectRoad({
  width,
  height,
  horizon,
  offset,
  curve = 0,
  cameraHeight = 1000,
  stripeLength = 200,
}) {
  const depthRows = height - horizon
  if (depthRows <= 0) return []

  const rows = []
  for (let y = horizon; y < height; y++) {
    const z = (cameraHeight * depthRows) / (y - horizon + 1)
    const halfWidth = BOTTOM_FILL * (width / 2) * (cameraHeight / z)
    // 1 at the bottom row, ~0 at the horizon: bends grow with distance.
    const near = (y - horizon + 1) / depthRows
    rows.push({
      y,
      z,
      center: width / 2 + curve * width * CURVE_SWING * (1 - near) ** 2,
      halfWidth,
      rumbleWidth: Math.max(1, halfWidth * 0.12),
      laneWidth: Math.max(1, halfWidth * 0.03),
      stripe: mod(Math.floor((z + offset) / stripeLength), 2),
    })
  }
  return rows
}
