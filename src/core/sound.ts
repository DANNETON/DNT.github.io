export class GameSound {
 private ctx:AudioContext|null=null;
 enabled=true; volume=.65;
 play(kind:'pickup'|'drop'|'combo',combo=1){if(!this.enabled||this.volume<=0)return;try{const Ctx=window.AudioContext;if(!Ctx)return;const ctx=this.ctx??(this.ctx=new Ctx());void ctx.resume().then(()=>{if(!this.enabled)return;const notes=kind==='combo'?[523.25,659.25,783.99]:kind==='pickup'?[420]:[240,320];notes.forEach((note,i)=>{const t=ctx.currentTime+i*.065,osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(note*(kind==='combo'?Math.pow(1.035,Math.min(combo,15)):1),t);if(kind==='pickup')osc.frequency.exponentialRampToValueAtTime(650,t+.06);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(this.volume*(kind==='combo'?.16:.12),t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.18);osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.2);osc.onended=()=>{osc.disconnect();gain.disconnect()}})}).catch(()=>{})}catch{}}
 stop(){const ctx=this.ctx;this.ctx=null;if(ctx)void ctx.close()}
}
