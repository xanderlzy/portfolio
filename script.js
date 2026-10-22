document.querySelectorAll('.wf').forEach(function(w,k){var n=+w.dataset.n,h='';for(var i=0;i<n;i++){var v=20+Math.abs(Math.sin(i*.31+k)*Math.cos(i*.07))*70+(i*7919%13);h+='<i style="height:'+Math.min(v,95)+'%"></i>'}w.innerHTML=h});
var F=['REUNION.mp4'],g=document.getElementById('ig');
F.forEach(function(f,i){var d=document.createElement('div');d.className='th'+(i<3?' on':'');d.innerHTML='<div class="im" style="background:radial-gradient(ellipse at '+(30+i*5%40)+'% 50%,hsl('+(205+i*9)+',40%,'+(24+i%3*6)+'%),#06090e)"><small>00:0'+(i%9)+':'+(10+i*3)+'</small></div><span>'+f+'</span>';d.onclick=function(){d.classList.toggle('on')};g.appendChild(d)});
var app=document.querySelector('.app'),tb=document.querySelectorAll('.tabs a');
tb.forEach(function(a){a.onclick=function(){app.dataset.v=a.dataset.t;tb.forEach(function(x){x.classList.toggle('on',x===a)})}});
document.getElementById('ex').onclick=function(){var v=function(i){return document.getElementById(i).value};location.href='mailto:xanderlzy@gmail.com?subject='+encodeURIComponent(v('ct')+' enquiry from '+v('cn'))+'&body='+encodeURIComponent(v('cm')+'\n\n'+v('cn')+'\n'+v('ce'))};
var IC=function(p){return'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" style="display:block;pointer-events:none">'+p+'</svg>'};
var ICON={play:IC('<path d="M7 4l13 8-13 8z"/>'),stop:IC('<path d="M6 6h12v12H6z"/>'),prevEdit:IC('<path d="M3 5h2v14H3zM22 5v14l-9-7zM13 5v14l-8-7z"/>'),nextEdit:IC('<path d="M19 5h2v14h-2zM2 5v14l9-7zM11 5v14l8-7z"/>'),prevFrame:IC('<path d="M6 5h2v14H6zM20 5v14L9 12z"/>'),nextFrame:IC('<path d="M16 5h2v14h-2zM4 5v14l11-7z"/>')};
var FPS=24,$=function(s){return document.querySelector(s)},pad=function(v){return String(v).padStart(2,'0')};
function mk(n,c){var t=0,cl=c.map(function(x){var o={n:x[0],s:t,l:x[1],h:x[2],T:x[3],sub:x[4]};t+=x[1];return o});return{name:n,clips:cl,dur:t,t:0}}
var SQ=[mk('REUNION',[['REUNION',60,215,'REUNION','Short film \u00b7 Director']])];
var cur=0,open=[0],pl=0,last=0,lastCi=-1,ph,rm;
function tc(s){var f=Math.floor(s*FPS+1e-6),ss=Math.floor(f/FPS);return[0,Math.floor(ss/60),ss%60,f%FPS].map(pad).join(':')}
function wf(n,k){var h='';for(var i=0;i<n;i++){var v=20+Math.abs(Math.sin(i*.31+k)*Math.cos(i*.07))*70+(i*7919%13);h+='<i style="height:'+Math.min(v,95)+'%"></i>'}return h}
function row(c,tg,nm,inner,b){return'<div class="tr '+c+'"><div class="hd"><em'+(b?' class="b"':'')+'>'+tg+'</em><span>'+nm+'</span></div><div class="lane">'+inner+'</div></div>'}
function pc(x,q){return'left:'+x/q.dur*100+'%;width:'+0+'%'}
function cl(a,l,q,inner,st){return'<div class="clip" style="left:'+a/q.dur*100+'%;width:'+l/q.dur*100+'%;'+(st||'')+'">'+inner+'</div>'}
var VIDEO_SRC='REUNION.mp4',vid=document.getElementById('vid'),vr=false;
function ruler(){var q=SQ[cur],r='',st=[5,10,15,30,60,120,300].filter(function(x){return q.dur/x<=8})[0]||600,i;for(i=0;i<q.dur;i+=st)r+='<span style="left:'+i/q.dur*100+'%">'+Math.floor(i/60)+':'+pad(i%60)+'</span>';$('.ruler').innerHTML=r+'<i class="rm"></i>';rm=$('.rm');$('.ctl span:last-child').textContent=tc(q.dur)}
function build(){var q=SQ[cur],v='',a='';
q.clips.forEach(function(c,i){v+=cl(c.s,c.l,q,c.n);a+=cl(c.s,c.l,q,'<div class="wf">'+wf(200,i)+'</div>')});
$('.tracks').innerHTML='<div class="ph"></div>'+row('v','V1','Video 1',v,1)+row('a','A1','LAV',a,1)+row('s','A2','SFX','')+row('m','A3','MUSIC','');
ph=$('.ph');ruler();$('.mon .ptabs .on').textContent='Program: '+q.name;lastCi=-1}
function setT(t,fv){var q=SQ[cur];t=Math.max(0,Math.min(q.dur-1/FPS,t));q.t=t;if(!fv&&vr){try{vid.currentTime=t}catch(e){}}var p=t/q.dur,ci=0;
q.clips.forEach(function(c,i){if(t>=c.s)ci=i});var c=q.clips[ci],u=(t-c.s)/c.l;
ph.style.left='calc(var(--hw) + (100% - var(--hw)) * '+p+')';rm.style.left=p*100+'%';
var s=tc(t);$('.tlh .tc').textContent=s;$('.ctl .tc').textContent=s;$('.scrub i').style.left=p*100+'%';
$('.frame').style.background='radial-gradient(ellipse 60% 70% at '+(35+u*40)+'% 48%,hsl('+c.h+',45%,26%) 0,hsl('+c.h+',50%,9%) 45%,#05080d 100%)';
if(ci!==lastCi){lastCi=ci;$('.frame h1').innerHTML=c.T.split('|').join('<br>');$('.frame p').textContent=c.sub;$('.rec').textContent='\u25cf '+c.n;
document.querySelectorAll('.tr.v .clip').forEach(function(e,i){e.classList.toggle('sel',i===ci)})}}
function play(on){pl=on===undefined?!pl:on;if(on===undefined)vid.muted=false;$('.btns span:nth-child(6)').innerHTML=pl?ICON.stop:ICON.play;var q=SQ[cur];
if(!vr&&pl&&vid.readyState===0)vid.load();
if(vr){if(pl){if(q.t>=q.dur-.1)setT(0);var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){vid.muted=true;vid.play().catch(function(){})})}else vid.pause()}
if(pl){if(!vr&&q.t>=q.dur-.1)setT(0);last=performance.now();requestAnimationFrame(tick)}}
function tick(n){if(!pl)return;var q=SQ[cur],t;
if(vr){t=vid.currentTime;if(vid.ended||t>=q.dur-1/FPS){setT(q.dur,1);play(false);return}setT(t,1)}
else{t=q.t+(n-last)/1000;last=n;if(t>=q.dur-1/FPS){setT(q.dur);play(false);return}setT(t)}
requestAnimationFrame(tick)}
function jump(d){var q=SQ[cur],t=q.t,x=d<0?0:q.dur;q.clips.forEach(function(c){if(d<0&&c.s<t-.05&&c.s>x)x=c.s;if(d>0&&c.s>t+.01&&c.s<x)x=c.s});setT(x)}
function tabs(){$('.tlh').innerHTML=open.map(function(i){return'<span class="stab'+(i===cur?' on':'')+'" data-s="'+i+'">'+SQ[i].name+(open.length>1?'<u data-x="'+i+'">\u00d7</u>':'')+'</span>'}).join('')+'<span class="tc"></span>'}
function tree(){$('.tree').innerHTML='<div class="l1"><span class="fo"></span>SHORT FILM</div><div class="l2 hl" data-s="0"><span class="sw"></span>REUNION</div>'}
function openSeq(i){play(false);if(open.indexOf(i)<0)open.push(i);cur=i;tabs();tree();build();setT(SQ[i].t)}
$('.tree').addEventListener('click',function(e){var el=e.target.closest('[data-s]');if(!el)return;var s=+el.dataset.s;if(s>=0)openSeq(s);});
$('.tlh').addEventListener('click',function(e){var x=e.target.closest('[data-x]'),t=e.target.closest('[data-s]');if(x){var i=+x.dataset.x;open.splice(open.indexOf(i),1);if(cur===i)openSeq(open[0]);else{tabs()}}else if(t)openSeq(+t.dataset.s)});
function bind(el,rect){el.addEventListener('pointerdown',function(e){if(e.button||e.clientX<rect().left)return;e.preventDefault();play(false);var mv=function(ev){var r=rect();setT((ev.clientX-r.left)/r.width*SQ[cur].dur)};mv(e);window.addEventListener('pointermove',mv);window.addEventListener('pointerup',function u(){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',u)})})}
var rr=function(){return $('.ruler').getBoundingClientRect()};bind($('.ruler'),rr);bind($('.tracks'),rr);bind($('.scrub'),function(){return $('.scrub').getBoundingClientRect()});
var B=document.querySelectorAll('.btns span');B[3].innerHTML=ICON.prevEdit;B[4].innerHTML=ICON.prevFrame;B[5].innerHTML=ICON.play;B[6].innerHTML=ICON.nextFrame;B[7].innerHTML=ICON.nextEdit;
B[3].onclick=function(){jump(-1)};B[7].onclick=function(){jump(1)};B[5].onclick=function(){play()};B[4].onclick=function(){play(false);setT(SQ[cur].t-1/FPS)};B[6].onclick=function(){play(false);setT(SQ[cur].t+1/FPS)};
addEventListener('keydown',function(e){if(app.dataset.v!=='edit'||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;var k=e.code,q=SQ[cur];
if(k=='Space'){e.preventDefault();play()}else if(k=='ArrowLeft'){e.preventDefault();play(false);setT(q.t-1/FPS)}else if(k=='ArrowRight'){e.preventDefault();play(false);setT(q.t+1/FPS)}else if(k=='ArrowUp'){e.preventDefault();jump(-1)}else if(k=='ArrowDown'){e.preventDefault();jump(1)}else if(k=='Home')setT(0);else if(k=='End')setT(q.dur)});
openSeq(0);SQ[0].t=0;setT(0);
function vinit(){if(!isFinite(vid.duration)||vr)return;var q=SQ[0];q.dur=vid.duration;q.clips[0].l=vid.duration;vr=true;$('.frame').classList.add('hasv');ruler();setT(q.t);if(pl){var pp=vid.play();if(pp&&pp.catch)pp.catch(function(){})}}
['loadedmetadata','loadeddata','canplay'].forEach(function(n){vid.addEventListener(n,vinit)});vid.addEventListener('error',function(){console.warn('REUNION video failed to load',vid.error)});vid.preload='metadata';vid.src=VIDEO_SRC+'#t=0.001';if(vid.readyState>=1)vinit();


(function(){var e=document.getElementById('clk');function u(){var t=new Date().toLocaleTimeString('en-US',{timeZone:'Asia/Singapore',hour:'numeric',minute:'2-digit'}),x='Singapore \u00b7 '+t;if(e.textContent!==x)e.textContent=x}u();setInterval(u,1000)})();

document.querySelectorAll('.mtabs button').forEach(function(b){b.onclick=function(){app.dataset.m=b.dataset.m;document.querySelectorAll('.mtabs button').forEach(function(x){x.classList.toggle('on',x===b)})}});

['pointerdown','keydown'].forEach(function(n){addEventListener(n,function u(){vid.muted=false;removeEventListener(n,u)},{passive:true})});
