import React from 'react';

type Props = {
  cool: boolean; order: number[]; chapter: number;
  completed: number;
  pending: number[];
  goldLevels: number[];
  animatedTiles: number[];
  flightSpeed: number;
  flash: boolean;
  reveal: boolean;
};

export default function HomeChapter({ cool, order, chapter, completed, pending, goldLevels, animatedTiles, flightSpeed, flash }: Props) {
  const [flipping, setFlipping] = React.useState<number[]>([]);
  const boardRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const piece = boardRef.current?.querySelector<HTMLElement>('.arriving');
    const stage = piece?.closest('.phone-stage');
    if (!piece || !stage || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frame = stage.getBoundingClientRect(), target = piece.getBoundingClientRect();
    const edge = Math.floor(Math.random() * 4);
    const x = edge === 0 ? frame.left : edge === 1 ? frame.right-target.width : frame.left+Math.random()*(frame.width-target.width);
    const y = edge === 2 ? frame.top : edge === 3 ? frame.bottom-target.height : frame.top+Math.random()*(frame.height-target.height);
    const flight = piece.animate([
      {transform:`translate(${x-target.left}px, ${y-target.top}px) rotate(-5deg) scale(1.04)`},
      {transform:'none'}
    ], {duration:680 * flightSpeed, easing:'cubic-bezier(.22,.61,.36,1)'});
    return () => flight.cancel();
  }, [animatedTiles]);
  const count = completed - new Set(pending.filter(id => id < completed)).size;
  return <div className="collection-display" data-cool={cool}>
    <div className="collection-title home-chapter-banner">第 <em>{chapter}</em> 章</div>
    <div ref={boardRef} className={`collection-board ${flash ? 'collection-complete' : ''}`} role="group" aria-label={`章节拼图进度 ${count}/25`}>
      {Array.from({ length: 25 }, (_, slot) => {
        const id = order.indexOf(slot);
        const filled = id < completed && (!pending.includes(id) || animatedTiles.includes(id));
        const column = slot % 5;
        const row = Math.floor(slot / 5);
        return <div key={id} className="collection-slot" data-gold={filled && goldLevels.includes(id + 1)}>{filled &&
          <button type="button" className={`collection-flip ${flipping.includes(id) ? 'flipping' : ''}`}
            aria-label={`翻看第 ${id+1} 关拼块`}
            disabled={animatedTiles.includes(id)}
            onClick={()=>setFlipping(current=>current.includes(id)?current:[...current,id])}
            onAnimationEnd={event=>{if(event.target===event.currentTarget)setFlipping(current=>current.filter(value=>value!==id))}}>
          <span className={`collection-piece ${animatedTiles.includes(id) ? 'arriving' : ''} ${goldLevels.includes(id + 1) ? 'gold' : ''}`}
            style={cool ? {backgroundImage: "url('./levels/cool/level-08.jpg')", backgroundSize:'500% 500%', backgroundPosition:(column*25)+'% '+(row*25)+'%'} : { backgroundPosition: `-${19.5 + column * 12.2}cqw calc(-31.3dvh - ${14 + row * 12.2}cqw)` }} /><span className="collection-back" aria-hidden="true"/></button>
        }</div>;
      })}
      <div className="collection-sheen" aria-hidden="true"><i/></div>
      {<div className={`frame-particles ${cool ? "frost-particles" : ""}`} aria-hidden="true">
        {Array.from({length:cool ? 8 : 12}, (_, index) => {
          const side = index % 4;
          const along = 18 + Math.floor(index / 4) * 30;
          return <i key={index} style={{
            left: side === 0 ? '-1%' : side === 1 ? '101%' : along+'%',
            top: side === 2 ? '-1%' : side === 3 ? '101%' : along+'%',
            '--drift-x': side === 0 ? '-5cqw' : side === 1 ? '5cqw' : (index % 3 - 1)*2+'cqw',
            '--drift-y': side === 2 ? '-5cqw' : side === 3 ? '5cqw' : (index % 3 - 1)*2+'cqw',
            animationDelay: (index * (cool ? .6 : .23))+'s'
          } as React.CSSProperties}>{cool ? "❄" : null}</i>;
        })}
      </div>}<div className="collection-count home-chapter-progress">{count}/25</div>
    </div>
  </div>;
}














