import {useState} from 'react';

export function GoldReveal({left, right, onComplete, onError}: {
  left: string; right: string; onComplete: () => void; onError: () => void;
}) {
  const [loaded, setLoaded] = useState(0);
  return <div className="board gold-reveal" aria-label="正在展开隐藏关右侧画面">
    <div className={'gold-panorama' + (loaded === 3 ? ' ready' : '')} onAnimationEnd={onComplete}>
      <img src={left} alt="" onLoad={()=>setLoaded(mask=>mask|1)} onError={onError}/>
      <img src={right} alt="完整的金拼图" onLoad={()=>setLoaded(mask=>mask|2)} onError={onError}/>
    </div>
  </div>;
}
