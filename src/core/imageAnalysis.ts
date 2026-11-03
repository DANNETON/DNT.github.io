export type ImageAnalysis={score:number;contrast:number;repetition:number;ambiguity:number;reference:number};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
/** Pixel heuristics, not semantic recognition or a solver. All component scores mean harder. */
export async function analyzeImage(url:string,n:number):Promise<ImageAnalysis>{
 const img=new Image();img.src=url;await img.decode();
 const c=document.createElement('canvas');c.width=c.height=n*24;
 const ctx=c.getContext('2d');if(!ctx)throw new Error('无法读取图片');
 ctx.drawImage(img,0,0,c.width,c.height);
 const {data}=ctx.getImageData(0,0,c.width,c.height),w=c.width;
 const gray=(x:number,y:number)=>{const i=(y*w+x)*4;return (.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255};
 const features:number[][]=[];let lineCount=0;
 for(let ty=0;ty<n;ty++)for(let tx=0;tx<n;tx++){
  const f:number[]=[];
  for(let sy=0;sy<3;sy++)for(let sx=0;sx<3;sx++){
   const sums=[0,0,0];for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    const i=((ty*24+sy*8+y)*w+tx*24+sx*8+x)*4;
    for(let k=0;k<3;k++)sums[k]+=data[i+k]/255/64;
   }f.push(...sums);
  }features.push(f);
 }
 let sum=0,sq=0;
 for(let y=0;y<w;y++)for(let x=0;x<w;x++){const g=gray(x,y);sum+=g;sq+=g*g}
 // Long coherent edges provide a modest reference cue; texture alone earns no credit.
 for(let y=1;y<w;y++){let count=0;for(let x=0;x<w;x++)if(Math.abs(gray(x,y)-gray(x,y-1))>.12)count++;if(count/w>.55)lineCount++}
 for(let x=1;x<w;x++){let count=0;for(let y=0;y<w;y++)if(Math.abs(gray(x,y)-gray(x-1,y))>.12)count++;if(count/w>.55)lineCount++}
 let similar=0,flat=0;
 for(let i=0;i<features.length;i++){
  const f=features[i];let nearest=1;
  for(let j=0;j<features.length;j++)if(i!==j){let d=0;for(let k=0;k<f.length;k++)d+=(f[k]-features[j][k])**2;nearest=Math.min(nearest,Math.sqrt(d/f.length))}
  similar+=clamp(1-nearest/.18);
  let variation=0;for(let k=3;k<f.length;k++)variation+=Math.abs(f[k]-f[k%3]);flat+=clamp(1-variation/24/.15);
 }
 const contrast=clamp(1-Math.sqrt(Math.max(0,sq/(w*w)-(sum/(w*w))**2))/.25);
 const repetition=similar/features.length,ambiguity=flat/features.length,reference=1-clamp(lineCount/8);
 const score=Math.round(6*(contrast*.2+repetition*.4+ambiguity*.25+reference*.15));
 return {score,contrast,repetition,ambiguity,reference};
}
