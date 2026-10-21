document.querySelectorAll('.wf').forEach(function(w,k){var n=+w.dataset.n,h='';for(var i=0;i<n;i++){var v=20+Math.abs(Math.sin(i*.31+k)*Math.cos(i*.07))*70+(i*7919%13);h+='<i style="height:'+Math.min(v,95)+'%"></i>'}w.innerHTML=h});
var F=['Showreel_2026.mov','A001_A015_0815OF.mov','A001_A011_0815.mov','B001_B002_0815CS.mov','DRYP_Fall_v24.mov','Untitled_Short_01.mov','D_CAM_Interview.mov','E_CAM_Wide.mov','BTS_Stills_01.mov','Doc_Cut_v3.mov','Music_Promo.mov','Title_Card.png'],g=document.getElementById('ig');
F.forEach(function(f,i){var d=document.createElement('div');d.className='th'+(i<3?' on':'');d.innerHTML='<div class="im" style="background:radial-gradient(ellipse at '+(30+i*5%40)+'% 50%,hsl('+(205+i*9)+',40%,'+(24+i%3*6)+'%),#06090e)"><small>00:0'+(i%9)+':'+(10+i*3)+'</small></div><span>'+f+'</span>';d.onclick=function(){d.classList.toggle('on')};g.appendChild(d)});
var app=document.querySelector('.app'),tb=document.querySelectorAll('.tabs a');
tb.forEach(function(a){a.onclick=function(){app.dataset.v=a.dataset.t;tb.forEach(function(x){x.classList.toggle('on',x===a)})}});
document.getElementById('ex').onclick=function(){var v=function(i){return document.getElementById(i).value};location.href='mailto:xanderlzy@gmail.com?subject='+encodeURIComponent(v('ct')+' enquiry from '+v('cn'))+'&body='+encodeURIComponent(v('cm')+'\n\n'+v('cn')+'\n'+v('ce'))};
var FPS=24,$=function(s){return document.querySelector(s)},pad=function(v){return String(v).padStart(2,'0')};
function mk(n,c){var t=0,cl=c.map(function(x){var o={n:x[0],s:t,l:x[1],h:x[2],T:x[3],sub:x[4]};t+=x[1];return o});return{name:n,clips:cl,dur:t,t:0}}
var SQ=[
mk('Showreel_2026',[['Opening_Title',5,205,'XANDER|LEE','Showreel 2026'],['Night_Run_A001',7,215,'NIGHT RUN','Short film \u00b7 Director'],['DRYP_Fall_v24',6,25,'DRYP|FALL','Commercial \u00b7 DP'],['Neon_Cut',6,285,'NEON|HOURS','Music video \u00b7 Director'],['Interview_D_CAM',6,150,'THE|LONG WAY','Documentary \u00b7 DP'],['End_Card',4,205,'LET\u2019S TALK','xanderlzy@gmail.com']]),
mk('Untitled_Short',[['Scene_01_Dawn',8,200,'UNTITLED','Short film \u00b7 2026'],['Scene_02_Corridor',10,190,'THE|CORRIDOR','Director'],['Scene_03_Rain',12,215,'RAIN','Cinematography'],['Scene_04_Table',10,35,'AFTER|HOURS','Edit \u00b7 Grade'],['Credits',8,210,'FIN','Written and directed by Xander Lee']]),
mk('DRYP_Fall_Campaign',[['A001_A011',6,215,'DRYP','Fall Campaign 2026'],['A001_A006_Starts',8,205,'ON YOUR|MARKS','Athlete \u00b7 Night'],['B001_B002',6,200,'FIRST|STEP','Commercial'],['A001_A013_FN',6,30,'KEEP|MOVING','Fall collection'],['Endplate',4,215,'DRYP','Director / DP']]),
mk('Music_Video_Promo',[['Intro',6,285,'NEON|HOURS','Music video'],['Verse_A',9,300,'VERSE','Performance'],['Chorus_1',8,320,'CHORUS','Lights'],['Verse_B',9,270,'VERSE II','Narrative'],['Outro',8,285,'FADE','Directed by Xander Lee']]),
mk('Documentary_Cut',[['Cold_Open',10,150,'THE|LONG WAY','Documentary'],['Interview_D_CAM',14,40,'IN HER|WORDS','Interview'],['Streets_BRoll',12,165,'STREETS','B-roll \u00b7 Singapore'],['Archive',8,45,'ARCHIVE','Found footage'],['Closing',8,150,'THE|END','Edit v3']])];
var cur=0,open=[0],pl=0,last=0,lastCi=-1,ph,rm;
function tc(s){var f=Math.floor(s*FPS+1e-6),ss=Math.floor(f/FPS);return[0,Math.floor(ss/60),ss%60,f%FPS].map(pad).join(':')}
function wf(n,k){var h='';for(var i=0;i<n;i++){var v=20+Math.abs(Math.sin(i*.31+k)*Math.cos(i*.07))*70+(i*7919%13);h+='<i style="height:'+Math.min(v,95)+'%"></i>'}return h}
function row(c,tg,nm,inner,b){return'<div class="tr '+c+'"><div class="hd"><em'+(b?' class="b"':'')+'>'+tg+'</em><span>'+nm+'</span></div><div class="lane">'+inner+'</div></div>'}
function pc(x,q){return'left:'+x/q.dur*100+'%;width:'+0+'%'}
function cl(a,l,q,inner,st){return'<div class="clip" style="left:'+a/q.dur*100+'%;width:'+l/q.dur*100+'%;'+(st||'')+'">'+inner+'</div>'}
function build(){var q=SQ[cur],v='',a='',s='',r='',i;
q.clips.forEach(function(c,i){v+=cl(c.s,c.l,q,c.n+'.mov','background:hsl('+c.h+',45%,22%)');if(i%2==0)a+=cl(c.s,c.l,q,'<div class="wf">'+wf(c.l*8,i)+'</div>');else s+=cl(c.s+.5,c.l-1,q,'<div class="wf">'+wf(c.l*6,i+3)+'</div>')});
var m=cl(0,q.dur,q,'<div class="wf">'+wf(q.dur*5,9)+'</div>');
$('.tracks').innerHTML='<div class="ph"></div>'+row('v','V1','Video 1',v,1)+row('a','A1','LAV',a,1)+row('s','A2','SFX',s)+row('m','A3','MUSIC',m);
for(i=0;i<q.dur;i+=10)r+='<span style="left:'+i/q.dur*100+'%">'+Math.floor(i/60)+':'+pad(i%60)+'</span>';
$('.ruler').innerHTML=r+'<i class="rm"></i>';ph=$('.ph');rm=$('.rm');
$('.mon .ptabs .on').textContent='Program: '+q.name;$('.ctl span:last-child').textContent=tc(q.dur);lastCi=-1}
function setT(t){var q=SQ[cur];t=Math.max(0,Math.min(q.dur-1/FPS,t));q.t=t;var p=t/q.dur,ci=0;
q.clips.forEach(function(c,i){if(t>=c.s)ci=i});var c=q.clips[ci],u=(t-c.s)/c.l;
ph.style.left='calc(150px + (100% - 150px) * '+p+')';rm.style.left=p*100+'%';
var s=tc(t);$('.tlh .tc').textContent=s;$('.ctl .tc').textContent=s;$('.scrub i').style.left=p*100+'%';
$('.frame').style.background='radial-gradient(ellipse 60% 70% at '+(35+u*40)+'% 48%,hsl('+c.h+',45%,26%) 0,hsl('+c.h+',50%,9%) 45%,#05080d 100%)';
if(ci!==lastCi){lastCi=ci;$('.frame h1').innerHTML=c.T.split('|').join('<br>');$('.frame p').textContent=c.sub;$('.rec').textContent='\u25cf '+c.n;
document.querySelectorAll('.tr.v .clip').forEach(function(e,i){e.classList.toggle('sel',i===ci)})}}
function play(on){pl=on===undefined?!pl:on;$('.btns span:nth-child(6)').textContent=pl?'\u25a0':'\u25b6';if(pl){var q=SQ[cur];if(q.t>=q.dur-.1)setT(0);last=performance.now();requestAnimationFrame(tick)}}
function tick(n){if(!pl)return;var q=SQ[cur],t=q.t+(n-last)/1000;last=n;if(t>=q.dur-1/FPS){setT(q.dur);play(false);return}setT(t);requestAnimationFrame(tick)}
function jump(d){var q=SQ[cur],t=q.t,x=d<0?0:q.dur;q.clips.forEach(function(c){if(d<0&&c.s<t-.05&&c.s>x)x=c.s;if(d>0&&c.s>t+.01&&c.s<x)x=c.s});setT(x)}
function tabs(){$('.tlh').innerHTML=open.map(function(i){return'<span class="stab'+(i===cur?' on':'')+'" data-s="'+i+'">'+SQ[i].name+(open.length>1?'<u data-x="'+i+'">\u00d7</u>':'')+'</span>'}).join('')+'<span class="tc"></span>'}
function tree(){var h='<div class="l1"><span class="fo"></span>001 SEQUENCES</div>';SQ.forEach(function(q,i){h+='<div class="l2'+(i===cur?' hl':'')+'" data-s="'+i+'"><span class="sw"></span>'+q.name+'</div>'});
[['002 SHORT FILMS',1],['003 COMMERCIAL',2],['004 MUSIC VIDEOS',3],['005 DOCUMENTARY',4],['006 BEHIND THE SCENES',-1],['007 ABOUT & CONTACT',-2]].forEach(function(b){h+='<div class="l1" '+(b[1]>-1?'':(b[1]==-2?'':'')) +'data-s="'+b[1]+'"><span class="fo"></span>'+b[0]+'</div>'});$('.tree').innerHTML=h}
function openSeq(i){play(false);if(open.indexOf(i)<0)open.push(i);cur=i;tabs();tree();build();setT(SQ[i].t)}
$('.tree').addEventListener('click',function(e){var el=e.target.closest('[data-s]');if(!el)return;var s=+el.dataset.s;if(s>=0)openSeq(s);else if(s==-2)document.querySelector('[data-t=export]').click()});
$('.tlh').addEventListener('click',function(e){var x=e.target.closest('[data-x]'),t=e.target.closest('[data-s]');if(x){var i=+x.dataset.x;open.splice(open.indexOf(i),1);if(cur===i)openSeq(open[0]);else{tabs()}}else if(t)openSeq(+t.dataset.s)});
function bind(el,rect){el.addEventListener('pointerdown',function(e){if(e.button||e.clientX<rect().left)return;e.preventDefault();play(false);var mv=function(ev){var r=rect();setT((ev.clientX-r.left)/r.width*SQ[cur].dur)};mv(e);window.addEventListener('pointermove',mv);window.addEventListener('pointerup',function u(){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',u)})})}
var rr=function(){return $('.ruler').getBoundingClientRect()};bind($('.ruler'),rr);bind($('.tracks'),rr);bind($('.scrub'),function(){return $('.scrub').getBoundingClientRect()});
var B=document.querySelectorAll('.btns span');B[4].textContent='|\u25c0';B[6].textContent='\u25b6|';B[5].textContent='\u25b6';
B[3].onclick=function(){jump(-1)};B[7].onclick=function(){jump(1)};B[5].onclick=function(){play()};B[4].onclick=function(){play(false);setT(SQ[cur].t-1/FPS)};B[6].onclick=function(){play(false);setT(SQ[cur].t+1/FPS)};
addEventListener('keydown',function(e){if(app.dataset.v!=='edit'||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;var k=e.code,q=SQ[cur];
if(k=='Space'){e.preventDefault();play()}else if(k=='ArrowLeft'){e.preventDefault();play(false);setT(q.t-1/FPS)}else if(k=='ArrowRight'){e.preventDefault();play(false);setT(q.t+1/FPS)}else if(k=='ArrowUp'){e.preventDefault();jump(-1)}else if(k=='ArrowDown'){e.preventDefault();jump(1)}else if(k=='Home')setT(0);else if(k=='End')setT(q.dur)});
openSeq(0);SQ[0].t=0;setT(2.5);
