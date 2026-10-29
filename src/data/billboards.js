/**
 * Roadside billboard messages per stage — two short lines each, drawn with
 * the 3×5 pixel font (A–Z, 0–9, + , . and space only). Every claim is from
 * the resume.
 */

const BILLBOARDS = {
  portpro: [
    ['100,000+', 'CONTAINERS'],
    ['550+ TRUCKING', 'COMPANIES'],
    ['LLM IN', 'PRODUCTION'],
    ['PORT RAIL', 'TERMINAL'],
  ],
  kodknackare: [
    ['KOD CMS V3', 'MALMO'],
    ['REACT', 'PHP'],
  ],
  'wisdom-mirror': [
    ['KARMA CRM', 'FROM SCRATCH'],
    ['SKYCRM', 'TEAM LEAD'],
  ],
  ascend: [
    ['NATIONAL', 'KIDNEY CENTER'],
    ['LARAVEL', 'ANGULARJS'],
  ],
}

const START = [
  ['12+ YEARS', 'IN PRODUCTION'],
  ['KATHMANDU', 'NEPAL'],
]

export function billboardsFor(stageId) {
  return BILLBOARDS[stageId] ?? START
}
