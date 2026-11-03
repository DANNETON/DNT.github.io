import {hasGoldPanel} from './bonus';

export function imageForLevel(level: number, bonus = false, cool = false): string {
  const id = Math.max(1, Math.min(26, Math.trunc(level)));
  if (cool) return '/levels/cool/level-' + String(Math.min(id, 25)).padStart(2, '0') + '.jpg';
  const folder = bonus && hasGoldPanel(id, cool) ? '/levels/gold' : '/levels';
  return `${folder}/level-${String(id).padStart(2, '0')}.jpg?v=chapter1-hd4`;
}

