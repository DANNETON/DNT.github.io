import {useEffect,useRef,useState} from 'react';
import type {Board} from '../core/engine';
import {groupFor,groupsOf,moveBoard} from '../core/engine';
export function BoardView({board,image,onMove,onToggleLock,showIds=false,aspectRatio}:{aspectRatio?:number;board:Board;image:string;onMove:(id:number,target:number)=>void;onToggleLock?:(id:number)=>void;showIds?:boolean}){
 const [artRatio,setArtRatio]=useState(2/3);
 useEffect(()=>{
   let current=true;
   setArtRatio(2/3);
   const artwork=new Image();
   artwork.onload=()=>{if(current)setArtRatio(artwork.naturalWidth/artwork.naturalHeight)};
   artwork.src=image;
   return ()=>{current=false};
 },[image]);
 const cropX=Math.max(1,artRatio/(aspectRatio ?? 2/3)),cropY=Math.max(1,(aspectRatio ?? 2/3)/artRatio); const ref=useRef<HTMLDivElement>(null),drag=useRef<{id:number;x:number;y:number}|null>(null),lastTap=useRef<{id:number;at:number}|null>(null);
 const [burst,setBurst]=useState<{key:number;pieces:number[]}|null>(null);const [offset,setOffset]=useState<{x:number;y:number}|null>(null);const [selected,setSelected]=useState<number|null>(null);const n=board.n;useEffect(()=>{if(!burst)return;const timer=window.setTimeout(()=>setBurst(null),1050);return()=>clearTimeout(timer)},[burst]);
 function attemptMove(id:number,target:number){const next=moveBoard(board,id,target);const old=groupsOf(board);const pieces=next?groupsOf(next).filter(g=>g.members.length>1&&old.filter(a=>a.members.some(k=>g.members.includes(k))).length>1).flatMap(g=>g.members):[];setBurst(pieces.length?{key:Date.now(),pieces}:null);onMove(id,target)}
 function targetAt(cx:number,cy:number){const r=ref.current?.getBoundingClientRect();if(!r)return -1;const x=Math.floor((cx-r.left)/r.width*n),y=Math.floor((cy-r.top)/r.height*n);return x>=0&&x<n&&y>=0&&y<n?y*n+x:-1}
 return <div className="board" style={aspectRatio ? {aspectRatio, maxWidth: Math.min(100, aspectRatio * 150) + '%'} : undefined} ref={ref} onPointerDown={e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('[data-piece]');if(!el)return;drag.current={id:Number(el.dataset.piece),x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current)setOffset({x:e.clientX-drag.current.x,y:e.clientY-drag.current.y})}} onPointerUp={e=>{setOffset(null);const d=drag.current;drag.current=null;if(!d)return;const target=targetAt(e.clientX,e.clientY);if(target<0)return;const moved=Math.hypot(e.clientX-d.x,e.clientY-d.y)>9;if(moved){lastTap.current=null;setSelected(null);attemptMove(d.id,target);return}const now=Date.now();if(lastTap.current?.id===d.id&&now-lastTap.current.at<330){lastTap.current=null;setSelected(null);onToggleLock?.(d.id);return}lastTap.current={id:d.id,at:now};if(selected===null){setSelected(d.id)}else if(selected!==d.id){attemptMove(selected,target);setSelected(null)}}} onPointerCancel={()=>{drag.current=null;setOffset(null)}}>{board.cells.map((id,pos)=>{const locked=(board.locked||[]).includes(id);const members = groupFor(board, id);
 const active=!!burst?.pieces.includes(id);const positions=members.map(k=>board.cells.indexOf(k));const cx=(Math.min(...positions.map(p=>p%n))+Math.max(...positions.map(p=>p%n))+1)/2;const cy=(Math.min(...positions.map(p=>Math.floor(p/n)))+Math.max(...positions.map(p=>Math.floor(p/n)))+1)/2;const col = pos % n;
 const edges = [
   pos < n || !members.includes(board.cells[pos - n]),
   col === n - 1 || !members.includes(board.cells[pos + 1]),
   pos >= n * (n - 1) || !members.includes(board.cells[pos + n]),
   col === 0 || !members.includes(board.cells[pos - 1])
 ];
 const borderWidth = edges.map(visible => visible ? '1.5px' : '0').join(' ');
 return <div key={active?`${id}-connect-${burst!.key}`:id} data-piece={id} className={'tile '+(selected===id?'selected ':'')+(members.length>1?'connected ':'')+(locked?'locked':'')+(active?' connection-active':'')} style={{transform:offset&&drag.current&&groupFor(board,drag.current.id).includes(id)&&!groupFor(board,drag.current.id).some(k=>(board.locked||[]).includes(k))?`translate(${offset.x}px,${offset.y}px)`:undefined,zIndex:offset&&drag.current&&groupFor(board,drag.current.id).includes(id)?50:undefined,animation:active&&!offset?"connectedHop .48s ease-out":undefined,transformOrigin:`${(cx-pos%n)*100}% ${(cy-Math.floor(pos/n))*100}%`,transition:offset?"none":undefined,width:`${100/n}%`,height:`${100/n}%`,left:`${pos%n*100/n}%`,top:`${Math.floor(pos/n)*100/n}%`,backgroundImage:`url("${image}")`,backgroundSize:`${n*cropX*100}% ${n*cropY*100}%`,backgroundPosition:`${(id%n+n*(cropX-1)/2)/(n*cropX-1)*100}% ${(Math.floor(id/n)+n*(cropY-1)/2)/(n*cropY-1)*100}%`}}>{active&&<span key={burst!.key} className="connection-feedback"><span className="connection-rim" style={{borderWidth:edges.map(visible=>visible?'2.5px':'0').join(' ')}}/>{edges.map((visible,edge)=>visible&&<span key={edge} className={"edge-sparks edge-"+edge}><i>✦</i><i>·</i><i>◇</i></span>)}</span>}<span aria-hidden="true" className="piece-contour" style={{borderWidth}}/>{locked&&<span className="lock-symbol">🔒</span>}{showIds&&<span className="tile-id">{id}</span>}</div>})}</div>
}




