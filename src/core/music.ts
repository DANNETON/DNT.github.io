export const musicTracks = [
 {id:'zen', title:'静心回响 · 禅音'},
 {id:'mist-window', title:'雾窗来信 · 钢琴'},
 {id:'tidal-steps', title:'潮汐漫步 · 木琴'},
 {id:'polar-night', title:'极夜微光 · 氛围长音'}
] as const;
export type MusicTrack = typeof musicTracks[number]['id'];

export function readMusicTrack(): MusicTrack {
 try {
  const saved = localStorage.getItem('jigsaw-music-track');
  return musicTracks.find(track => track.id === saved)?.id ?? 'zen';
 } catch { return 'zen'; }
}

export class ZenMusic {
 constructor(private track: MusicTrack = 'zen') {}
 setTrack(track: MusicTrack) {
  if (this.track === track) return;
  this.stop();
  this.track = track;
  this.step = 0;
 }
 private ctx:AudioContext|null=null;
 private master:GainNode|null=null;
 private voices:AudioScheduledSourceNode[]=[];
 private scheduler:number|undefined;
 private step=0;
 private volume=.22;
 private enabled=true;
 get isEnabled(){return this.enabled}
 setEnabled(v:boolean){this.enabled=v;if(!v)this.stop()}
 setVolume(v:number){this.volume=Math.min(1,Math.max(0,v));if(this.master)this.master.gain.setTargetAtTime(this.volume*.18,this.ctx!.currentTime,.08)}
 async start(){if(!this.enabled)return;const Ctx=window.AudioContext;if(!Ctx)return;
  if(this.ctx){await this.ctx.resume();return}
  const ctx=new Ctx();this.ctx=ctx;const master=ctx.createGain();this.master=master;master.gain.value=this.volume*.18;master.connect(ctx.destination);
  if (this.track !== 'zen') {
   try {
    const url = './music/' + this.track + '.wav';
    await ctx.resume();
    if (ctx !== this.ctx) return;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Audio download failed: ' + response.status);
    const bytes = await response.arrayBuffer();
    if (ctx !== this.ctx) return;
    const buffer = await ctx.decodeAudioData(bytes);
    if (ctx !== this.ctx) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(master);
    source.start();
    this.voices.push(source);
   } catch (error) {
    if (ctx === this.ctx) { this.stop(); console.warn('BGM playback failed', error); }
   }
   return;
  }
  const drone=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();drone.type='sine';drone.frequency.value=110;gain.gain.value=.14;filter.type='lowpass';filter.frequency.value=480;drone.connect(filter);filter.connect(gain);gain.connect(master);drone.start();this.voices.push(drone);
  const notes=[220,261.63,293.66,392,440,392,293.66,261.63,196,220,293.66,261.63];
  const play=()=>{if(!this.ctx||!this.master)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type='sine';osc.frequency.value=notes[this.step++%notes.length];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+2.7);osc.connect(g);g.connect(this.master);osc.start(t);osc.stop(t+2.8)};
  play();this.scheduler=window.setInterval(play,2800);await ctx.resume();
 }
 stop(){if(this.scheduler!==undefined){clearInterval(this.scheduler);this.scheduler=undefined}for(const v of this.voices){try{v.stop()}catch{}}this.voices=[];const c=this.ctx;this.ctx=null;this.master=null;if(c)void c.close()}
}
