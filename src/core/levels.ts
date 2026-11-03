import {seededLayout,type Board,type PushMode} from './engine';
export const CHAPTER_SIZE=25;
export const TOTAL_LEVELS=26;
export type GridSize=4|6|8;
export type Rhythm='2+1'|'3+2';
export type LevelDefinition={id:number;chapter:number;chapterIndex:number|null;size:GridSize;difficulty:1|2|3|4|5|6;seed:number;layout:number[];imageKey:string;rhythm:Rhythm;isChapterExtra:boolean;status:'prototype'};
// 26 authored levels. Level 26 is a playable chapter epilogue and NEVER adds a 26th chapter tile.
export const DIFFICULTIES=[1,2,2,2,4,2,2,5,1,2,4,2,1,3,6,1,2,2,4,5,2,1,2,6,3,1] as const;
export function sizeForDifficulty(d:number):GridSize{return d<=2?4:d<=4?6:8}
export function rhythmSlot(level:number,rhythm:Rhythm){const easy=rhythm==='2+1'?2:3,hard=rhythm==='2+1'?1:2;return (level-1)%(easy+hard)<easy?'normal':'peak'}
export const levels:LevelDefinition[]=DIFFICULTIES.map((difficulty,i)=>{const id=i+1,size=sizeForDifficulty(difficulty),seed=20261102+id*7919;return {id,chapter:1,chapterIndex:id<=25?id:null,size,difficulty,seed,layout:seededLayout(size,seed),imageKey:`chapter1-level${String(id).padStart(2,'0')}`,rhythm:'2+1',isChapterExtra:id===26,status:'prototype'}});
export function getLevel(id:number):LevelDefinition{return levels[Math.max(0,Math.min(25,id-1))]}
export function boardForLevel(id:number,pushMode:PushMode):Board{const cfg=getLevel(id);return {n:cfg.size,cells:[...cfg.layout],steps:0,history:[],pushMode}}
export function chapterCompletedCount(highestUnlocked:number){return Math.max(0,Math.min(25,highestUnlocked-1))}
export function bonusLevelFor(afterLevel:number){const seed=991731+afterLevel*991;return {id:`gold-${afterLevel}`,afterLevel,size:8 as const,difficulty:6 as const,seed,layout:seededLayout(8,seed),reward:'gold-border' as const}}
export function boardForHidden(afterLevel:number,pushMode:PushMode):Board{const cfg=bonusLevelFor(afterLevel);return {n:8,cells:[...cfg.layout],steps:0,history:[],pushMode}}
