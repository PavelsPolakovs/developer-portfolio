// Self-contained snippet reproduced verbatim on clipboard via "Copy Animation" button.
// When pasted into a browser console it creates a floating canvas with the hero animation.
export const ANIMATION_CODE = `(function(){
const canvas=document.createElement('canvas');
canvas.width=400;canvas.height=300;
canvas.style.cssText='position:fixed;top:20px;right:20px;border-radius:16px;z-index:9999;border:1px solid #1e2a3a;box-shadow:0 24px 64px rgba(0,0,0,.5)';
document.body.appendChild(canvas);
const ctx=canvas.getContext('2d');
const pts=Array.from({length:40},()=>({x:Math.random()*400,y:Math.random()*300,vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8,r:Math.random()*1.6+.8,flash:0}));
let bursts=[];
function spawnBurst(x,y){const c=6+Math.floor(Math.random()*5);for(let i=0;i<c;i++){const a=(Math.PI*2/c)*i+(Math.random()-.5)*.6,s=.8+Math.random()*2.2;bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:.018+Math.random()*.014,r:.5+Math.random()*.7});}}
const waves=[{speed:.3,amp:28,freq:.018,hue:145,alpha:.35,width:2,offset:-60},{speed:1.4,amp:18,freq:.027,hue:162,alpha:.22,width:1.5,offset:0},{speed:.7,amp:32,freq:.012,hue:182,alpha:.15,width:1,offset:60}];
const hc=pts.map(()=>waves.map(()=>0));
let t=0;
function wy(w,x){return 150+w.offset+Math.sin(x*w.freq+t*w.speed)*w.amp;}
function draw(){
requestAnimationFrame(draw);
ctx.fillStyle='#0d1117';ctx.fillRect(0,0,400,300);
t+=.016;
waves.forEach(w=>{
ctx.save();ctx.filter='blur(4px)';ctx.beginPath();
for(let n=0;n<=400;n++){n===0?ctx.moveTo(n,wy(w,n)):ctx.lineTo(n,wy(w,n));}
ctx.strokeStyle=\`hsla(\${w.hue},75%,58%,\${w.alpha*.3})\`;ctx.lineWidth=w.width*2;ctx.stroke();ctx.restore();
const g=ctx.createLinearGradient(0,0,400,0);
g.addColorStop(0,\`hsla(\${w.hue},75%,58%,0)\`);g.addColorStop(.15,\`hsla(\${w.hue},75%,58%,\${w.alpha})\`);
g.addColorStop(.85,\`hsla(\${w.hue+18},68%,54%,\${w.alpha})\`);g.addColorStop(1,\`hsla(\${w.hue+18},68%,54%,0)\`);
ctx.beginPath();for(let n=0;n<=400;n++){n===0?ctx.moveTo(n,wy(w,n)):ctx.lineTo(n,wy(w,n));}
ctx.strokeStyle=g;ctx.lineWidth=w.width;ctx.stroke();
});
for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=\`rgba(74,222,128,\${(1-d/100)*.2})\`;ctx.lineWidth=1;ctx.stroke();}}}
pts.forEach((p,pi)=>{
p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>400)p.vx*=-1;if(p.y<0||p.y>300)p.vy*=-1;
waves.forEach((w,wi)=>{if(hc[pi][wi]>0){hc[pi][wi]--;return;}const y=wy(w,p.x);if(Math.abs(p.y-y)<w.width+4){p.flash=1;spawnBurst(p.x,p.y);hc[pi][wi]=50;}});
if(p.flash>0)p.flash=Math.max(0,p.flash-.04);
if(p.flash>0){ctx.beginPath();ctx.arc(p.x,p.y,p.r+5+p.flash*4,0,Math.PI*2);ctx.fillStyle=\`rgba(180,255,210,\${p.flash*.25})\`;ctx.fill();}
ctx.beginPath();ctx.arc(p.x,p.y,p.r+3,0,Math.PI*2);ctx.fillStyle='rgba(74,222,128,.1)';ctx.fill();
ctx.beginPath();ctx.arc(p.x,p.y,p.r+p.flash*1.5,0,Math.PI*2);ctx.fillStyle=p.flash>0?\`rgba(220,255,235,\${.7+p.flash*.3})\`:'rgba(180,255,210,.9)';ctx.fill();
});
bursts=bursts.filter(b=>b.life>0);
bursts.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vx*=.97;b.vy*=.97;b.life-=b.decay;const a=Math.max(0,b.life);ctx.beginPath();ctx.arc(b.x,b.y,b.r+1,0,Math.PI*2);ctx.fillStyle=\`rgba(74,222,128,\${a*.15})\`;ctx.fill();ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=\`rgba(200,255,220,\${a})\`;ctx.fill();});
}
draw();
})();`
