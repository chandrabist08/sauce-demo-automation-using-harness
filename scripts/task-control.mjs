// Task control — manages lifecycle phase transitions
export const PHASES = ['GATHER', 'DISCOVER', 'BUILD', 'EVALUATE', 'SHIP'];

export function currentPhase(requirements) {
  if (!requirements.length) return 'GATHER';
  const approved = requirements.filter((r) => r.status === 'approved');
  if (!approved.length) return 'GATHER';
  return 'DISCOVER';
}
