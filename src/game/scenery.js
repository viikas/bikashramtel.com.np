/**
 * Roadside sprites per stage. Nepal stages get hills and prayer flags,
 * Sweden gets trees, PortPro gets the port: containers and cranes. Every stage
 * has billboards (messages in src/data/billboards.js).
 */

export const SCENERY = {
  ascend:          ['hill', 'prayer-flags', 'tree', 'billboard'],
  'wisdom-mirror': ['hill', 'prayer-flags', 'tree', 'billboard'],
  kodknackare:     ['tree', 'billboard'],
  portpro:         ['container', 'crane', 'billboard'],
}

const START_SCENERY = ['hill', 'tree', 'billboard']

export function sceneryFor(stageId) {
  return SCENERY[stageId] ?? START_SCENERY
}
