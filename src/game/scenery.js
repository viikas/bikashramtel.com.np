/**
 * Roadside sprites per stage. Nepal stages get hills and prayer flags,
 * Sweden gets trees and billboards, PortPro gets the port: containers and cranes.
 */

export const SCENERY = {
  ascend:          ['hill', 'prayer-flags', 'tree'],
  'wisdom-mirror': ['hill', 'prayer-flags', 'tree'],
  kodknackare:     ['tree', 'billboard'],
  portpro:         ['container', 'crane', 'billboard'],
}

const START_SCENERY = ['hill', 'tree']

export function sceneryFor(stageId) {
  return SCENERY[stageId] ?? START_SCENERY
}
