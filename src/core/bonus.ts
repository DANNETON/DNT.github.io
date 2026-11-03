import chapter from '../../editor/chapter01.json';

export const GOLD_KEY='jigsaw-lab-gold-completions-v3';
export const QUALIFY_KEY='jigsaw-lab-bonus-thresholds-v1';
export type BonusThresholds=Record<string,number>;
// The old save used level numbers. Carry awards with the two relocated panoramas.

export function loadGold(): number[] {
 try {
  const saved = localStorage.getItem(GOLD_KEY);
  if (saved !== null) return JSON.parse(saved).filter((id: number) => hasGoldPanel(id));
  const previous = localStorage.getItem('jigsaw-lab-gold-completions-v2');
  const relocatedGold = previous === null ? new Map([[1, 21], [3, 18]]) : new Map([[22, 21], [6, 18]]);
  const old: number[] = JSON.parse(previous ?? localStorage.getItem('jigsaw-lab-gold-completions-v1') ?? '[]');
  const migrated = old.filter(id => id !== 18 && id !== 21)
   .map(id => relocatedGold.get(id) ?? id).filter(id => hasGoldPanel(id));
  saveGold(migrated);
  return migrated;
 } catch { return []; }
}
export function saveGold(ids:number[]){try{localStorage.setItem(GOLD_KEY,JSON.stringify([...new Set(ids.filter(id=>hasGoldPanel(id)))]))}catch{}}
export function loadThresholds():BonusThresholds{try{return JSON.parse(localStorage.getItem(QUALIFY_KEY)||'{}')}catch{return {}}}
// A local testing threshold, NOT a fabricated population percentile.
export function qualifiesForGold(level:number,seconds:number,thresholds:BonusThresholds,cool=false){
 if (!hasGoldPanel(level,cool)) return false;
 const originalLevel = level === 21 ? 1 : level === 18 ? 3 : level;
 return seconds<=Math.max(1,thresholds[String(originalLevel)]??(originalLevel<=2?90:originalLevel<=4?180:300));
}
export const COMBO_VOICES:Record<number,string>={3:'Nice!',4:'Perfect!',5:'Excellent!',8:'Brilliant!',11:'Incredible!',15:'Spectacular!',20:'Legendary!'};
export function comboPraise(n:number){const tier=Object.keys(COMBO_VOICES).map(Number).filter(t=>n>=t).sort((a,b)=>b-a)[0];return COMBO_VOICES[tier]||null}
const selectedLevels = new Set(chapter.levels.filter(level => level.bonus.enabled).map(level => level.id));
export function hasGoldPanel(level: number, cool = false) {
 return !cool && selectedLevels.has(level);
}
