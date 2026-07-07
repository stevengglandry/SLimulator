(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const zt=Math.PI*2;function tt(i,e,t){return Math.max(e,Math.min(t,i))}function _e(i,e,t){return i+(e-i)*t}function qc(i){const e=tt(i,0,1);return e*e*(3-2*e)}function yr(i){let e=i;for(;e>Math.PI;)e-=zt;for(;e<-Math.PI;)e+=zt;return e}function ml(i,e,t){return i+yr(e-i)*t}function Q(i){const e=Math.sin(i*12.9898+78.233)*43758.5453;return e-Math.floor(e)}function Ps(i){const e=Math.max(0,Math.floor(i));return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function Ut(i,e=1){return Number.isFinite(i)?i.toFixed(e):"0"}const Hh=38;class Vh{ctx=null;master=null;motorFundamental=null;motorHarmonic=null;inverterWhine=null;cabinHum=null;motorGain=null;inverterGain=null;cabinHumGain=null;motorTone=null;tireNoise=null;tireGain=null;tireFilter=null;roadNoise=null;roadGain=null;roadFilter=null;started=!1;lastCrashCount=0;lastImpactBurstAt=-1;resume(){this.ensure().then(()=>this.ctx?.resume())}update(e){if(!this.started)return;const t=this.ctx;if(!t||!this.motorFundamental||!this.motorHarmonic||!this.inverterWhine||!this.cabinHum||!this.motorGain||!this.inverterGain||!this.cabinHumGain||!this.motorTone||!this.tireGain||!this.tireFilter||!this.roadGain||!this.roadFilter)return;const n=tt(e.vehicle.speedMps/Hh,0,1),s=Math.pow(n,1.18),r=e.vehicle.controls.accelerator,a=e.vehicle.controls.brake,o=Math.abs(e.vehicle.controls.steer),l=tt(Math.abs(e.vehicle.headingErrorRad)*1.4,0,1),c=tt(n*(o*.7+a*.48+l*.45),0,1),h=tt(r+a*.35,0,1),u=t.currentTime,d=64+s*330+h*52,m=540+s*720+h*160;this.motorFundamental.frequency.setTargetAtTime(d,u,.08),this.motorHarmonic.frequency.setTargetAtTime(d*1.53,u,.08),this.inverterWhine.frequency.setTargetAtTime(m,u,.06),this.cabinHum.frequency.setTargetAtTime(48+n*22+h*18,u,.16),this.motorTone.frequency.setTargetAtTime(420+s*780+h*260,u,.12),this.motorGain.gain.setTargetAtTime(.012+s*.018+h*.04,u,.12),this.inverterGain.gain.setTargetAtTime(12e-5+s*32e-5+h*7e-4,u,.14),this.cabinHumGain.gain.setTargetAtTime(.01+n*.005+h*.009,u,.18),this.roadFilter.frequency.setTargetAtTime(150+n*430,u,.24),this.roadGain.gain.setTargetAtTime(s*.042+a*n*.008,u,.2),this.tireFilter.frequency.setTargetAtTime(420+n*980+c*520,u,.16),this.tireGain.gain.setTargetAtTime(Math.pow(n,1.45)*.014+c*.024,u,.12),e.metrics.crashCount>this.lastCrashCount&&this.burst("impact"),this.lastCrashCount=e.metrics.crashCount}alert(e){this.ensure().then(()=>{const t=this.ctx,n=this.master;if(!t||!n)return;const s=t.createOscillator(),r=t.createGain();s.type=e==="earcon"?"sine":"square",s.frequency.value=e==="earcon"?880:82,r.gain.setValueAtTime(1e-4,t.currentTime),r.gain.exponentialRampToValueAtTime(e==="earcon"?.16:.08,t.currentTime+.03),r.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+(e==="earcon"?.45:.7)),s.connect(r).connect(n),s.start(),s.stop(t.currentTime+.8)})}burst(e){this.ensure().then(()=>{const t=this.ctx,n=this.master;!t||!n||(e==="impact"?this.playImpactCrash(t,n):this.playTireScreech(t,n))})}async ensure(){if(this.started)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.58;const t=this.ctx.createDynamicsCompressor();t.threshold.value=-18,t.knee.value=16,t.ratio.value=3.5,t.attack.value=.004,t.release.value=.18,this.master.connect(t).connect(this.ctx.destination),this.motorGain=this.ctx.createGain(),this.motorGain.gain.value=0,this.motorTone=this.ctx.createBiquadFilter(),this.motorTone.type="lowpass",this.motorTone.frequency.value=620,this.motorTone.Q.value=.72,this.motorFundamental=this.ctx.createOscillator(),this.motorFundamental.type="sine",this.motorHarmonic=this.ctx.createOscillator(),this.motorHarmonic.type="triangle";const n=this.ctx.createGain();n.gain.value=.9;const s=this.ctx.createGain();s.gain.value=.16,this.motorFundamental.connect(n).connect(this.motorTone),this.motorHarmonic.connect(s).connect(this.motorTone),this.motorTone.connect(this.motorGain).connect(this.master),this.motorFundamental.start(),this.motorHarmonic.start(),this.inverterGain=this.ctx.createGain(),this.inverterGain.gain.value=0,this.inverterWhine=this.ctx.createOscillator(),this.inverterWhine.type="sine";const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.value=720,r.Q.value=.5,this.inverterWhine.connect(r).connect(this.inverterGain).connect(this.master),this.inverterWhine.start(),this.cabinHumGain=this.ctx.createGain(),this.cabinHumGain.gain.value=0,this.cabinHum=this.ctx.createOscillator(),this.cabinHum.type="sine";const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=118,this.cabinHum.connect(a).connect(this.cabinHumGain).connect(this.master),this.cabinHum.start();const o=this.createNoiseBuffer("warm");this.roadNoise=this.ctx.createBufferSource(),this.roadNoise.buffer=o,this.roadNoise.loop=!0,this.roadGain=this.ctx.createGain(),this.roadGain.gain.value=0;const l=this.ctx.createBiquadFilter();l.type="highpass",l.frequency.value=34,this.roadFilter=this.ctx.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadFilter.frequency.value=220,this.roadFilter.Q.value=.56,this.roadNoise.connect(l).connect(this.roadFilter).connect(this.roadGain).connect(this.master),this.roadNoise.start();const c=this.createNoiseBuffer("bright");this.tireNoise=this.ctx.createBufferSource(),this.tireNoise.buffer=c,this.tireNoise.loop=!0,this.tireGain=this.ctx.createGain(),this.tireGain.gain.value=0;const h=this.ctx.createBiquadFilter();h.type="highpass",h.frequency.value=170,this.tireFilter=this.ctx.createBiquadFilter(),this.tireFilter.type="bandpass",this.tireFilter.frequency.value=520,this.tireFilter.Q.value=.62,this.tireNoise.connect(h).connect(this.tireFilter).connect(this.tireGain).connect(this.master),this.tireNoise.start(),this.started=!0}playTireScreech(e,t){const n=e.currentTime,s=e.createOscillator(),r=e.createBiquadFilter(),a=e.createGain();s.type="sawtooth",s.frequency.setValueAtTime(680,n),s.frequency.exponentialRampToValueAtTime(420,n+.6),r.type="bandpass",r.frequency.setValueAtTime(980,n),r.frequency.exponentialRampToValueAtTime(640,n+.55),r.Q.value=4.4,a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.13,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.72),s.connect(r).connect(a).connect(t),s.start(n),s.stop(n+.78)}playImpactCrash(e,t){const n=e.currentTime;if(n-this.lastImpactBurstAt<.22)return;this.lastImpactBurstAt=n;const s=e.createOscillator(),r=e.createBiquadFilter(),a=e.createGain();s.type="sawtooth",s.frequency.setValueAtTime(930,n),s.frequency.exponentialRampToValueAtTime(520,n+.36),r.type="bandpass",r.frequency.setValueAtTime(1150,n),r.frequency.exponentialRampToValueAtTime(620,n+.38),r.Q.value=5.2,a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.11,n+.016),a.gain.exponentialRampToValueAtTime(.018,n+.32),a.gain.exponentialRampToValueAtTime(1e-4,n+.54),s.connect(r).connect(a).connect(t),s.start(n),s.stop(n+.58);const o=e.createOscillator(),l=e.createBiquadFilter(),c=e.createGain();o.type="sine",o.frequency.setValueAtTime(62,n+.035),o.frequency.exponentialRampToValueAtTime(34,n+.34),l.type="lowpass",l.frequency.value=160,c.gain.setValueAtTime(1e-4,n),c.gain.exponentialRampToValueAtTime(.32,n+.045),c.gain.exponentialRampToValueAtTime(1e-4,n+.44),o.connect(l).connect(c).connect(t),o.start(n),o.stop(n+.5);const h=e.createBufferSource(),u=e.createBiquadFilter(),d=e.createGain();h.buffer=this.createNoiseBuffer("bright"),u.type="bandpass",u.frequency.value=340,u.Q.value=1.1,d.gain.setValueAtTime(1e-4,n),d.gain.exponentialRampToValueAtTime(.18,n+.045),d.gain.exponentialRampToValueAtTime(1e-4,n+.24),h.connect(u).connect(d).connect(t),h.start(n+.025),h.stop(n+.28)}createNoiseBuffer(e){const t=this.ctx;if(!t)throw new Error("Audio context is not ready");const n=t.createBuffer(1,t.sampleRate*2,t.sampleRate),s=n.getChannelData(0);let r=0;for(let a=0;a<s.length;a++){const o=Math.random()*2-1;e==="warm"?(r=r*.985+o*.015,s[a]=r*4.2):(r=r*.35+o*.65,s[a]=r)}return n}}const Wh=360,Xh=.12;class qh{last=performance.now();frames=0;acc=0;lastFrameMs=0;frameHistory=[];stages=new Map;fps=0;mark(e=performance.now()){const t=Math.min(.1,Math.max(0,(e-this.last)/1e3));return this.last=e,this.lastFrameMs=t*1e3,this.frameHistory.push(this.lastFrameMs),this.frameHistory.length>Wh&&this.frameHistory.shift(),this.frames++,this.acc+=t,this.acc>=.5&&(this.fps=this.frames/this.acc,this.frames=0,this.acc=0),t}measure(e,t){const n=performance.now();try{return t()}finally{this.record(e,performance.now()-n)}}record(e,t){const n=this.stages.get(e);if(!n){this.stages.set(e,{lastMs:t,avgMs:t,maxMs:t});return}n.lastMs=t,n.avgMs+=(t-n.avgMs)*Xh,n.maxMs=Math.max(n.maxMs*.985,t)}snapshot(e){const t=this.frameHistory,n=t.length?t.reduce((l,c)=>l+c,0)/t.length:this.lastFrameMs,s=t.length?Math.max(...t):this.lastFrameMs,r=[...t].sort((l,c)=>l-c),a=r.length?r[Math.max(0,Math.floor(r.length*.99)-1)]:this.lastFrameMs,o={};for(const[l,c]of this.stages)o[l]={lastMs:On(c.lastMs),avgMs:On(c.avgMs),maxMs:On(c.maxMs)};return{fps:On(this.fps),frameMs:{last:On(this.lastFrameMs),avg:On(n),max:On(s),p99:On(a),onePercentLowFps:a>0?On(1e3/a):0},stages:o,renderer:e}}}function On(i){return Math.round(i*100)/100}const Yc="6.0.0",ws=2.2369362921,$i=1/ws,Vt={unmapped:{label:"UNMAPPED",lanes:1,curveAmp:11.5,trees:3.84,buildings:0,city:0,median:.8,guardrailDistance:10.7,forest:1,crosswalks:.85,trafficLights:0,buildingScale:0,buildingSetback:16,skylineDensity:0,speedLimitMph:30},l2:{label:"L2 HIGHWAY",lanes:2,curveAmp:5.4,trees:.22,buildings:.28,city:.28,median:4.1,guardrailDistance:4.5,forest:.02,crosswalks:0,trafficLights:.12,buildingScale:.45,buildingSetback:8,skylineDensity:0,speedLimitMph:50},l3:{label:"L3 HIGHWAY",lanes:3,curveAmp:2.1,trees:0,buildings:.92,city:.18,median:5.2,guardrailDistance:5.25,forest:0,crosswalks:0,trafficLights:0,buildingScale:2.9,buildingSetback:80,skylineDensity:1,speedLimitMph:70}},Oe={laneWidth:5.4,shoulderWidth:2.4,vehicleWidth:1.82,vehicleLength:4.6,tireTrack:1.58,wheelbase:2.7,pedestrianHitRadius:.5,maxSpeedMps:80*$i,routeWaveMeters:360,driverSteerGain:.72,driverSteerExponent:1.22,lowSpeedSteerRad:.52,highSpeedSteerRad:.115,maxSteerRad:.52,steeringPointsPerSecond:10,offRoadPenaltyPerSecond:10,crashPenalty:200,sceneTransitionLeadM:255,sceneTransitionTaperM:115,fixedHz:60,sampleHz:10};function Yh(i){const e=tt(i,-1,1);return Math.sign(e)*Math.pow(Math.abs(e),Oe.driverSteerExponent)}function $h(i,e,t){if(t>.05)return{accelerator:0,brake:t};const n=e-i,s=tt(n*.22+.08,0,.72),r=tt(-n*.2-.03,0,.62);return{accelerator:s,brake:r}}function Zh(i,e,t){const n=Math.max(i.speedMps,4),s=t==="l3"?.78:.48,r=t==="l3"?1.06:.74,o=-(e.error+Math.sin(i.headingError)*Math.min(n*.42,12))*s/Math.max(n,8)-i.headingError*r,l=t==="l3"?Oe.maxSteerRad*.98:Oe.maxSteerRad*.54;return tt(o,-l,l)}function Kh(i){const e=tt(i/Oe.maxSpeedMps,0,1);return _e(Oe.lowSpeedSteerRad,Oe.highSpeedSteerRad,e)}function Jh(i,e,t,n,s){const r=Kh(t.speedMps),a=Yh(i.steer)*r*Oe.driverSteerGain;let o=a;const l=tt(i.accelerator,0,1);let c=l,h=tt(i.brake,0,1);if(e.accActive){const u=$h(t.speedMps,e.setSpeedMps,h);c=l>.05?Math.max(l,u.accelerator):u.accelerator,h=l>.05?0:u.brake}if(e.lcaActive){const u=s==="l3"?"l3":"l2",d=Zh(t,n,u);e.assistSteerAngle+=(d-e.assistSteerAngle)*(u==="l3"?.38:.24),o=tt(a+e.assistSteerAngle,-r,r)}else e.assistSteerAngle*=.82;return{steer:tt(o/Oe.maxSteerRad,-1,1),accelerator:c,brake:h}}class Qh{constructor(e){this.seed=e}seed;scene="unmapped";transition=null;queue=[];reset(e="unmapped",t=this.seed){this.seed=t>>>0,this.scene=e,this.transition=null,this.queue=[]}requestScene(e,t,n=0){if(!Vt[e])throw new Error(`Unknown scene: ${e}`);if(!this.transition&&e===this.scene)return"noop";const s=this.queue[this.queue.length-1];return this.transition&&this.transition.to===e&&this.queue.length===0||s?.target===e?"noop":this.transition?(this.queue.push({target:e}),"queued"):(this.beginTransition(e,n),"started")}beginTransition(e,t=0){const n=Math.max(0,t),s=n+Oe.sceneTransitionLeadM;this.transition={from:this.scene,to:e,progress:0,originS:n,taperStartS:s,lockS:s+Oe.sceneTransitionTaperM}}update(e,t=0){if(!this.transition)return{};if(this.transition.progress=tt((t-this.transition.originS)/Math.max(1,this.transition.lockS-this.transition.originS),0,1),t<this.transition.lockS)return{};const n=this.transition.from,s=this.transition.to;if(this.scene=s,this.transition=null,this.queue.length){const r=this.queue.shift();return this.beginTransition(r.target,t),{completed:{from:n,to:s},started:r.target}}return{completed:{from:n,to:s}}}requestedScene(){return this.transition?.to??this.scene}transitionTAt(e){return this.transition?qc((e-this.transition.taperStartS)/Math.max(1,this.transition.lockS-this.transition.taperStartS)):0}scenePairAt(){return this.transition?{from:this.transition.from,to:this.transition.to}:{from:this.scene,to:this.scene}}sceneAt(e){const t=this.scenePairAt();return this.transitionTAt(e)>=.5?t.to:t.from}scenerySceneAt(e){return this.transition?e>=this.transition.taperStartS?this.transition.to:this.scene:this.scene}roadValueAt(e,t){const n=this.scenePairAt();return _e(Vt[n.from][e],Vt[n.to][e],this.transitionTAt(t))}laneCount(e=0){return Vt[this.sceneAt(e)].lanes}laneFloat(e=0){return this.roadValueAt("lanes",e)}frameAt(e){const t=this.roadValueAt("curveAmp",e),n=Oe.routeWaveMeters,s=this.seed%4096/4096*zt,r=e/n*zt+s,a=e/(n*.43)*zt+s*.37,o=Math.sin(r)*t+Math.sin(a)*t*.28,l=Math.cos(r)*(zt/n)*t+Math.cos(a)*(zt/(n*.43))*t*.28,c=-Math.sin(r)*(zt/n)**2*t-Math.sin(a)*(zt/(n*.43))**2*t*.28,h=Math.atan(l),u=c/Math.pow(1+l*l,1.5),d=Math.cos(h),m=Math.sin(h);return{s:e,x:o,z:-e,heading:h,curvature:u,rightX:d,rightZ:m,forwardX:-m,forwardZ:-d}}worldFromRoad(e,t,n=0){const s=this.frameAt(e);return{x:s.x+s.rightX*t,y:n,z:s.z+s.rightZ*t,heading:s.heading}}roadFromWorld(e,t){let n=Math.max(0,-t);for(let o=0;o<4;o++){const l=this.frameAt(n),c=e-l.x,h=t-l.z,u=Math.tan(l.heading);n=Math.max(0,n+(c*u-h)/(u*u+1))}const s=this.frameAt(n),r=e-s.x,a=t-s.z;return{s:n,lateral:r*s.rightX+a*s.rightZ,heading:s.heading}}boundsAt(e=0){const t=this.laneFloat(e),n=this.laneCount(e),s=2*t*Oe.laneWidth,r=-t*Oe.laneWidth,a=t*Oe.laneWidth,o=this.roadValueAt("guardrailDistance",e),l=Array.from({length:n},(c,h)=>Oe.laneWidth*(h+.5));return{laneCount:n,laneFloat:t,leftEdge:r,rightEdge:a,leftWall:r-o,rightWall:a+o,roadWidth:s,medianWidth:this.roadValueAt("median",e),laneCenters:l}}nearestLane(e,t=0){const n=this.boundsAt(t).laneCenters;let s=0,r=Number.POSITIVE_INFINITY;for(let a=0;a<n.length;a++){const o=Math.abs(e-n[a]);o<r&&(r=o,s=a)}return{index:s,center:n[s]??0,error:e-(n[s]??0)}}normalizeHeadingError(e,t){return yr(e-this.frameAt(t).heading)}pedestrianAt(e,t){const n=this.boundsAt(e*16),s=Q(e*15.71+this.seed),r=s<.5?-1:1,a=s*zt,o=.18+Math.sin(t*1.8+a)*.16;return{lateral:(r<0?n.leftEdge:n.rightEdge)+r*(.95+Math.max(0,o)),side:r<0?"left":"right",active:this.roadValueAt("crosswalks",e*16)>.3}}}const Do="185",jh=0,gl=1,ed=2,gr=1,td=2,Es=3,ci=0,en=1,St=2,Dn=0,Ki=1,es=2,_l=3,vl=4,nd=5,vi=100,id=101,sd=102,rd=103,ad=104,od=200,ld=201,cd=202,hd=203,Oa=204,Ba=205,dd=206,ud=207,fd=208,pd=209,md=210,gd=211,_d=212,vd=213,xd=214,za=0,Ga=1,ka=2,ts=3,Ha=4,Va=5,Wa=6,Xa=7,Io=0,Sd=1,Md=2,In=0,Uo=1,No=2,Fo=3,Fr=4,Oo=5,Bo=6,zo=7,$c=300,yi=301,ns=302,qr=303,Yr=304,Or=306,Yn=1e3,Vn=1001,qa=1002,Wt=1003,bd=1004,Fs=1005,Zt=1006,$r=1007,Si=1008,cn=1009,Zc=1010,Kc=1011,Ls=1012,Go=1013,Un=1014,bn=1015,hn=1016,ko=1017,Ho=1018,Ds=1020,Jc=35902,Qc=35899,jc=1021,eh=1022,yn=1023,$n=1026,Mi=1027,Vo=1028,Wo=1029,Ei=1030,Xo=1031,qo=1033,_r=33776,vr=33777,xr=33778,Sr=33779,Ya=35840,$a=35841,Za=35842,Ka=35843,Ja=36196,Qa=37492,ja=37496,eo=37488,to=37489,Er=37490,no=37491,io=37808,so=37809,ro=37810,ao=37811,oo=37812,lo=37813,co=37814,ho=37815,uo=37816,fo=37817,po=37818,mo=37819,go=37820,_o=37821,vo=36492,xo=36494,So=36495,Mo=36283,bo=36284,Tr=36285,yo=36286,yd=3200,Ar=0,Ed=1,ai="",on="srgb",wr="srgb-linear",Cr="linear",ct="srgb",Li=7680,xl=519,Td=512,Ad=513,wd=514,Yo=515,Cd=516,Rd=517,$o=518,Pd=519,Eo=35044,Ji=35048,Sl="300 es",En=2e3,is=2001;function Ld(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dd(){const i=Rr("canvas");return i.style.display="block",i}const Ml={};function Pr(...i){const e="THREE."+i.shift();console.log(e,...i)}function th(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ne(...i){i=th(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ot(...i){i=th(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Qi(...i){const e=i.join(" ");e in Ml||(Ml[e]=!0,Ne(...i))}function Id(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Ud={[za]:Ga,[ka]:Wa,[Ha]:Xa,[ts]:Va,[Ga]:za,[Wa]:ka,[Xa]:Ha,[Va]:ts};class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bl=1234567;const Cs=Math.PI/180,ss=180/Math.PI;function Xn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function Ve(i,e,t){return Math.max(e,Math.min(t,i))}function Zo(i,e){return(i%e+e)%e}function Nd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Fd(i,e,t){return i!==e?(t-i)/(e-i):0}function Rs(i,e,t){return(1-t)*i+t*e}function Od(i,e,t,n){return Rs(i,e,1-Math.exp(-t*n))}function Bd(i,e=1){return e-Math.abs(Zo(i,e*2)-e)}function zd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Gd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function kd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Hd(i,e){return i+Math.random()*(e-i)}function Vd(i){return i*(.5-Math.random())}function Wd(i){i!==void 0&&(bl=i);let e=bl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Xd(i){return i*Cs}function qd(i){return i*ss}function Yd(i){return(i&i-1)===0&&i!==0}function $d(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Zd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kd(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*h,o*c);break;default:Ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Sn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Jd={DEG2RAD:Cs,RAD2DEG:ss,generateUUID:Xn,clamp:Ve,euclideanModulo:Zo,mapLinear:Nd,inverseLerp:Fd,lerp:Rs,damp:Od,pingpong:Bd,smoothstep:zd,smootherstep:Gd,randInt:kd,randFloat:Hd,randFloatSpread:Vd,seededRandom:Wd,degToRad:Xd,radToDeg:qd,isPowerOfTwo:Yd,ceilPowerOfTwo:$d,floorPowerOfTwo:Zd,setQuaternionFromProperEuler:Kd,normalize:ht,denormalize:Sn};class Ue{static{Ue.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class hi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],m=r[a+1],g=r[a+2],v=r[a+3];if(u!==v||l!==d||c!==m||h!==g){let f=l*d+c*m+h*g+u*v;f<0&&(d=-d,m=-m,g=-g,v=-v,f=-f);let p=1-o;if(f<.9995){const M=Math.acos(f),E=Math.sin(M);p=Math.sin(p*M)/E,o=Math.sin(o*M)/E,l=l*p+d*o,c=c*p+m*o,h=h*p+g*o,u=u*p+v*o}else{l=l*p+d*o,c=c*p+m*o,h=h*p+g*o,u=u*p+v*o;const M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*m-c*d,e[t+1]=l*g+h*d+c*u-o*m,e[t+2]=c*g+h*m+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"YZX":this._x=d*h*u+c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u-d*m*g;break;case"XZY":this._x=d*h*u-c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u+d*m*g;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{static{R.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zr.copy(this).projectOnVector(e),this.sub(Zr)}reflect(e){return this.sub(Zr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zr=new R,yl=new hi;class Ge{static{Ge.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],v=s[0],f=s[3],p=s[6],M=s[1],E=s[4],S=s[7],A=s[2],y=s[5],C=s[8];return r[0]=a*v+o*M+l*A,r[3]=a*f+o*E+l*y,r[6]=a*p+o*S+l*C,r[1]=c*v+h*M+u*A,r[4]=c*f+h*E+u*y,r[7]=c*p+h*S+u*C,r[2]=d*v+m*M+g*A,r[5]=d*f+m*E+g*y,r[8]=d*p+m*S+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,m=c*r-a*l,g=t*u+n*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=m*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Qi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Kr.makeScale(e,t)),this}rotate(e){return Qi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Kr.makeRotation(-e)),this}translate(e,t){return Qi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Kr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Kr=new Ge,El=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tl=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Qd(){const i={enabled:!0,workingColorSpace:wr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ct&&(s.r=qn(s.r),s.g=qn(s.g),s.b=qn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ct&&(s.r=ji(s.r),s.g=ji(s.g),s.b=ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ai?Cr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Qi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Qi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[wr]:{primaries:e,whitePoint:n,transfer:Cr,toXYZ:El,fromXYZ:Tl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:El,fromXYZ:Tl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),i}const it=Qd();function qn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Di;class jd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Di===void 0&&(Di=Rr("canvas")),Di.width=e.width,Di.height=e.height;const s=Di.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Di}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=qn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(qn(t[n]/255)*255):t[n]=qn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let eu=0;class Ko{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=Xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jr(s[a].image)):r.push(Jr(s[a]))}else r=Jr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Jr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?jd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let tu=0;const Qr=new R;class Kt extends wi{constructor(e=Kt.DEFAULT_IMAGE,t=Kt.DEFAULT_MAPPING,n=Vn,s=Vn,r=Zt,a=Si,o=yn,l=cn,c=Kt.DEFAULT_ANISOTROPY,h=ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=Xn(),this.name="",this.source=new Ko(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Qr).x}get height(){return this.source.getSize(Qr).y}get depth(){return this.source.getSize(Qr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$c)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Yn:e.x=e.x-Math.floor(e.x);break;case Vn:e.x=e.x<0?0:1;break;case qa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Yn:e.y=e.y-Math.floor(e.y);break;case Vn:e.y=e.y<0?0:1;break;case qa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=$c;Kt.DEFAULT_ANISOTROPY=1;class ft{static{ft.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],m=l[5],g=l[9],v=l[2],f=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,S=(m+1)/2,A=(p+1)/2,y=(h+d)/4,C=(u+v)/4,x=(g+f)/4;return E>S&&E>A?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=y/n,r=C/n):S>A?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=y/s,r=x/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=C/r,s=x/r),this.set(n,s,r,t),this}let M=Math.sqrt((f-g)*(f-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(f-g)/M,this.y=(u-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nu extends wi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Kt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Zt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ko(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class tn extends nu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class nh extends Kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class iu extends Kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pt{static{pt.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,u,d,m,g,v,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,m,g,v,f)}set(e,t,n,s,r,a,o,l,c,h,u,d,m,g,v,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=m,p[7]=g,p[11]=v,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Ii.setFromMatrixColumn(e,0).length(),r=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,m=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,m=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,m=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,m=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-m,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(su,e,ru)}lookAt(e,t,n){const s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),Qn.crossVectors(n,sn),Qn.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),Qn.crossVectors(n,sn)),Qn.normalize(),Os.crossVectors(sn,Qn),s[0]=Qn.x,s[4]=Os.x,s[8]=sn.x,s[1]=Qn.y,s[5]=Os.y,s[9]=sn.y,s[2]=Qn.z,s[6]=Os.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],v=n[6],f=n[10],p=n[14],M=n[3],E=n[7],S=n[11],A=n[15],y=s[0],C=s[4],x=s[8],w=s[12],L=s[1],D=s[5],N=s[9],q=s[13],K=s[2],B=s[6],X=s[10],H=s[14],J=s[3],se=s[7],fe=s[11],ne=s[15];return r[0]=a*y+o*L+l*K+c*J,r[4]=a*C+o*D+l*B+c*se,r[8]=a*x+o*N+l*X+c*fe,r[12]=a*w+o*q+l*H+c*ne,r[1]=h*y+u*L+d*K+m*J,r[5]=h*C+u*D+d*B+m*se,r[9]=h*x+u*N+d*X+m*fe,r[13]=h*w+u*q+d*H+m*ne,r[2]=g*y+v*L+f*K+p*J,r[6]=g*C+v*D+f*B+p*se,r[10]=g*x+v*N+f*X+p*fe,r[14]=g*w+v*q+f*H+p*ne,r[3]=M*y+E*L+S*K+A*J,r[7]=M*C+E*D+S*B+A*se,r[11]=M*x+E*N+S*X+A*fe,r[15]=M*w+E*q+S*H+A*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],m=e[14],g=e[3],v=e[7],f=e[11],p=e[15],M=l*m-c*d,E=o*m-c*u,S=o*d-l*u,A=a*m-c*h,y=a*d-l*h,C=a*u-o*h;return t*(v*M-f*E+p*S)-n*(g*M-f*A+p*y)+s*(g*E-v*A+p*C)-r*(g*S-v*y+f*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],m=e[11],g=e[12],v=e[13],f=e[14],p=e[15],M=t*o-n*a,E=t*l-s*a,S=t*c-r*a,A=n*l-s*o,y=n*c-r*o,C=s*c-r*l,x=h*v-u*g,w=h*f-d*g,L=h*p-m*g,D=u*f-d*v,N=u*p-m*v,q=d*p-m*f,K=M*q-E*N+S*D+A*L-y*w+C*x;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/K;return e[0]=(o*q-l*N+c*D)*B,e[1]=(s*N-n*q-r*D)*B,e[2]=(v*C-f*y+p*A)*B,e[3]=(d*y-u*C-m*A)*B,e[4]=(l*L-a*q-c*w)*B,e[5]=(t*q-s*L+r*w)*B,e[6]=(f*S-g*C-p*E)*B,e[7]=(h*C-d*S+m*E)*B,e[8]=(a*N-o*L+c*x)*B,e[9]=(n*L-t*N-r*x)*B,e[10]=(g*y-v*S+p*M)*B,e[11]=(u*S-h*y-m*M)*B,e[12]=(o*w-a*D-l*x)*B,e[13]=(t*D-n*w+s*x)*B,e[14]=(v*E-g*A-f*M)*B,e[15]=(h*A-u*E+d*M)*B,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,m=r*h,g=r*u,v=a*h,f=a*u,p=o*u,M=l*c,E=l*h,S=l*u,A=n.x,y=n.y,C=n.z;return s[0]=(1-(v+p))*A,s[1]=(m+S)*A,s[2]=(g-E)*A,s[3]=0,s[4]=(m-S)*y,s[5]=(1-(d+p))*y,s[6]=(f+M)*y,s[7]=0,s[8]=(g+E)*C,s[9]=(f-M)*C,s[10]=(1-(d+v))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ii.set(s[0],s[1],s[2]).length();const o=Ii.set(s[4],s[5],s[6]).length(),l=Ii.set(s[8],s[9],s[10]).length();r<0&&(a=-a),gn.copy(this);const c=1/a,h=1/o,u=1/l;return gn.elements[0]*=c,gn.elements[1]*=c,gn.elements[2]*=c,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=u,gn.elements[9]*=u,gn.elements[10]*=u,t.setFromRotationMatrix(gn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=En,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),m=(n+s)/(n-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===En)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===is)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=En,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===En)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===is)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new R,gn=new pt,su=new R(0,0,0),ru=new R(1,1,1),Qn=new R,Os=new R,sn=new R,Al=new pt,wl=new hi;class Nn{constructor(e=0,t=0,n=0,s=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Al.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Al,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wl.setFromEuler(this),this.setFromQuaternion(wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class ih{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let au=0;const Cl=new R,Ui=new hi,Bn=new pt,Bs=new R,fs=new R,ou=new R,lu=new hi,Rl=new R(1,0,0),Pl=new R(0,1,0),Ll=new R(0,0,1),Dl={type:"added"},cu={type:"removed"},Ni={type:"childadded",child:null},jr={type:"childremoved",child:null};class Rt extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=Xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new R,t=new Nn,n=new hi,s=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pt},normalMatrix:{value:new Ge}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ih,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.premultiply(Ui),this}rotateX(e){return this.rotateOnAxis(Rl,e)}rotateY(e){return this.rotateOnAxis(Pl,e)}rotateZ(e){return this.rotateOnAxis(Ll,e)}translateOnAxis(e,t){return Cl.copy(e).applyQuaternion(this.quaternion),this.position.add(Cl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Rl,e)}translateY(e){return this.translateOnAxis(Pl,e)}translateZ(e){return this.translateOnAxis(Ll,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Bs.copy(e):Bs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(fs,Bs,this.up):Bn.lookAt(Bs,fs,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),Ui.setFromRotationMatrix(Bn),this.quaternion.premultiply(Ui.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ot("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):ot("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cu),jr.child=e,this.dispatchEvent(jr),jr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,e,ou),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,lu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new R(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Wn extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hu={type:"move"};class ea{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const f=t.getJointPose(v,n),p=this._getHandJoint(c,v);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const sh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},zs={h:0,s:0,l:0};function ta(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Te{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=on){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=it.workingColorSpace){if(e=Zo(e,1),t=Ve(t,0,1),n=Ve(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ta(a,r,e+1/3),this.g=ta(a,r,e),this.b=ta(a,r,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=on){function n(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=on){const n=sh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qn(e.r),this.g=qn(e.g),this.b=qn(e.b),this}copyLinearToSRGB(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=on){return it.workingToColorSpace(Yt.copy(this),e),Math.round(Ve(Yt.r*255,0,255))*65536+Math.round(Ve(Yt.g*255,0,255))*256+Math.round(Ve(Yt.b*255,0,255))}getHexString(e=on){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(Yt.copy(this),t);const n=Yt.r,s=Yt.g,r=Yt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=on){it.workingToColorSpace(Yt.copy(this),e);const t=Yt.r,n=Yt.g,s=Yt.b;return e!==on?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(zs);const n=Rs(jn.h,zs.h,t),s=Rs(jn.s,zs.s,t),r=Rs(jn.l,zs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Te;Te.NAMES=sh;class Lr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Te(e),this.near=t,this.far=n}clone(){return new Lr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class du extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const _n=new R,zn=new R,na=new R,Gn=new R,Fi=new R,Oi=new R,Il=new R,ia=new R,sa=new R,ra=new R,aa=new ft,oa=new ft,la=new ft;class Mn{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),_n.subVectors(e,t),s.cross(_n);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){_n.subVectors(s,t),zn.subVectors(n,t),na.subVectors(e,t);const a=_n.dot(_n),o=_n.dot(zn),l=_n.dot(na),c=zn.dot(zn),h=zn.dot(na),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gn.x),l.addScaledVector(a,Gn.y),l.addScaledVector(o,Gn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return aa.setScalar(0),oa.setScalar(0),la.setScalar(0),aa.fromBufferAttribute(e,t),oa.fromBufferAttribute(e,n),la.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(aa,r.x),a.addScaledVector(oa,r.y),a.addScaledVector(la,r.z),a}static isFrontFacing(e,t,n,s){return _n.subVectors(n,t),zn.subVectors(e,t),_n.cross(zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),_n.cross(zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Mn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Fi.subVectors(s,n),Oi.subVectors(r,n),ia.subVectors(e,n);const l=Fi.dot(ia),c=Oi.dot(ia);if(l<=0&&c<=0)return t.copy(n);sa.subVectors(e,s);const h=Fi.dot(sa),u=Oi.dot(sa);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Fi,a);ra.subVectors(e,r);const m=Fi.dot(ra),g=Oi.dot(ra);if(g>=0&&m<=g)return t.copy(r);const v=m*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Oi,o);const f=h*g-m*u;if(f<=0&&u-h>=0&&m-g>=0)return Il.subVectors(r,s),o=(u-h)/(u-h+(m-g)),t.copy(s).addScaledVector(Il,o);const p=1/(f+v+d);return a=v*p,o=d*p,t.copy(n).addScaledVector(Fi,a).addScaledVector(Oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Fn{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,vn):vn.fromBufferAttribute(r,a),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Gs.copy(n.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ps),ks.subVectors(this.max,ps),Bi.subVectors(e.a,ps),zi.subVectors(e.b,ps),Gi.subVectors(e.c,ps),ei.subVectors(zi,Bi),ti.subVectors(Gi,zi),fi.subVectors(Bi,Gi);let t=[0,-ei.z,ei.y,0,-ti.z,ti.y,0,-fi.z,fi.y,ei.z,0,-ei.x,ti.z,0,-ti.x,fi.z,0,-fi.x,-ei.y,ei.x,0,-ti.y,ti.x,0,-fi.y,fi.x,0];return!ca(t,Bi,zi,Gi,ks)||(t=[1,0,0,0,1,0,0,0,1],!ca(t,Bi,zi,Gi,ks))?!1:(Hs.crossVectors(ei,ti),t=[Hs.x,Hs.y,Hs.z],ca(t,Bi,zi,Gi,ks))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const kn=[new R,new R,new R,new R,new R,new R,new R,new R],vn=new R,Gs=new Fn,Bi=new R,zi=new R,Gi=new R,ei=new R,ti=new R,fi=new R,ps=new R,ks=new R,Hs=new R,pi=new R;function ca(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){pi.fromArray(i,r);const o=s.x*Math.abs(pi.x)+s.y*Math.abs(pi.y)+s.z*Math.abs(pi.z),l=e.dot(pi),c=t.dot(pi),h=n.dot(pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const It=new R,Vs=new Ue;let uu=0;class yt extends wi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:uu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Eo,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Vs.fromBufferAttribute(this,t),Vs.applyMatrix3(e),this.setXY(t,Vs.x,Vs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Eo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class rh extends yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ah extends yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class _t extends yt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const fu=new Fn,ms=new R,ha=new R;class di{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):fu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ms.subVectors(e,this.center);const t=ms.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ms,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ha.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ms.copy(e.center).add(ha)),this.expandByPoint(ms.copy(e.center).sub(ha))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let pu=0;const un=new pt,da=new Rt,ki=new R,rn=new Fn,gs=new Fn,Bt=new R;class Et extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=Xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ld(e)?ah:rh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,t,n){return un.makeTranslation(e,t,n),this.applyMatrix4(un),this}scale(e,t,n){return un.makeScale(e,t,n),this.applyMatrix4(un),this}lookAt(e){return da.lookAt(e),da.updateMatrix(),this.applyMatrix4(da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new _t(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(rn.min,gs.min),rn.expandByPoint(Bt),Bt.addVectors(rn.max,gs.max),rn.expandByPoint(Bt)):(rn.expandByPoint(gs.min),rn.expandByPoint(gs.max))}rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Bt.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(e,c),Bt.add(ki)),s=Math.max(s,n.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new yt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new R,l[x]=new R;const c=new R,h=new R,u=new R,d=new Ue,m=new Ue,g=new Ue,v=new R,f=new R;function p(x,w,L){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,L),d.fromBufferAttribute(r,x),m.fromBufferAttribute(r,w),g.fromBufferAttribute(r,L),h.sub(c),u.sub(c),m.sub(d),g.sub(d);const D=1/(m.x*g.y-g.x*m.y);isFinite(D)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(D),f.copy(u).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(D),o[x].add(v),o[w].add(v),o[L].add(v),l[x].add(f),l[w].add(f),l[L].add(f))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,w=M.length;x<w;++x){const L=M[x],D=L.start,N=L.count;for(let q=D,K=D+N;q<K;q+=3)p(e.getX(q+0),e.getX(q+1),e.getX(q+2))}const E=new R,S=new R,A=new R,y=new R;function C(x){A.fromBufferAttribute(s,x),y.copy(A);const w=o[x];E.copy(w),E.sub(A.multiplyScalar(A.dot(w))).normalize(),S.crossVectors(y,w);const D=S.dot(l[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,D)}for(let x=0,w=M.length;x<w;++x){const L=M[x],D=L.start,N=L.count;for(let q=D,K=D+N;q<K;q+=3)C(e.getX(q+0)),C(e.getX(q+1)),C(e.getX(q+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),v=e.getX(d+1),f=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,f),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let m=0,g=0;for(let v=0,f=l.length;v<f;v++){o.isInterleavedBufferAttribute?m=l[v]*o.data.stride+o.offset:m=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[m++]}return new yt(d,h,u)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Et,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],m=e(d,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Eo,this.updateRanges=[],this.version=0,this.uuid=Xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Jt=new R;class oi{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Pr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new oi(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Pr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let gu=0;class Ci extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gu++}),this.uuid=Xn(),this.name="",this.type="Material",this.blending=Ki,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oa,this.blendDst=Ba,this.blendEquation=vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Oa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ba&&(n.blendDst=this.blendDst),this.blendEquation!==vi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ue().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ue().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Hn=new R,ua=new R,Ws=new R,ni=new R,fa=new R,Xs=new R,pa=new R;class oh{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Hn.copy(this.origin).addScaledVector(this.direction,t),Hn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ua.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(ua);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ws),o=ni.dot(this.direction),l=-ni.dot(Ws),c=ni.lengthSq(),h=Math.abs(1-a*a);let u,d,m,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,m=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ua).addScaledVector(Ws,d),m}intersectSphere(e,t){Hn.subVectors(e.center,this.origin);const n=Hn.dot(this.direction),s=Hn.dot(Hn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Hn)!==null}intersectTriangle(e,t,n,s,r){fa.subVectors(t,e),Xs.subVectors(n,e),pa.crossVectors(fa,Xs);let a=this.direction.dot(pa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ni.subVectors(this.origin,e);const l=o*this.direction.dot(Xs.crossVectors(ni,Xs));if(l<0)return null;const c=o*this.direction.dot(fa.cross(ni));if(c<0||l+c>a)return null;const h=-o*ni.dot(pa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $t extends Ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Io,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ul=new pt,mi=new oh,qs=new di,Nl=new R,Ys=new R,$s=new R,Zs=new R,ma=new R,Ks=new R,Fl=new R,Js=new R;class rt extends Rt{constructor(e=new Et,t=new $t){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ks.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(ma.fromBufferAttribute(u,e),a?Ks.addScaledVector(ma,h):Ks.addScaledVector(ma.sub(t),h))}t.add(Ks)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(r),mi.copy(e.ray).recast(e.near),!(qs.containsPoint(mi.origin)===!1&&(mi.intersectSphere(qs,Nl)===null||mi.origin.distanceToSquared(Nl)>(e.far-e.near)**2))&&(Ul.copy(r).invert(),mi.copy(e.ray).applyMatrix4(Ul),!(n.boundingBox!==null&&mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,mi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const f=d[g],p=a[f.materialIndex],M=Math.max(f.start,m.start),E=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let S=M,A=E;S<A;S+=3){const y=o.getX(S),C=o.getX(S+1),x=o.getX(S+2);s=Qs(this,p,e,n,c,h,u,y,C,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let f=g,p=v;f<p;f+=3){const M=o.getX(f),E=o.getX(f+1),S=o.getX(f+2);s=Qs(this,a,e,n,c,h,u,M,E,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const f=d[g],p=a[f.materialIndex],M=Math.max(f.start,m.start),E=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let S=M,A=E;S<A;S+=3){const y=S,C=S+1,x=S+2;s=Qs(this,p,e,n,c,h,u,y,C,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let f=g,p=v;f<p;f+=3){const M=f,E=f+1,S=f+2;s=Qs(this,a,e,n,c,h,u,M,E,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function _u(i,e,t,n,s,r,a,o){let l;if(e.side===en?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===ci,o),l===null)return null;Js.copy(o),Js.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Js);return c<t.near||c>t.far?null:{distance:c,point:Js.clone(),object:i}}function Qs(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Ys),i.getVertexPosition(l,$s),i.getVertexPosition(c,Zs);const h=_u(i,e,t,n,Ys,$s,Zs,Fl);if(h){const u=new R;Mn.getBarycoord(Fl,Ys,$s,Zs,u),s&&(h.uv=Mn.getInterpolatedAttribute(s,o,l,c,u,new Ue)),r&&(h.uv1=Mn.getInterpolatedAttribute(r,o,l,c,u,new Ue)),a&&(h.normal=Mn.getInterpolatedAttribute(a,o,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new R,materialIndex:0};Mn.getNormal(Ys,$s,Zs,d.normal),h.face=d,h.barycoord=u}return h}class lh extends Kt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Wt,h=Wt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ol extends yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hi=new pt,Bl=new pt,js=[],zl=new Fn,vu=new pt,_s=new rt,vs=new di;class xu extends rt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ol(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,vu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Fn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),zl.copy(e.boundingBox).applyMatrix4(Hi),this.boundingBox.union(zl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),vs.copy(e.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(vs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(_s.geometry=this.geometry,_s.material=this.material,_s.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vs.copy(this.boundingSphere),vs.applyMatrix4(n),e.ray.intersectsSphere(vs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Hi),Bl.multiplyMatrices(n,Hi),_s.matrixWorld=Bl,_s.raycast(e,js);for(let a=0,o=js.length;a<o;a++){const l=js[a];l.instanceId=r,l.object=this,t.push(l)}js.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ol(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new lh(new Float32Array(s*this.count),s,this.count,Vo,bn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ga=new R,Su=new R,Mu=new Ge;class _i{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ga.subVectors(n,t).cross(Su.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(ga),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Mu.getNormalMatrix(e),s=this.coplanarPoint(ga).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new di,bu=new Ue(.5,.5),er=new R;class Jo{constructor(e=new _i,t=new _i,n=new _i,s=new _i,r=new _i,a=new _i){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],m=r[7],g=r[8],v=r[9],f=r[10],p=r[11],M=r[12],E=r[13],S=r[14],A=r[15];if(s[0].setComponents(c-a,m-h,p-g,A-M).normalize(),s[1].setComponents(c+a,m+h,p+g,A+M).normalize(),s[2].setComponents(c+o,m+u,p+v,A+E).normalize(),s[3].setComponents(c-o,m-u,p-v,A-E).normalize(),n)s[4].setComponents(l,d,f,S).normalize(),s[5].setComponents(c-l,m-d,p-f,A-S).normalize();else if(s[4].setComponents(c-l,m-d,p-f,A-S).normalize(),t===En)s[5].setComponents(c+l,m+d,p+f,A+S).normalize();else if(t===is)s[5].setComponents(l,d,f,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(e){gi.center.set(0,0,0);const t=bu.distanceTo(e.center);return gi.radius=.7071067811865476+t,gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(er.x=s.normal.x>0?e.max.x:e.min.x,er.y=s.normal.y>0?e.max.y:e.min.y,er.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(er)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ch extends Ci{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Dr=new R,Ir=new R,Gl=new pt,xs=new oh,tr=new di,_a=new R,kl=new R;class yu extends Rt{constructor(e=new Et,t=new ch){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Dr.fromBufferAttribute(t,s-1),Ir.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Dr.distanceTo(Ir);e.setAttribute("lineDistance",new _t(n,1))}else Ne("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(s),tr.radius+=r,e.ray.intersectsSphere(tr)===!1)return;Gl.copy(s).invert(),xs.copy(e.ray).applyMatrix4(Gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=m,f=g-1;v<f;v+=c){const p=h.getX(v),M=h.getX(v+1),E=nr(this,e,xs,l,p,M,v);E&&t.push(E)}if(this.isLineLoop){const v=h.getX(g-1),f=h.getX(m),p=nr(this,e,xs,l,v,f,g-1);p&&t.push(p)}}else{const m=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=m,f=g-1;v<f;v+=c){const p=nr(this,e,xs,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=nr(this,e,xs,l,g-1,m,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function nr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Dr.fromBufferAttribute(o,s),Ir.fromBufferAttribute(o,r),t.distanceSqToSegment(Dr,Ir,_a,kl)>n)return;_a.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(_a);if(!(c<e.near||c>e.far))return{distance:c,point:kl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Hl=new R,Vl=new R;class Eu extends yu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Hl.fromBufferAttribute(t,s),Vl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Hl.distanceTo(Vl);e.setAttribute("lineDistance",new _t(n,1))}else Ne("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hh extends Kt{constructor(e=[],t=yi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cs extends Kt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class rs extends Kt{constructor(e,t,n=Un,s,r,a,o=Wt,l=Wt,c,h=$n,u=1){if(h!==$n&&h!==Mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ko(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Tu extends rs{constructor(e,t=Un,n=yi,s,r,a=Wt,o=Wt,l,c=$n){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class dh extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ye extends Et{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new _t(c,3)),this.setAttribute("normal",new _t(h,3)),this.setAttribute("uv",new _t(u,2));function g(v,f,p,M,E,S,A,y,C,x,w){const L=S/C,D=A/x,N=S/2,q=A/2,K=y/2,B=C+1,X=x+1;let H=0,J=0;const se=new R;for(let fe=0;fe<X;fe++){const ne=fe*D-q;for(let re=0;re<B;re++){const nt=re*L-N;se[v]=nt*M,se[f]=ne*E,se[p]=K,c.push(se.x,se.y,se.z),se[v]=0,se[f]=0,se[p]=y>0?1:-1,h.push(se.x,se.y,se.z),u.push(re/C),u.push(1-fe/x),H+=1}}for(let fe=0;fe<x;fe++)for(let ne=0;ne<C;ne++){const re=d+ne+B*fe,nt=d+ne+B*(fe+1),Qe=d+(ne+1)+B*(fe+1),We=d+(ne+1)+B*fe;l.push(re,nt,We),l.push(nt,Qe,We),J+=6}o.addGroup(m,J,w),m+=J,d+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ye(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class as extends Et{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],m=[];let g=0;const v=[],f=n/2;let p=0;M(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new _t(u,3)),this.setAttribute("normal",new _t(d,3)),this.setAttribute("uv",new _t(m,2));function M(){const S=new R,A=new R;let y=0;const C=(t-e)/n;for(let x=0;x<=r;x++){const w=[],L=x/r,D=L*(t-e)+e;for(let N=0;N<=s;N++){const q=N/s,K=q*l+o,B=Math.sin(K),X=Math.cos(K);A.x=D*B,A.y=-L*n+f,A.z=D*X,u.push(A.x,A.y,A.z),S.set(B,C,X).normalize(),d.push(S.x,S.y,S.z),m.push(q,1-L),w.push(g++)}v.push(w)}for(let x=0;x<s;x++)for(let w=0;w<r;w++){const L=v[w][x],D=v[w+1][x],N=v[w+1][x+1],q=v[w][x+1];(e>0||w!==0)&&(h.push(L,D,q),y+=3),(t>0||w!==r-1)&&(h.push(D,N,q),y+=3)}c.addGroup(p,y,0),p+=y}function E(S){const A=g,y=new Ue,C=new R;let x=0;const w=S===!0?e:t,L=S===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,f*L,0),d.push(0,L,0),m.push(.5,.5),g++;const D=g;for(let N=0;N<=s;N++){const K=N/s*l+o,B=Math.cos(K),X=Math.sin(K);C.x=w*X,C.y=f*L,C.z=w*B,u.push(C.x,C.y,C.z),d.push(0,L,0),y.x=B*.5+.5,y.y=X*.5*L+.5,m.push(y.x,y.y),g++}for(let N=0;N<s;N++){const q=A+N,K=D+N;S===!0?h.push(K,K+1,q):h.push(K+1,K,q),x+=3}c.addGroup(p,x,S===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new as(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qo extends as{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Qo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class jo extends Et{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new _t(r,3)),this.setAttribute("normal",new _t(r.slice(),3)),this.setAttribute("uv",new _t(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const E=new R,S=new R,A=new R;for(let y=0;y<t.length;y+=3)m(t[y+0],E),m(t[y+1],S),m(t[y+2],A),l(E,S,A,M)}function l(M,E,S,A){const y=A+1,C=[];for(let x=0;x<=y;x++){C[x]=[];const w=M.clone().lerp(S,x/y),L=E.clone().lerp(S,x/y),D=y-x;for(let N=0;N<=D;N++)N===0&&x===y?C[x][N]=w:C[x][N]=w.clone().lerp(L,N/D)}for(let x=0;x<y;x++)for(let w=0;w<2*(y-x)-1;w++){const L=Math.floor(w/2);w%2===0?(d(C[x][L+1]),d(C[x+1][L]),d(C[x][L])):(d(C[x][L+1]),d(C[x+1][L+1]),d(C[x+1][L]))}}function c(M){const E=new R;for(let S=0;S<r.length;S+=3)E.x=r[S+0],E.y=r[S+1],E.z=r[S+2],E.normalize().multiplyScalar(M),r[S+0]=E.x,r[S+1]=E.y,r[S+2]=E.z}function h(){const M=new R;for(let E=0;E<r.length;E+=3){M.x=r[E+0],M.y=r[E+1],M.z=r[E+2];const S=f(M)/2/Math.PI+.5,A=p(M)/Math.PI+.5;a.push(S,1-A)}g(),u()}function u(){for(let M=0;M<a.length;M+=6){const E=a[M+0],S=a[M+2],A=a[M+4],y=Math.max(E,S,A),C=Math.min(E,S,A);y>.9&&C<.1&&(E<.2&&(a[M+0]+=1),S<.2&&(a[M+2]+=1),A<.2&&(a[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function m(M,E){const S=M*3;E.x=e[S+0],E.y=e[S+1],E.z=e[S+2]}function g(){const M=new R,E=new R,S=new R,A=new R,y=new Ue,C=new Ue,x=new Ue;for(let w=0,L=0;w<r.length;w+=9,L+=6){M.set(r[w+0],r[w+1],r[w+2]),E.set(r[w+3],r[w+4],r[w+5]),S.set(r[w+6],r[w+7],r[w+8]),y.set(a[L+0],a[L+1]),C.set(a[L+2],a[L+3]),x.set(a[L+4],a[L+5]),A.copy(M).add(E).add(S).divideScalar(3);const D=f(A);v(y,L+0,M,D),v(C,L+2,E,D),v(x,L+4,S,D)}}function v(M,E,S,A){A<0&&M.x===1&&(a[E]=M.x-1),S.x===0&&S.z===0&&(a[E]=A/2/Math.PI+.5)}function f(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jo(e.vertices,e.indices,e.radius,e.detail)}}class Is extends jo{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Is(e.radius,e.detail)}}class Ti extends Et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,m=[],g=[],v=[],f=[];for(let p=0;p<h;p++){const M=p*d-a;for(let E=0;E<c;E++){const S=E*u-r;g.push(S,-M,0),v.push(0,0,1),f.push(E/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const E=M+c*p,S=M+c*(p+1),A=M+1+c*(p+1),y=M+1+c*p;m.push(E,S,y),m.push(S,A,y)}this.setIndex(m),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(v,3)),this.setAttribute("uv",new _t(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ti(e.width,e.height,e.widthSegments,e.heightSegments)}}class el extends Et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new R,d=new R,m=[],g=[],v=[],f=[];for(let p=0;p<=n;p++){const M=[],E=p/n,S=a+E*o,A=e*Math.cos(S),y=Math.sqrt(e*e-A*A);let C=0;p===0&&a===0?C=.5/t:p===n&&l===Math.PI&&(C=-.5/t);for(let x=0;x<=t;x++){const w=x/t,L=s+w*r;u.x=-y*Math.cos(L),u.y=A,u.z=y*Math.sin(L),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),f.push(w+C,1-E),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){const E=h[p][M+1],S=h[p][M],A=h[p+1][M],y=h[p+1][M+1];(p!==0||a>0)&&m.push(E,S,y),(p!==n-1||l<Math.PI)&&m.push(S,A,y)}this.setIndex(m),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(v,3)),this.setAttribute("uv",new _t(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new el(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Au extends Et{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,s=new R,r=new R;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const u=l[c],d=u.start,m=u.count;for(let g=d,v=d+m;g<v;g+=3)for(let f=0;f<3;f++){const p=o.getX(g+f),M=o.getX(g+(f+1)%3);s.fromBufferAttribute(a,p),r.fromBufferAttribute(a,M),Wl(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,u=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,u),Wl(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new _t(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Wl(i,e,t){const n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(s)===!0?!1:(t.add(n),t.add(s),!0)}function os(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Xl(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Xl(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Qt(i){const e={};for(let t=0;t<i.length;t++){const n=os(i[t]);for(const s in n)e[s]=n[s]}return e}function Xl(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function uh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const Ai={clone:os,merge:Qt};var Cu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ru=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nt extends Ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cu,this.fragmentShader=Ru,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=os(e.uniforms),this.uniformsGroups=wu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Te().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ue().fromArray(s.value);break;case"v3":this.uniforms[n].value=new R().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ft().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ge().fromArray(s.value);break;case"m4":this.uniforms[n].value=new pt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class fh extends Nt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class si extends Ci{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ar,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class lt extends Ci{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ar,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Io,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Pu extends Ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Lu extends Ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Br extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Du extends Br{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const va=new pt,ql=new R,Yl=new R;class ph{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jo,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ql.setFromMatrixPosition(e.matrixWorld),t.position.copy(ql),Yl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yl),t.updateMatrixWorld(),va.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(va,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===is||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(va)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ir=new R,sr=new hi,An=new R;class tl extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ir,sr,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ir,sr,An.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ir,sr,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ir,sr,An.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ii=new R,$l=new Ue,Zl=new Ue;class ln extends tl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ss*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Cs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ss*2*Math.atan(Math.tan(Cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ii.x,ii.y).multiplyScalar(-e/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-e/ii.z)}getViewSize(e,t){return this.getViewBounds(e,$l,Zl),t.subVectors(Zl,$l)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Cs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Iu extends ph{constructor(){super(new ln(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=ss*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Uu extends Br{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Iu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class zr extends tl{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Nu extends ph{constructor(){super(new zr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fu extends Br{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new Nu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Ou extends Br{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Bu extends Et{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Vi=-90,Wi=1;class zu extends Rt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Vi,Wi,e,t);s.layers=this.layers,this.add(s);const r=new ln(Vi,Wi,e,t);r.layers=this.layers,this.add(r);const a=new ln(Vi,Wi,e,t);a.layers=this.layers,this.add(a);const o=new ln(Vi,Wi,e,t);o.layers=this.layers,this.add(o);const l=new ln(Vi,Wi,e,t);l.layers=this.layers,this.add(l);const c=new ln(Vi,Wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===is)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Gu extends ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ku{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Hu.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Hu(){this._document.hidden===!1&&this.reset()}class To extends mu{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class mh{static{mh.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}}const Kl=new R,rr=new R,Xi=new R,qi=new R,xa=new R,Vu=new R,Wu=new R;class Xu{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Kl.subVectors(e,this.start),rr.subVectors(this.end,this.start);const n=rr.dot(rr);if(n===0)return 0;let r=rr.dot(Kl)/n;return t&&(r=Ve(r,0,1)),r}closestPointToPoint(e,t,n){const s=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(e,t=Vu,n=Wu){const s=10000000000000001e-32;let r,a;const o=this.start,l=e.start,c=this.end,h=e.end;Xi.subVectors(c,o),qi.subVectors(h,l),xa.subVectors(o,l);const u=Xi.dot(Xi),d=qi.dot(qi),m=qi.dot(xa);if(u<=s&&d<=s)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(u<=s)r=0,a=m/d,a=Ve(a,0,1);else{const g=Xi.dot(xa);if(d<=s)a=0,r=Ve(-g/u,0,1);else{const v=Xi.dot(qi),f=u*d-v*v;f!==0?r=Ve((v*m-g*d)/f,0,1):r=0,a=(v*r+m)/d,a<0?(a=0,r=Ve(-g/u,0,1)):a>1&&(a=1,r=Ve((v-g)/u,0,1))}}return t.copy(o).addScaledVector(Xi,r),n.copy(l).addScaledVector(qi,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const ar=new R,wt=new tl;class qu extends Eu{constructor(e){const t=new Et,n=new ch({color:16777215,vertexColors:!0,toneMapped:!1}),s=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(g,v){l(g),l(v)}function l(g){s.push(0,0,0),r.push(0,0,0),a[g]===void 0&&(a[g]=[]),a[g].push(s.length/3-1)}t.setAttribute("position",new _t(s,3)),t.setAttribute("color",new _t(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new Te(16755200),h=new Te(16711680),u=new Te(43775),d=new Te(16777215),m=new Te(3355443);this.setColors(c,h,u,d,m)}setColors(e,t,n,s,r){const o=this.geometry.getAttribute("color");return o.setXYZ(0,e.r,e.g,e.b),o.setXYZ(1,e.r,e.g,e.b),o.setXYZ(2,e.r,e.g,e.b),o.setXYZ(3,e.r,e.g,e.b),o.setXYZ(4,e.r,e.g,e.b),o.setXYZ(5,e.r,e.g,e.b),o.setXYZ(6,e.r,e.g,e.b),o.setXYZ(7,e.r,e.g,e.b),o.setXYZ(8,e.r,e.g,e.b),o.setXYZ(9,e.r,e.g,e.b),o.setXYZ(10,e.r,e.g,e.b),o.setXYZ(11,e.r,e.g,e.b),o.setXYZ(12,e.r,e.g,e.b),o.setXYZ(13,e.r,e.g,e.b),o.setXYZ(14,e.r,e.g,e.b),o.setXYZ(15,e.r,e.g,e.b),o.setXYZ(16,e.r,e.g,e.b),o.setXYZ(17,e.r,e.g,e.b),o.setXYZ(18,e.r,e.g,e.b),o.setXYZ(19,e.r,e.g,e.b),o.setXYZ(20,e.r,e.g,e.b),o.setXYZ(21,e.r,e.g,e.b),o.setXYZ(22,e.r,e.g,e.b),o.setXYZ(23,e.r,e.g,e.b),o.setXYZ(24,t.r,t.g,t.b),o.setXYZ(25,t.r,t.g,t.b),o.setXYZ(26,t.r,t.g,t.b),o.setXYZ(27,t.r,t.g,t.b),o.setXYZ(28,t.r,t.g,t.b),o.setXYZ(29,t.r,t.g,t.b),o.setXYZ(30,t.r,t.g,t.b),o.setXYZ(31,t.r,t.g,t.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,s.r,s.g,s.b),o.setXYZ(39,s.r,s.g,s.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){const e=this.geometry,t=this.pointMap,n=1,s=1;let r,a;if(wt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===En)r=-1,a=1;else if(this.camera.coordinateSystem===is)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Dt("c",t,e,wt,0,0,r),Dt("t",t,e,wt,0,0,a),Dt("n1",t,e,wt,-n,-s,r),Dt("n2",t,e,wt,n,-s,r),Dt("n3",t,e,wt,-n,s,r),Dt("n4",t,e,wt,n,s,r),Dt("f1",t,e,wt,-n,-s,a),Dt("f2",t,e,wt,n,-s,a),Dt("f3",t,e,wt,-n,s,a),Dt("f4",t,e,wt,n,s,a),Dt("u1",t,e,wt,n*.7,s*1.1,r),Dt("u2",t,e,wt,-n*.7,s*1.1,r),Dt("u3",t,e,wt,0,s*2,r),Dt("cf1",t,e,wt,-n,0,a),Dt("cf2",t,e,wt,n,0,a),Dt("cf3",t,e,wt,0,-s,a),Dt("cf4",t,e,wt,0,s,a),Dt("cn1",t,e,wt,-n,0,r),Dt("cn2",t,e,wt,n,0,r),Dt("cn3",t,e,wt,0,-s,r),Dt("cn4",t,e,wt,0,s,r),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Dt(i,e,t,n,s,r,a){ar.set(s,r,a).unproject(n);const o=e[i];if(o!==void 0){const l=t.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],ar.x,ar.y,ar.z)}}function Jl(i,e,t,n){const s=Yu(n);switch(t){case jc:return i*e;case Vo:return i*e/s.components*s.byteLength;case Wo:return i*e/s.components*s.byteLength;case Ei:return i*e*2/s.components*s.byteLength;case Xo:return i*e*2/s.components*s.byteLength;case eh:return i*e*3/s.components*s.byteLength;case yn:return i*e*4/s.components*s.byteLength;case qo:return i*e*4/s.components*s.byteLength;case _r:case vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case xr:case Sr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $a:case Ka:return Math.max(i,16)*Math.max(e,8)/4;case Ya:case Za:return Math.max(i,8)*Math.max(e,8)/2;case Ja:case Qa:case eo:case to:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ja:case Er:case no:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case so:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ao:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case oo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case lo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case co:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ho:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case uo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case fo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case po:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case mo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case go:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case _o:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case vo:case xo:case So:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Mo:case bo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Tr:case yo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yu(i){switch(i){case cn:case Zc:return{byteLength:1,components:1};case Ls:case Kc:case hn:return{byteLength:2,components:1};case ko:case Ho:return{byteLength:2,components:4};case Un:case Go:case bn:return{byteLength:4,components:1};case Jc:case Qc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Do}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Do);function gh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function $u(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<u.length;m++){const g=u[d],v=u[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let m=0,g=u.length;m<g;m++){const v=u[m];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Zu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ku=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ju=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ju=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ef=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,nf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,rf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,af=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,of=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,cf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,hf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,df=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,uf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ff=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,gf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,_f=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,vf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,xf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Sf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Mf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,bf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ef=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Tf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Af="gl_FragColor = linearToOutputTexel( gl_FragColor );",wf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Rf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Pf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Lf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Df=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,If=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Uf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ff=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Of=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Bf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Hf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Vf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Yf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$f=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Zf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Kf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Jf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qf=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,jf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ep=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,np=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ip=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ap=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,op=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,up=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,xp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Sp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ep=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Rp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Pp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Up=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Np=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Op=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Bp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Gp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Xp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,im=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,sm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,rm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,om=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,mm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,_m=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Mm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ym=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Em=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Am=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:Zu,alphahash_pars_fragment:Ku,alphamap_fragment:Ju,alphamap_pars_fragment:Qu,alphatest_fragment:ju,alphatest_pars_fragment:ef,aomap_fragment:tf,aomap_pars_fragment:nf,batching_pars_vertex:sf,batching_vertex:rf,begin_vertex:af,beginnormal_vertex:of,bsdfs:lf,iridescence_fragment:cf,bumpmap_pars_fragment:hf,clipping_planes_fragment:df,clipping_planes_pars_fragment:uf,clipping_planes_pars_vertex:ff,clipping_planes_vertex:pf,color_fragment:mf,color_pars_fragment:gf,color_pars_vertex:_f,color_vertex:vf,common:xf,cube_uv_reflection_fragment:Sf,defaultnormal_vertex:Mf,displacementmap_pars_vertex:bf,displacementmap_vertex:yf,emissivemap_fragment:Ef,emissivemap_pars_fragment:Tf,colorspace_fragment:Af,colorspace_pars_fragment:wf,envmap_fragment:Cf,envmap_common_pars_fragment:Rf,envmap_pars_fragment:Pf,envmap_pars_vertex:Lf,envmap_physical_pars_fragment:Hf,envmap_vertex:Df,fog_vertex:If,fog_pars_vertex:Uf,fog_fragment:Nf,fog_pars_fragment:Ff,gradientmap_pars_fragment:Of,lightmap_pars_fragment:Bf,lights_lambert_fragment:zf,lights_lambert_pars_fragment:Gf,lights_pars_begin:kf,lights_toon_fragment:Vf,lights_toon_pars_fragment:Wf,lights_phong_fragment:Xf,lights_phong_pars_fragment:qf,lights_physical_fragment:Yf,lights_physical_pars_fragment:$f,lights_fragment_begin:Zf,lights_fragment_maps:Kf,lights_fragment_end:Jf,lightprobes_pars_fragment:Qf,logdepthbuf_fragment:jf,logdepthbuf_pars_fragment:ep,logdepthbuf_pars_vertex:tp,logdepthbuf_vertex:np,map_fragment:ip,map_pars_fragment:sp,map_particle_fragment:rp,map_particle_pars_fragment:ap,metalnessmap_fragment:op,metalnessmap_pars_fragment:lp,morphinstance_vertex:cp,morphcolor_vertex:hp,morphnormal_vertex:dp,morphtarget_pars_vertex:up,morphtarget_vertex:fp,normal_fragment_begin:pp,normal_fragment_maps:mp,normal_pars_fragment:gp,normal_pars_vertex:_p,normal_vertex:vp,normalmap_pars_fragment:xp,clearcoat_normal_fragment_begin:Sp,clearcoat_normal_fragment_maps:Mp,clearcoat_pars_fragment:bp,iridescence_pars_fragment:yp,opaque_fragment:Ep,packing:Tp,premultiplied_alpha_fragment:Ap,project_vertex:wp,dithering_fragment:Cp,dithering_pars_fragment:Rp,roughnessmap_fragment:Pp,roughnessmap_pars_fragment:Lp,shadowmap_pars_fragment:Dp,shadowmap_pars_vertex:Ip,shadowmap_vertex:Up,shadowmask_pars_fragment:Np,skinbase_vertex:Fp,skinning_pars_vertex:Op,skinning_vertex:Bp,skinnormal_vertex:zp,specularmap_fragment:Gp,specularmap_pars_fragment:kp,tonemapping_fragment:Hp,tonemapping_pars_fragment:Vp,transmission_fragment:Wp,transmission_pars_fragment:Xp,uv_pars_fragment:qp,uv_pars_vertex:Yp,uv_vertex:$p,worldpos_vertex:Zp,background_vert:Kp,background_frag:Jp,backgroundCube_vert:Qp,backgroundCube_frag:jp,cube_vert:em,cube_frag:tm,depth_vert:nm,depth_frag:im,distance_vert:sm,distance_frag:rm,equirect_vert:am,equirect_frag:om,linedashed_vert:lm,linedashed_frag:cm,meshbasic_vert:hm,meshbasic_frag:dm,meshlambert_vert:um,meshlambert_frag:fm,meshmatcap_vert:pm,meshmatcap_frag:mm,meshnormal_vert:gm,meshnormal_frag:_m,meshphong_vert:vm,meshphong_frag:xm,meshphysical_vert:Sm,meshphysical_frag:Mm,meshtoon_vert:bm,meshtoon_frag:ym,points_vert:Em,points_frag:Tm,shadow_vert:Am,shadow_frag:wm,sprite_vert:Cm,sprite_frag:Rm},ue={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},jt={basic:{uniforms:Qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Qt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Qt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Qt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Te(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Qt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Qt([ue.points,ue.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Qt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Qt([ue.common,ue.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Qt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Qt([ue.sprite,ue.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:Qt([ue.common,ue.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:Qt([ue.lights,ue.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};jt.physical={uniforms:Qt([jt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const or={r:0,b:0,g:0},Pm=new pt,_h=new Ge;_h.set(-1,0,0,0,1,0,0,0,1);function Lm(i,e,t,n,s,r){const a=new Te(0);let o=s===!0?0:1,l,c,h=null,u=0,d=null;function m(M){let E=M.isScene===!0?M.background:null;if(E&&E.isTexture){const S=M.backgroundBlurriness>0;E=e.get(E,S)}return E}function g(M){let E=!1;const S=m(M);S===null?f(a,o):S&&S.isColor&&(f(S,1),E=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(M,E){const S=m(E);S&&(S.isCubeTexture||S.mapping===Or)?(c===void 0&&(c=new rt(new Ye(1,1,1),new Nt({name:"BackgroundCubeMaterial",uniforms:os(jt.backgroundCube.uniforms),vertexShader:jt.backgroundCube.vertexShader,fragmentShader:jt.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,y,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Pm.makeRotationFromEuler(E.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_h),c.material.toneMapped=it.getTransfer(S.colorSpace)!==ct,(h!==S||u!==S.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,u=S.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new rt(new Ti(2,2),new Nt({name:"BackgroundMaterial",uniforms:os(jt.background.uniforms),vertexShader:jt.background.vertexShader,fragmentShader:jt.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=it.getTransfer(S.colorSpace)!==ct,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||u!==S.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=S,u=S.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function f(M,E){M.getRGB(or,uh(i)),t.buffers.color.setClear(or.r,or.g,or.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,E=1){a.set(M),o=E,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,f(a,o)},render:g,addToRenderList:v,dispose:p}}function Dm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(D,N,q,K,B){let X=!1;const H=u(D,K,q,N);r!==H&&(r=H,c(r.object)),X=m(D,K,q,B),X&&g(D,K,q,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,S(D,N,q,K),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(D){return i.bindVertexArray(D)}function h(D){return i.deleteVertexArray(D)}function u(D,N,q,K){const B=K.wireframe===!0;let X=n[N.id];X===void 0&&(X={},n[N.id]=X);const H=D.isInstancedMesh===!0?D.id:0;let J=X[H];J===void 0&&(J={},X[H]=J);let se=J[q.id];se===void 0&&(se={},J[q.id]=se);let fe=se[B];return fe===void 0&&(fe=d(l()),se[B]=fe),fe}function d(D){const N=[],q=[],K=[];for(let B=0;B<t;B++)N[B]=0,q[B]=0,K[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:q,attributeDivisors:K,object:D,attributes:{},index:null}}function m(D,N,q,K){const B=r.attributes,X=N.attributes;let H=0;const J=q.getAttributes();for(const se in J)if(J[se].location>=0){const ne=B[se];let re=X[se];if(re===void 0&&(se==="instanceMatrix"&&D.instanceMatrix&&(re=D.instanceMatrix),se==="instanceColor"&&D.instanceColor&&(re=D.instanceColor)),ne===void 0||ne.attribute!==re||re&&ne.data!==re.data)return!0;H++}return r.attributesNum!==H||r.index!==K}function g(D,N,q,K){const B={},X=N.attributes;let H=0;const J=q.getAttributes();for(const se in J)if(J[se].location>=0){let ne=X[se];ne===void 0&&(se==="instanceMatrix"&&D.instanceMatrix&&(ne=D.instanceMatrix),se==="instanceColor"&&D.instanceColor&&(ne=D.instanceColor));const re={};re.attribute=ne,ne&&ne.data&&(re.data=ne.data),B[se]=re,H++}r.attributes=B,r.attributesNum=H,r.index=K}function v(){const D=r.newAttributes;for(let N=0,q=D.length;N<q;N++)D[N]=0}function f(D){p(D,0)}function p(D,N){const q=r.newAttributes,K=r.enabledAttributes,B=r.attributeDivisors;q[D]=1,K[D]===0&&(i.enableVertexAttribArray(D),K[D]=1),B[D]!==N&&(i.vertexAttribDivisor(D,N),B[D]=N)}function M(){const D=r.newAttributes,N=r.enabledAttributes;for(let q=0,K=N.length;q<K;q++)N[q]!==D[q]&&(i.disableVertexAttribArray(q),N[q]=0)}function E(D,N,q,K,B,X,H){H===!0?i.vertexAttribIPointer(D,N,q,B,X):i.vertexAttribPointer(D,N,q,K,B,X)}function S(D,N,q,K){v();const B=K.attributes,X=q.getAttributes(),H=N.defaultAttributeValues;for(const J in X){const se=X[J];if(se.location>=0){let fe=B[J];if(fe===void 0&&(J==="instanceMatrix"&&D.instanceMatrix&&(fe=D.instanceMatrix),J==="instanceColor"&&D.instanceColor&&(fe=D.instanceColor)),fe!==void 0){const ne=fe.normalized,re=fe.itemSize,nt=e.get(fe);if(nt===void 0)continue;const Qe=nt.buffer,We=nt.type,$=nt.bytesPerElement,he=We===i.INT||We===i.UNSIGNED_INT||fe.gpuType===Go;if(fe.isInterleavedBufferAttribute){const te=fe.data,Ce=te.stride,Fe=fe.offset;if(te.isInstancedInterleavedBuffer){for(let Re=0;Re<se.locationSize;Re++)p(se.location+Re,te.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Re=0;Re<se.locationSize;Re++)f(se.location+Re);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let Re=0;Re<se.locationSize;Re++)E(se.location+Re,re/se.locationSize,We,ne,Ce*$,(Fe+re/se.locationSize*Re)*$,he)}else{if(fe.isInstancedBufferAttribute){for(let te=0;te<se.locationSize;te++)p(se.location+te,fe.meshPerAttribute);D.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let te=0;te<se.locationSize;te++)f(se.location+te);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let te=0;te<se.locationSize;te++)E(se.location+te,re/se.locationSize,We,ne,re*$,re/se.locationSize*te*$,he)}}else if(H!==void 0){const ne=H[J];if(ne!==void 0)switch(ne.length){case 2:i.vertexAttrib2fv(se.location,ne);break;case 3:i.vertexAttrib3fv(se.location,ne);break;case 4:i.vertexAttrib4fv(se.location,ne);break;default:i.vertexAttrib1fv(se.location,ne)}}}}M()}function A(){w();for(const D in n){const N=n[D];for(const q in N){const K=N[q];for(const B in K){const X=K[B];for(const H in X)h(X[H].object),delete X[H];delete K[B]}}delete n[D]}}function y(D){if(n[D.id]===void 0)return;const N=n[D.id];for(const q in N){const K=N[q];for(const B in K){const X=K[B];for(const H in X)h(X[H].object),delete X[H];delete K[B]}}delete n[D.id]}function C(D){for(const N in n){const q=n[N];for(const K in q){const B=q[K];if(B[D.id]===void 0)continue;const X=B[D.id];for(const H in X)h(X[H].object),delete X[H];delete B[D.id]}}}function x(D){for(const N in n){const q=n[N],K=D.isInstancedMesh===!0?D.id:0,B=q[K];if(B!==void 0){for(const X in B){const H=B[X];for(const J in H)h(H[J].object),delete H[J];delete B[X]}delete q[K],Object.keys(q).length===0&&delete n[N]}}}function w(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:A,releaseStatesOfGeometry:y,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:f,disableUnusedAttributes:M}}function Im(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let m=0;m<h;m++)d+=c[m];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Um(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==yn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==cn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==bn&&!x)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ne("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),y=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:M,maxVaryings:E,maxFragmentUniforms:S,maxSamples:A,samples:y}}function Nm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new _i,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||s;return s=d,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,v=u.clipIntersection,f=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{const M=r?0:n,E=M*4;let S=p.clippingState||null;l.value=S,S=h(g,d,E,m);for(let A=0;A!==E;++A)S[A]=t[A];p.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,m,g){const v=u!==null?u.length:0;let f=null;if(v!==0){if(f=l.value,g!==!0||f===null){const p=m+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(f===null||f.length<p)&&(f=new Float32Array(p));for(let E=0,S=m;E!==v;++E,S+=4)a.copy(u[E]).applyMatrix4(M,o),a.normal.toArray(f,S),f[S+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,f}}const li=4,Ql=[.125,.215,.35,.446,.526,.582],xi=20,Fm=256,Ss=new zr,jl=new Te;let Sa=null,Ma=0,ba=0,ya=!1;const Om=new R;class ec{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Om}=r;Sa=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),ya=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ic(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Sa,Ma,ba),this._renderer.xr.enabled=ya,e.scissorTest=!1,Yi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===yi||e.mapping===ns?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sa=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),ya=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Zt,minFilter:Zt,generateMipmaps:!1,type:hn,format:yn,colorSpace:wr,depthBuffer:!1},s=tc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tc(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Bm(r)),this._blurMaterial=Gm(r,e,t),this._ggxMaterial=zm(r,e,t)}return s}_compileMaterial(e){const t=new rt(new Et,e);this._renderer.compile(t,Ss)}_sceneToCubeUV(e,t,n,s,r){const l=new ln(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,m=u.toneMapping;u.getClearColor(jl),u.toneMapping=In,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new rt(new Ye,new $t({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,f=v.material;let p=!1;const M=e.background;M?M.isColor&&(f.color.copy(M),e.background=null,p=!0):(f.color.copy(jl),p=!0);for(let E=0;E<6;E++){const S=E%3;S===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):S===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const A=this._cubeSize;Yi(s,S*A,E>2?A:0,A,A),u.setRenderTarget(s),p&&u.render(v,l),u.render(e,l)}u.toneMapping=m,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===yi||e.mapping===ns;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ic()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Yi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ss)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,m=u*d,{_lodMax:g}=this,v=this._sizeLods[n],f=3*v*(n>g-li?n-g+li:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=g-t,Yi(r,f,p,3*v,2*v),s.setRenderTarget(r),s.render(o,Ss),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Yi(e,f,p,3*v,2*v),s.setRenderTarget(e),s.render(o,Ss)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ot("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=c;const d=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*xi-1),v=r/g,f=isFinite(r)?1+Math.floor(h*v):xi;f>xi&&Ne(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${xi}`);const p=[];let M=0;for(let C=0;C<xi;++C){const x=C/v,w=Math.exp(-x*x/2);p.push(w),C===0?M+=w:C<f&&(M+=2*w)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=f,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const S=this._sizeLods[s],A=3*S*(s>E-li?s-E+li:0),y=4*(this._cubeSize-S);Yi(t,A,y,3*S,2*S),l.setRenderTarget(t),l.render(u,Ss)}}function Bm(i){const e=[],t=[],n=[];let s=i;const r=i-li+1+Ql.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-li?l=Ql[a-i+li-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,v=3,f=2,p=1,M=new Float32Array(v*g*m),E=new Float32Array(f*g*m),S=new Float32Array(p*g*m);for(let y=0;y<m;y++){const C=y%3*2/3-1,x=y>2?0:-1,w=[C,x,0,C+2/3,x,0,C+2/3,x+1,0,C,x,0,C+2/3,x+1,0,C,x+1,0];M.set(w,v*g*y),E.set(d,f*g*y);const L=[y,y,y,y,y,y];S.set(L,p*g*y)}const A=new Et;A.setAttribute("position",new yt(M,v)),A.setAttribute("uv",new yt(E,f)),A.setAttribute("faceIndex",new yt(S,p)),n.push(new rt(A,null)),s>li&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function tc(i,e,t){const n=new tn(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Yi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function zm(i,e,t){return new Nt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Fm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Gr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Gm(i,e,t){const n=new Float32Array(xi),s=new R(0,1,0);return new Nt({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function nc(){return new Nt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function ic(){return new Nt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Gr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class vh extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new hh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ye(5,5,5),r=new Nt({name:"CubemapFromEquirect",uniforms:os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:Dn});r.uniforms.tEquirect.value=t;const a=new rt(s,r),o=t.minFilter;return t.minFilter===Si&&(t.minFilter=Zt),new zu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function km(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,m=!1){return d==null?null:m?a(d):r(d)}function r(d){if(d&&d.isTexture){const m=d.mapping;if(m===qr||m===Yr)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const v=new vh(g.height);return v.fromEquirectangularTexture(i,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const m=d.mapping,g=m===qr||m===Yr,v=m===yi||m===ns;if(g||v){let f=t.get(d);const p=f!==void 0?f.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new ec(i)),f=g?n.fromEquirectangular(d,f):n.fromCubemap(d,f),f.texture.pmremVersion=d.pmremVersion,t.set(d,f),f.texture;if(f!==void 0)return f.texture;{const M=d.image;return g&&M&&M.height>0||v&&M&&l(M)?(n===null&&(n=new ec(i)),f=g?n.fromEquirectangular(d):n.fromCubemap(d),f.texture.pmremVersion=d.pmremVersion,t.set(d,f),d.addEventListener("dispose",h),f.texture):null}}}return d}function o(d,m){return m===qr?d.mapping=yi:m===Yr&&(d.mapping=ns),d}function l(d){let m=0;const g=6;for(let v=0;v<g;v++)d[v]!==void 0&&m++;return m===g}function c(d){const m=d.target;m.removeEventListener("dispose",c);const g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function h(d){const m=d.target;m.removeEventListener("dispose",h);const g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function Hm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Qi("WebGLRenderer: "+n+" extension not supported."),s}}}function Vm(i,e,t,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const m in d)e.update(d[m],i.ARRAY_BUFFER)}function c(u){const d=[],m=u.index,g=u.attributes.position;let v=0;if(g===void 0)return;if(m!==null){const M=m.array;v=m.version;for(let E=0,S=M.length;E<S;E+=3){const A=M[E+0],y=M[E+1],C=M[E+2];d.push(A,y,y,C,C,A)}}else{const M=g.array;v=g.version;for(let E=0,S=M.length/3-1;E<S;E+=3){const A=E+0,y=E+1,C=E+2;d.push(A,y,y,C,C,A)}}const f=new(g.count>=65535?ah:rh)(d,1);f.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,f)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Wm(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,u*a,m),t.update(d,n,m))}function h(u,d,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,m);let v=0;for(let f=0;f<m;f++)v+=d[f];t.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Xm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ot("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function qm(i,e,t){const n=new WeakMap,s=new ft;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let L=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",L)};var m=L;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),v===!0&&(S=2),f===!0&&(S=3);let A=o.attributes.position.count*S,y=1;A>e.maxTextureSize&&(y=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const C=new Float32Array(A*y*4*u),x=new nh(C,A,y,u);x.type=bn,x.needsUpdate=!0;const w=S*4;for(let D=0;D<u;D++){const N=p[D],q=M[D],K=E[D],B=A*y*4*D;for(let X=0;X<N.count;X++){const H=X*w;g===!0&&(s.fromBufferAttribute(N,X),C[B+H+0]=s.x,C[B+H+1]=s.y,C[B+H+2]=s.z,C[B+H+3]=0),v===!0&&(s.fromBufferAttribute(q,X),C[B+H+4]=s.x,C[B+H+5]=s.y,C[B+H+6]=s.z,C[B+H+7]=0),f===!0&&(s.fromBufferAttribute(K,X),C[B+H+8]=s.x,C[B+H+9]=s.y,C[B+H+10]=s.z,C[B+H+11]=K.itemSize===4?s.w:1)}}d={count:u,texture:x,size:new Ue(A,y)},n.set(o,d),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let f=0;f<c.length;f++)g+=c[f];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Ym(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const $m={[Uo]:"LINEAR_TONE_MAPPING",[No]:"REINHARD_TONE_MAPPING",[Fo]:"CINEON_TONE_MAPPING",[Fr]:"ACES_FILMIC_TONE_MAPPING",[Bo]:"AGX_TONE_MAPPING",[zo]:"NEUTRAL_TONE_MAPPING",[Oo]:"CUSTOM_TONE_MAPPING"};function Zm(i,e,t,n,s,r){const a=new tn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new rs(e,t):void 0}),o=new tn(e,t,{type:hn,depthBuffer:!1,stencilBuffer:!1}),l=new Et;l.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new _t([0,2,0,0,2,0],2));const c=new fh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new rt(l,c),u=new zr(-1,1,1,-1,0,1);let d=null,m=null,g=!1,v,f=null,p=[],M=!1;this.setSize=function(E,S){a.setSize(E,S),o.setSize(E,S);for(let A=0;A<p.length;A++){const y=p[A];y.setSize&&y.setSize(E,S)}},this.setEffects=function(E){p=E,M=p.length>0&&p[0].isRenderPass===!0;const S=a.width,A=a.height;for(let y=0;y<p.length;y++){const C=p[y];C.setSize&&C.setSize(S,A)}},this.begin=function(E,S){if(g||E.toneMapping===In&&p.length===0)return!1;if(f=S,S!==null){const A=S.width,y=S.height;(a.width!==A||a.height!==y)&&this.setSize(A,y)}return M===!1&&E.setRenderTarget(a),v=E.toneMapping,E.toneMapping=In,!0},this.hasRenderPass=function(){return M},this.end=function(E,S){E.toneMapping=v,g=!0;let A=a,y=o;for(let C=0;C<p.length;C++){const x=p[C];if(x.enabled!==!1&&(x.render(E,y,A,S),x.needsSwap!==!1)){const w=A;A=y,y=w}}if(d!==E.outputColorSpace||m!==E.toneMapping){d=E.outputColorSpace,m=E.toneMapping,c.defines={},it.getTransfer(d)===ct&&(c.defines.SRGB_TRANSFER="");const C=$m[m];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,E.setRenderTarget(f),E.render(h,u),f=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const xh=new Kt,Ao=new rs(1,1),Sh=new nh,Mh=new iu,bh=new hh,sc=[],rc=[],ac=new Float32Array(16),oc=new Float32Array(9),lc=new Float32Array(4);function hs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=sc[s];if(r===void 0&&(r=new Float32Array(s),sc[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function kr(i,e){let t=rc[e];t===void 0&&(t=new Int32Array(e),rc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Km(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Jm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function Qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function jm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function eg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;lc.set(n),i.uniformMatrix2fv(this.addr,!1,lc),Ot(t,n)}}function tg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;oc.set(n),i.uniformMatrix3fv(this.addr,!1,oc),Ot(t,n)}}function ng(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;ac.set(n),i.uniformMatrix4fv(this.addr,!1,ac),Ot(t,n)}}function ig(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function sg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function rg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function ag(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function og(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function lg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function cg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function hg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function dg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ao.compareFunction=t.isReversedDepthBuffer()?$o:Yo,r=Ao):r=xh,t.setTexture2D(e||r,s)}function ug(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Mh,s)}function fg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bh,s)}function pg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Sh,s)}function mg(i){switch(i){case 5126:return Km;case 35664:return Jm;case 35665:return Qm;case 35666:return jm;case 35674:return eg;case 35675:return tg;case 35676:return ng;case 5124:case 35670:return ig;case 35667:case 35671:return sg;case 35668:case 35672:return rg;case 35669:case 35673:return ag;case 5125:return og;case 36294:return lg;case 36295:return cg;case 36296:return hg;case 35678:case 36198:case 36298:case 36306:case 35682:return dg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return fg;case 36289:case 36303:case 36311:case 36292:return pg}}function gg(i,e){i.uniform1fv(this.addr,e)}function _g(i,e){const t=hs(e,this.size,2);i.uniform2fv(this.addr,t)}function vg(i,e){const t=hs(e,this.size,3);i.uniform3fv(this.addr,t)}function xg(i,e){const t=hs(e,this.size,4);i.uniform4fv(this.addr,t)}function Sg(i,e){const t=hs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Mg(i,e){const t=hs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function bg(i,e){const t=hs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function yg(i,e){i.uniform1iv(this.addr,e)}function Eg(i,e){i.uniform2iv(this.addr,e)}function Tg(i,e){i.uniform3iv(this.addr,e)}function Ag(i,e){i.uniform4iv(this.addr,e)}function wg(i,e){i.uniform1uiv(this.addr,e)}function Cg(i,e){i.uniform2uiv(this.addr,e)}function Rg(i,e){i.uniform3uiv(this.addr,e)}function Pg(i,e){i.uniform4uiv(this.addr,e)}function Lg(i,e,t){const n=this.cache,s=e.length,r=kr(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ao:a=xh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Dg(i,e,t){const n=this.cache,s=e.length,r=kr(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Mh,r[a])}function Ig(i,e,t){const n=this.cache,s=e.length,r=kr(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||bh,r[a])}function Ug(i,e,t){const n=this.cache,s=e.length,r=kr(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Sh,r[a])}function Ng(i){switch(i){case 5126:return gg;case 35664:return _g;case 35665:return vg;case 35666:return xg;case 35674:return Sg;case 35675:return Mg;case 35676:return bg;case 5124:case 35670:return yg;case 35667:case 35671:return Eg;case 35668:case 35672:return Tg;case 35669:case 35673:return Ag;case 5125:return wg;case 36294:return Cg;case 36295:return Rg;case 36296:return Pg;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ig;case 36289:case 36303:case 36311:case 36292:return Ug}}class Fg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=mg(t.type)}}class Og{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ng(t.type)}}class Bg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Ea=/(\w+)(\])?(\[|\.)?/g;function cc(i,e){i.seq.push(e),i.map[e.id]=e}function zg(i,e,t){const n=i.name,s=n.length;for(Ea.lastIndex=0;;){const r=Ea.exec(n),a=Ea.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){cc(t,c===void 0?new Fg(o,i,e):new Og(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Bg(o),cc(t,u)),t=u}}}class Mr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);zg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function hc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Gg=37297;let kg=0;function Hg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const dc=new Ge;function Vg(i){it._getMatrix(dc,it.workingColorSpace,i);const e=`mat3( ${dc.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(i)){case Cr:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function uc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Hg(i.getShaderSource(e),o)}else return r}function Wg(i,e){const t=Vg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Xg={[Uo]:"Linear",[No]:"Reinhard",[Fo]:"Cineon",[Fr]:"ACESFilmic",[Bo]:"AgX",[zo]:"Neutral",[Oo]:"Custom"};function qg(i,e){const t=Xg[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const lr=new R;function Yg(){it.getLuminanceCoefficients(lr);const i=lr.x.toFixed(4),e=lr.y.toFixed(4),t=lr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $g(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ts).join(`
`)}function Zg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Kg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ts(i){return i!==""}function fc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Jg=/^[ \t]*#include +<([\w\d./]+)>/gm;function wo(i){return i.replace(Jg,jg)}const Qg=new Map;function jg(i,e){let t=$e[e];if(t===void 0){const n=Qg.get(e);if(n!==void 0)t=$e[n],Ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return wo(t)}const e0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mc(i){return i.replace(e0,t0)}function t0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function gc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const n0={[gr]:"SHADOWMAP_TYPE_PCF",[Es]:"SHADOWMAP_TYPE_VSM"};function i0(i){return n0[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const s0={[yi]:"ENVMAP_TYPE_CUBE",[ns]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE_UV"};function r0(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":s0[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const a0={[ns]:"ENVMAP_MODE_REFRACTION"};function o0(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":a0[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const l0={[Io]:"ENVMAP_BLENDING_MULTIPLY",[Sd]:"ENVMAP_BLENDING_MIX",[Md]:"ENVMAP_BLENDING_ADD"};function c0(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":l0[i.combine]||"ENVMAP_BLENDING_NONE"}function h0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function d0(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=i0(t),c=r0(t),h=o0(t),u=c0(t),d=h0(t),m=$g(t),g=Zg(r),v=s.createProgram();let f,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ts).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ts).join(`
`),p.length>0&&(p+=`
`)):(f=[gc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),p=[gc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?$e.tonemapping_pars_fragment:"",t.toneMapping!==In?qg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,Wg("linearToOutputTexel",t.outputColorSpace),Yg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ts).join(`
`)),a=wo(a),a=fc(a,t),a=pc(a,t),o=wo(o),o=fc(o,t),o=pc(o,t),a=mc(a),o=mc(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===Sl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=M+f+a,S=M+p+o,A=hc(s,s.VERTEX_SHADER,E),y=hc(s,s.FRAGMENT_SHADER,S);s.attachShader(v,A),s.attachShader(v,y),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function C(D){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(v)||"",q=s.getShaderInfoLog(A)||"",K=s.getShaderInfoLog(y)||"",B=N.trim(),X=q.trim(),H=K.trim();let J=!0,se=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,A,y);else{const fe=uc(s,A,"vertex"),ne=uc(s,y,"fragment");ot("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+B+`
`+fe+`
`+ne)}else B!==""?Ne("WebGLProgram: Program Info Log:",B):(X===""||H==="")&&(se=!1);se&&(D.diagnostics={runnable:J,programLog:B,vertexShader:{log:X,prefix:f},fragmentShader:{log:H,prefix:p}})}s.deleteShader(A),s.deleteShader(y),x=new Mr(s,v),w=Kg(s,v)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(v,Gg)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=kg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=y,this}let u0=0;class f0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new p0(e),t.set(e,n)),n}}class p0{constructor(e){this.id=u0++,this.code=e,this.usedTimes=0}}function m0(i){return i===Ei||i===Er||i===Tr}function g0(i,e,t,n,s,r){const a=new ih,o=new f0,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,w,L,D,N,q){const K=D.fog,B=N.geometry,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,J=e.get(x.envMap||X,H),se=J&&J.mapping===Or?J.image.height:null,fe=m[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Ne("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const ne=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,re=ne!==void 0?ne.length:0;let nt=0;B.morphAttributes.position!==void 0&&(nt=1),B.morphAttributes.normal!==void 0&&(nt=2),B.morphAttributes.color!==void 0&&(nt=3);let Qe,We,$,he;if(fe){const Ee=jt[fe];Qe=Ee.vertexShader,We=Ee.fragmentShader}else{Qe=x.vertexShader,We=x.fragmentShader;const Ee=o.getVertexShaderStage(x),bt=o.getFragmentShaderStage(x);o.update(x,Ee,bt),$=Ee.id,he=bt.id}const te=i.getRenderTarget(),Ce=i.state.buffers.depth.getReversed(),Fe=N.isInstancedMesh===!0,Re=N.isBatchedMesh===!0,vt=!!x.map,Xe=!!x.matcap,ke=!!J,ze=!!x.aoMap,Je=!!x.lightMap,je=!!x.bumpMap&&x.wireframe===!1,et=!!x.normalMap,Tt=!!x.displacementMap,Ze=!!x.emissiveMap,Mt=!!x.metalnessMap,De=!!x.roughnessMap,P=x.anisotropy>0,qe=x.clearcoat>0,Me=x.dispersion>0,T=x.iridescence>0,_=x.sheen>0,U=x.transmission>0,O=P&&!!x.anisotropyMap,z=qe&&!!x.clearcoatMap,ee=qe&&!!x.clearcoatNormalMap,ae=qe&&!!x.clearcoatRoughnessMap,W=T&&!!x.iridescenceMap,Y=T&&!!x.iridescenceThicknessMap,ie=_&&!!x.sheenColorMap,be=_&&!!x.sheenRoughnessMap,le=!!x.specularMap,ce=!!x.specularColorMap,ye=!!x.specularIntensityMap,Pe=U&&!!x.transmissionMap,Be=U&&!!x.thicknessMap,I=!!x.gradientMap,oe=!!x.alphaMap,Z=x.alphaTest>0,de=!!x.alphaHash,pe=!!x.extensions;let j=In;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(j=i.toneMapping);const Ae={shaderID:fe,shaderType:x.type,shaderName:x.name,vertexShader:Qe,fragmentShader:We,defines:x.defines,customVertexShaderID:$,customFragmentShaderID:he,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:Re,batchingColor:Re&&N._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&N.instanceColor!==null,instancingMorph:Fe&&N.morphTexture!==null,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:vt,matcap:Xe,envMap:ke,envMapMode:ke&&J.mapping,envMapCubeUVHeight:se,aoMap:ze,lightMap:Je,bumpMap:je,normalMap:et,displacementMap:Tt,emissiveMap:Ze,normalMapObjectSpace:et&&x.normalMapType===Ed,normalMapTangentSpace:et&&x.normalMapType===Ar,packedNormalMap:et&&x.normalMapType===Ar&&m0(x.normalMap.format),metalnessMap:Mt,roughnessMap:De,anisotropy:P,anisotropyMap:O,clearcoat:qe,clearcoatMap:z,clearcoatNormalMap:ee,clearcoatRoughnessMap:ae,dispersion:Me,iridescence:T,iridescenceMap:W,iridescenceThicknessMap:Y,sheen:_,sheenColorMap:ie,sheenRoughnessMap:be,specularMap:le,specularColorMap:ce,specularIntensityMap:ye,transmission:U,transmissionMap:Pe,thicknessMap:Be,gradientMap:I,opaque:x.transparent===!1&&x.blending===Ki&&x.alphaToCoverage===!1,alphaMap:oe,alphaTest:Z,alphaHash:de,combine:x.combine,mapUv:vt&&g(x.map.channel),aoMapUv:ze&&g(x.aoMap.channel),lightMapUv:Je&&g(x.lightMap.channel),bumpMapUv:je&&g(x.bumpMap.channel),normalMapUv:et&&g(x.normalMap.channel),displacementMapUv:Tt&&g(x.displacementMap.channel),emissiveMapUv:Ze&&g(x.emissiveMap.channel),metalnessMapUv:Mt&&g(x.metalnessMap.channel),roughnessMapUv:De&&g(x.roughnessMap.channel),anisotropyMapUv:O&&g(x.anisotropyMap.channel),clearcoatMapUv:z&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ee&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:W&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(x.sheenRoughnessMap.channel),specularMapUv:le&&g(x.specularMap.channel),specularColorMapUv:ce&&g(x.specularColorMap.channel),specularIntensityMapUv:ye&&g(x.specularIntensityMap.channel),transmissionMapUv:Pe&&g(x.transmissionMap.channel),thicknessMapUv:Be&&g(x.thicknessMap.channel),alphaMapUv:oe&&g(x.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(et||P),vertexNormals:!!B.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!B.attributes.uv&&(vt||oe),fog:!!K,useFog:x.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||B.attributes.normal===void 0&&et===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ce,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:nt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:q.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:vt&&x.map.isVideoTexture===!0&&it.getTransfer(x.map.colorSpace)===ct,decodeVideoTextureEmissive:Ze&&x.emissiveMap.isVideoTexture===!0&&it.getTransfer(x.emissiveMap.colorSpace)===ct,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===St,flipSided:x.side===en,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||Re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ae.vertexUv1s=l.has(1),Ae.vertexUv2s=l.has(2),Ae.vertexUv3s=l.has(3),l.clear(),Ae}function f(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)w.push(L),w.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(p(w,x),M(w,x),w.push(i.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function M(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){const w=m[x.type];let L;if(w){const D=jt[w];L=Ai.clone(D.uniforms)}else L=x.uniforms;return L}function S(x,w){let L=h.get(w);return L!==void 0?++L.usedTimes:(L=new d0(i,w,x,s),c.push(L),h.set(w,L)),L}function A(x){if(--x.usedTimes===0){const w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function y(x){o.remove(x)}function C(){o.dispose()}return{getParameters:v,getProgramCacheKey:f,getUniforms:E,acquireProgram:S,releaseProgram:A,releaseShaderCache:y,programs:c,dispose:C}}function _0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function v0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function _c(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function vc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let m=0;return d.isInstancedMesh&&(m+=2),d.isSkinnedMesh&&(m+=1),m}function o(d,m,g,v,f,p){let M=i[e];return M===void 0?(M={id:d.id,object:d,geometry:m,material:g,materialVariant:a(d),groupOrder:v,renderOrder:d.renderOrder,z:f,group:p},i[e]=M):(M.id=d.id,M.object=d,M.geometry=m,M.material=g,M.materialVariant=a(d),M.groupOrder=v,M.renderOrder=d.renderOrder,M.z=f,M.group=p),e++,M}function l(d,m,g,v,f,p){const M=o(d,m,g,v,f,p);g.transmission>0?n.push(M):g.transparent===!0?s.push(M):t.push(M)}function c(d,m,g,v,f,p){const M=o(d,m,g,v,f,p);g.transmission>0?n.unshift(M):g.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,m,g){t.length>1&&t.sort(d||v0),n.length>1&&n.sort(m||_c),s.length>1&&s.sort(m||_c),g&&(t.reverse(),n.reverse(),s.reverse())}function u(){for(let d=e,m=i.length;d<m;d++){const g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function x0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new vc,i.set(n,[a])):s>=r.length?(a=new vc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function S0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Te};break;case"SpotLight":t={position:new R,direction:new R,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function M0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let b0=0;function y0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function E0(i){const e=new S0,t=M0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const s=new R,r=new pt,a=new pt;function o(c){let h=0,u=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let m=0,g=0,v=0,f=0,p=0,M=0,E=0,S=0,A=0,y=0,C=0;c.sort(y0);for(let w=0,L=c.length;w<L;w++){const D=c[w],N=D.color,q=D.intensity,K=D.distance;let B=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ei?B=D.shadow.map.texture:B=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=N.r*q,u+=N.g*q,d+=N.b*q;else if(D.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(D.sh.coefficients[X],q);C++}else if(D.isDirectionalLight){const X=e.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const H=D.shadow,J=t.get(D);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.directionalShadow[m]=J,n.directionalShadowMap[m]=B,n.directionalShadowMatrix[m]=D.shadow.matrix,M++}n.directional[m]=X,m++}else if(D.isSpotLight){const X=e.get(D);X.position.setFromMatrixPosition(D.matrixWorld),X.color.copy(N).multiplyScalar(q),X.distance=K,X.coneCos=Math.cos(D.angle),X.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),X.decay=D.decay,n.spot[v]=X;const H=D.shadow;if(D.map&&(n.spotLightMap[A]=D.map,A++,H.updateMatrices(D),D.castShadow&&y++),n.spotLightMatrix[v]=H.matrix,D.castShadow){const J=t.get(D);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,n.spotShadow[v]=J,n.spotShadowMap[v]=B,S++}v++}else if(D.isRectAreaLight){const X=e.get(D);X.color.copy(N).multiplyScalar(q),X.halfWidth.set(D.width*.5,0,0),X.halfHeight.set(0,D.height*.5,0),n.rectArea[f]=X,f++}else if(D.isPointLight){const X=e.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),X.distance=D.distance,X.decay=D.decay,D.castShadow){const H=D.shadow,J=t.get(D);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,n.pointShadow[g]=J,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=D.shadow.matrix,E++}n.point[g]=X,g++}else if(D.isHemisphereLight){const X=e.get(D);X.skyColor.copy(D.color).multiplyScalar(q),X.groundColor.copy(D.groundColor).multiplyScalar(q),n.hemi[p]=X,p++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==m||x.pointLength!==g||x.spotLength!==v||x.rectAreaLength!==f||x.hemiLength!==p||x.numDirectionalShadows!==M||x.numPointShadows!==E||x.numSpotShadows!==S||x.numSpotMaps!==A||x.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=f,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=S+A-y,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=C,x.directionalLength=m,x.pointLength=g,x.spotLength=v,x.rectAreaLength=f,x.hemiLength=p,x.numDirectionalShadows=M,x.numPointShadows=E,x.numSpotShadows=S,x.numSpotMaps=A,x.numLightProbes=C,n.version=b0++)}function l(c,h){let u=0,d=0,m=0,g=0,v=0;const f=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const E=c[p];if(E.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(f),u++}else if(E.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(f),S.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(f),m++}else if(E.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(f),a.identity(),r.copy(E.matrixWorld),r.premultiply(f),a.extractRotation(r),S.halfWidth.set(E.width*.5,0,0),S.halfHeight.set(0,E.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(f),d++}else if(E.isHemisphereLight){const S=n.hemi[v];S.direction.setFromMatrixPosition(E.matrixWorld),S.direction.transformDirection(f),v++}}}return{setup:o,setupView:l,state:n}}function xc(i){const e=new E0(i),t=[],n=[],s=[];function r(d){u.camera=d,t.length=0,n.length=0,s.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function T0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new xc(i),e.set(s,[o])):r>=a.length?(o=new xc(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const A0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,w0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,C0=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],R0=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Sc=new pt,Ms=new R,Ta=new R;function P0(i,e,t){let n=new Jo;const s=new Ue,r=new Ue,a=new ft,o=new Pu,l=new Lu,c={},h=t.maxTextureSize,u={[ci]:en,[en]:ci,[St]:St},d=new Nt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:A0,fragmentShader:w0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Et;g.setAttribute("position",new yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new rt(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let p=this.type;this.render=function(y,C,x){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||y.length===0)return;this.type===td&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=gr);const w=i.getRenderTarget(),L=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Dn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const q=p!==this.type;q&&C.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(B=>B.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,B=y.length;K<B;K++){const X=y[K],H=X.shadow;if(H===void 0){Ne("WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const J=H.getFrameExtents();s.multiply(J),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,H.mapSize.y=r.y));const se=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=se,H.map===null||q===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Es){if(X.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new tn(s.x,s.y,{format:Ei,type:hn,minFilter:Zt,magFilter:Zt,generateMipmaps:!1}),H.map.texture.name=X.name+".shadowMap",H.map.depthTexture=new rs(s.x,s.y,bn),H.map.depthTexture.name=X.name+".shadowMapDepth",H.map.depthTexture.format=$n,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Wt,H.map.depthTexture.magFilter=Wt}else X.isPointLight?(H.map=new vh(s.x),H.map.depthTexture=new Tu(s.x,Un)):(H.map=new tn(s.x,s.y),H.map.depthTexture=new rs(s.x,s.y,Un)),H.map.depthTexture.name=X.name+".shadowMap",H.map.depthTexture.format=$n,this.type===gr?(H.map.depthTexture.compareFunction=se?$o:Yo,H.map.depthTexture.minFilter=Zt,H.map.depthTexture.magFilter=Zt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Wt,H.map.depthTexture.magFilter=Wt);H.camera.updateProjectionMatrix()}const fe=H.map.isWebGLCubeRenderTarget?6:1;for(let ne=0;ne<fe;ne++){if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,ne),i.clear();else{ne===0&&(i.setRenderTarget(H.map),i.clear());const re=H.getViewport(ne);a.set(r.x*re.x,r.y*re.y,r.x*re.z,r.y*re.w),N.viewport(a)}if(X.isPointLight){const re=H.camera,nt=H.matrix,Qe=X.distance||re.far;Qe!==re.far&&(re.far=Qe,re.updateProjectionMatrix()),Ms.setFromMatrixPosition(X.matrixWorld),re.position.copy(Ms),Ta.copy(re.position),Ta.add(C0[ne]),re.up.copy(R0[ne]),re.lookAt(Ta),re.updateMatrixWorld(),nt.makeTranslation(-Ms.x,-Ms.y,-Ms.z),Sc.multiplyMatrices(re.projectionMatrix,re.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Sc,re.coordinateSystem,re.reversedDepth)}else H.updateMatrices(X);n=H.getFrustum(),S(C,x,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Es&&M(H,x),H.needsUpdate=!1}p=this.type,f.needsUpdate=!1,i.setRenderTarget(w,L,D)};function M(y,C){const x=e.update(v);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,m.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new tn(s.x,s.y,{format:Ei,type:hn})),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(C,null,x,d,v,null),m.uniforms.shadow_pass.value=y.mapPass.texture,m.uniforms.resolution.value=y.mapSize,m.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(C,null,x,m,v,null)}function E(y,C,x,w){let L=null;const D=x.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(D!==void 0)L=D;else if(L=x.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const N=L.uuid,q=C.uuid;let K=c[N];K===void 0&&(K={},c[N]=K);let B=K[q];B===void 0&&(B=L.clone(),K[q]=B,C.addEventListener("dispose",A)),L=B}if(L.visible=C.visible,L.wireframe=C.wireframe,w===Es?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:u[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const N=i.properties.get(L);N.light=x}return L}function S(y,C,x,w,L){if(y.visible===!1)return;if(y.layers.test(C.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&L===Es)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,y.matrixWorld);const q=e.update(y),K=y.material;if(Array.isArray(K)){const B=q.groups;for(let X=0,H=B.length;X<H;X++){const J=B[X],se=K[J.materialIndex];if(se&&se.visible){const fe=E(y,se,w,L);y.onBeforeShadow(i,y,C,x,q,fe,J),i.renderBufferDirect(x,null,q,fe,y,J),y.onAfterShadow(i,y,C,x,q,fe,J)}}}else if(K.visible){const B=E(y,K,w,L);y.onBeforeShadow(i,y,C,x,q,B,null),i.renderBufferDirect(x,null,q,B,y,null),y.onAfterShadow(i,y,C,x,q,B,null)}}const N=y.children;for(let q=0,K=N.length;q<K;q++)S(N[q],C,x,w,L)}function A(y){y.target.removeEventListener("dispose",A);for(const x in c){const w=c[x],L=y.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function L0(i,e){function t(){let I=!1;const oe=new ft;let Z=null;const de=new ft(0,0,0,0);return{setMask:function(pe){Z!==pe&&!I&&(i.colorMask(pe,pe,pe,pe),Z=pe)},setLocked:function(pe){I=pe},setClear:function(pe,j,Ae,Ee,bt){bt===!0&&(pe*=Ee,j*=Ee,Ae*=Ee),oe.set(pe,j,Ae,Ee),de.equals(oe)===!1&&(i.clearColor(pe,j,Ae,Ee),de.copy(oe))},reset:function(){I=!1,Z=null,de.set(-1,0,0,0)}}}function n(){let I=!1,oe=!1,Z=null,de=null,pe=null;return{setReversed:function(j){if(oe!==j){const Ae=e.get("EXT_clip_control");j?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),oe=j;const Ee=pe;pe=null,this.setClear(Ee)}},getReversed:function(){return oe},setTest:function(j){j?te(i.DEPTH_TEST):Ce(i.DEPTH_TEST)},setMask:function(j){Z!==j&&!I&&(i.depthMask(j),Z=j)},setFunc:function(j){if(oe&&(j=Ud[j]),de!==j){switch(j){case za:i.depthFunc(i.NEVER);break;case Ga:i.depthFunc(i.ALWAYS);break;case ka:i.depthFunc(i.LESS);break;case ts:i.depthFunc(i.LEQUAL);break;case Ha:i.depthFunc(i.EQUAL);break;case Va:i.depthFunc(i.GEQUAL);break;case Wa:i.depthFunc(i.GREATER);break;case Xa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=j}},setLocked:function(j){I=j},setClear:function(j){pe!==j&&(pe=j,oe&&(j=1-j),i.clearDepth(j))},reset:function(){I=!1,Z=null,de=null,pe=null,oe=!1}}}function s(){let I=!1,oe=null,Z=null,de=null,pe=null,j=null,Ae=null,Ee=null,bt=null;return{setTest:function(dt){I||(dt?te(i.STENCIL_TEST):Ce(i.STENCIL_TEST))},setMask:function(dt){oe!==dt&&!I&&(i.stencilMask(dt),oe=dt)},setFunc:function(dt,pn,mn){(Z!==dt||de!==pn||pe!==mn)&&(i.stencilFunc(dt,pn,mn),Z=dt,de=pn,pe=mn)},setOp:function(dt,pn,mn){(j!==dt||Ae!==pn||Ee!==mn)&&(i.stencilOp(dt,pn,mn),j=dt,Ae=pn,Ee=mn)},setLocked:function(dt){I=dt},setClear:function(dt){bt!==dt&&(i.clearStencil(dt),bt=dt)},reset:function(){I=!1,oe=null,Z=null,de=null,pe=null,j=null,Ae=null,Ee=null,bt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d={},m=new WeakMap,g=[],v=null,f=!1,p=null,M=null,E=null,S=null,A=null,y=null,C=null,x=new Te(0,0,0),w=0,L=!1,D=null,N=null,q=null,K=null,B=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,J=0;const se=i.getParameter(i.VERSION);se.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(se)[1]),H=J>=1):se.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),H=J>=2);let fe=null,ne={};const re=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),Qe=new ft().fromArray(re),We=new ft().fromArray(nt);function $(I,oe,Z,de){const pe=new Uint8Array(4),j=i.createTexture();i.bindTexture(I,j),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<Z;Ae++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(oe+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return j}const he={};he[i.TEXTURE_2D]=$(i.TEXTURE_2D,i.TEXTURE_2D,1),he[i.TEXTURE_CUBE_MAP]=$(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[i.TEXTURE_2D_ARRAY]=$(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),he[i.TEXTURE_3D]=$(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(ts),je(!1),et(gl),te(i.CULL_FACE),ze(Dn);function te(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function Ce(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Fe(I,oe){return d[I]!==oe?(i.bindFramebuffer(I,oe),d[I]=oe,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=oe),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function Re(I,oe){let Z=g,de=!1;if(I){Z=m.get(oe),Z===void 0&&(Z=[],m.set(oe,Z));const pe=I.textures;if(Z.length!==pe.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Ae=pe.length;j<Ae;j++)Z[j]=i.COLOR_ATTACHMENT0+j;Z.length=pe.length,de=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,de=!0);de&&i.drawBuffers(Z)}function vt(I){return v!==I?(i.useProgram(I),v=I,!0):!1}const Xe={[vi]:i.FUNC_ADD,[id]:i.FUNC_SUBTRACT,[sd]:i.FUNC_REVERSE_SUBTRACT};Xe[rd]=i.MIN,Xe[ad]=i.MAX;const ke={[od]:i.ZERO,[ld]:i.ONE,[cd]:i.SRC_COLOR,[Oa]:i.SRC_ALPHA,[md]:i.SRC_ALPHA_SATURATE,[fd]:i.DST_COLOR,[dd]:i.DST_ALPHA,[hd]:i.ONE_MINUS_SRC_COLOR,[Ba]:i.ONE_MINUS_SRC_ALPHA,[pd]:i.ONE_MINUS_DST_COLOR,[ud]:i.ONE_MINUS_DST_ALPHA,[gd]:i.CONSTANT_COLOR,[_d]:i.ONE_MINUS_CONSTANT_COLOR,[vd]:i.CONSTANT_ALPHA,[xd]:i.ONE_MINUS_CONSTANT_ALPHA};function ze(I,oe,Z,de,pe,j,Ae,Ee,bt,dt){if(I===Dn){f===!0&&(Ce(i.BLEND),f=!1);return}if(f===!1&&(te(i.BLEND),f=!0),I!==nd){if(I!==p||dt!==L){if((M!==vi||A!==vi)&&(i.blendEquation(i.FUNC_ADD),M=vi,A=vi),dt)switch(I){case Ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case es:i.blendFunc(i.ONE,i.ONE);break;case _l:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case vl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ot("WebGLState: Invalid blending: ",I);break}else switch(I){case Ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case _l:ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vl:ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ot("WebGLState: Invalid blending: ",I);break}E=null,S=null,y=null,C=null,x.set(0,0,0),w=0,p=I,L=dt}return}pe=pe||oe,j=j||Z,Ae=Ae||de,(oe!==M||pe!==A)&&(i.blendEquationSeparate(Xe[oe],Xe[pe]),M=oe,A=pe),(Z!==E||de!==S||j!==y||Ae!==C)&&(i.blendFuncSeparate(ke[Z],ke[de],ke[j],ke[Ae]),E=Z,S=de,y=j,C=Ae),(Ee.equals(x)===!1||bt!==w)&&(i.blendColor(Ee.r,Ee.g,Ee.b,bt),x.copy(Ee),w=bt),p=I,L=!1}function Je(I,oe){I.side===St?Ce(i.CULL_FACE):te(i.CULL_FACE);let Z=I.side===en;oe&&(Z=!Z),je(Z),I.blending===Ki&&I.transparent===!1?ze(Dn):ze(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const de=I.stencilWrite;o.setTest(de),de&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Ze(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Ce(i.SAMPLE_ALPHA_TO_COVERAGE)}function je(I){D!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),D=I)}function et(I){I!==jh?(te(i.CULL_FACE),I!==N&&(I===gl?i.cullFace(i.BACK):I===ed?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ce(i.CULL_FACE),N=I}function Tt(I){I!==q&&(H&&i.lineWidth(I),q=I)}function Ze(I,oe,Z){I?(te(i.POLYGON_OFFSET_FILL),(K!==oe||B!==Z)&&(K=oe,B=Z,a.getReversed()&&(oe=-oe),i.polygonOffset(oe,Z))):Ce(i.POLYGON_OFFSET_FILL)}function Mt(I){I?te(i.SCISSOR_TEST):Ce(i.SCISSOR_TEST)}function De(I){I===void 0&&(I=i.TEXTURE0+X-1),fe!==I&&(i.activeTexture(I),fe=I)}function P(I,oe,Z){Z===void 0&&(fe===null?Z=i.TEXTURE0+X-1:Z=fe);let de=ne[Z];de===void 0&&(de={type:void 0,texture:void 0},ne[Z]=de),(de.type!==I||de.texture!==oe)&&(fe!==Z&&(i.activeTexture(Z),fe=Z),i.bindTexture(I,oe||he[I]),de.type=I,de.texture=oe)}function qe(){const I=ne[fe];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Me(){try{i.compressedTexImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function _(){try{i.texSubImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function U(){try{i.texSubImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function O(){try{i.compressedTexSubImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function z(){try{i.compressedTexSubImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function ee(){try{i.texStorage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function ae(){try{i.texStorage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function W(){try{i.texImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function Y(){try{i.texImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function ie(I){return u[I]!==void 0?u[I]:i.getParameter(I)}function be(I,oe){u[I]!==oe&&(i.pixelStorei(I,oe),u[I]=oe)}function le(I){Qe.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Qe.copy(I))}function ce(I){We.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),We.copy(I))}function ye(I,oe){let Z=c.get(oe);Z===void 0&&(Z=new WeakMap,c.set(oe,Z));let de=Z.get(I);de===void 0&&(de=i.getUniformBlockIndex(oe,I.name),Z.set(I,de))}function Pe(I,oe){const de=c.get(oe).get(I);l.get(oe)!==de&&(i.uniformBlockBinding(oe,de,I.__bindingPointIndex),l.set(oe,de))}function Be(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},fe=null,ne={},d={},m=new WeakMap,g=[],v=null,f=!1,p=null,M=null,E=null,S=null,A=null,y=null,C=null,x=new Te(0,0,0),w=0,L=!1,D=null,N=null,q=null,K=null,B=null,Qe.set(0,0,i.canvas.width,i.canvas.height),We.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Ce,bindFramebuffer:Fe,drawBuffers:Re,useProgram:vt,setBlending:ze,setMaterial:Je,setFlipSided:je,setCullFace:et,setLineWidth:Tt,setPolygonOffset:Ze,setScissorTest:Mt,activeTexture:De,bindTexture:P,unbindTexture:qe,compressedTexImage2D:Me,compressedTexImage3D:T,texImage2D:W,texImage3D:Y,pixelStorei:be,getParameter:ie,updateUBOMapping:ye,uniformBlockBinding:Pe,texStorage2D:ee,texStorage3D:ae,texSubImage2D:_,texSubImage3D:U,compressedTexSubImage2D:O,compressedTexSubImage3D:z,scissor:le,viewport:ce,reset:Be}}function D0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,h=new WeakMap,u=new Set;let d;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,_){return g?new OffscreenCanvas(T,_):Rr("canvas")}function f(T,_,U){let O=1;const z=Me(T);if((z.width>U||z.height>U)&&(O=U/Math.max(z.width,z.height)),O<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const ee=Math.floor(O*z.width),ae=Math.floor(O*z.height);d===void 0&&(d=v(ee,ae));const W=_?v(ee,ae):d;return W.width=ee,W.height=ae,W.getContext("2d").drawImage(T,0,0,ee,ae),Ne("WebGLRenderer: Texture has been resized from ("+z.width+"x"+z.height+") to ("+ee+"x"+ae+")."),W}else return"data"in T&&Ne("WebGLRenderer: Image in DataTexture is too big ("+z.width+"x"+z.height+")."),T;return T}function p(T){return T.generateMipmaps}function M(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(T,_,U,O,z,ee=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ae;O&&(ae=e.get("EXT_texture_norm16"),ae||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=_;if(_===i.RED&&(U===i.FLOAT&&(W=i.R32F),U===i.HALF_FLOAT&&(W=i.R16F),U===i.UNSIGNED_BYTE&&(W=i.R8),U===i.UNSIGNED_SHORT&&ae&&(W=ae.R16_EXT),U===i.SHORT&&ae&&(W=ae.R16_SNORM_EXT)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.R8UI),U===i.UNSIGNED_SHORT&&(W=i.R16UI),U===i.UNSIGNED_INT&&(W=i.R32UI),U===i.BYTE&&(W=i.R8I),U===i.SHORT&&(W=i.R16I),U===i.INT&&(W=i.R32I)),_===i.RG&&(U===i.FLOAT&&(W=i.RG32F),U===i.HALF_FLOAT&&(W=i.RG16F),U===i.UNSIGNED_BYTE&&(W=i.RG8),U===i.UNSIGNED_SHORT&&ae&&(W=ae.RG16_EXT),U===i.SHORT&&ae&&(W=ae.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RG8UI),U===i.UNSIGNED_SHORT&&(W=i.RG16UI),U===i.UNSIGNED_INT&&(W=i.RG32UI),U===i.BYTE&&(W=i.RG8I),U===i.SHORT&&(W=i.RG16I),U===i.INT&&(W=i.RG32I)),_===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGB8UI),U===i.UNSIGNED_SHORT&&(W=i.RGB16UI),U===i.UNSIGNED_INT&&(W=i.RGB32UI),U===i.BYTE&&(W=i.RGB8I),U===i.SHORT&&(W=i.RGB16I),U===i.INT&&(W=i.RGB32I)),_===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),U===i.UNSIGNED_INT&&(W=i.RGBA32UI),U===i.BYTE&&(W=i.RGBA8I),U===i.SHORT&&(W=i.RGBA16I),U===i.INT&&(W=i.RGBA32I)),_===i.RGB&&(U===i.UNSIGNED_SHORT&&ae&&(W=ae.RGB16_EXT),U===i.SHORT&&ae&&(W=ae.RGB16_SNORM_EXT),U===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),U===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),_===i.RGBA){const Y=ee?Cr:it.getTransfer(z);U===i.FLOAT&&(W=i.RGBA32F),U===i.HALF_FLOAT&&(W=i.RGBA16F),U===i.UNSIGNED_BYTE&&(W=Y===ct?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT&&ae&&(W=ae.RGBA16_EXT),U===i.SHORT&&ae&&(W=ae.RGBA16_SNORM_EXT),U===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function A(T,_){let U;return T?_===null||_===Un||_===Ds?U=i.DEPTH24_STENCIL8:_===bn?U=i.DEPTH32F_STENCIL8:_===Ls&&(U=i.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Un||_===Ds?U=i.DEPTH_COMPONENT24:_===bn?U=i.DEPTH_COMPONENT32F:_===Ls&&(U=i.DEPTH_COMPONENT16),U}function y(T,_){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==Wt&&T.minFilter!==Zt?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function C(T){const _=T.target;_.removeEventListener("dispose",C),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&u.delete(_)}function x(T){const _=T.target;_.removeEventListener("dispose",x),D(_)}function w(T){const _=n.get(T);if(_.__webglInit===void 0)return;const U=T.source,O=m.get(U);if(O){const z=O[_.__cacheKey];z.usedTimes--,z.usedTimes===0&&L(T),Object.keys(O).length===0&&m.delete(U)}n.remove(T)}function L(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const U=T.source,O=m.get(U);delete O[_.__cacheKey],a.memory.textures--}function D(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let z=0;z<_.__webglFramebuffer[O].length;z++)i.deleteFramebuffer(_.__webglFramebuffer[O][z]);else i.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)i.deleteFramebuffer(_.__webglFramebuffer[O]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const U=T.textures;for(let O=0,z=U.length;O<z;O++){const ee=n.get(U[O]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),a.memory.textures--),n.remove(U[O])}n.remove(T)}let N=0;function q(){N=0}function K(){return N}function B(T){N=T}function X(){const T=N;return T>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),N+=1,T}function H(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function J(T,_){const U=n.get(T);if(T.isVideoTexture&&P(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&U.__version!==T.version){const O=T.image;if(O===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(U,T,_);return}}else T.isExternalTexture&&(U.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function se(T,_){const U=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&U.__version!==T.version){Ce(U,T,_);return}else T.isExternalTexture&&(U.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function fe(T,_){const U=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&U.__version!==T.version){Ce(U,T,_);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function ne(T,_){const U=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&U.__version!==T.version){Fe(U,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}const re={[Yn]:i.REPEAT,[Vn]:i.CLAMP_TO_EDGE,[qa]:i.MIRRORED_REPEAT},nt={[Wt]:i.NEAREST,[bd]:i.NEAREST_MIPMAP_NEAREST,[Fs]:i.NEAREST_MIPMAP_LINEAR,[Zt]:i.LINEAR,[$r]:i.LINEAR_MIPMAP_NEAREST,[Si]:i.LINEAR_MIPMAP_LINEAR},Qe={[Td]:i.NEVER,[Pd]:i.ALWAYS,[Ad]:i.LESS,[Yo]:i.LEQUAL,[wd]:i.EQUAL,[$o]:i.GEQUAL,[Cd]:i.GREATER,[Rd]:i.NOTEQUAL};function We(T,_){if(_.type===bn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Zt||_.magFilter===$r||_.magFilter===Fs||_.magFilter===Si||_.minFilter===Zt||_.minFilter===$r||_.minFilter===Fs||_.minFilter===Si)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,re[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,re[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,re[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,nt[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,nt[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,Qe[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Wt||_.minFilter!==Fs&&_.minFilter!==Si||_.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function $(T,_){let U=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",C));const O=_.source;let z=m.get(O);z===void 0&&(z={},m.set(O,z));const ee=H(_);if(ee!==T.__cacheKey){z[ee]===void 0&&(z[ee]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),z[ee].usedTimes++;const ae=z[T.__cacheKey];ae!==void 0&&(z[T.__cacheKey].usedTimes--,ae.usedTimes===0&&L(_)),T.__cacheKey=ee,T.__webglTexture=z[ee].texture}return U}function he(T,_,U){return Math.floor(Math.floor(T/U)/_)}function te(T,_,U,O){const ee=T.updateRanges;if(ee.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,U,O,_.data);else{ee.sort((be,le)=>be.start-le.start);let ae=0;for(let be=1;be<ee.length;be++){const le=ee[ae],ce=ee[be],ye=le.start+le.count,Pe=he(ce.start,_.width,4),Be=he(le.start,_.width,4);ce.start<=ye+1&&Pe===Be&&he(ce.start+ce.count-1,_.width,4)===Pe?le.count=Math.max(le.count,ce.start+ce.count-le.start):(++ae,ee[ae]=ce)}ee.length=ae+1;const W=t.getParameter(i.UNPACK_ROW_LENGTH),Y=t.getParameter(i.UNPACK_SKIP_PIXELS),ie=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let be=0,le=ee.length;be<le;be++){const ce=ee[be],ye=Math.floor(ce.start/4),Pe=Math.ceil(ce.count/4),Be=ye%_.width,I=Math.floor(ye/_.width),oe=Pe,Z=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Be),t.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,Be,I,oe,Z,U,O,_.data)}T.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,W),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(i.UNPACK_SKIP_ROWS,ie)}}function Ce(T,_,U){let O=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=i.TEXTURE_3D);const z=$(T,_),ee=_.source;t.bindTexture(O,T.__webglTexture,i.TEXTURE0+U);const ae=n.get(ee);if(ee.version!==ae.__version||z===!0){if(t.activeTexture(i.TEXTURE0+U),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const Z=it.getPrimaries(it.workingColorSpace),de=_.colorSpace===ai?null:it.getPrimaries(_.colorSpace),pe=_.colorSpace===ai||Z===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let Y=f(_.image,!1,s.maxTextureSize);Y=qe(_,Y);const ie=r.convert(_.format,_.colorSpace),be=r.convert(_.type);let le=S(_.internalFormat,ie,be,_.normalized,_.colorSpace,_.isVideoTexture);We(O,_);let ce;const ye=_.mipmaps,Pe=_.isVideoTexture!==!0,Be=ae.__version===void 0||z===!0,I=ee.dataReady,oe=y(_,Y);if(_.isDepthTexture)le=A(_.format===Mi,_.type),Be&&(Pe?t.texStorage2D(i.TEXTURE_2D,1,le,Y.width,Y.height):t.texImage2D(i.TEXTURE_2D,0,le,Y.width,Y.height,0,ie,be,null));else if(_.isDataTexture)if(ye.length>0){Pe&&Be&&t.texStorage2D(i.TEXTURE_2D,oe,le,ye[0].width,ye[0].height);for(let Z=0,de=ye.length;Z<de;Z++)ce=ye[Z],Pe?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ce.width,ce.height,ie,be,ce.data):t.texImage2D(i.TEXTURE_2D,Z,le,ce.width,ce.height,0,ie,be,ce.data);_.generateMipmaps=!1}else Pe?(Be&&t.texStorage2D(i.TEXTURE_2D,oe,le,Y.width,Y.height),I&&te(_,Y,ie,be)):t.texImage2D(i.TEXTURE_2D,0,le,Y.width,Y.height,0,ie,be,Y.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Pe&&Be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,le,ye[0].width,ye[0].height,Y.depth);for(let Z=0,de=ye.length;Z<de;Z++)if(ce=ye[Z],_.format!==yn)if(ie!==null)if(Pe){if(I)if(_.layerUpdates.size>0){const pe=Jl(ce.width,ce.height,_.format,_.type);for(const j of _.layerUpdates){const Ae=ce.data.subarray(j*pe/ce.data.BYTES_PER_ELEMENT,(j+1)*pe/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,j,ce.width,ce.height,1,ie,Ae)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,ce.width,ce.height,Y.depth,ie,ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,le,ce.width,ce.height,Y.depth,0,ce.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?I&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,ce.width,ce.height,Y.depth,ie,be,ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,le,ce.width,ce.height,Y.depth,0,ie,be,ce.data)}else{Pe&&Be&&t.texStorage2D(i.TEXTURE_2D,oe,le,ye[0].width,ye[0].height);for(let Z=0,de=ye.length;Z<de;Z++)ce=ye[Z],_.format!==yn?ie!==null?Pe?I&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,ce.width,ce.height,ie,ce.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,le,ce.width,ce.height,0,ce.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ce.width,ce.height,ie,be,ce.data):t.texImage2D(i.TEXTURE_2D,Z,le,ce.width,ce.height,0,ie,be,ce.data)}else if(_.isDataArrayTexture)if(Pe){if(Be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,le,Y.width,Y.height,Y.depth),I)if(_.layerUpdates.size>0){const Z=Jl(Y.width,Y.height,_.format,_.type);for(const de of _.layerUpdates){const pe=Y.data.subarray(de*Z/Y.data.BYTES_PER_ELEMENT,(de+1)*Z/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,de,Y.width,Y.height,1,ie,be,pe)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,ie,be,Y.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,le,Y.width,Y.height,Y.depth,0,ie,be,Y.data);else if(_.isData3DTexture)Pe?(Be&&t.texStorage3D(i.TEXTURE_3D,oe,le,Y.width,Y.height,Y.depth),I&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,ie,be,Y.data)):t.texImage3D(i.TEXTURE_3D,0,le,Y.width,Y.height,Y.depth,0,ie,be,Y.data);else if(_.isFramebufferTexture){if(Be)if(Pe)t.texStorage2D(i.TEXTURE_2D,oe,le,Y.width,Y.height);else{let Z=Y.width,de=Y.height;for(let pe=0;pe<oe;pe++)t.texImage2D(i.TEXTURE_2D,pe,le,Z,de,0,ie,be,null),Z>>=1,de>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){const Z=i.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),Y.parentNode!==Z){Z.appendChild(Y),u.add(_),Z.onpaint=de=>{const pe=de.changedElements;for(const j of u)pe.includes(j.image)&&(j.needsUpdate=!0)},Z.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Y);else{const pe=i.RGBA,j=i.RGBA,Ae=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pe,j,Ae,Y)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ye.length>0){if(Pe&&Be){const Z=Me(ye[0]);t.texStorage2D(i.TEXTURE_2D,oe,le,Z.width,Z.height)}for(let Z=0,de=ye.length;Z<de;Z++)ce=ye[Z],Pe?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ie,be,ce):t.texImage2D(i.TEXTURE_2D,Z,le,ie,be,ce);_.generateMipmaps=!1}else if(Pe){if(Be){const Z=Me(Y);t.texStorage2D(i.TEXTURE_2D,oe,le,Z.width,Z.height)}I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,be,Y)}else t.texImage2D(i.TEXTURE_2D,0,le,ie,be,Y);p(_)&&M(O),ae.__version=ee.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Fe(T,_,U){if(_.image.length!==6)return;const O=$(T,_),z=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+U);const ee=n.get(z);if(z.version!==ee.__version||O===!0){t.activeTexture(i.TEXTURE0+U);const ae=it.getPrimaries(it.workingColorSpace),W=_.colorSpace===ai?null:it.getPrimaries(_.colorSpace),Y=_.colorSpace===ai||ae===W?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const ie=_.isCompressedTexture||_.image[0].isCompressedTexture,be=_.image[0]&&_.image[0].isDataTexture,le=[];for(let j=0;j<6;j++)!ie&&!be?le[j]=f(_.image[j],!0,s.maxCubemapSize):le[j]=be?_.image[j].image:_.image[j],le[j]=qe(_,le[j]);const ce=le[0],ye=r.convert(_.format,_.colorSpace),Pe=r.convert(_.type),Be=S(_.internalFormat,ye,Pe,_.normalized,_.colorSpace),I=_.isVideoTexture!==!0,oe=ee.__version===void 0||O===!0,Z=z.dataReady;let de=y(_,ce);We(i.TEXTURE_CUBE_MAP,_);let pe;if(ie){I&&oe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Be,ce.width,ce.height);for(let j=0;j<6;j++){pe=le[j].mipmaps;for(let Ae=0;Ae<pe.length;Ae++){const Ee=pe[Ae];_.format!==yn?ye!==null?I?Z&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,0,0,Ee.width,Ee.height,ye,Ee.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,Be,Ee.width,Ee.height,0,Ee.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,0,0,Ee.width,Ee.height,ye,Pe,Ee.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,Be,Ee.width,Ee.height,0,ye,Pe,Ee.data)}}}else{if(pe=_.mipmaps,I&&oe){pe.length>0&&de++;const j=Me(le[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Be,j.width,j.height)}for(let j=0;j<6;j++)if(be){I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,le[j].width,le[j].height,ye,Pe,le[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Be,le[j].width,le[j].height,0,ye,Pe,le[j].data);for(let Ae=0;Ae<pe.length;Ae++){const bt=pe[Ae].image[j].image;I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,0,0,bt.width,bt.height,ye,Pe,bt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,Be,bt.width,bt.height,0,ye,Pe,bt.data)}}else{I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ye,Pe,le[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Be,ye,Pe,le[j]);for(let Ae=0;Ae<pe.length;Ae++){const Ee=pe[Ae];I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,0,0,ye,Pe,Ee.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,Be,ye,Pe,Ee.image[j])}}}p(_)&&M(i.TEXTURE_CUBE_MAP),ee.__version=z.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Re(T,_,U,O,z,ee){const ae=r.convert(U.format,U.colorSpace),W=r.convert(U.type),Y=S(U.internalFormat,ae,W,U.normalized,U.colorSpace),ie=n.get(_),be=n.get(U);if(be.__renderTarget=_,!ie.__hasExternalTextures){const le=Math.max(1,_.width>>ee),ce=Math.max(1,_.height>>ee);z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?t.texImage3D(z,ee,Y,le,ce,_.depth,0,ae,W,null):t.texImage2D(z,ee,Y,le,ce,0,ae,W,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),De(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,O,z,be.__webglTexture,0,Mt(_)):(z===i.TEXTURE_2D||z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,O,z,be.__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function vt(T,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const O=_.depthTexture,z=O&&O.isDepthTexture?O.type:null,ee=A(_.stencilBuffer,z),ae=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;De(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt(_),ee,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt(_),ee,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ee,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ae,i.RENDERBUFFER,T)}else{const O=_.textures;for(let z=0;z<O.length;z++){const ee=O[z],ae=r.convert(ee.format,ee.colorSpace),W=r.convert(ee.type),Y=S(ee.internalFormat,ae,W,ee.normalized,ee.colorSpace);De(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt(_),Y,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt(_),Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Xe(T,_,U){const O=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const z=n.get(_.depthTexture);if(z.__renderTarget=_,(!z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),O){if(z.__webglInit===void 0&&(z.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),z.__webglTexture===void 0){z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),We(i.TEXTURE_CUBE_MAP,_.depthTexture);const ie=r.convert(_.depthTexture.format),be=r.convert(_.depthTexture.type);let le;_.depthTexture.format===$n?le=i.DEPTH_COMPONENT24:_.depthTexture.format===Mi&&(le=i.DEPTH24_STENCIL8);for(let ce=0;ce<6;ce++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,le,_.width,_.height,0,ie,be,null)}}else J(_.depthTexture,0);const ee=z.__webglTexture,ae=Mt(_),W=O?i.TEXTURE_CUBE_MAP_POSITIVE_X+U:i.TEXTURE_2D,Y=_.depthTexture.format===Mi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===$n)De(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,W,ee,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,Y,W,ee,0);else if(_.depthTexture.format===Mi)De(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,W,ee,0,ae):i.framebufferTexture2D(i.FRAMEBUFFER,Y,W,ee,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(T){const _=n.get(T),U=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const O=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",z)};O.addEventListener("dispose",z),_.__depthDisposeCallback=z}_.__boundDepthTexture=O}if(T.depthTexture&&!_.__autoAllocateDepthBuffer)if(U)for(let O=0;O<6;O++)Xe(_.__webglFramebuffer[O],T,O);else{const O=T.texture.mipmaps;O&&O.length>0?Xe(_.__webglFramebuffer[0],T,0):Xe(_.__webglFramebuffer,T,0)}else if(U){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=i.createRenderbuffer(),vt(_.__webglDepthbuffer[O],T,!1);else{const z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer[O];i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,ee)}}else{const O=T.texture.mipmaps;if(O&&O.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),vt(_.__webglDepthbuffer,T,!1);else{const z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,ee)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(T,_,U){const O=n.get(T);_!==void 0&&Re(O.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&ke(T)}function Je(T){const _=T.texture,U=n.get(T),O=n.get(_);T.addEventListener("dispose",x);const z=T.textures,ee=T.isWebGLCubeRenderTarget===!0,ae=z.length>1;if(ae||(O.__webglTexture===void 0&&(O.__webglTexture=i.createTexture()),O.__version=_.version,a.memory.textures++),ee){U.__webglFramebuffer=[];for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[W]=[];for(let Y=0;Y<_.mipmaps.length;Y++)U.__webglFramebuffer[W][Y]=i.createFramebuffer()}else U.__webglFramebuffer[W]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let W=0;W<_.mipmaps.length;W++)U.__webglFramebuffer[W]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(ae)for(let W=0,Y=z.length;W<Y;W++){const ie=n.get(z[W]);ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&De(T)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let W=0;W<z.length;W++){const Y=z[W];U.__webglColorRenderbuffer[W]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[W]);const ie=r.convert(Y.format,Y.colorSpace),be=r.convert(Y.type),le=S(Y.internalFormat,ie,be,Y.normalized,Y.colorSpace,T.isXRRenderTarget===!0),ce=Mt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,le,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+W,i.RENDERBUFFER,U.__webglColorRenderbuffer[W])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),vt(U.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture),We(i.TEXTURE_CUBE_MAP,_);for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)Re(U.__webglFramebuffer[W][Y],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,Y);else Re(U.__webglFramebuffer[W],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);p(_)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){for(let W=0,Y=z.length;W<Y;W++){const ie=z[W],be=n.get(ie);let le=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(le=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,be.__webglTexture),We(le,ie),Re(U.__webglFramebuffer,T,ie,i.COLOR_ATTACHMENT0+W,le,0),p(ie)&&M(le)}t.unbindTexture()}else{let W=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(W=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(W,O.__webglTexture),We(W,_),_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)Re(U.__webglFramebuffer[Y],T,_,i.COLOR_ATTACHMENT0,W,Y);else Re(U.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,W,0);p(_)&&M(W),t.unbindTexture()}T.depthBuffer&&ke(T)}function je(T){const _=T.textures;for(let U=0,O=_.length;U<O;U++){const z=_[U];if(p(z)){const ee=E(T),ae=n.get(z).__webglTexture;t.bindTexture(ee,ae),M(ee),t.unbindTexture()}}}const et=[],Tt=[];function Ze(T){if(T.samples>0){if(De(T)===!1){const _=T.textures,U=T.width,O=T.height;let z=i.COLOR_BUFFER_BIT;const ee=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=n.get(T),W=_.length>1;if(W)for(let ie=0;ie<_.length;ie++)t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer);const Y=T.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let ie=0;ie<_.length;ie++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(z|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(z|=i.STENCIL_BUFFER_BIT)),W){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ae.__webglColorRenderbuffer[ie]);const be=n.get(_[ie]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,be,0)}i.blitFramebuffer(0,0,U,O,0,0,U,O,z,i.NEAREST),l===!0&&(et.length=0,Tt.length=0,et.push(i.COLOR_ATTACHMENT0+ie),T.depthBuffer&&T.resolveDepthBuffer===!1&&(et.push(ee),Tt.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,et))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),W)for(let ie=0;ie<_.length;ie++){t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,ae.__webglColorRenderbuffer[ie]);const be=n.get(_[ie]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Mt(T){return Math.min(s.maxSamples,T.samples)}function De(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function P(T){const _=a.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function qe(T,_){const U=T.colorSpace,O=T.format,z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||U!==wr&&U!==ai&&(it.getTransfer(U)===ct?(O!==yn||z!==cn)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ot("WebGLTextures: Unsupported texture color space:",U)),_}function Me(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=q,this.getTextureUnits=K,this.setTextureUnits=B,this.setTexture2D=J,this.setTexture2DArray=se,this.setTexture3D=fe,this.setTextureCube=ne,this.rebindTextures=ze,this.setupRenderTarget=Je,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=De,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function I0(i,e){function t(n,s=ai){let r;const a=it.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===ko)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ho)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Jc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Qc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Zc)return i.BYTE;if(n===Kc)return i.SHORT;if(n===Ls)return i.UNSIGNED_SHORT;if(n===Go)return i.INT;if(n===Un)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===hn)return i.HALF_FLOAT;if(n===jc)return i.ALPHA;if(n===eh)return i.RGB;if(n===yn)return i.RGBA;if(n===$n)return i.DEPTH_COMPONENT;if(n===Mi)return i.DEPTH_STENCIL;if(n===Vo)return i.RED;if(n===Wo)return i.RED_INTEGER;if(n===Ei)return i.RG;if(n===Xo)return i.RG_INTEGER;if(n===qo)return i.RGBA_INTEGER;if(n===_r||n===vr||n===xr||n===Sr)if(a===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ya||n===$a||n===Za||n===Ka)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ya)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ja||n===Qa||n===ja||n===eo||n===to||n===Er||n===no)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ja||n===Qa)return a===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ja)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===eo)return r.COMPRESSED_R11_EAC;if(n===to)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Er)return r.COMPRESSED_RG11_EAC;if(n===no)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===io)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===so)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ro)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ao)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===oo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===co)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ho)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===uo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===fo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===po)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===go)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_o)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===vo||n===xo||n===So)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===vo)return a===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===So)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Mo||n===bo||n===Tr||n===yo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Mo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===bo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Tr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const U0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,N0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class F0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new dh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Nt({vertexShader:U0,fragmentShader:N0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new Ti(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class O0 extends wi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,m=null,g=null;const v=typeof XRWebGLBinding<"u",f=new F0,p={},M=t.getContextAttributes();let E=null,S=null;const A=[],y=[],C=new Ue;let x=null;const w=new ln;w.viewport=new ft;const L=new ln;L.viewport=new ft;const D=[w,L],N=new Gu;let q=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let he=A[$];return he===void 0&&(he=new ea,A[$]=he),he.getTargetRaySpace()},this.getControllerGrip=function($){let he=A[$];return he===void 0&&(he=new ea,A[$]=he),he.getGripSpace()},this.getHand=function($){let he=A[$];return he===void 0&&(he=new ea,A[$]=he),he.getHandSpace()};function B($){const he=y.indexOf($.inputSource);if(he===-1)return;const te=A[he];te!==void 0&&(te.update($.inputSource,$.frame,c||a),te.dispatchEvent({type:$.type,data:$.inputSource}))}function X(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",H);for(let $=0;$<A.length;$++){const he=y[$];he!==null&&(y[$]=null,A[$].disconnect(he))}q=null,K=null,f.reset();for(const $ in p)delete p[$];e.setRenderTarget(E),m=null,d=null,u=null,s=null,S=null,We.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",X),s.addEventListener("inputsourceschange",H),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Ce=null,Fe=null;M.depth&&(Fe=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=M.stencil?Mi:$n,Ce=M.stencil?Ds:Un);const Re={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new tn(d.textureWidth,d.textureHeight,{format:yn,type:cn,depthTexture:new rs(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const te={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new tn(m.framebufferWidth,m.framebufferHeight,{format:yn,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),We.setContext(s),We.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function H($){for(let he=0;he<$.removed.length;he++){const te=$.removed[he],Ce=y.indexOf(te);Ce>=0&&(y[Ce]=null,A[Ce].disconnect(te))}for(let he=0;he<$.added.length;he++){const te=$.added[he];let Ce=y.indexOf(te);if(Ce===-1){for(let Re=0;Re<A.length;Re++)if(Re>=y.length){y.push(te),Ce=Re;break}else if(y[Re]===null){y[Re]=te,Ce=Re;break}if(Ce===-1)break}const Fe=A[Ce];Fe&&Fe.connect(te)}}const J=new R,se=new R;function fe($,he,te){J.setFromMatrixPosition(he.matrixWorld),se.setFromMatrixPosition(te.matrixWorld);const Ce=J.distanceTo(se),Fe=he.projectionMatrix.elements,Re=te.projectionMatrix.elements,vt=Fe[14]/(Fe[10]-1),Xe=Fe[14]/(Fe[10]+1),ke=(Fe[9]+1)/Fe[5],ze=(Fe[9]-1)/Fe[5],Je=(Fe[8]-1)/Fe[0],je=(Re[8]+1)/Re[0],et=vt*Je,Tt=vt*je,Ze=Ce/(-Je+je),Mt=Ze*-Je;if(he.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Mt),$.translateZ(Ze),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Fe[10]===-1)$.projectionMatrix.copy(he.projectionMatrix),$.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const De=vt+Ze,P=Xe+Ze,qe=et-Mt,Me=Tt+(Ce-Mt),T=ke*Xe/P*De,_=ze*Xe/P*De;$.projectionMatrix.makePerspective(qe,Me,T,_,De,P),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ne($,he){he===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(he.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let he=$.near,te=$.far;f.texture!==null&&(f.depthNear>0&&(he=f.depthNear),f.depthFar>0&&(te=f.depthFar)),N.near=L.near=w.near=he,N.far=L.far=w.far=te,(q!==N.near||K!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),q=N.near,K=N.far),N.layers.mask=$.layers.mask|6,w.layers.mask=N.layers.mask&-5,L.layers.mask=N.layers.mask&-3;const Ce=$.parent,Fe=N.cameras;ne(N,Ce);for(let Re=0;Re<Fe.length;Re++)ne(Fe[Re],Ce);Fe.length===2?fe(N,w,L):N.projectionMatrix.copy(w.projectionMatrix),re($,N,Ce)};function re($,he,te){te===null?$.matrix.copy(he.matrixWorld):($.matrix.copy(te.matrixWorld),$.matrix.invert(),$.matrix.multiply(he.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(he.projectionMatrix),$.projectionMatrixInverse.copy(he.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ss*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(N)},this.getCameraTexture=function($){return p[$]};let nt=null;function Qe($,he){if(h=he.getViewerPose(c||a),g=he,h!==null){const te=h.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let Ce=!1;te.length!==N.cameras.length&&(N.cameras.length=0,Ce=!0);for(let Xe=0;Xe<te.length;Xe++){const ke=te[Xe];let ze=null;if(m!==null)ze=m.getViewport(ke);else{const je=u.getViewSubImage(d,ke);ze=je.viewport,Xe===0&&(e.setRenderTargetTextures(S,je.colorTexture,je.depthStencilTexture),e.setRenderTarget(S))}let Je=D[Xe];Je===void 0&&(Je=new ln,Je.layers.enable(Xe),Je.viewport=new ft,D[Xe]=Je),Je.matrix.fromArray(ke.transform.matrix),Je.matrix.decompose(Je.position,Je.quaternion,Je.scale),Je.projectionMatrix.fromArray(ke.projectionMatrix),Je.projectionMatrixInverse.copy(Je.projectionMatrix).invert(),Je.viewport.set(ze.x,ze.y,ze.width,ze.height),Xe===0&&(N.matrix.copy(Je.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ce===!0&&N.cameras.push(Je)}const Fe=s.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const Xe=u.getDepthInformation(te[0]);Xe&&Xe.isValid&&Xe.texture&&f.init(Xe,s.renderState)}if(Fe&&Fe.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let Xe=0;Xe<te.length;Xe++){const ke=te[Xe].camera;if(ke){let ze=p[ke];ze||(ze=new dh,p[ke]=ze);const Je=u.getCameraImage(ke);ze.sourceTexture=Je}}}}for(let te=0;te<A.length;te++){const Ce=y[te],Fe=A[te];Ce!==null&&Fe!==void 0&&Fe.update(Ce,he,c||a)}nt&&nt($,he),he.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:he}),g=null}const We=new gh;We.setAnimationLoop(Qe),this.setAnimationLoop=function($){nt=$},this.dispose=function(){}}}const B0=new pt,yh=new Ge;yh.set(-1,0,0,0,1,0,0,0,1);function z0(i,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,uh(i)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,M,E,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(f,p):p.isMeshLambertMaterial?(r(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(f,p),u(f,p)):p.isMeshPhongMaterial?(r(f,p),h(f,p),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(f,p),d(f,p),p.isMeshPhysicalMaterial&&m(f,p,S)):p.isMeshMatcapMaterial?(r(f,p),g(f,p)):p.isMeshDepthMaterial?r(f,p):p.isMeshDistanceMaterial?(r(f,p),v(f,p)):p.isMeshNormalMaterial?r(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,M,E):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===en&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===en&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const M=e.get(p),E=M.envMap,S=M.envMapRotation;E&&(f.envMap.value=E,f.envMapRotation.value.setFromMatrix4(B0.makeRotationFromEuler(S)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(yh),f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,M,E){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*M,f.scale.value=E*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function h(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function u(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function d(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,M){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=M.texture,f.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function v(f,p){const M=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(M.matrixWorld),f.nearDistance.value=M.shadow.camera.near,f.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function G0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,A){const y=A.program;n.uniformBlockBinding(S,y)}function c(S,A){let y=s[S.id];y===void 0&&(f(S),y=h(S),s[S.id]=y,S.addEventListener("dispose",M));const C=A.program;n.updateUBOMapping(S,C);const x=e.render.frame;r[S.id]!==x&&(d(S),r[S.id]=x)}function h(S){const A=u();S.__bindingPointIndex=A;const y=i.createBuffer(),C=S.__size,x=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,C,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,y),y}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const A=s[S.id],y=S.uniforms,C=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let x=0,w=y.length;x<w;x++){const L=y[x];if(Array.isArray(L))for(let D=0,N=L.length;D<N;D++)m(L[D],x,D,C);else m(L,x,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(S,A,y,C){if(v(S,A,y,C)===!0){const x=S.__offset,w=S.value;if(Array.isArray(w)){let L=0;for(let D=0;D<w.length;D++){const N=w[D],q=p(N);g(N,S.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=q.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,S.__data)}}function g(S,A,y){typeof S=="number"||typeof S=="boolean"?A[0]=S:S.isMatrix3?(A[0]=S.elements[0],A[1]=S.elements[1],A[2]=S.elements[2],A[3]=0,A[4]=S.elements[3],A[5]=S.elements[4],A[6]=S.elements[5],A[7]=0,A[8]=S.elements[6],A[9]=S.elements[7],A[10]=S.elements[8],A[11]=0):ArrayBuffer.isView(S)?A.set(new S.constructor(S.buffer,S.byteOffset,A.length)):S.toArray(A,y)}function v(S,A,y,C){const x=S.value,w=A+"_"+y;if(C[w]===void 0)return typeof x=="number"||typeof x=="boolean"?C[w]=x:ArrayBuffer.isView(x)?C[w]=x.slice():C[w]=x.clone(),!0;{const L=C[w];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return C[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function f(S){const A=S.uniforms;let y=0;const C=16;for(let w=0,L=A.length;w<L;w++){const D=Array.isArray(A[w])?A[w]:[A[w]];for(let N=0,q=D.length;N<q;N++){const K=D[N],B=Array.isArray(K.value)?K.value:[K.value];for(let X=0,H=B.length;X<H;X++){const J=B[X],se=p(J),fe=y%C,ne=fe%se.boundary,re=fe+ne;y+=ne,re!==0&&C-re<se.storage&&(y+=C-re),K.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=y,y+=se.storage}}}const x=y%C;return x>0&&(y+=C-x),S.__size=y,S.__cache={},this}function p(S){const A={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(A.boundary=4,A.storage=4):S.isVector2?(A.boundary=8,A.storage=8):S.isVector3||S.isColor?(A.boundary=16,A.storage=12):S.isVector4?(A.boundary=16,A.storage=16):S.isMatrix3?(A.boundary=48,A.storage=48):S.isMatrix4?(A.boundary=64,A.storage=64):S.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(A.boundary=16,A.storage=S.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",S),A}function M(S){const A=S.target;A.removeEventListener("dispose",M);const y=a.indexOf(A.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function E(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:E}}const k0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let wn=null;function H0(){return wn===null&&(wn=new lh(k0,16,16,Ei,hn),wn.name="DFG_LUT",wn.minFilter=Zt,wn.magFilter=Zt,wn.wrapS=Vn,wn.wrapT=Vn,wn.generateMipmaps=!1,wn.needsUpdate=!0),wn}class V0{constructor(e={}){const{canvas:t=Dd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:m=cn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=m,f=new Set([qo,Xo,Wo]),p=new Set([cn,Un,Ls,Ds,ko,Ho]),M=new Uint32Array(4),E=new Int32Array(4),S=new R;let A=null,y=null;const C=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=In,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let D=!1,N=null,q=null,K=null,B=null;this._outputColorSpace=on;let X=0,H=0,J=null,se=-1,fe=null;const ne=new ft,re=new ft;let nt=null;const Qe=new Te(0);let We=0,$=t.width,he=t.height,te=1,Ce=null,Fe=null;const Re=new ft(0,0,$,he),vt=new ft(0,0,$,he);let Xe=!1;const ke=new Jo;let ze=!1,Je=!1;const je=new pt,et=new R,Tt=new ft,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Mt=!1;function De(){return J===null?te:1}let P=n;function qe(b,F){return t.getContext(b,F)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Do}`),t.addEventListener("webglcontextlost",bt,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",pn,!1),P===null){const F="webgl2";if(P=qe(F,b),P===null)throw qe(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(b){throw ot("WebGLRenderer: "+b.message),b}let Me,T,_,U,O,z,ee,ae,W,Y,ie,be,le,ce,ye,Pe,Be,I,oe,Z,de,pe,j;function Ae(){Me=new Hm(P),Me.init(),de=new I0(P,Me),T=new Um(P,Me,e,de),_=new L0(P,Me),T.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),q=P.createFramebuffer(),K=P.createFramebuffer(),B=P.createFramebuffer(),U=new Xm(P),O=new _0,z=new D0(P,Me,_,O,T,de,U),ee=new km(L),ae=new $u(P),pe=new Dm(P,ae),W=new Vm(P,ae,U,pe),Y=new Ym(P,W,ae,pe,U),I=new qm(P,T,z),ye=new Nm(O),ie=new g0(L,ee,Me,T,pe,ye),be=new z0(L,O),le=new x0,ce=new T0(Me),Be=new Lm(L,ee,_,Y,g,l),Pe=new P0(L,Y,T),j=new G0(P,U,T,_),oe=new Im(P,Me,U),Z=new Wm(P,Me,U),U.programs=ie.programs,L.capabilities=T,L.extensions=Me,L.properties=O,L.renderLists=le,L.shadowMap=Pe,L.state=_,L.info=U}Ae(),v!==cn&&(w=new Zm(v,t.width,t.height,o,s,r));const Ee=new O0(L,P);this.xr=Ee,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const b=Me.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Me.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(b){b!==void 0&&(te=b,this.setSize($,he,!1))},this.getSize=function(b){return b.set($,he)},this.setSize=function(b,F,V=!0){if(Ee.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}$=b,he=F,t.width=Math.floor(b*te),t.height=Math.floor(F*te),V===!0&&(t.style.width=b+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set($*te,he*te).floor()},this.setDrawingBufferSize=function(b,F,V){$=b,he=F,te=V,t.width=Math.floor(b*V),t.height=Math.floor(F*V),this.setViewport(0,0,b,F)},this.setEffects=function(b){if(v===cn){ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let F=0;F<b.length;F++)if(b[F].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ne)},this.getViewport=function(b){return b.copy(Re)},this.setViewport=function(b,F,V,G){b.isVector4?Re.set(b.x,b.y,b.z,b.w):Re.set(b,F,V,G),_.viewport(ne.copy(Re).multiplyScalar(te).round())},this.getScissor=function(b){return b.copy(vt)},this.setScissor=function(b,F,V,G){b.isVector4?vt.set(b.x,b.y,b.z,b.w):vt.set(b,F,V,G),_.scissor(re.copy(vt).multiplyScalar(te).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(b){_.setScissorTest(Xe=b)},this.setOpaqueSort=function(b){Ce=b},this.setTransparentSort=function(b){Fe=b},this.getClearColor=function(b){return b.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor(...arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha(...arguments)},this.clear=function(b=!0,F=!0,V=!0){let G=0;if(b){let k=!1;if(J!==null){const ge=J.texture.format;k=f.has(ge)}if(k){const ge=J.texture.type,Se=p.has(ge),me=Be.getClearColor(),we=Be.getClearAlpha(),Le=me.r,He=me.g,Ke=me.b;Se?(M[0]=Le,M[1]=He,M[2]=Ke,M[3]=we,P.clearBufferuiv(P.COLOR,0,M)):(E[0]=Le,E[1]=He,E[2]=Ke,E[3]=we,P.clearBufferiv(P.COLOR,0,E))}else G|=P.COLOR_BUFFER_BIT}F&&(G|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),N=b},this.dispose=function(){t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",pn,!1),Be.dispose(),le.dispose(),ce.dispose(),O.dispose(),ee.dispose(),Y.dispose(),pe.dispose(),j.dispose(),ie.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",ol),Ee.removeEventListener("sessionend",ll),ui.stop()};function bt(b){b.preventDefault(),Pr("WebGLRenderer: Context Lost."),D=!0}function dt(){Pr("WebGLRenderer: Context Restored."),D=!1;const b=U.autoReset,F=Pe.enabled,V=Pe.autoUpdate,G=Pe.needsUpdate,k=Pe.type;Ae(),U.autoReset=b,Pe.enabled=F,Pe.autoUpdate=V,Pe.needsUpdate=G,Pe.type=k}function pn(b){ot("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function mn(b){const F=b.target;F.removeEventListener("dispose",mn),Vr(F)}function Vr(b){us(b),O.remove(b)}function us(b){const F=O.get(b).programs;F!==void 0&&(F.forEach(function(V){ie.releaseProgram(V)}),b.isShaderMaterial&&ie.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,V,G,k,ge){F===null&&(F=Ze);const Se=k.isMesh&&k.matrixWorld.determinantAffine()<0,me=zh(b,F,V,G,k);_.setMaterial(G,Se);let we=V.index,Le=1;if(G.wireframe===!0){if(we=W.getWireframeAttribute(V),we===void 0)return;Le=2}const He=V.drawRange,Ke=V.attributes.position;let Ie=He.start*Le,ut=(He.start+He.count)*Le;ge!==null&&(Ie=Math.max(Ie,ge.start*Le),ut=Math.min(ut,(ge.start+ge.count)*Le)),we!==null?(Ie=Math.max(Ie,0),ut=Math.min(ut,we.count)):Ke!=null&&(Ie=Math.max(Ie,0),ut=Math.min(ut,Ke.count));const Pt=ut-Ie;if(Pt<0||Pt===1/0)return;pe.setup(k,G,me,V,we);let At,mt=oe;if(we!==null&&(At=ae.get(we),mt=Z,mt.setIndex(At)),k.isMesh)G.wireframe===!0?(_.setLineWidth(G.wireframeLinewidth*De()),mt.setMode(P.LINES)):mt.setMode(P.TRIANGLES);else if(k.isLine){let Xt=G.linewidth;Xt===void 0&&(Xt=1),_.setLineWidth(Xt*De()),k.isLineSegments?mt.setMode(P.LINES):k.isLineLoop?mt.setMode(P.LINE_LOOP):mt.setMode(P.LINE_STRIP)}else k.isPoints?mt.setMode(P.POINTS):k.isSprite&&mt.setMode(P.TRIANGLES);if(k.isBatchedMesh)if(Me.get("WEBGL_multi_draw"))mt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Xt=k._multiDrawStarts,xe=k._multiDrawCounts,nn=k._multiDrawCount,at=we?ae.get(we).bytesPerElement:1,dn=O.get(G).currentProgram.getUniforms();for(let Tn=0;Tn<nn;Tn++)dn.setValue(P,"_gl_DrawID",Tn),mt.render(Xt[Tn]/at,xe[Tn])}else if(k.isInstancedMesh)mt.renderInstances(Ie,Pt,k.count);else if(V.isInstancedBufferGeometry){const Xt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,xe=Math.min(V.instanceCount,Xt);mt.renderInstances(Ie,Pt,xe)}else mt.render(Ie,Pt)};function al(b,F,V){b.transparent===!0&&b.side===St&&b.forceSinglePass===!1?(b.side=en,b.needsUpdate=!0,Ns(b,F,V),b.side=ci,b.needsUpdate=!0,Ns(b,F,V),b.side=St):Ns(b,F,V)}this.compile=function(b,F,V=null){V===null&&(V=b),y=ce.get(V),y.init(F),x.push(y),V.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(y.pushLight(k),k.castShadow&&y.pushShadow(k))}),b!==V&&b.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(y.pushLight(k),k.castShadow&&y.pushShadow(k))}),y.setupLights();const G=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ge=k.material;if(ge)if(Array.isArray(ge))for(let Se=0;Se<ge.length;Se++){const me=ge[Se];al(me,V,k),G.add(me)}else al(ge,V,k),G.add(ge)}),y=x.pop(),G},this.compileAsync=function(b,F,V=null){const G=this.compile(b,F,V);return new Promise(k=>{function ge(){if(G.forEach(function(Se){O.get(Se).currentProgram.isReady()&&G.delete(Se)}),G.size===0){k(b);return}setTimeout(ge,10)}Me.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Wr=null;function Oh(b){Wr&&Wr(b)}function ol(){ui.stop()}function ll(){ui.start()}const ui=new gh;ui.setAnimationLoop(Oh),typeof self<"u"&&ui.setContext(self),this.setAnimationLoop=function(b){Wr=b,Ee.setAnimationLoop(b),b===null?ui.stop():ui.start()},Ee.addEventListener("sessionstart",ol),Ee.addEventListener("sessionend",ll),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;N!==null&&N.renderStart(b,F);const V=Ee.enabled===!0&&Ee.isPresenting===!0,G=w!==null&&(J===null||V)&&w.begin(L,J);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(F),F=Ee.getCamera()),b.isScene===!0&&b.onBeforeRender(L,b,F,J),y=ce.get(b,x.length),y.init(F),y.state.textureUnits=z.getTextureUnits(),x.push(y),je.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),ke.setFromProjectionMatrix(je,En,F.reversedDepth),Je=this.localClippingEnabled,ze=ye.init(this.clippingPlanes,Je),A=le.get(b,C.length),A.init(),C.push(A),Ee.enabled===!0&&Ee.isPresenting===!0){const Se=L.xr.getDepthSensingMesh();Se!==null&&Xr(Se,F,-1/0,L.sortObjects)}Xr(b,F,0,L.sortObjects),A.finish(),L.sortObjects===!0&&A.sort(Ce,Fe,F.reversedDepth),Mt=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Mt&&Be.addToRenderList(A,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ze===!0&&ye.beginShadows();const k=y.state.shadowsArray;if(Pe.render(k,b,F),ze===!0&&ye.endShadows(),(G&&w.hasRenderPass())===!1){const Se=A.opaque,me=A.transmissive;if(y.setupLights(),F.isArrayCamera){const we=F.cameras;if(me.length>0)for(let Le=0,He=we.length;Le<He;Le++){const Ke=we[Le];hl(Se,me,b,Ke)}Mt&&Be.render(b);for(let Le=0,He=we.length;Le<He;Le++){const Ke=we[Le];cl(A,b,Ke,Ke.viewport)}}else me.length>0&&hl(Se,me,b,F),Mt&&Be.render(b),cl(A,b,F)}J!==null&&H===0&&(z.updateMultisampleRenderTarget(J),z.updateRenderTargetMipmap(J)),G&&w.end(L),b.isScene===!0&&b.onAfterRender(L,b,F),pe.resetDefaultState(),se=-1,fe=null,x.pop(),x.length>0?(y=x[x.length-1],z.setTextureUnits(y.state.textureUnits),ze===!0&&ye.setGlobalState(L.clippingPlanes,y.state.camera)):y=null,C.pop(),C.length>0?A=C[C.length-1]:A=null,N!==null&&N.renderEnd()};function Xr(b,F,V,G){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLightProbeGrid)y.pushLightProbeGrid(b);else if(b.isLight)y.pushLight(b),b.castShadow&&y.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||ke.intersectsSprite(b)){G&&Tt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(je);const Se=Y.update(b),me=b.material;me.visible&&A.push(b,Se,me,V,Tt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||ke.intersectsObject(b))){const Se=Y.update(b),me=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Tt.copy(b.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Tt.copy(Se.boundingSphere.center)),Tt.applyMatrix4(b.matrixWorld).applyMatrix4(je)),Array.isArray(me)){const we=Se.groups;for(let Le=0,He=we.length;Le<He;Le++){const Ke=we[Le],Ie=me[Ke.materialIndex];Ie&&Ie.visible&&A.push(b,Se,Ie,V,Tt.z,Ke)}}else me.visible&&A.push(b,Se,me,V,Tt.z,null)}}const ge=b.children;for(let Se=0,me=ge.length;Se<me;Se++)Xr(ge[Se],F,V,G)}function cl(b,F,V,G){const{opaque:k,transmissive:ge,transparent:Se}=b;y.setupLightsView(V),ze===!0&&ye.setGlobalState(L.clippingPlanes,V),G&&_.viewport(ne.copy(G)),k.length>0&&Us(k,F,V),ge.length>0&&Us(ge,F,V),Se.length>0&&Us(Se,F,V),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function hl(b,F,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[G.id]===void 0){const Ie=Me.has("EXT_color_buffer_half_float")||Me.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[G.id]=new tn(1,1,{generateMipmaps:!0,type:Ie?hn:cn,minFilter:Si,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace})}const ge=y.state.transmissionRenderTarget[G.id],Se=G.viewport||ne;ge.setSize(Se.z*L.transmissionResolutionScale,Se.w*L.transmissionResolutionScale);const me=L.getRenderTarget(),we=L.getActiveCubeFace(),Le=L.getActiveMipmapLevel();L.setRenderTarget(ge),L.getClearColor(Qe),We=L.getClearAlpha(),We<1&&L.setClearColor(16777215,.5),L.clear(),Mt&&Be.render(V);const He=L.toneMapping;L.toneMapping=In;const Ke=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),y.setupLightsView(G),ze===!0&&ye.setGlobalState(L.clippingPlanes,G),Us(b,V,G),z.updateMultisampleRenderTarget(ge),z.updateRenderTargetMipmap(ge),Me.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let ut=0,Pt=F.length;ut<Pt;ut++){const At=F[ut],{object:mt,geometry:Xt,material:xe,group:nn}=At;if(xe.side===St&&mt.layers.test(G.layers)){const at=xe.side;xe.side=en,xe.needsUpdate=!0,dl(mt,V,G,Xt,xe,nn),xe.side=at,xe.needsUpdate=!0,Ie=!0}}Ie===!0&&(z.updateMultisampleRenderTarget(ge),z.updateRenderTargetMipmap(ge))}L.setRenderTarget(me,we,Le),L.setClearColor(Qe,We),Ke!==void 0&&(G.viewport=Ke),L.toneMapping=He}function Us(b,F,V){const G=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ge=b.length;k<ge;k++){const Se=b[k],{object:me,geometry:we,group:Le}=Se;let He=Se.material;He.allowOverride===!0&&G!==null&&(He=G),me.layers.test(V.layers)&&dl(me,F,V,we,He,Le)}}function dl(b,F,V,G,k,ge){b.onBeforeRender(L,F,V,G,k,ge),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(L,F,V,G,b,ge),k.transparent===!0&&k.side===St&&k.forceSinglePass===!1?(k.side=en,k.needsUpdate=!0,L.renderBufferDirect(V,F,G,k,b,ge),k.side=ci,k.needsUpdate=!0,L.renderBufferDirect(V,F,G,k,b,ge),k.side=St):L.renderBufferDirect(V,F,G,k,b,ge),b.onAfterRender(L,F,V,G,k,ge)}function Ns(b,F,V){F.isScene!==!0&&(F=Ze);const G=O.get(b),k=y.state.lights,ge=y.state.shadowsArray,Se=k.state.version,me=ie.getParameters(b,k.state,ge,F,V,y.state.lightProbeGridArray),we=ie.getProgramCacheKey(me);let Le=G.programs;G.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?F.environment:null,G.fog=F.fog;const He=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;G.envMap=ee.get(b.envMap||G.environment,He),G.envMapRotation=G.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Le===void 0&&(b.addEventListener("dispose",mn),Le=new Map,G.programs=Le);let Ke=Le.get(we);if(Ke!==void 0){if(G.currentProgram===Ke&&G.lightsStateVersion===Se)return fl(b,me),Ke}else me.uniforms=ie.getUniforms(b),N!==null&&b.isNodeMaterial&&N.build(b,V,me),b.onBeforeCompile(me,L),Ke=ie.acquireProgram(me,we),Le.set(we,Ke),G.uniforms=me.uniforms;const Ie=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ie.clippingPlanes=ye.uniform),fl(b,me),G.needsLights=kh(b),G.lightsStateVersion=Se,G.needsLights&&(Ie.ambientLightColor.value=k.state.ambient,Ie.lightProbe.value=k.state.probe,Ie.directionalLights.value=k.state.directional,Ie.directionalLightShadows.value=k.state.directionalShadow,Ie.spotLights.value=k.state.spot,Ie.spotLightShadows.value=k.state.spotShadow,Ie.rectAreaLights.value=k.state.rectArea,Ie.ltc_1.value=k.state.rectAreaLTC1,Ie.ltc_2.value=k.state.rectAreaLTC2,Ie.pointLights.value=k.state.point,Ie.pointLightShadows.value=k.state.pointShadow,Ie.hemisphereLights.value=k.state.hemi,Ie.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ie.spotLightMatrix.value=k.state.spotLightMatrix,Ie.spotLightMap.value=k.state.spotLightMap,Ie.pointShadowMatrix.value=k.state.pointShadowMatrix),G.lightProbeGrid=y.state.lightProbeGridArray.length>0,G.currentProgram=Ke,G.uniformsList=null,Ke}function ul(b){if(b.uniformsList===null){const F=b.currentProgram.getUniforms();b.uniformsList=Mr.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function fl(b,F){const V=O.get(b);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function Bh(b,F){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;S.setFromMatrixPosition(F.matrixWorld);for(let V=0,G=b.length;V<G;V++){const k=b[V];if(k.texture!==null&&k.boundingBox.containsPoint(S))return k}return null}function zh(b,F,V,G,k){F.isScene!==!0&&(F=Ze),z.resetTextureUnits();const ge=F.fog,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?F.environment:null,me=J===null?L.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:it.workingColorSpace,we=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Le=ee.get(G.envMap||Se,we),He=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ke=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ie=!!V.morphAttributes.position,ut=!!V.morphAttributes.normal,Pt=!!V.morphAttributes.color;let At=In;G.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(At=L.toneMapping);const mt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Xt=mt!==void 0?mt.length:0,xe=O.get(G),nn=y.state.lights;if(ze===!0&&(Je===!0||b!==fe)){const xt=b===fe&&G.id===se;ye.setState(G,b,xt)}let at=!1;G.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==nn.state.version||xe.outputColorSpace!==me||k.isBatchedMesh&&xe.batching===!1||!k.isBatchedMesh&&xe.batching===!0||k.isBatchedMesh&&xe.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&xe.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&xe.instancing===!1||!k.isInstancedMesh&&xe.instancing===!0||k.isSkinnedMesh&&xe.skinning===!1||!k.isSkinnedMesh&&xe.skinning===!0||k.isInstancedMesh&&xe.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&xe.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&xe.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&xe.instancingMorph===!1&&k.morphTexture!==null||xe.envMap!==Le||G.fog===!0&&xe.fog!==ge||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==ye.numPlanes||xe.numIntersection!==ye.numIntersection)||xe.vertexAlphas!==He||xe.vertexTangents!==Ke||xe.morphTargets!==Ie||xe.morphNormals!==ut||xe.morphColors!==Pt||xe.toneMapping!==At||xe.morphTargetsCount!==Xt||!!xe.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(at=!0):(at=!0,xe.__version=G.version);let dn=xe.currentProgram;at===!0&&(dn=Ns(G,F,k),N&&G.isNodeMaterial&&N.onUpdateProgram(G,dn,xe));let Tn=!1,Zn=!1,Ri=!1;const gt=dn.getUniforms(),Lt=xe.uniforms;if(_.useProgram(dn.program)&&(Tn=!0,Zn=!0,Ri=!0),G.id!==se&&(se=G.id,Zn=!0),xe.needsLights){const xt=Bh(y.state.lightProbeGridArray,k);xe.lightProbeGrid!==xt&&(xe.lightProbeGrid=xt,Zn=!0)}if(Tn||fe!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),gt.setValue(P,"projectionMatrix",b.projectionMatrix),gt.setValue(P,"viewMatrix",b.matrixWorldInverse);const Jn=gt.map.cameraPosition;Jn!==void 0&&Jn.setValue(P,et.setFromMatrixPosition(b.matrixWorld)),T.logarithmicDepthBuffer&&gt.setValue(P,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&gt.setValue(P,"isOrthographic",b.isOrthographicCamera===!0),fe!==b&&(fe=b,Zn=!0,Ri=!0)}if(xe.needsLights&&(nn.state.directionalShadowMap.length>0&&gt.setValue(P,"directionalShadowMap",nn.state.directionalShadowMap,z),nn.state.spotShadowMap.length>0&&gt.setValue(P,"spotShadowMap",nn.state.spotShadowMap,z),nn.state.pointShadowMap.length>0&&gt.setValue(P,"pointShadowMap",nn.state.pointShadowMap,z)),k.isSkinnedMesh){gt.setOptional(P,k,"bindMatrix"),gt.setOptional(P,k,"bindMatrixInverse");const xt=k.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),gt.setValue(P,"boneTexture",xt.boneTexture,z))}k.isBatchedMesh&&(gt.setOptional(P,k,"batchingTexture"),gt.setValue(P,"batchingTexture",k._matricesTexture,z),gt.setOptional(P,k,"batchingIdTexture"),gt.setValue(P,"batchingIdTexture",k._indirectTexture,z),gt.setOptional(P,k,"batchingColorTexture"),k._colorsTexture!==null&&gt.setValue(P,"batchingColorTexture",k._colorsTexture,z));const Kn=V.morphAttributes;if((Kn.position!==void 0||Kn.normal!==void 0||Kn.color!==void 0)&&I.update(k,V,dn),(Zn||xe.receiveShadow!==k.receiveShadow)&&(xe.receiveShadow=k.receiveShadow,gt.setValue(P,"receiveShadow",k.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&F.environment!==null&&(Lt.envMapIntensity.value=F.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=H0()),Zn){if(gt.setValue(P,"toneMappingExposure",L.toneMappingExposure),xe.needsLights&&Gh(Lt,Ri),ge&&G.fog===!0&&be.refreshFogUniforms(Lt,ge),be.refreshMaterialUniforms(Lt,G,te,he,y.state.transmissionRenderTarget[b.id]),xe.needsLights&&xe.lightProbeGrid){const xt=xe.lightProbeGrid;Lt.probesSH.value=xt.texture,Lt.probesMin.value.copy(xt.boundingBox.min),Lt.probesMax.value.copy(xt.boundingBox.max),Lt.probesResolution.value.copy(xt.resolution)}Mr.upload(P,ul(xe),Lt,z)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Mr.upload(P,ul(xe),Lt,z),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&gt.setValue(P,"center",k.center),gt.setValue(P,"modelViewMatrix",k.modelViewMatrix),gt.setValue(P,"normalMatrix",k.normalMatrix),gt.setValue(P,"modelMatrix",k.matrixWorld),G.uniformsGroups!==void 0){const xt=G.uniformsGroups;for(let Jn=0,Pi=xt.length;Jn<Pi;Jn++){const pl=xt[Jn];j.update(pl,dn),j.bind(pl,dn)}}return dn}function Gh(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function kh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(b,F,V){const G=O.get(b);G.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),O.get(b.texture).__webglTexture=F,O.get(b.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:V,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,F){const V=O.get(b);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(b,F=0,V=0){J=b,X=F,H=V;let G=null,k=!1,ge=!1;if(b){const me=O.get(b);if(me.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(P.FRAMEBUFFER,me.__webglFramebuffer),ne.copy(b.viewport),re.copy(b.scissor),nt=b.scissorTest,_.viewport(ne),_.scissor(re),_.setScissorTest(nt),se=-1;return}else if(me.__webglFramebuffer===void 0)z.setupRenderTarget(b);else if(me.__hasExternalTextures)z.rebindTextures(b,O.get(b.texture).__webglTexture,O.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const He=b.depthTexture;if(me.__boundDepthTexture!==He){if(He!==null&&O.has(He)&&(b.width!==He.image.width||b.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(b)}}const we=b.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(ge=!0);const Le=O.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Le[F])?G=Le[F][V]:G=Le[F],k=!0):b.samples>0&&z.useMultisampledRTT(b)===!1?G=O.get(b).__webglMultisampledFramebuffer:Array.isArray(Le)?G=Le[V]:G=Le,ne.copy(b.viewport),re.copy(b.scissor),nt=b.scissorTest}else ne.copy(Re).multiplyScalar(te).floor(),re.copy(vt).multiplyScalar(te).floor(),nt=Xe;if(V!==0&&(G=q),_.bindFramebuffer(P.FRAMEBUFFER,G)&&_.drawBuffers(b,G),_.viewport(ne),_.scissor(re),_.setScissorTest(nt),k){const me=O.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+F,me.__webglTexture,V)}else if(ge){const me=F;for(let we=0;we<b.textures.length;we++){const Le=O.get(b.textures[we]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+we,Le.__webglTexture,V,me)}}else if(b!==null&&V!==0){const me=O.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,me.__webglTexture,V)}se=-1},this.readRenderTargetPixels=function(b,F,V,G,k,ge,Se,me=0){if(!(b&&b.isWebGLRenderTarget)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=O.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){_.bindFramebuffer(P.FRAMEBUFFER,we);try{const Le=b.textures[me],He=Le.format,Ke=Le.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+me),!T.textureFormatReadable(He)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!T.textureTypeReadable(Ke)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-G&&V>=0&&V<=b.height-k&&P.readPixels(F,V,G,k,de.convert(He),de.convert(Ke),ge)}finally{const Le=J!==null?O.get(J).__webglFramebuffer:null;_.bindFramebuffer(P.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(b,F,V,G,k,ge,Se,me=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=O.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(F>=0&&F<=b.width-G&&V>=0&&V<=b.height-k){_.bindFramebuffer(P.FRAMEBUFFER,we);const Le=b.textures[me],He=Le.format,Ke=Le.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+me),!T.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!T.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ie=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ie),P.bufferData(P.PIXEL_PACK_BUFFER,ge.byteLength,P.STREAM_READ),P.readPixels(F,V,G,k,de.convert(He),de.convert(Ke),0);const ut=J!==null?O.get(J).__webglFramebuffer:null;_.bindFramebuffer(P.FRAMEBUFFER,ut);const Pt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Id(P,Pt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ie),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ge),P.deleteBuffer(Ie),P.deleteSync(Pt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,F=null,V=0){const G=Math.pow(2,-V),k=Math.floor(b.image.width*G),ge=Math.floor(b.image.height*G),Se=F!==null?F.x:0,me=F!==null?F.y:0;z.setTexture2D(b,0),P.copyTexSubImage2D(P.TEXTURE_2D,V,0,0,Se,me,k,ge),_.unbindTexture()},this.copyTextureToTexture=function(b,F,V=null,G=null,k=0,ge=0){let Se,me,we,Le,He,Ke,Ie,ut,Pt;const At=b.isCompressedTexture?b.mipmaps[ge]:b.image;if(V!==null)Se=V.max.x-V.min.x,me=V.max.y-V.min.y,we=V.isBox3?V.max.z-V.min.z:1,Le=V.min.x,He=V.min.y,Ke=V.isBox3?V.min.z:0;else{const Lt=Math.pow(2,-k);Se=Math.floor(At.width*Lt),me=Math.floor(At.height*Lt),b.isDataArrayTexture?we=At.depth:b.isData3DTexture?we=Math.floor(At.depth*Lt):we=1,Le=0,He=0,Ke=0}G!==null?(Ie=G.x,ut=G.y,Pt=G.z):(Ie=0,ut=0,Pt=0);const mt=de.convert(F.format),Xt=de.convert(F.type);let xe;F.isData3DTexture?(z.setTexture3D(F,0),xe=P.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(z.setTexture2DArray(F,0),xe=P.TEXTURE_2D_ARRAY):(z.setTexture2D(F,0),xe=P.TEXTURE_2D),_.activeTexture(P.TEXTURE0),_.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(P.UNPACK_ALIGNMENT,F.unpackAlignment);const nn=_.getParameter(P.UNPACK_ROW_LENGTH),at=_.getParameter(P.UNPACK_IMAGE_HEIGHT),dn=_.getParameter(P.UNPACK_SKIP_PIXELS),Tn=_.getParameter(P.UNPACK_SKIP_ROWS),Zn=_.getParameter(P.UNPACK_SKIP_IMAGES);_.pixelStorei(P.UNPACK_ROW_LENGTH,At.width),_.pixelStorei(P.UNPACK_IMAGE_HEIGHT,At.height),_.pixelStorei(P.UNPACK_SKIP_PIXELS,Le),_.pixelStorei(P.UNPACK_SKIP_ROWS,He),_.pixelStorei(P.UNPACK_SKIP_IMAGES,Ke);const Ri=b.isDataArrayTexture||b.isData3DTexture,gt=F.isDataArrayTexture||F.isData3DTexture;if(b.isDepthTexture){const Lt=O.get(b),Kn=O.get(F),xt=O.get(Lt.__renderTarget),Jn=O.get(Kn.__renderTarget);_.bindFramebuffer(P.READ_FRAMEBUFFER,xt.__webglFramebuffer),_.bindFramebuffer(P.DRAW_FRAMEBUFFER,Jn.__webglFramebuffer);for(let Pi=0;Pi<we;Pi++)Ri&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,O.get(b).__webglTexture,k,Ke+Pi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,O.get(F).__webglTexture,ge,Pt+Pi)),P.blitFramebuffer(Le,He,Se,me,Ie,ut,Se,me,P.DEPTH_BUFFER_BIT,P.NEAREST);_.bindFramebuffer(P.READ_FRAMEBUFFER,null),_.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||O.has(b)){const Lt=O.get(b),Kn=O.get(F);_.bindFramebuffer(P.READ_FRAMEBUFFER,K),_.bindFramebuffer(P.DRAW_FRAMEBUFFER,B);for(let xt=0;xt<we;xt++)Ri?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Lt.__webglTexture,k,Ke+xt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Lt.__webglTexture,k),gt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Kn.__webglTexture,ge,Pt+xt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Kn.__webglTexture,ge),k!==0?P.blitFramebuffer(Le,He,Se,me,Ie,ut,Se,me,P.COLOR_BUFFER_BIT,P.NEAREST):gt?P.copyTexSubImage3D(xe,ge,Ie,ut,Pt+xt,Le,He,Se,me):P.copyTexSubImage2D(xe,ge,Ie,ut,Le,He,Se,me);_.bindFramebuffer(P.READ_FRAMEBUFFER,null),_.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else gt?b.isDataTexture||b.isData3DTexture?P.texSubImage3D(xe,ge,Ie,ut,Pt,Se,me,we,mt,Xt,At.data):F.isCompressedArrayTexture?P.compressedTexSubImage3D(xe,ge,Ie,ut,Pt,Se,me,we,mt,At.data):P.texSubImage3D(xe,ge,Ie,ut,Pt,Se,me,we,mt,Xt,At):b.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ge,Ie,ut,Se,me,mt,Xt,At.data):b.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ge,Ie,ut,At.width,At.height,mt,At.data):P.texSubImage2D(P.TEXTURE_2D,ge,Ie,ut,Se,me,mt,Xt,At);_.pixelStorei(P.UNPACK_ROW_LENGTH,nn),_.pixelStorei(P.UNPACK_IMAGE_HEIGHT,at),_.pixelStorei(P.UNPACK_SKIP_PIXELS,dn),_.pixelStorei(P.UNPACK_SKIP_ROWS,Tn),_.pixelStorei(P.UNPACK_SKIP_IMAGES,Zn),ge===0&&F.generateMipmaps&&P.generateMipmap(xe),_.unbindTexture()},this.initRenderTarget=function(b){O.get(b).__webglFramebuffer===void 0&&z.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?z.setTextureCube(b,0):b.isData3DTexture?z.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?z.setTexture2DArray(b,0):z.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){X=0,H=0,J=null,_.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}const Mc=.36,cr=.82,bc=-1.28,yc=1.22,W0=.84;class nl{fixedDt=1/Oe.fixedHz;engineAccel=4.5;brakeDecel=12.5;rollingDrag=.18;aeroDrag=.0023;steerResponse=.15;headingDamping=.34;reverseAccel=1.2;wheelPositions=[new R(bc,-.25,-cr),new R(bc,-.25,cr),new R(yc,-.25,-cr),new R(yc,-.25,cr)];cachedQuaternion=new hi;state={s:0,lateral:Oe.laneWidth/2,headingError:0,speedMps:0,steerAngle:0,wheelSpin:0};lastControls={steer:0,accelerator:0,brake:0};lastPose=null;lastGuardrailContact=null;constructor(){}static async create(){return new nl}dispose(){}setParam(e,t){e==="engineAccel"?this.engineAccel=t:e==="aeroDrag"?this.aeroDrag=t:e==="brakeDecel"?this.brakeDecel=t:e==="steerResponse"?this.steerResponse=t:e==="headingDamping"&&(this.headingDamping=t)}getParams(){return{engineAccel:this.engineAccel,aeroDrag:this.aeroDrag,brakeDecel:this.brakeDecel,steerResponse:this.steerResponse,headingDamping:this.headingDamping}}resetToRoad(e,t,n,s=0){this.state={s:Math.max(0,t),lateral:n,headingError:0,speedMps:tt(s,0,Oe.maxSpeedMps),steerAngle:0,wheelSpin:0},this.lastControls={steer:0,accelerator:0,brake:0},this.lastGuardrailContact=null,this.lastPose=this.computePose(e)}step(e,t){const n=this.fixedDt,s=this.state,r=tt(t.steer,-1,1)*Oe.maxSteerRad;s.steerAngle+=(r-s.steerAngle)*this.steerResponse;const a=tt(s.speedMps/Oe.maxSpeedMps,0,1),o=t.accelerator*this.engineAccel*(1-a*.76),l=t.brake*this.brakeDecel,c=this.rollingDrag+s.speedMps*s.speedMps*this.aeroDrag;let h=o-l-c;s.speedMps<=.08&&t.brake>.85&&t.accelerator<.05&&(h=-this.reverseAccel),s.speedMps=tt(s.speedMps+h*n,0,Oe.maxSpeedMps);const d=e.frameAt(s.s).curvature,m=Math.max(0,s.speedMps*Math.cos(s.headingError))/Math.max(.62,1-d*s.lateral),g=s.speedMps*Math.sin(s.headingError),v=s.speedMps/Oe.wheelbase*Math.tan(s.steerAngle);return s.s=Math.max(0,s.s+m*n),s.lateral+=g*n,s.headingError=yr(s.headingError+(v-d*m)*n),s.headingError-=s.headingError*this.headingDamping*n*tt(1-Math.abs(t.steer),0,1),s.wheelSpin+=s.speedMps*n/Mc,this.lastControls={...t},this.lastPose=this.computePose(e),this.lastGuardrailContact=this.guardrailContactAt(e,this.lastPose),this.lastPose}pose(e){return this.lastPose=this.computePose(e),this.lastGuardrailContact=this.guardrailContactAt(e,this.lastPose),this.lastPose}wheelVisuals(){return this.wheelPositions.map((e,t)=>({position:e,steering:t<2?-this.state.steerAngle:0,rotation:this.state.wheelSpin,suspension:0,radius:Mc}))}chassisQuaternion(){return this.cachedQuaternion}controls(){return{...this.lastControls}}guardrailContactSide(){return this.lastGuardrailContact}computePose(e){const t=this.state,n=e.worldFromRoad(t.s,t.lateral,W0),s=yr(n.heading+t.headingError);return this.cachedQuaternion.copy(X0(s)),{x:n.x,y:n.y,z:n.z,yaw:s,speedMps:t.speedMps,s:t.s,lateral:t.lateral,headingError:t.headingError,steerAngle:t.steerAngle}}guardrailContactAt(e,t){const n=e.boundsAt(t.s),s=Oe.vehicleWidth/2;return t.lateral-s<=n.leftWall?"left":t.lateral+s>=n.rightWall?"right":null}}function X0(i){return new hi().setFromEuler(new Nn(0,-Math.PI/2-i,0,"YXZ"))}const Co=new EventTarget;function q0(i){return typeof structuredClone=="function"?structuredClone(i):JSON.parse(JSON.stringify(i))}function an(i,e,t=!0){const n=q0(e);if(Co.dispatchEvent(new CustomEvent(i,{detail:n})),window.dispatchEvent(new CustomEvent(`slimulator:${i}`,{detail:n})),t&&i!=="event"){const s={type:i,data:n};Co.dispatchEvent(new CustomEvent("event",{detail:s})),window.dispatchEvent(new CustomEvent("slimulator:event",{detail:s}))}}const Aa=18,Y0=44,$0=4,Z0=-1.3,K0=3,J0=.08,Ec=.16,Tc=.03;function Ac(){return{steeringPoints:0,offRoadPenalty:0,offRoadSeconds:0,crashCount:0,laneChanges:0,sdlp:0,sdlpN:0,sdlpMean:0,sdlpM2:0,timeByMode:{manual:0,acc:0,l2:0,l3:0},alertCounts:{earcon:0,haptic:0}}}class il{road;physics;inputSource="local";externalControls={steer:0,accelerator:0,brake:0};session={subId:"",started:!1,status:"idle",elapsed:0,startedAt:null};adas={accActive:!1,lcaActive:!1,autoArmed:!1,setSpeedMps:0,assistSteerAngle:0};metrics=Ac();crashes=[];trials=[];activeTrial=null;crashState=null;dicMessage="READY - MANUAL";dicUntil=0;fixedAccumulator=0;currentControls={steer:0,accelerator:0,brake:0};sampleClock=0;lastLane=0;laneCandidate=null;laneCandidateTime=0;distanceOffset=0;previousPose=null;currentPose=null;constructor(e,t=Date.now()>>>0){this.physics=e,this.road=new Qh(t),this.newSession({seed:t})}static async create(e=Date.now()>>>0){const t=await nl.create();return new il(t,e)}newSession({subId:e="",seed:t=Date.now()>>>0}={}){this.road.reset("unmapped",t),this.session={subId:String(e||""),started:!1,status:"idle",elapsed:0,startedAt:null},this.adas={accActive:!1,lcaActive:!1,autoArmed:!1,setSpeedMps:0,assistSteerAngle:0},this.metrics=Ac(),this.crashes=[],this.trials=[],this.activeTrial=null,this.crashState=null,this.currentControls={steer:0,accelerator:0,brake:0},this.sampleClock=0,this.lastLane=0,this.laneCandidate=null,this.laneCandidateTime=0,this.distanceOffset=0,this.dicMessage="READY - MANUAL",this.dicUntil=0,this.fixedAccumulator=0;const s=this.road.boundsAt(0).laneCenters[0]??0;this.physics.resetToRoad(this.road,0,s,0);const r=this.physics.pose(this.road);this.previousPose={...r},this.currentPose={...r},an("session",this.snapshot(),!1)}update(e,t,n){const s=tt(e,0,.1);this.fixedAccumulator+=s;const r=this.physics.fixedDt;let a=0;for(;this.fixedAccumulator>=r&&a++<8;)this.stepFixed(r,t,n),this.fixedAccumulator-=r;const o=this.snapshot(!0);return an("state",o,!1),o}setInputSource(e){this.inputSource=e,an("event",{type:"input-source",source:e},!1)}setExternalControls(e){this.externalControls={steer:tt(Number(e.steer??this.externalControls.steer)||0,-1,1),accelerator:tt(Number(e.accelerator??this.externalControls.accelerator)||0,0,1),brake:tt(Number(e.brake??this.externalControls.brake)||0,0,1)}}requestScene(e,t){const n=this.physics.pose(this.road),s=this.road.requestScene(e,t,n.s);s==="started"?(this.setDIC(`TRANSITION - ${Vt[e].label}`,3),an("event",{type:"scene-transition-start",from:this.road.scene,to:e},!1)):s==="queued"&&(this.setDIC(`QUEUED - ${Vt[e].label}`,2.4),an("event",{type:"scene-transition-queued",to:e,queue:[...this.road.queue]},!1))}toggleACC(){const e=this.physics.pose(this.road);this.adas.accActive?(this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.setDIC("ACC OFF",2)):e.speedMps>=15*$i?(this.adas.accActive=!0,this.adas.setSpeedMps=e.speedMps,this.setDIC(`ACC SET - ${Math.round(e.speedMps*ws)} MPH`,2.6)):(this.setDIC("ACC UNAVAILABLE",2),an("event",{type:"acc-rejected",reason:"below-min-speed"},!1))}toggleLCA(){const e=this.physics.pose(this.road);if(this.adas.lcaActive){this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.adas.accActive?this.setDIC("LANE CENTER OFF - ACC",2.4):this.setDIC("LANE CENTER OFF",2.4);return}if(this.road.scene==="unmapped"&&!this.road.transition){this.adas.autoArmed=!0,this.adas.accActive=e.speedMps>=15*$i,this.adas.setSpeedMps=Math.max(e.speedMps,15*$i),this.setDIC("LCA ARMED",2.4);return}if(this.road.scene==="l2"||this.road.scene==="l3"){this.adas.lcaActive=!0,this.adas.accActive=!0,this.adas.autoArmed=!1,this.adas.setSpeedMps=Math.max(e.speedMps,15*$i),this.setDIC(`${this.road.scene.toUpperCase()} ACTIVE`,2.4);return}this.setDIC("LCA UNAVAILABLE",2)}triggerAlert({type:e="earcon",expectedAction:t="brake",id:n}={}){this.activeTrial&&this.finishTrial("superseded"),this.startIfNeeded();const s={id:n||`trial-${this.trials.length+1}`,index:this.trials.length+1,type:e,expectedAction:t,mode:this.mode(),startedAt:this.session.elapsed,pdt:null,drt:null,status:"active",baseline:{...this.currentControls}};return this.activeTrial=s,this.trials.push(s),this.metrics.alertCounts[e]++,this.setDIC(`${e==="earcon"?"AUDITORY":"HAPTIC"} ALERT - RESPOND`,3),an("event",{type:"alert-triggered",trial:s},!1),s.id}snapshot(e=!1){const t=this.physics.pose(this.road),n=e?this.interpolatedPose(t):t,s=this.road.nearestLane(n.lateral,n.s);return{version:Yc,session:{...this.session,seed:this.road.seed},inputSource:this.inputSource,vehicle:{speedMps:n.speedMps,speedMph:n.speedMps*ws,roadPositionM:n.s,distanceM:this.distanceOffset+n.s,lateralM:n.lateral,headingErrorRad:n.headingError,steerAngleRad:n.steerAngle,controls:{...this.currentControls},pose:n,crashReset:this.crashState?{...this.crashState}:null},road:{scene:this.road.scene,requestedScene:this.road.requestedScene(),lanesPerDirection:this.road.laneCount(n.s),transition:this.road.transition?{...this.road.transition}:null,queue:this.road.queue.map(r=>({...r})),seed:this.road.seed,bounds:this.road.boundsAt(n.s),lane:s,curvePoints:Array.from({length:9},(r,a)=>{const o=-10+a*5,l=this.road.frameAt(n.s),c=this.road.frameAt(n.s+o),h=c.x-l.x,u=c.z-l.z;return{sOffset:o,xOffset:h*l.rightX+u*l.rightZ}})},adas:{...this.adas,mode:this.mode(),setSpeedMph:this.adas.setSpeedMps*ws},metrics:{...this.metrics,totalScore:this.totalScore(),crashPenaltyTotal:this.metrics.crashCount*Oe.crashPenalty},crashes:this.crashes.map(r=>({...r})),trials:this.trials.map(r=>({...r})),dicMessage:this.session.elapsed>this.dicUntil&&!this.crashState?`${this.mode().toUpperCase()} - ${Vt[this.road.scene].label}`:this.dicMessage}}totalScore(){return this.metrics.steeringPoints-this.metrics.offRoadPenalty-this.metrics.crashCount*Oe.crashPenalty}mode(){return this.adas.lcaActive&&this.road.scene==="l3"?"l3":this.adas.lcaActive&&this.road.scene==="l2"?"l2":this.adas.accActive?"acc":"manual"}stepFixed(e,t,n){const s=this.physics.pose(this.road),r=this.road.update(e,s.s);r.completed&&this.finishSceneTransition(r.completed.from,r.completed.to),r.started&&an("event",{type:"scene-transition-start",from:this.road.scene,to:r.started},!1);let a=this.inputSource==="external"?{...this.externalControls}:{...t};a={steer:tt(Number(a.steer)||0,-1,1),accelerator:tt(Number(a.accelerator)||0,0,1),brake:tt(Number(a.brake)||0,0,1)},a.brake>.05&&(this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1),this.meaningful(a)&&this.startIfNeeded(),this.session.started&&(this.session.elapsed+=e);const o=this.physics.pose(this.road),l=this.road.nearestLane(o.lateral,o.s);this.crashState&&(a={steer:0,accelerator:0,brake:1});const c=this.crashState?{steer:0,accelerator:0,brake:1}:Jh(a,this.adas,o,l,this.road.scene);this.currentControls=c,this.previousPose={...o};const h=n?n.measure("physics",()=>this.physics.step(this.road,c)):this.physics.step(this.road,c);this.noteControlActions(a),this.detectCrashes(o,h),this.updateMetrics(e,h),this.updateCrashReset(e,h),this.currentPose={...this.physics.pose(this.road)}}interpolatedPose(e){if(!this.previousPose||!this.currentPose)return e;const t=tt(this.fixedAccumulator/this.physics.fixedDt,0,1);return{x:_e(this.previousPose.x,this.currentPose.x,t),y:_e(this.previousPose.y,this.currentPose.y,t),z:_e(this.previousPose.z,this.currentPose.z,t),yaw:ml(this.previousPose.yaw,this.currentPose.yaw,t),speedMps:_e(this.previousPose.speedMps,this.currentPose.speedMps,t),s:_e(this.previousPose.s,this.currentPose.s,t),lateral:_e(this.previousPose.lateral,this.currentPose.lateral,t),headingError:ml(this.previousPose.headingError,this.currentPose.headingError,t),steerAngle:_e(this.previousPose.steerAngle,this.currentPose.steerAngle,t)}}finishSceneTransition(e,t){t==="unmapped"?(this.adas.lcaActive&&(this.adas.autoArmed=!0),this.adas.lcaActive=!1):this.adas.autoArmed&&(this.adas.lcaActive=!0,this.adas.accActive=!0,this.adas.setSpeedMps=Math.max(this.physics.pose(this.road).speedMps,15*$i),this.adas.autoArmed=!1);const n=this.physics.pose(this.road),s=this.road.boundsAt(n.s),r=n.lateral<s.leftEdge||n.lateral>s.rightEdge;if(!this.session.started||n.speedMps<2||r){const a=this.road.nearestLane(n.lateral,n.s);this.physics.resetToRoad(this.road,n.s,a.center,0),this.currentControls={steer:0,accelerator:0,brake:0}}this.setDIC(`${Vt[t].label} ACTIVE`,2.6),an("event",{type:"scene-transition-complete",from:e,to:t,mode:this.mode()},!1)}updateMetrics(e,t){if(!this.session.started)return;const n=this.mode();this.metrics.timeByMode[n]+=e;const s=this.road.boundsAt(t.s),r=this.road.nearestLane(t.lateral,t.s),a=t.lateral-Oe.tireTrack/2,o=t.lateral+Oe.tireTrack/2;if(a<s.leftEdge||o>s.rightEdge)this.metrics.offRoadSeconds+=e,this.metrics.offRoadPenalty+=Oe.offRoadPenaltyPerSecond*e;else if(t.speedMps>2){const h=tt(1-Math.abs(r.error)/(Oe.laneWidth/2),0,1);this.metrics.steeringPoints+=Oe.steeringPointsPerSecond*h*e}if(this.sampleClock+=e,this.sampleClock>=1/Oe.sampleHz&&(this.sampleClock%=1/Oe.sampleHz,t.speedMps>2&&!this.crashState)){const h=r.error;this.metrics.sdlpN++;const u=h-this.metrics.sdlpMean;this.metrics.sdlpMean+=u/this.metrics.sdlpN,this.metrics.sdlpM2+=u*(h-this.metrics.sdlpMean),this.metrics.sdlp=this.metrics.sdlpN>1?Math.sqrt(this.metrics.sdlpM2/(this.metrics.sdlpN-1)):0}const c=r.index;c!==this.lastLane?(this.laneCandidate===c?this.laneCandidateTime+=e:(this.laneCandidate=c,this.laneCandidateTime=0),this.laneCandidateTime>.55&&(this.metrics.laneChanges++,this.lastLane=c,this.laneCandidate=null)):(this.laneCandidate=null,this.laneCandidateTime=0)}detectCrashes(e,t){if(this.crashState)return;const n=this.findPedestrianCollision(e,t);if(n){this.crash(n.side,{type:"pedestrian",zone:"Pedestrian crosswalk",pedestrian:n});return}const s=this.physics.guardrailContactSide()??this.findGuardrailContact(e,t);s&&this.crash(s,{type:"wall",zone:"Guard rail"})}findGuardrailContact(e,t){for(let s=0;s<=4;s++){const r=s/4,a=_e(e.s,t.s,r),o=_e(e.lateral,t.lateral,r),l=this.guardrailContactAt(a,o);if(l)return l}return null}guardrailContactAt(e,t){const n=this.road.boundsAt(e),s=Oe.vehicleWidth/2,r=t-s,a=t+s;return r<=n.leftWall+Ec+Tc?"left":a>=n.rightWall-Ec-Tc?"right":null}updateCrashReset(e,t){if(this.crashState&&(this.crashState.stoppedFor+=e,this.crashState.phase=t.speedMps<J0?"waiting":"braking",this.crashState.stoppedFor>=K0)){const n=this.road.nearestLane(t.lateral,t.s);this.physics.resetToRoad(this.road,t.s,n.center,0),this.currentControls={steer:0,accelerator:0,brake:0},this.crashState=null,this.setDIC("CONTROL RESTORED",2.5),an("event",{type:"crash-reset-complete",laneCenter:n.center},!1)}}crash(e,t){if(this.crashState)return;this.startIfNeeded();const n=this.snapshot(),s={index:this.crashes.length+1,time:this.session.elapsed,type:t.type,side:e,zone:t.zone||"Crash boundary wall",mph:n.vehicle.speedMph,mode:this.mode(),odometer:n.vehicle.distanceM,lateral:n.vehicle.lateralM,score:this.totalScore()-Oe.crashPenalty};t.pedestrian&&(s.pedestrian={...t.pedestrian}),this.crashes.push(s),this.metrics.crashCount++,this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.crashState={phase:"braking",stoppedFor:0},this.setDIC(t.type==="pedestrian"?"PEDESTRIAN CRASH!":"CRASH!",10),an("event",{type:"crash",crash:s},!1)}findPedestrianCollision(e,t){if(this.road.roadValueAt("crosswalks",e.s)<=.3&&this.road.roadValueAt("crosswalks",t.s)<=.3)return null;const n=Oe.pedestrianHitRadius,s=Oe.vehicleLength/2,r=Oe.vehicleWidth/2,a=Math.min(e.s,t.s)-s-n,o=Math.max(e.s,t.s)+s+n,l=Math.floor(a/Aa),c=Math.ceil(o/Aa);for(let h=l;h<=c;h++){if((h-$0)%Y0!==0)continue;const u=h*Aa+Z0;if(u<a||u>o)continue;const d=this.road.pedestrianAt(h,this.session.elapsed);if(!d.active)continue;const m=t.s-e.s,g=Math.abs(m)>.01?tt((u-e.s)/m,0,1):0,v=_e(e.s,t.s,g),f=e.lateral+(t.lateral-e.lateral)*g,p=Math.abs(u-v)<=s+n,M=Math.abs(f-d.lateral)<=r+n;if(p&&M)return{id:`ped-${h}`,segment:h,side:d.side,s:u,lateral:d.lateral}}return null}startIfNeeded(){this.session.started||(this.session.started=!0,this.session.status="running",this.session.startedAt=new Date().toISOString(),an("event",{type:"session-started",startedAt:this.session.startedAt},!1))}meaningful(e){return Math.abs(e.steer)>.08||e.accelerator>.05||e.brake>.05}setDIC(e,t=2){this.dicMessage=e,this.dicUntil=this.session.elapsed+t}noteControlActions(e){if(!this.activeTrial)return;const t=this.activeTrial.baseline||{steer:0,accelerator:0,brake:0};e.brake-t.brake>.22&&e.brake>.3?this.noteAction("brake"):e.accelerator-t.accelerator>.22&&e.accelerator>.3?this.noteAction("accelerate"):e.steer-t.steer<-.28&&e.steer<-.3?this.noteAction("steerLeft"):e.steer-t.steer>.28&&e.steer>.3&&this.noteAction("steerRight")}noteAction(e){if(!this.activeTrial)return;const t=Math.max(0,this.session.elapsed-this.activeTrial.startedAt);this.activeTrial.pdt==null&&(this.activeTrial.pdt=t),this.activeTrial.drt==null&&e===this.activeTrial.expectedAction&&(this.activeTrial.drt=t,this.finishTrial("complete"))}finishTrial(e){this.activeTrial&&(this.activeTrial.status=e,an("event",{type:`alert-trial-${e}`,trial:this.activeTrial},!1),this.activeTrial=null)}}const Q0=1.35,j0=1.3,e_=.08,wa="slimulator-gamepad-mapping",Ct={steer:{kind:"axis",index:0},accelerator:{kind:"axis",index:5},brake:{kind:"axis",index:2},acc:{kind:"button",index:0},lca:{kind:"button",index:1},deadzone:.08,steerGain:.75};class t_{constructor(e=window,t={}){this.target=e,this.now=t.now??(()=>performance.now()),this.gamepadMapping=this.loadGamepadMapping(),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp),this.isTouchDevice()&&this.createTouchOverlay()}target;keys=new Set;latches={acc:!1,lca:!1};now;gamepadMapping=ri(Ct);touchControls={steer:0,accelerator:0,brake:0};touchOverlay=null;keyboardSteer=0;lastKeyboardSteerSampleMs=null;dispose(){this.target.removeEventListener("keydown",this.onKeyDown),this.target.removeEventListener("keyup",this.onKeyUp),this.touchOverlay&&(this.touchOverlay.remove(),this.touchOverlay=null)}sample(e="local"){if(e==="gamepad")return this.gamepadControls();const t=this.keyboardControls(),n=this.gamepadControls(),s=this.touchControls;let r=t.steer;Math.abs(n.steer)>Math.abs(r)&&(r=n.steer),Math.abs(s.steer)>Math.abs(r)&&(r=s.steer);const a=Math.max(t.accelerator,n.accelerator,s.accelerator),o=Math.max(t.brake,n.brake,s.brake),l=this.consumeLatch("acc")||n.accButton,c=this.consumeLatch("lca")||n.lcaButton;return{steer:r,accelerator:a,brake:o,accButton:l,lcaButton:c}}getGamepadMapping(){return ri(this.gamepadMapping)}setGamepadMapping(e){this.gamepadMapping=Po({...ri(this.gamepadMapping),...e}),typeof localStorage<"u"&&localStorage.setItem(wa,JSON.stringify(this.gamepadMapping))}resetGamepadMapping(){return this.gamepadMapping=ri(Ct),typeof localStorage<"u"&&localStorage.removeItem(wa),this.getGamepadMapping()}isTouchDevice(){return typeof window<"u"&&"ontouchstart"in window||typeof navigator<"u"&&navigator.maxTouchPoints>0}createTouchOverlay(){const e=document.createElement("div");e.className="mobile-touch-overlay",e.innerHTML=`
      <div class="touch-group steer-group">
        <button id="touchLeft" class="touch-btn steer-btn" type="button" aria-label="Steer Left">◀</button>
        <button id="touchRight" class="touch-btn steer-btn" type="button" aria-label="Steer Right">▶</button>
      </div>
      <div class="touch-group aux-group">
        <button id="touchAcc" class="touch-btn aux-btn" type="button">ACC</button>
        <button id="touchLca" class="touch-btn aux-btn" type="button">LCA</button>
      </div>
      <div class="touch-group pedal-group">
        <button id="touchBrake" class="touch-btn pedal-btn brake" type="button" aria-label="Brake">BRAKE</button>
        <button id="touchGas" class="touch-btn pedal-btn gas" type="button" aria-label="Accelerate">GAS</button>
      </div>
    `,document.body.appendChild(e),this.touchOverlay=e;const t=e.querySelector("#touchLeft"),n=e.querySelector("#touchRight"),s=e.querySelector("#touchGas"),r=e.querySelector("#touchBrake"),a=e.querySelector("#touchAcc"),o=e.querySelector("#touchLca");let l=!1,c=!1;const h=()=>{this.touchControls.steer=(c?1:0)-(l?1:0)};t.addEventListener("touchstart",u=>{u.preventDefault(),l=!0,h()},{passive:!1}),t.addEventListener("touchend",u=>{u.preventDefault(),l=!1,h()},{passive:!1}),t.addEventListener("touchcancel",u=>{u.preventDefault(),l=!1,h()},{passive:!1}),n.addEventListener("touchstart",u=>{u.preventDefault(),c=!0,h()},{passive:!1}),n.addEventListener("touchend",u=>{u.preventDefault(),c=!1,h()},{passive:!1}),n.addEventListener("touchcancel",u=>{u.preventDefault(),c=!1,h()},{passive:!1}),s.addEventListener("touchstart",u=>{u.preventDefault(),this.touchControls.accelerator=1},{passive:!1}),s.addEventListener("touchend",u=>{u.preventDefault(),this.touchControls.accelerator=0},{passive:!1}),s.addEventListener("touchcancel",u=>{u.preventDefault(),this.touchControls.accelerator=0},{passive:!1}),r.addEventListener("touchstart",u=>{u.preventDefault(),this.touchControls.brake=1},{passive:!1}),r.addEventListener("touchend",u=>{u.preventDefault(),this.touchControls.brake=0},{passive:!1}),r.addEventListener("touchcancel",u=>{u.preventDefault(),this.touchControls.brake=0},{passive:!1}),a.addEventListener("touchstart",u=>{u.preventDefault(),this.latches.acc=!0},{passive:!1}),o.addEventListener("touchstart",u=>{u.preventDefault(),this.latches.lca=!0},{passive:!1})}liveGamepadLabel(){if(typeof navigator>"u")return"No gamepad";const e=navigator.getGamepads?.().find(Boolean);if(!e)return"No gamepad";const t=this.gamepadControls(),n=e.axes.map((r,a)=>`A${a}:${r.toFixed(2)}`).join(" "),s=e.buttons.map((r,a)=>r.pressed||r.value>.02?`B${a}:${r.value.toFixed(2)}`:"").filter(Boolean).join(" ");return[e.id,`Mapped steer:${t.steer.toFixed(2)} acc:${t.accelerator.toFixed(2)} brake:${t.brake.toFixed(2)} ACC:${t.accButton?"on":"off"} LCA:${t.lcaButton?"on":"off"}`,`Axes ${n}`,s?`Buttons ${s}`:"Buttons none"].join(`
`)}loadGamepadMapping(){if(typeof localStorage>"u")return ri(Ct);try{const e=JSON.parse(localStorage.getItem(wa)||"{}");return s_(e)}catch{return ri(Ct)}}keyboardControls(){const e=this.keys.has("KeyA")||this.keys.has("ArrowLeft"),n=(this.keys.has("KeyD")||this.keys.has("ArrowRight")?1:0)-(e?1:0),s=this.now(),r=this.lastKeyboardSteerSampleMs??s,a=tt((s-r)/1e3,0,e_),o=n===0?j0:Q0;return this.lastKeyboardSteerSampleMs=s,this.keyboardSteer=i_(this.keyboardSteer,n,o*a),{steer:this.keyboardSteer,accelerator:this.keys.has("KeyW")?1:0,brake:this.keys.has("KeyS")||this.keys.has("Space")?1:0}}gamepadControls(){if(typeof navigator>"u")return{steer:0,accelerator:0,brake:0};const e=navigator.getGamepads?.().find(Boolean);if(!e)return{steer:0,accelerator:0,brake:0};const t=this.gamepadMapping,n=Eh(e,t.steer),s=Math.abs(n)<t.deadzone?0:tt(n*t.steerGain,-1,1),r=wc(e,t.accelerator),a=wc(e,t.brake);return{steer:s,accelerator:r,brake:a,accButton:Ro(e,t.acc),lcaButton:Ro(e,t.lca)}}consumeLatch(e){const t=this.latches[e];return this.latches[e]=!1,t}onKeyDown=e=>{e.repeat||(e.code==="ArrowDown"&&(this.latches.acc=!0),e.code==="ArrowUp"&&(this.latches.lca=!0),this.keys.add(e.code))};onKeyUp=e=>{this.keys.delete(e.code)}}function n_(i){return Number.isFinite(i)?tt((i+1)/2,0,1):0}function Eh(i,e){const t=Number.isFinite(i.axes[e.index])?i.axes[e.index]:0;return e.invert?-t:t}function wc(i,e){return e.kind==="axis"?n_(Eh(i,e)):Ro(i,e)?1:0}function Ro(i,e){const t=i.buttons[e.index];return!!(t?.pressed||(t?.value??0)>.5)}function i_(i,e,t){const n=e-i;return Math.abs(n)<=t?e:i+Math.sign(n)*t}function s_(i){return Hr(i)?"steerAxis"in i||"acceleratorAxis"in i||"brakeAxis"in i||"accButton"in i||"lcaButton"in i?Po({steer:{kind:"axis",index:bs(i.steerAxis,Ct.steer.index)},accelerator:{kind:"axis",index:bs(i.acceleratorAxis,Rc(Ct.accelerator))},brake:{kind:"axis",index:bs(i.brakeAxis,Rc(Ct.brake))},acc:{kind:"button",index:bs(i.accButton,Ct.acc.index)},lca:{kind:"button",index:bs(i.lcaButton,Ct.lca.index)},deadzone:Pc(i.deadzone,Ct.deadzone),steerGain:Pc(i.steerGain,Ct.steerGain)}):Po({...ri(Ct),...i}):ri(Ct)}function Po(i){return{steer:Th(i.steer,Ct.steer),accelerator:Cc(i.accelerator,Ct.accelerator),brake:Cc(i.brake,Ct.brake),acc:Lo(i.acc,Ct.acc),lca:Lo(i.lca,Ct.lca),deadzone:tt(Number(i.deadzone)||Ct.deadzone,0,.5),steerGain:tt(Number(i.steerGain)||Ct.steerGain,.1,1.5)}}function Cc(i,e){return Hr(i)&&i.kind==="button"?Lo(i,e.kind==="button"?e:Ct.acc):Th(i,e.kind==="axis"?e:Ct.steer)}function Th(i,e){return Hr(i)?{kind:"axis",index:Ah(i.index),invert:i.invert===!0}:{...e}}function Lo(i,e){return Hr(i)?{kind:"button",index:Ah(i.index)}:{...e}}function ri(i){return{steer:{...i.steer},accelerator:{...i.accelerator},brake:{...i.brake},acc:{...i.acc},lca:{...i.lca},deadzone:i.deadzone,steerGain:i.steerGain}}function Rc(i){return i.index}function bs(i,e){return Number.isFinite(Number(i))?Number(i):e}function Pc(i,e){return Number.isFinite(Number(i))?Number(i):e}function Hr(i){return typeof i=="object"&&i!==null}function Ah(i){return Math.max(0,Math.min(31,Math.round(Number(i)||0)))}const br={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ds{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const r_=new zr(-1,1,1,-1,0,1);class a_ extends Et{constructor(){super(),this.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new _t([0,2,0,0,2,0],2))}}const o_=new a_;class sl{constructor(e){this._mesh=new rt(o_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,r_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class wh extends ds{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Nt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ai.clone(e.uniforms),this.material=new Nt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new sl(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Lc extends ds{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class l_ extends ds{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class c_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Ue);this._width=n.width,this._height=n.height,t=new tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wh(br),this.copyPass.material.blending=Dn,this.timer=new ku}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Lc!==void 0&&(a instanceof Lc?n=!0:a instanceof l_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const hr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class h_ extends ds{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ai.clone(hr.uniforms),this.material=new fh({name:hr.name,uniforms:this.uniforms,vertexShader:hr.vertexShader,fragmentShader:hr.fragmentShader}),this._fsQuad=new sl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},it.getTransfer(this._outputColorSpace)===ct&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Uo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===No?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Fo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Fr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Bo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===zo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Oo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class d_ extends ds{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Te}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const u_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Te(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ls extends ds{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Ue(e.x,e.y):new Ue(256,256),this.clearColor=new Te(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new tn(r,a,{type:hn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new tn(r,a,{type:hn});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new tn(r,a,{type:hn});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}const o=u_;this.highPassUniforms=Ai.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Nt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Ue(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ai.clone(br.uniforms),this.blendMaterial=new Nt({uniforms:this.copyUniforms,vertexShader:br.vertexShader,fragmentShader:br.fragmentShader,premultipliedAlpha:!0,blending:es,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Te,this._oldClearAlpha=1,this._basic=new $t,this._fsQuad=new sl(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ue(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ls.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ls.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Nt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ue(.5,.5)},direction:{value:new Ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Nt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}ls.BlurDirectionX=new Ue(1,0);ls.BlurDirectionY=new Ue(0,1);const f_={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Ue(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};class p_{constructor(e,t,n,s){this.scene=e,this.road=t,this.renderer=n,this.bloom=s,this.scene.background=new Te(4952730),this.scene.fog=new Lr(4952730,54,370),this.sky.position.set(0,420,-900),this.sky.rotation.x=-Math.PI/2.7,this.scene.add(this.sky),this.mountainFar=this.createMountainRidge(3501945,.36,31),this.mountainNear=this.createMountainRidge(2645094,.44,83),this.lowFogBand=new rt(new Ti(1800,115),new $t({color:9224381,transparent:!0,opacity:.14,depthWrite:!1,side:St})),this.lowFogBand.renderOrder=-3,this.scene.add(this.lowFogBand);const r=new Is(1,1),a=new si({color:16120058,roughness:.95,metalness:.05,flatShading:!0,fog:!1});for(let o=0;o<18;o++){const l=new Wn,c=6+Math.floor(Q(o*47)*6);for(let u=0;u<c;u++){const d=o*73+u*19,m=(u-(c-1)/2)/Math.max(1,(c-1)/2),g=1-Math.abs(m)*.6,v=(14+Q(d)*16)*g,f=(10+Q(d+5)*10)*g,p=(12+Q(d+11)*14)*g,M=new rt(r,a);M.scale.set(v,f,p);const E=(u-(c-1)/2)*(8+Q(d+17)*8),S=f*.4+(Q(d+23)-.5)*2,A=(Q(d+29)-.5)*(10+Q(d+31)*8);if(M.position.set(E,S,A),M.rotation.set(Q(d+31)*Math.PI,Q(d+37)*Math.PI,Q(d+41)*Math.PI),l.add(M),Q(d+43)>.35){const y=new rt(r,a),C=v*(.45+Q(d+47)*.2),x=f*(.45+Q(d+53)*.2),w=p*(.45+Q(d+59)*.2);y.scale.set(C,x,w),y.position.set(E+(Q(d+61)-.5)*v*.3,S+f*.4+x*.2,A+(Q(d+67)-.5)*p*.3),y.rotation.set(Q(d+71)*Math.PI,Q(d+73)*Math.PI,Q(d+79)*Math.PI),l.add(y)}}l.scale.set(_e(.72,1.34,Q(o*53)),_e(.82,1.18,Q(o*59)),_e(.72,1.38,Q(o*61))),l.rotation.y=(Q(o*67)-.5)*.35;const h={x:-430+Q(o*31)*860,y:82+Q(o*37)*122,z:-150-Q(o*41)*640,speed:2.4+Q(o*43)*5.8,phase:Q(o*89)*Math.PI*2};l.position.set(h.x,h.y,h.z),this.cloudBases.push(h),this.cloudGroup.add(l)}this.scene.add(this.cloudGroup)}scene;road;renderer;bloom;sky=new rt(new Ti(4e3,1600),new $t({color:9419207,depthWrite:!1}));mountainFar;mountainNear;lowFogBand;cloudGroup=new Wn;cloudBases=[];qualityMode="high";setQualityMode(e){this.qualityMode=e,this.cloudGroup.visible=!0,this.cloudGroup.children.forEach((t,n)=>{t.visible=e==="high"||n%3===0})}update(e,t=0){const n=this.qualityMode==="high",s=e.vehicle.pose,r=this.road.roadValueAt("forest",s.s),a=this.road.roadValueAt("buildingScale",s.s),o=Math.min(1,a),l=new Te(4426385).lerp(new Te(3239802),r*.34).lerp(new Te(2447720),o*.26);this.scene.background instanceof Te&&this.scene.background.copy(l);const c=this.scene.fog;c instanceof Lr&&(c.color.copy(l),c.near=_e(62,42,r),c.far=_e(390,260,r),o>.75&&(c.near=72,c.far=470)),this.sky.material.color.copy(l),this.renderer.toneMappingExposure=_e(1.2,1.06,r)+o*.05,this.bloom.strength=n?_e(.06,.11,o):0,this.sky.position.set(s.x,420,s.z-900),this.cloudGroup.position.set(s.x,0,s.z),this.cloudGroup.children.forEach((m,g)=>{const v=this.cloudBases[g];if(!v)return;m.visible=n||g%3===0;const f=s.s*.08+t*v.speed,p=m_(v.z+f,-820,180),M=v.x+Math.sin(t*.015+v.phase)*18;m.position.set(M,v.y,p)});const h=this.road.worldFromRoad(s.s+720,0,0),u=this.road.worldFromRoad(s.s+430,0,0);this.mountainFar.position.set(h.x,-2,h.z),this.mountainNear.position.set(u.x,-6,u.z),this.mountainFar.material.opacity=_e(.22,.42,r),this.mountainNear.material.opacity=_e(.14,.52,r),this.mountainFar.visible=r>.08,this.mountainNear.visible=r>.08;const d=this.road.worldFromRoad(s.s+260,0,28);this.lowFogBand.position.set(d.x,d.y,d.z),this.lowFogBand.material.opacity=_e(.04,.2,r),this.lowFogBand.visible=r>.08}createMountainRidge(e,t,n){const r=[],a=[];for(let c=0;c<19;c++){const h=_e(-900,900,c/18),u=Math.sin((c+n)*.72)*34,d=Math.sin((c+n)*1.31)*18,m=58+u+d+Q(c*19.7+n)*52;r.push(h,-24,0,h,m,0)}for(let c=0;c<18;c++){const h=c*2;a.push(h,h+2,h+1,h+1,h+2,h+3)}const o=new Et;o.setAttribute("position",new yt(new Float32Array(r),3)),o.setIndex(a),o.computeVertexNormals();const l=new rt(o,new $t({color:e,transparent:!0,opacity:t,depthWrite:!1,side:St}));return l.frustumCulled=!1,l.renderOrder=-4,this.scene.add(l),l}}function m_(i,e,t){const n=t-e;return e+((i-e)%n+n)%n}const Dc=new Fn,dr=new R;class Ch extends Bu{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new _t(e,3)),this.setAttribute("uv",new _t(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new To(t,6,1);return this.setAttribute("instanceStart",new oi(n,3,0)),this.setAttribute("instanceEnd",new oi(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new To(t,6,1);return this.setAttribute("instanceColorStart",new oi(n,3,0)),this.setAttribute("instanceColorEnd",new oi(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Au(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fn);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Dc.setFromBufferAttribute(t),this.boundingBox.union(Dc))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)dr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(dr)),dr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(dr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ue.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ue},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};jt.line={uniforms:Ai.merge([ue.common,ue.fog,ue.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Zi extends Nt{constructor(e){super({type:"LineMaterial",uniforms:Ai.clone(jt.line.uniforms),vertexShader:jt.line.vertexShader,fragmentShader:jt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Ca=new ft,Ic=new R,Uc=new R,Gt=new ft,kt=new ft,Cn=new ft,Ra=new R,Pa=new pt,Ht=new Xu,Nc=new R,ur=new Fn,fr=new di,Rn=new ft;let Ln,bi;function Fc(i,e,t){return Rn.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),Rn.multiplyScalar(1/Rn.w),Rn.x=bi/t.width,Rn.y=bi/t.height,Rn.applyMatrix4(i.projectionMatrixInverse),Rn.multiplyScalar(1/Rn.w),Math.abs(Math.max(Rn.x,Rn.y))}function g_(i,e){const t=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){Ht.start.fromBufferAttribute(s,o),Ht.end.fromBufferAttribute(r,o),Ht.applyMatrix4(t);const c=new R,h=new R;Ln.distanceSqToSegment(Ht.start,Ht.end,h,c),h.distanceTo(c)<bi*.5&&e.push({point:h,pointOnLine:c,distance:Ln.origin.distanceTo(h),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function __(i,e,t){const n=e.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,h=Math.min(o.instanceCount,l.count),u=-e.near;Ln.at(1,Cn),Cn.w=1,Cn.applyMatrix4(e.matrixWorldInverse),Cn.applyMatrix4(n),Cn.multiplyScalar(1/Cn.w),Cn.x*=r.x/2,Cn.y*=r.y/2,Cn.z=0,Ra.copy(Cn),Pa.multiplyMatrices(e.matrixWorldInverse,a);for(let d=0,m=h;d<m;d++){if(Gt.fromBufferAttribute(l,d),kt.fromBufferAttribute(c,d),Gt.w=1,kt.w=1,Gt.applyMatrix4(Pa),kt.applyMatrix4(Pa),Gt.z>u&&kt.z>u)continue;if(Gt.z>u){const E=Gt.z-kt.z,S=(Gt.z-u)/E;Gt.lerp(kt,S)}else if(kt.z>u){const E=kt.z-Gt.z,S=(kt.z-u)/E;kt.lerp(Gt,S)}Gt.applyMatrix4(n),kt.applyMatrix4(n),Gt.multiplyScalar(1/Gt.w),kt.multiplyScalar(1/kt.w),Gt.x*=r.x/2,Gt.y*=r.y/2,kt.x*=r.x/2,kt.y*=r.y/2,Ht.start.copy(Gt),Ht.start.z=0,Ht.end.copy(kt),Ht.end.z=0;const v=Ht.closestPointToPointParameter(Ra,!0);Ht.at(v,Nc);const f=Jd.lerp(Gt.z,kt.z,v),p=f>=-1&&f<=1,M=Ra.distanceTo(Nc)<bi*.5;if(p&&M){Ht.start.fromBufferAttribute(l,d),Ht.end.fromBufferAttribute(c,d),Ht.start.applyMatrix4(a),Ht.end.applyMatrix4(a);const E=new R,S=new R;Ln.distanceSqToSegment(Ht.start,Ht.end,S,E),t.push({point:S,pointOnLine:E,distance:Ln.origin.distanceTo(S),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}class v_ extends rt{constructor(e=new Ch,t=new Zi({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)Ic.fromBufferAttribute(t,a),Uc.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Ic.distanceTo(Uc);const r=new To(s,2,1);return e.setAttribute("instanceDistanceStart",new oi(r,1,0)),e.setAttribute("instanceDistanceEnd",new oi(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,s=e.camera;if(s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Ln=e.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;bi=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),fr.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=bi*.5;else{const u=Math.max(s.near,fr.distanceToPoint(Ln.origin));c=Fc(s,u,l.resolution)}if(fr.radius+=c,Ln.intersectsSphere(fr)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),ur.copy(o.boundingBox).applyMatrix4(a);let h;if(n)h=bi*.5;else{const u=Math.max(s.near,ur.distanceToPoint(Ln.origin));h=Fc(s,u,l.resolution)}ur.expandByScalar(h),Ln.intersectsBox(ur)!==!1&&(n?g_(this,t):__(this,s,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Ca),this.material.uniforms.resolution.value.set(Ca.z,Ca.w))}}class Rh extends Ch{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setPositions(n),this}setColors(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setColors(n),this}setFromPoints(e){const t=e.length-1,n=new Float32Array(6*t);for(let s=0;s<t;s++)n[6*s]=e[s].x,n[6*s+1]=e[s].y,n[6*s+2]=e[s].z||0,n[6*s+3]=e[s+1].x,n[6*s+4]=e[s+1].y,n[6*s+5]=e[s+1].z||0;return super.setPositions(n),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class x_ extends v_{constructor(e=new Rh,t=new Zi({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}function S_(){const i=document.createElement("canvas");i.width=128,i.height=256;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#112430"),t.addColorStop(1,"#18232c"),e.fillStyle=t,e.fillRect(0,0,128,256);const n=8,s=24,r=128/n,a=256/s;for(let l=0;l<s;l++)for(let c=0;c<n;c++){const h=Math.sin(l*12.9898+c*78.233)*43758.5453%1,u=Math.abs(h);u>.65?e.fillStyle=u>.88?"#ffc640":"#5be5f7":e.fillStyle="#0c151c",e.fillRect(c*r+3,l*a+2,r-6,a-4)}const o=new cs(i);return o.wrapS=Yn,o.wrapT=Yn,o.repeat.set(1,1),o}const Ph=160,M_=96,Oc=Ph,Lh=432,b_=224,Pn=Lh,Dh=3.1,Ih=5.1,La=Dh+Ih;function Bc(i){const e=Math.max(0,Math.min(1,i));return e*e*(3-2*e)}function pr(i,e){return typeof i=="function"?i(e):i}function Uh(i){return i==="high"?{sampleCount:Ph,spacing:3,backDistance:42}:{sampleCount:M_,spacing:3.4,backDistance:30}}function y_(i,e,t){const n=Uh(t),s=Math.floor((e-n.backDistance)/n.spacing)*n.spacing;for(let r=0;r<n.sampleCount;r++)i[r]=s+r*n.spacing;return{base:s,sampleCount:n.sampleCount,spacing:n.spacing}}function Nh(i){return i==="high"?{sampleCount:Lh,spacing:1.1,backDistance:42}:{sampleCount:b_,spacing:1.45,backDistance:30}}function E_(i,e,t){const n=Nh(t),s=Math.floor((e-n.backDistance)/n.spacing)*n.spacing;for(let r=0;r<n.sampleCount;r++)i[r]=s+r*n.spacing;return{base:s,sampleCount:n.sampleCount,spacing:n.spacing}}function T_(i){return(i%La+La)%La}class A_{constructor(e,t){this.scene=e,this.road=t;const n=this.createRoadRibbons();this.ribbons=n.ribbons,this.guardrailLines=n.guardrailLines,this.markingLines=n.markingLines}scene;road;ribbons;guardrailLines;markingLines;laneLines=[];roadSamples=new Float32Array(Oc);guardrailSamples=new Float32Array(Pn);qualityMode="high";lastUpdateKey="";setQualityMode(e){this.qualityMode!==e&&(this.qualityMode=e,this.lastUpdateKey="")}update(e){const t=Uh(this.qualityMode),n=Nh(this.qualityMode),s=Math.floor((e.vehicle.roadPositionM-t.backDistance)/t.spacing)*t.spacing,r=Math.floor((e.vehicle.roadPositionM-n.backDistance)/n.spacing)*n.spacing,a=e.road.transition,o=a?`${a.from}:${a.to}:${Math.floor(a.progress*1e3)}`:"",l=`${this.qualityMode}:${s}:${r}:${e.road.scene}:${o}`;if(l===this.lastUpdateKey)return;this.lastUpdateKey=l,y_(this.roadSamples,e.vehicle.roadPositionM,this.qualityMode);const c=E_(this.guardrailSamples,e.vehicle.roadPositionM,this.qualityMode);this.updateLaneDashPhase(c.base);const h=this.roadSamples,u=this.guardrailSamples,d=f=>this.road.boundsAt(f),m=d(e.vehicle.roadPositionM);this.updateRibbon(this.ribbons.ground,h,t.sampleCount,f=>d(f).leftWall-60,f=>d(f).rightWall+60,-.18),this.updateRibbon(this.ribbons.road,h,t.sampleCount,f=>d(f).leftEdge,f=>d(f).rightEdge,.02),this.updateRibbon(this.ribbons.shoulderL,h,t.sampleCount,f=>d(f).leftEdge-Oe.shoulderWidth,f=>d(f).leftEdge,.012),this.updateRibbon(this.ribbons.shoulderR,h,t.sampleCount,f=>d(f).rightEdge,f=>d(f).rightEdge+Oe.shoulderWidth,.012),this.updateRibbon(this.ribbons.roadSheen,h,t.sampleCount,f=>d(f).leftEdge+.08,f=>d(f).rightEdge-.08,.043),this.updateRibbon(this.ribbons.shoulderGlowL,h,t.sampleCount,f=>d(f).leftEdge-.24,f=>d(f).leftEdge+.08,.062),this.updateRibbon(this.ribbons.shoulderGlowR,h,t.sampleCount,f=>d(f).rightEdge-.08,f=>d(f).rightEdge+.24,.062),this.updateRibbon(this.ribbons.wallL,h,t.sampleCount,f=>d(f).leftWall-.14,f=>d(f).leftWall+.14,.46),this.updateRibbon(this.ribbons.wallR,h,t.sampleCount,f=>d(f).rightWall-.14,f=>d(f).rightWall+.14,.46),this.updateVerticalRibbon(this.ribbons.guardrailFaceL,u,n.sampleCount,f=>d(f).leftWall,.5,.82),this.updateVerticalRibbon(this.ribbons.guardrailFaceR,u,n.sampleCount,f=>d(f).rightWall,.5,.82),this.updateGuardrailLine(this.guardrailLines.left,u,n.sampleCount,f=>d(f).leftWall,.86,e.vehicle.roadPositionM),this.updateGuardrailLine(this.guardrailLines.right,u,n.sampleCount,f=>d(f).rightWall,.86,e.vehicle.roadPositionM),this.ribbons.urbanFacadeL.mesh.visible=!1,this.ribbons.urbanFacadeR.mesh.visible=!1,this.updateGuardrailLine(this.markingLines.edgeL,u,n.sampleCount,f=>d(f).leftEdge+.06,.076,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.edgeR,u,n.sampleCount,f=>d(f).rightEdge-.06,.076,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.centerL,u,n.sampleCount,-.17,.082,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.centerR,u,n.sampleCount,.17,.082,e.vehicle.roadPositionM);for(let f=0;f<this.laneLines.length;f++)this.laneLines[f].line.visible=!1;let g=0;const v=u[Math.max(0,n.sampleCount-1)]??e.vehicle.roadPositionM;for(let f=0;f<3;f++){const p=f+1,M=Math.max(m.laneFloat,this.road.laneFloat(v)),E=Bc((M-p)/.4);if(E<=.01){g+=2;continue}const S=-5.4*(f+1);if(g<this.laneLines.length){const y=this.laneLines[g++];y.line.visible=!0,y.line.material.opacity=.86*E,this.updateGuardrailLine(y,u,n.sampleCount,S,.108,e.vehicle.roadPositionM,C=>this.road.laneFloat(C)>p+.03)}const A=Oe.laneWidth*(f+1);if(g<this.laneLines.length){const y=this.laneLines[g++];y.line.visible=!0,y.line.material.opacity=.86*E,this.updateGuardrailLine(y,u,n.sampleCount,A,.108,e.vehicle.roadPositionM,C=>this.road.laneFloat(C)>p+.03)}}}createRoadRibbons(){const e=new lt({color:5398874,emissive:2042151,emissiveIntensity:.42,side:St}),t=new lt({color:3364687,side:St}),n=new lt({color:2973519,side:St}),s=new lt({color:4812144,side:St}),r=S_(),a=new $t({map:r,side:St,transparent:!0,opacity:.82}),o=new $t({color:11191741,side:St,transparent:!0,opacity:.68,depthWrite:!1}),l=new Zi({color:13953248,linewidth:.18,worldUnits:!0,transparent:!0,opacity:.7,alphaToCoverage:!0,depthWrite:!1}),c=new Zi({color:16777215,linewidth:.105,worldUnits:!0,vertexColors:!0,transparent:!0,opacity:.72,alphaToCoverage:!0,depthWrite:!1}),h=new Zi({color:16777215,linewidth:.105,worldUnits:!0,vertexColors:!0,transparent:!0,opacity:.72,alphaToCoverage:!0,depthWrite:!1}),u=new Zi({color:16777215,linewidth:.12,worldUnits:!0,vertexColors:!0,dashed:!0,dashSize:Dh,gapSize:Ih,transparent:!0,opacity:.86,alphaToCoverage:!0,depthWrite:!1}),d=new $t({color:9478294,transparent:!0,opacity:.13,depthWrite:!1,side:St}),m=new $t({color:10024413,transparent:!0,opacity:.13,depthWrite:!1,side:St}),g=Oc,v={ground:this.createRibbon(g,n,"ground"),road:this.createRibbon(g,e,"road"),shoulderL:this.createRibbon(g,t,"shoulderL"),shoulderR:this.createRibbon(g,t,"shoulderR"),roadSheen:this.createRibbon(g,d,"roadSheen"),shoulderGlowL:this.createRibbon(g,m,"shoulderGlowL"),shoulderGlowR:this.createRibbon(g,m,"shoulderGlowR"),wallL:this.createRibbon(g,s,"wallL"),wallR:this.createRibbon(g,s,"wallR"),guardrailFaceL:this.createRibbon(Pn,o,"guardrailFaceL"),guardrailFaceR:this.createRibbon(Pn,o,"guardrailFaceR"),urbanFacadeL:this.createRibbon(g,a,"urbanFacadeL"),urbanFacadeR:this.createRibbon(g,a,"urbanFacadeR")};for(let f=0;f<6;f++){const p=u.clone();this.laneLines.push(this.createGuardrailLine(Pn,p,`lane${f}`,{dashed:!0,renderOrder:4,nearColor:14809329,farColor:4678750,fadeStartM:70,fadeEndM:175}))}return{ribbons:v,guardrailLines:{left:this.createGuardrailLine(Pn,l,"guardrailTopL",{renderOrder:2}),right:this.createGuardrailLine(Pn,l,"guardrailTopR",{renderOrder:2})},markingLines:{edgeL:this.createGuardrailLine(Pn,c,"edgeL",{renderOrder:4,nearColor:14218990,farColor:5205350,fadeStartM:82,fadeEndM:190}),edgeR:this.createGuardrailLine(Pn,c,"edgeR",{renderOrder:4,nearColor:14218990,farColor:5205350,fadeStartM:82,fadeEndM:190}),centerL:this.createGuardrailLine(Pn,h,"centerL",{renderOrder:4,nearColor:15781461,farColor:7300934,fadeStartM:78,fadeEndM:185}),centerR:this.createGuardrailLine(Pn,h,"centerR",{renderOrder:4,nearColor:15781461,farColor:7300934,fadeStartM:78,fadeEndM:185})}}}createRibbon(e,t,n){const s=new Float32Array(e*2*3),r=new Float32Array(e*2*3),a=new Float32Array(e*2*2),o=[];for(let h=0;h<e-1;h++){const u=h*2;o.push(u,u+2,u+1,u+1,u+2,u+3)}for(let h=0;h<e*2;h++)r[h*3+1]=1;const l=new Et;l.setAttribute("position",new yt(s,3).setUsage(Ji)),l.setAttribute("normal",new yt(r,3)),l.setAttribute("uv",new yt(a,2).setUsage(Ji)),l.setIndex(o);const c=new rt(l,t);return c.name=n,c.receiveShadow=!0,c.frustumCulled=!1,this.scene.add(c),{mesh:c,positions:s,uvs:a,maxSampleCount:e}}createGuardrailLine(e,t,n,s={}){const r=new Rh,a=new Float32Array(e*3),o=s.nearColor===void 0?void 0:new Float32Array(e*3);r.setPositions(a),o&&r.setColors(o);const l=new x_(r,t);l.name=n,l.frustumCulled=!1,l.renderOrder=s.renderOrder??2;const c=s.dashed??!1;return t.dashed!==c&&(t.dashed=c),c&&l.computeLineDistances(),this.scene.add(l),{line:l,geometry:r,positions:a,colors:o,nearColor:s.nearColor===void 0?void 0:new Te(s.nearColor),farColor:s.farColor===void 0?void 0:new Te(s.farColor),fadeStartM:s.fadeStartM,fadeEndM:s.fadeEndM,maxSampleCount:e,dashed:s.dashed??!1}}updateRibbon(e,t,n,s,r,a,o){for(let h=0;h<n;h++){const u=t[h],d=this.road.worldFromRoad(u,pr(s,u),a),m=this.road.worldFromRoad(u,pr(r,u),a),g=h*6;e.positions[g]=d.x,e.positions[g+1]=d.y,e.positions[g+2]=d.z,e.positions[g+3]=m.x,e.positions[g+4]=m.y,e.positions[g+5]=m.z;const v=o?u/o:h/(n-1),f=h*4;e.uvs[f]=0,e.uvs[f+1]=v,e.uvs[f+2]=1,e.uvs[f+3]=v}const l=e.mesh.geometry.getAttribute("position"),c=e.mesh.geometry.getAttribute("uv");e.mesh.geometry.setDrawRange(0,Math.max(0,n-1)*6),l.needsUpdate=!0,c.needsUpdate=!0}updateVerticalRibbon(e,t,n,s,r,a){for(let c=0;c<n;c++){const h=t[c],u=pr(s,h),d=this.road.worldFromRoad(h,u,r),m=this.road.worldFromRoad(h,u,a),g=c*6;e.positions[g]=d.x,e.positions[g+1]=d.y,e.positions[g+2]=d.z,e.positions[g+3]=m.x,e.positions[g+4]=m.y,e.positions[g+5]=m.z;const v=c/(n-1),f=c*4;e.uvs[f]=0,e.uvs[f+1]=v,e.uvs[f+2]=1,e.uvs[f+3]=v}const o=e.mesh.geometry.getAttribute("position"),l=e.mesh.geometry.getAttribute("uv");e.mesh.geometry.setDrawRange(0,Math.max(0,n-1)*6),o.needsUpdate=!0,l.needsUpdate=!0}updateGuardrailLine(e,t,n,s,r,a,o){const l=Math.min(n,e.maxSampleCount);let c=0,h=l-1;if(o){c=-1,h=-1;for(let d=0;d<l;d++)o(t[d])&&(c<0&&(c=d),h=d);if(c<0){e.geometry.setPositions(e.positions.subarray(0,0)),e.colors&&e.geometry.setColors(e.colors.subarray(0,0));return}}const u=Math.max(0,h-c+1);for(let d=0;d<u;d++){const m=t[c+d],g=this.road.worldFromRoad(m,pr(s,m),r),v=d*3;if(e.positions[v]=g.x,e.positions[v+1]=g.y,e.positions[v+2]=g.z,e.colors&&e.nearColor&&e.farColor&&e.fadeStartM!==void 0&&e.fadeEndM!==void 0){const f=Bc((m-a-e.fadeStartM)/Math.max(1,e.fadeEndM-e.fadeStartM));e.colors[v]=e.nearColor.r+(e.farColor.r-e.nearColor.r)*f,e.colors[v+1]=e.nearColor.g+(e.farColor.g-e.nearColor.g)*f,e.colors[v+2]=e.nearColor.b+(e.farColor.b-e.nearColor.b)*f}}e.geometry.setPositions(e.positions.subarray(0,u*3)),e.colors&&e.geometry.setColors(e.colors.subarray(0,u*3)),e.dashed&&(e.line.material.dashed||(e.line.material.dashed=!0),e.line.computeLineDistances())}updateLaneDashPhase(e){const t=T_(e);for(const n of this.laneLines)n.dashed&&(n.line.material.dashOffset=t)}}function w_(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Et;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.attributes[m]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(u.morphAttributes[m])}if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0;const u=[];for(let d=0;d<i.length;++d){const m=i[d].index;for(let g=0;g<m.count;++g)u.push(m.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=zc(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const m=[];for(let v=0;v<a[h].length;++v)m.push(a[h][v][d]);const g=zc(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function zc(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new yt(a,t,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let d=0,m=h.count;d<m;d++)for(let g=0;g<t;g++){const v=h.getComponent(d,g);o.setComponent(d+u,g,v)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}function Gc(){const i=[],e=new Is(1.2,1);i.push(e);const t=[new R(.6,.4,.5),new R(-.6,-.2,.4),new R(.4,-.3,-.6),new R(-.5,.5,-.4),new R(0,.8,.1),new R(.2,-.5,.5)];for(let s=0;s<t.length;s++){const r=.65+Math.random()*.45,a=new Is(r,1);a.translate(t[s].x,t[s].y,t[s].z),i.push(a)}const n=w_(i);return n.computeVertexNormals(),n}function Fh(i){const e=Vt[i],t=e.lanes,n=2*t*Oe.laneWidth,s=-t*Oe.laneWidth,r=t*Oe.laneWidth;return{laneCount:e.lanes,laneFloat:t,leftEdge:s,rightEdge:r,leftWall:s-e.guardrailDistance,rightWall:r+e.guardrailDistance,roadWidth:n,medianWidth:e.median,laneCenters:Array.from({length:e.lanes},(a,o)=>Oe.laneWidth*(o+.5))}}function C_(i,e,t){const n=Vt[i].curveAmp,s=Oe.routeWaveMeters,r=t%4096/4096*zt,a=e/s*zt+r,o=e/(s*.43)*zt+r*.37,l=Math.sin(a)*n+Math.sin(o)*n*.28,c=Math.cos(a)*(zt/s)*n+Math.cos(o)*(zt/(s*.43))*n*.28,h=-Math.sin(a)*(zt/s)**2*n-Math.sin(o)*(zt/(s*.43))**2*n*.28,u=Math.atan(c),d=h/Math.pow(1+c*c,1.5),m=Math.cos(u),g=Math.sin(u);return{s:e,x:l,z:-e,heading:u,curvature:d,rightX:m,rightZ:g,forwardX:-g,forwardZ:-m}}function xn(i,e,t,n,s){const r=C_(i,e,s);return{x:r.x+r.rightX*t,y:n,z:r.z+r.rightZ*t,heading:r.heading}}function R_(i,e,t,n){const s=Q(n+e*41.7+t*131.9);return i==="l3"?s>.74?"billboard":s>.55?"skyscraper":s>.42?"bulk":s>.28?"shop":"standard":i==="l2"?s>.92?"billboard":s>.72?"bulk":s>.42?"shop":"standard":s>.88?"shop":"standard"}function Da(i,e,t,n,s=8){const r=Fh(i),a=t?1:-1,o=a<0?r.leftWall:r.rightWall,l=n+e*17.31+t*73.7,c=Vt[i].buildingSetback,h=Math.max(3.5,c*.38)+s+2,u=i==="l3"?_e(24,86,Q(l+3)):_e(8,34,Q(l+3));return{side:a,clearance:o,lateral:o+a*(h+u),sOffset:(Q(l+7)-.5)*12,rotationJitter:(Q(l+11)-.5)*.32,variant:R_(i,e,t,n)}}const kc={vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float alpha = 1.0 - vUv.y;
      float edgeFade = sin(vUv.x * 3.14159);
      gl_FragColor = vec4(uColor, alpha * edgeFade * 0.82);
    }
  `};class Hc{constructor(e,t,n=96,s=.22){this.maxPoints=n,this.width=s;const r=new Et,a=this.maxPoints*2;this.positions=new Float32Array(a*3),this.history=Array.from({length:this.maxPoints},()=>new R);const o=new Float32Array(a*2),l=[];for(let h=0;h<this.maxPoints-1;h++){const u=h*2;l.push(u,u+2,u+1,u+1,u+2,u+3)}for(let h=0;h<this.maxPoints;h++){const u=h/(this.maxPoints-1);o[h*4]=0,o[h*4+1]=u,o[h*4+2]=1,o[h*4+3]=u}r.setAttribute("position",new yt(this.positions,3).setUsage(Ji)),r.setAttribute("uv",new yt(o,2)),r.setIndex(l);const c=new Nt({uniforms:{uColor:{value:new Te(t).multiplyScalar(4.4)}},vertexShader:kc.vertexShader,fragmentShader:kc.fragmentShader,transparent:!0,depthWrite:!1,blending:es,side:St});this.mesh=new rt(r,c),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3,e.add(this.mesh)}maxPoints;width;mesh;positions;history;halfRight=new R;historyCount=0;update(e,t){const n=Math.min(this.historyCount,this.maxPoints-1);for(let r=n;r>0;r--)this.history[r].copy(this.history[r-1]);this.history[0].copy(e),this.historyCount=Math.min(this.historyCount+1,this.maxPoints),this.halfRight.copy(t).normalize().multiplyScalar(this.width*.5);for(let r=0;r<this.maxPoints;r++){const a=this.history[Math.min(r,this.historyCount-1)],o=r*6;this.positions[o]=a.x-this.halfRight.x,this.positions[o+1]=a.y-this.halfRight.y,this.positions[o+2]=a.z-this.halfRight.z,this.positions[o+3]=a.x+this.halfRight.x,this.positions[o+4]=a.y+this.halfRight.y,this.positions[o+5]=a.z+this.halfRight.z}const s=this.mesh.geometry.getAttribute("position");s.needsUpdate=!0}lastPoint(){return this.historyCount>0?this.history[0]:null}clear(){this.historyCount=0}}function P_(){return new Nt({uniforms:{uColor:{value:new Te(16768896).multiplyScalar(1.85)}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 localPosition = instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * localPosition;
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float lengthFade = pow(vUv.y, 2.15);
        float edgeFade = sin(vUv.x * 3.14159);
        gl_FragColor = vec4(uColor, lengthFade * edgeFade * 0.085);
      }
    `,transparent:!0,depthWrite:!1,blending:es,side:St})}function L_(){const i=new Float32Array([-2.1,.38,-1.55,-2.1,.38,1.55,-16.5,.42,-4.1,-16.5,.42,4.1,-30,.46,-5.8,-30,.46,5.8]),e=new Float32Array([.34,0,.66,0,.16,.55,.84,.55,0,1,1,1]),t=new Et;t.setAttribute("position",new yt(i,3)),t.setAttribute("uv",new yt(e,2)),t.setIndex([0,2,1,1,2,3,2,4,3,3,4,5]);const n=new Nt({uniforms:{uColor:{value:new Te(16773053).multiplyScalar(1.55)}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float center = pow(sin(vUv.x * 3.14159), 1.25);
        float falloff = pow(1.0 - vUv.y, 1.3);
        float fadeIn = smoothstep(0.0, 0.18, vUv.y);
        gl_FragColor = vec4(uColor, center * falloff * fadeIn * 0.062);
      }
    `,transparent:!0,depthWrite:!1,blending:es,side:St}),s=new rt(t,n);return s.frustumCulled=!1,s.renderOrder=2,s}const ys=new Rt,fn=new Te,Ia=240,As=4,Ua=(As+1)*2,D_=["KEEP YOUR LANE","SMOOTH IS FAST","CHECK MIRRORS","DRIVE AHEAD","MIND THE GAP","CRUISE CLEAN","LOOK FAR","SIGNAL EARLY"],I_=[30,50,70];function U_(){const i=document.createElement("canvas");i.width=64,i.height=128;const e=i.getContext("2d");e.fillStyle="#f1f5f9",e.fillRect(0,0,64,128);const t=4,n=12,s=64/t,r=128/n;for(let o=0;o<n;o++)for(let l=0;l<t;l++){const c=Math.sin(o*12.9898+l*78.233)*43758.5453%1;Math.abs(c)>.6?e.fillStyle="#fff59d":e.fillStyle="#1e293b",e.fillRect(l*s+3,o*r+3,s-6,r-6)}const a=new cs(i);return a.wrapS=Yn,a.wrapT=Yn,a}function N_(i=0){const e=document.createElement("canvas");e.width=96,e.height=256;const t=e.getContext("2d");t.fillStyle="#d8e3e4",t.fillRect(0,0,e.width,e.height),t.fillStyle="#6e9298",t.fillRect(0,0,e.width,5),t.fillRect(0,e.height-7,e.width,7);const n=6,s=24,r=e.width/n,a=e.height/s;for(let l=0;l<s;l++)for(let c=0;c<n;c++){const h=Q(i+l*19.7+c*53.1);t.fillStyle=h>.68?"#fff0a3":h>.36?"#375867":"#183241",t.fillRect(c*r+4,l*a+4,r-8,a-6)}const o=new cs(e);return o.wrapS=Yn,o.wrapT=Yn,o}function F_(i,e){const t=document.createElement("canvas");t.width=512,t.height=256;const n=t.getContext("2d"),s=Math.floor(170+Q(e)*180);n.fillStyle=`hsl(${s}, 44%, 34%)`,n.fillRect(0,0,t.width,t.height),n.fillStyle="rgba(255,255,255,0.09)",n.fillRect(0,0,t.width,42),n.fillRect(0,t.height-34,t.width,34),n.strokeStyle="#c9d8d4",n.lineWidth=10,n.strokeRect(12,12,t.width-24,t.height-24),n.fillStyle="#d9e8e3",n.textAlign="center",n.textBaseline="middle",n.font="700 54px system-ui, sans-serif";const r=i.split(" ");return r.length>2?(n.fillText(r.slice(0,2).join(" "),t.width/2,102),n.fillText(r.slice(2).join(" "),t.width/2,162)):n.fillText(i,t.width/2,t.height/2),n.font="700 20px system-ui, sans-serif",n.fillText("SLIMULATOR",t.width/2,t.height-28),new cs(t)}function O_(i){const e=document.createElement("canvas");e.width=192,e.height=240;const t=e.getContext("2d");return t.fillStyle="#d9e0dc",Ur(t,18,14,e.width-36,e.height-28,14),t.fill(),t.strokeStyle="#283238",t.lineWidth=8,Ur(t,18,14,e.width-36,e.height-28,14),t.stroke(),t.fillStyle="#283238",t.textAlign="center",t.textBaseline="middle",t.font="800 28px system-ui, sans-serif",t.fillText("SPEED",e.width/2,58),t.fillText("LIMIT",e.width/2,92),t.font="900 86px system-ui, sans-serif",t.fillText(String(i),e.width/2,162),new cs(e)}function B_(i){const e=document.createElement("canvas");e.width=512,e.height=256;const t=e.getContext("2d"),n=i.split(`
`);return t.fillStyle="#163b3f",Ur(t,16,16,e.width-32,e.height-32,18),t.fill(),t.strokeStyle="#c7d7d2",t.lineWidth=8,Ur(t,16,16,e.width-32,e.height-32,18),t.stroke(),t.fillStyle="#d3e1dd",t.textAlign="center",t.textBaseline="middle",t.font="900 54px system-ui, sans-serif",t.fillText(n[0]??"",e.width/2,92),t.font="900 72px system-ui, sans-serif",t.fillText(n[1]??"",e.width/2,164),new cs(e)}function Ur(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.lineTo(e+n-r,t),i.quadraticCurveTo(e+n,t,e+n,t+r),i.lineTo(e+n,t+s-r),i.quadraticCurveTo(e+n,t+s,e+n-r,t+s),i.lineTo(e+r,t+s),i.quadraticCurveTo(e,t+s,e,t+s-r),i.lineTo(e,t+r),i.quadraticCurveTo(e,t,e+r,t),i.closePath()}function mr(i){return i==="l2"?4099:i==="l3"?9970:0}function z_(i,e){return e==="unmapped"?`EXITING
HWY`:i==="unmapped"?`ENTERING
HWY`:`ENTERING
${e.toUpperCase()} HWY`}class G_{constructor(e,t){this.scene=e,this.road=t;const n=U_();this.buildingMesh=this.createInstanced(new Ye(1,1,1),new lt({map:n,color:16777215}),180,!0),this.buildingCaps=this.createInstanced(new Ye(1,1,1),new lt({color:11850186}),180,!0),this.treeTrunks=this.createInstanced(new as(.45,.55,1,5),new lt({color:2970697}),180,!0),this.treeCrowns=this.createInstanced(Gc(),new lt({color:3832929}),260,!0),this.roadsideBrush=this.createInstanced(Gc(),new lt({color:3501910}),420,!0),this.trafficPoles=this.createInstanced(new Ye(1,1,1),new lt({color:7904160}),90,!0),this.trafficLights=this.createInstanced(new Ye(1,1,1),new lt({color:1059374,emissive:new Te(6156186).multiplyScalar(4.2),emissiveIntensity:1}),90,!1),this.utilityPoles=this.createInstanced(new Ye(1,1,1),new lt({color:2111805}),180,!0),this.utilityCrossbars=this.createInstanced(new Ye(1,1,1),new lt({color:1913912}),300,!0),this.utilityWires=this.createInstanced(new Ye(1,1,1),new $t({color:794661,transparent:!0,opacity:.72}),420,!1);const s=new Qo(2.2,5.8,8,1,!0);s.translate(0,-2.9,0),this.streetlightCones=this.createInstanced(s,P_(),180,!1),this.crosswalkPaint=this.createCrosswalkPaint(),this.crosswalkLampPosts=this.createInstanced(new Ye(1,1,1),new lt({color:9087402}),64,!0),this.crosswalkLampHeads=this.createInstanced(new Ye(1,1,1),new lt({color:16773296,emissive:new Te(16768378).multiplyScalar(3.8),emissiveIntensity:1}),64,!1),this.reflectorMesh=this.createInstanced(new Ye(1,1,1),new lt({color:14350207,emissive:new Te(14282842).multiplyScalar(4.6),emissiveIntensity:1}),180,!1),this.guardrailPosts=this.createInstanced(new Ye(1,1,1),new lt({color:8163987}),280,!0),this.pedestrianBodies=this.createInstanced(new Ye(1,1,1),new lt({color:14179176}),48,!0),this.pedestrianHeads=this.createInstanced(new el(1,8,6),new lt({color:15844751}),48,!0),this.pedestrianArms=this.createInstanced(new Ye(1,1,1),new lt({color:15844751}),96,!0),this.pedestrianLegs=this.createInstanced(new Ye(1,1,1),new lt({color:2700093}),96,!0),this.buildingWings=this.createInstanced(new Ye(1,1,1),new lt({map:n,color:16777215}),180,!0),this.urbanBlocks=this.createInstanced(new Ye(1,1,1),new lt({map:n,color:16777215}),180,!0),this.urbanRoofCaps=this.createInstanced(new Ye(1,1,1),new lt({color:9680059}),180,!0),this.shopBuildings=this.createInstanced(new Ye(1,1,1),new lt({color:13359058}),56,!0),this.shopAwnings=this.createInstanced(new Ye(1,1,1),new lt({color:5154481}),56,!0),this.bulkStores=this.createInstanced(new Ye(1,1,1),new lt({color:12043977}),42,!0),this.parkingLots=this.createInstanced(new Ye(1,1,1),new lt({color:2502708}),86,!1),this.parkingStripes=this.createInstanced(new Ye(1,1,1),new $t({color:14279391}),220,!1),this.skyscrapers=this.createInstanced(new Ye(1,1,1),new lt({map:N_(this.road.seed),color:16777215}),54,!0),this.billboardPosts=this.createInstanced(new Ye(1,1,1),new lt({color:2241080}),120,!0),this.speedSignPosts=this.createInstanced(new Ye(1,1,1),new lt({color:13358546}),56,!0),this.transitionSignPosts=this.createInstanced(new Ye(1,1,1),new lt({color:7310216}),8,!0),this.billboardMaterials=D_.map((r,a)=>new $t({map:F_(r,this.road.seed+a*127.3),color:11911870,side:St,fog:!0})),this.speedSignMaterials=new Map(I_.map(r=>[r,new $t({map:O_(r),color:12108477,side:St,fog:!0})])),this.createPlanePool(this.billboardFaces,38,this.billboardMaterials[0],!0),this.createPlanePool(this.speedSignFaces,24,this.speedSignMaterials.get(30),!0),this.createPlanePool(this.transitionSignFaces,4,this.transitionSignMaterial(`ENTERING
HWY`),!0)}scene;road;buildingMesh;buildingCaps;treeTrunks;treeCrowns;roadsideBrush;trafficPoles;trafficLights;utilityPoles;utilityCrossbars;utilityWires;streetlightCones;crosswalkPaint;crosswalkLampPosts;crosswalkLampHeads;reflectorMesh;guardrailPosts;pedestrianBodies;pedestrianHeads;pedestrianArms;pedestrianLegs;urbanBlocks;urbanRoofCaps;buildingWings;shopBuildings;shopAwnings;bulkStores;parkingLots;parkingStripes;skyscrapers;billboardPosts;speedSignPosts;transitionSignPosts;billboardFaces=[];billboardMaterials;speedSignFaces=[];speedSignMaterials;transitionSignFaces=[];transitionSignMaterials=new Map;qualityMode="high";lastUpdateKey="";speedSignScene=null;speedSignSessionStartedAt="";speedSignAnchor=0;setQualityMode(e){this.qualityMode!==e&&(this.qualityMode=e,this.lastUpdateKey="")}update(e,t){const n=this.qualityMode==="high"?{backDistance:50,forwardDistance:420,timeHz:8,density:1}:{backDistance:36,forwardDistance:260,timeHz:4,density:.54},s=e.road.transition,r=s?`${s.from}:${s.to}:${Math.floor(s.progress*1e3)}`:"",a=Math.floor((e.vehicle.roadPositionM-n.backDistance)/18),o=Math.ceil((e.vehicle.roadPositionM+n.forwardDistance)/18),l=Math.floor(t*n.timeHz),c=`${this.qualityMode}:${a}:${o}:${l}:${e.road.scene}:${r}`;if(c===this.lastUpdateKey)return;this.lastUpdateKey=c;const h=e.vehicle.roadPositionM;let u=0,d=0,m=0,g=0,v=0,f=0,p=0,M=0,E=0,S=0,A=0,y=0,C=0,x=0,w=0,L=0,D=0,N=0,q=0,K=0,B=0,X=0,H=0;for(let ne=a;ne<=o;ne++){const re=ne*18,nt=this.road.scenerySceneAt(re),Qe=Vt[nt],We=Qe.city,$=Qe.forest,he=Qe.crosswalks,te=Qe.trafficLights,Ce=Qe.buildingScale,Fe=Qe.buildingSetback,Re=Qe.skylineDensity,vt=Qe.buildings*n.density,Xe=Qe.trees*(this.qualityMode==="high"?1:.48),ke=Ce,ze=Re*1.45,Je=Re>.01,je=(this.road.seed+mr(nt))%1e4,et=this.road.boundsAt(re),Tt=this.road.frameAt(re),Ze=Math.PI+Tt.heading;for(const De of[et.leftWall,et.rightWall]){if(L<this.capacity(this.guardrailPosts)){const P=this.road.worldFromRoad(re,De,.4);st(this.guardrailPosts,L++,P.x,P.y,P.z,.16,.8,.16,Ze)}if(w<this.capacity(this.reflectorMesh)){const P=this.road.worldFromRoad(re,De,.62);st(this.reflectorMesh,w++,P.x,P.y,P.z,.1,.18,.75,Ze)}}if(We<.72&&Ce<1.2){const De=Math.min(.96,.38+$*.58+(1-We)*.2);for(let P=0;P<2&&!(v>=this.capacity(this.roadsideBrush));P++){const qe=P?1:-1,Me=ne*17.13+P*47.9+je;if(Q(Me)>De)continue;const T=re+(Q(Me+2)-.5)*15,_=_e(.55,1.35,Q(Me+3)),U=_e(.95,2.75,Q(Me+5)),O=_e(.9,2.65,Q(Me+7)),z=qe<0?et.leftWall:et.rightWall,ee=Math.max(3.4,U*1.55+1.35+Q(Me+1)*3.8),ae=z+qe*ee,W=this.road.worldFromRoad(T,ae,_*.52);st(this.roadsideBrush,v,W.x,W.y,W.z,U,_,O,Ze+(Q(Me+11)-.5)*.52),this.roadsideBrush.setColorAt(v,fn.setHSL(.41+Q(Me+13)*.08,.36,.3+Q(Me+17)*.14)),v++}}if(he>.35&&(ne-4)%44===0){const De=Math.max(4,Math.floor(et.roadWidth/.82)),P=et.roadWidth-.62,qe=5.2,Me=Math.min(.48,P/(De*1.55)),T=-P/2+Me/2,_=P/Math.max(1,De-1);for(let O=0;O<De&&y<this.crosswalkPaint.maxStripes;O++){const z=T+O*_;this.writeCrosswalkStripe(y++,re,z,Me,qe,.074)}for(const O of[et.leftEdge-1.35,et.rightEdge+1.35]){if(C<this.capacity(this.crosswalkLampPosts)){const z=this.road.worldFromRoad(re-.85,O,2.35);st(this.crosswalkLampPosts,C++,z.x,z.y,z.z,.13,4.7,.13,Ze)}if(x<this.capacity(this.crosswalkLampHeads)){const z=this.road.worldFromRoad(re-.85,O,4.85);st(this.crosswalkLampHeads,x++,z.x,z.y,z.z,.52,.18,.34,Ze+Math.PI/2)}if(A<this.capacity(this.streetlightCones)){const z=this.road.worldFromRoad(re-.85,O,4.78);st(this.streetlightCones,A++,z.x,z.y,z.z,.72,.72,.72,Ze)}}const U=this.road.pedestrianAt(ne,t);if(U.active&&D<this.capacity(this.pedestrianBodies)&&N<this.capacity(this.pedestrianHeads)&&q+1<this.capacity(this.pedestrianArms)&&K+1<this.capacity(this.pedestrianLegs)){const O=Math.sin(t*2.2+ne)*.08,z=Math.sin(t*3.1+ne)*.08,ee=this.road.worldFromRoad(re-1.3,U.lateral+O,.82);st(this.pedestrianBodies,D++,ee.x,ee.y,ee.z,.26,.68,.2,Ze);const ae=this.road.worldFromRoad(re-1.3,U.lateral+O,1.28);st(this.pedestrianHeads,N++,ae.x,ae.y,ae.z,.18,.2,.18,Ze);for(const W of[-.22,.22]){const Y=this.road.worldFromRoad(re-1.3,U.lateral+O+W,.78);st(this.pedestrianArms,q++,Y.x,Y.y,Y.z,.06,.48,.07,Ze)}for(const W of[-.07,.07]){const Y=this.road.worldFromRoad(re-1.3+z*Math.sign(W),U.lateral+O+W,.3);st(this.pedestrianLegs,K++,Y.x,Y.y,Y.z,.07,.52,.08,Ze)}}if(te>.45)for(const O of[et.leftEdge-3.4,et.rightEdge+3.4]){const z=this.road.worldFromRoad(re+2.8,O,2.65);f<this.capacity(this.trafficPoles)&&st(this.trafficPoles,f++,z.x,z.y,z.z,.14,5.3,.14,Ze),p<this.capacity(this.trafficLights)&&st(this.trafficLights,p++,z.x,5.15,z.z,.46,.8,.24,Ze)}}if(Je&&ne%(ze>1.1?2:3)===0)for(let De=0;De<2&&!(B>=this.capacity(this.urbanBlocks)||X>=this.capacity(this.urbanRoofCaps));De++){if(this.reservesBillboardSlot(ne,De))continue;const P=De?1:-1,qe=ne*23.9+De*71.1+je,Me=(P<0?et.leftWall:et.rightWall)+P*(Fe+_e(12,36,Q(qe))),T=_e(ze>1.1?42:24,ze>1.1?100:52,Q(qe+3))*Re,_=_e(ze>1.1?16:12,ze>1.1?38:28,Q(qe+5))*Re,U=_e(ze>1.1?18:14,ze>1.1?42:32,Q(qe+7))*Re,O=re+(Q(qe+11)-.5)*7,z=this.road.worldFromRoad(O,Me,T/2);st(this.urbanBlocks,B,z.x,z.y,z.z,_,T,U,Ze+(Q(qe+13)-.5)*.18),this.urbanBlocks.setColorAt(B,fn.setHSL(.53+Q(qe+17)*.06,.26,.42+Q(qe+19)*.18));const ee=this.road.worldFromRoad(O,Me,T+.42);st(this.urbanRoofCaps,X,ee.x,ee.y,ee.z,_*.78,.48,U*.78,Ze),this.urbanRoofCaps.setColorAt(X,fn.setHSL(.47+Q(qe+29)*.08,.18,.58+Q(qe+31)*.12)),B++,X++}if(ne%4===0&&We<.55&&Ce<1.15)for(const De of[et.leftWall-2.8,et.rightWall+2.8]){if(M>=this.capacity(this.utilityPoles))break;const P=this.road.worldFromRoad(re+3,De,4.15);st(this.utilityPoles,M++,P.x,P.y,P.z,.18,8.3,.18,Ze);const qe=this.road.worldFromRoad(re+3,De,7.2);if(st(this.utilityCrossbars,E++,qe.x,qe.y,qe.z,.12,.12,4.3,Ze+Math.PI/2),E<this.capacity(this.utilityCrossbars)){const Me=this.road.worldFromRoad(re+3,De,7.68);st(this.utilityCrossbars,E++,Me.x,Me.y,Me.z,.09,.09,2.7,Ze+Math.PI/2)}if(this.qualityMode==="high"&&re>=h+28)for(const Me of[-1.35,-.45,.45,1.35]){if(S>=this.capacity(this.utilityWires))break;const T=this.road.worldFromRoad(re+58,De+Me,7.74+Math.abs(Me)*.04);st(this.utilityWires,S++,T.x,T.y,T.z,.016,.016,46,Ze)}if(this.qualityMode==="high"&&A<this.capacity(this.streetlightCones)){const Me=De<0?1.7:-1.7,T=this.road.worldFromRoad(re+3,De+Me,6.9);st(this.streetlightCones,A++,T.x,T.y,T.z,1,1,1,Ze)}}for(let De=0;De<2;De++){if(this.reservesBillboardSlot(ne,De))continue;const P=De?1:-1,qe=Q(ne*11.17+De*43+je),Me=re+(Q(ne*5.13+De)-.5)*12,T=this.road.boundsAt(Me),_=P<0?T.leftWall:T.rightWall,U=$>.45?8.2:ke>0?6.6:13.5,O=$>.45?38:ke>1.1?30:ke>0?28:44,z=_+P*_e(U,O,qe),ee=ke>.05&&Re>.05&&ne>a+2&&ne%(ke>1.1?2:4)===De,ae=this.road.frameAt(Me),W=Math.PI+ae.heading,Y=ee?1:qc(tt((vt-qe+.16)/.34,0,1));if(ke>0&&Y>.04){if(u>=this.capacity(this.buildingMesh)||d>=this.capacity(this.buildingCaps))continue;const ie=ne*12.31+De*91.7+je,be=ee?1:_e(.38,1,Y),ce=(ee?_e(18,ke>1.1?66:38,Q(ie+5)):_e(10,ke>1.1?58:44,Math.pow(Q(ie),.75)))*ke*be,ye=_e(6.5,ke>1.1?26:20,Q(ie+3))*_e(.72,1,be),Pe=_e(7,ke>1.1?30:22,Q(ie+7))*_e(.72,1,be),I=Math.sqrt(ye*ye+Pe*Pe)/2+Fe,oe=(Q(ie+11)-.5)*2.8,Z=_e(4,24,Q(ie+2)),de=_+P*(I+Z)+oe,pe=P<0?Math.min(_-I,de):Math.max(_+I,de),j=this.road.worldFromRoad(Me,pe,ce/2);st(this.buildingMesh,u,j.x,j.y,j.z,ye,ce,Pe,W+(Q(ie+13)-.5)*.4),this.buildingMesh.setColorAt(u,fn.setHSL(.54+Q(ie+17)*.08,.28,.34+Q(ie+19)*.22));const Ae=this.road.worldFromRoad(Me,pe,ce+.35);if(st(this.buildingCaps,d++,Ae.x,Ae.y,Ae.z,ye*.78,.48,Pe*.78,W),u++,this.qualityMode==="high"&&Q(ie+37)>.36&&H<this.capacity(this.buildingWings)){const Ee=ye*_e(.4,.75,Q(ie+41)),bt=ce*_e(.35,.8,Q(ie+43)),dt=Pe*_e(.4,.75,Q(ie+47)),Vr=pe+P*(ye+Ee)/2,us=this.road.worldFromRoad(Me,Vr,bt/2);st(this.buildingWings,H++,us.x,us.y,us.z,Ee,bt,dt,W),this.buildingWings.setColorAt(H-1,fn.setHSL(.53+Q(ie+59)*.08,.26,.3+Q(ie+61)*.18))}}else{const ie=Math.floor(Xe)+(qe<Xe%1?1:0);for(let be=0;be<ie&&!(m>=this.capacity(this.treeTrunks)||g>=this.capacity(this.treeCrowns));be++){const le=ne*15.41+De*59.3+be*113.7+je,ce=$>.45?_e(7.4,21,Q(le)):_e(5.4,14.6,Q(le)),ye=z+(Q(le+11)-.5)*8,Pe=Me+(Q(le+13)-.5)*10,Be=this.road.worldFromRoad(Pe,ye,0),I=ce*.44;st(this.treeTrunks,m++,Be.x,I*.5,Be.z,.62,I,.62,W);const oe=$>.45?1.34:1.08,Z=this.road.worldFromRoad(Pe,ye,I);st(this.treeCrowns,g,Z.x,Z.y,Z.z,3.3*oe,2.5*oe,3*oe,Q(le+19)*zt),this.treeCrowns.setColorAt(g,fn.setHSL(.42+Q(le+23)*.05,.46,.28+Q(le+29)*.14)),g++}}}}for(const ne of[42,56]){const re=Math.floor((h-n.backDistance)/ne),nt=Math.ceil((h+n.forwardDistance)/ne);for(let Qe=re;Qe<=nt;Qe++){const We=Qe*ne,$=this.road.scenerySceneAt(We),he=Vt[$],te=he.skylineDensity;if(te<=.01)continue;const Ce=te*1.45;if(Ce>1.1&&ne!==42||Ce<=1.1&&ne!==56)continue;const Fe=he.buildingSetback,Re=(this.road.seed+mr($))%1e4,vt=this.road.boundsAt(We),Xe=this.road.frameAt(We),ke=Math.PI+Xe.heading;for(let ze=0;ze<2&&!(B>=this.capacity(this.urbanBlocks)||X>=this.capacity(this.urbanRoofCaps));ze++){const Je=ze?1:-1,je=Qe*31.7+ze*79.3+Re,et=(Je<0?vt.leftWall:vt.rightWall)+Je*(Fe+_e(36,90,Q(je))),Tt=_e(Ce>1.1?48:24,Ce>1.1?110:48,Q(je+3)),Ze=_e(Ce>1.1?18:12,Ce>1.1?42:28,Q(je+5)),Mt=_e(Ce>1.1?20:14,Ce>1.1?46:32,Q(je+7)),De=Tt*te,P=Ze*te,qe=Mt*te,Me=this.road.worldFromRoad(We+(Q(je+11)-.5)*5,et,De/2);st(this.urbanBlocks,B,Me.x,Me.y,Me.z,P,De,qe,ke+(Q(je+13)-.5)*.16),this.urbanBlocks.setColorAt(B,fn.setHSL(.53+Q(je+17)*.06,.26,.46+Q(je+19)*.18));const T=this.road.worldFromRoad(We,et,De+.42);st(this.urbanRoofCaps,X,T.x,T.y,T.z,P*.76,.5,qe*.76,ke),this.urbanRoofCaps.setColorAt(X,fn.setHSL(.47+Q(je+29)*.08,.18,.58+Q(je+31)*.14)),B++,X++}}}const J=this.writeLandmarks(a,o),se=this.writeSpeedSigns(e,a,o),fe=this.writeTransitionSign(e,a,o);this.applyCrosswalkCount(y),this.applyCounts([[this.buildingMesh,u],[this.buildingCaps,d],[this.buildingWings,H],[this.treeTrunks,m],[this.treeCrowns,g],[this.roadsideBrush,v],[this.trafficPoles,f],[this.trafficLights,p],[this.utilityPoles,M],[this.utilityCrossbars,E],[this.utilityWires,S],[this.streetlightCones,A],[this.crosswalkLampPosts,C],[this.crosswalkLampHeads,x],[this.reflectorMesh,w],[this.guardrailPosts,L],[this.pedestrianBodies,D],[this.pedestrianHeads,N],[this.pedestrianArms,q],[this.pedestrianLegs,K],[this.urbanBlocks,B],[this.urbanRoofCaps,X],[this.shopBuildings,J.shop],[this.shopAwnings,J.awning],[this.bulkStores,J.bulk],[this.parkingLots,J.lot],[this.parkingStripes,J.stripe],[this.skyscrapers,J.tower],[this.billboardPosts,J.billboardPost],[this.speedSignPosts,se.post],[this.transitionSignPosts,fe.post]]),this.hidePlanePool(this.billboardFaces,J.billboardFace),this.hidePlanePool(this.speedSignFaces,se.face),this.hidePlanePool(this.transitionSignFaces,fe.face)}writeLandmarks(e,t){const n={shop:0,awning:0,bulk:0,lot:0,stripe:0,tower:0,billboardPost:0,billboardFace:0},s=this.qualityMode==="high"?4:6;for(let r=e;r<=t;r++){const a=this.road.scenerySceneAt(r*18),o=mr(a),l=this.road.seed+o,c=1;if(Vc(r+Math.floor(o/997),s)===0)for(let h=0;h<2;h++){const u=Da(a,r,h,l,8);if(u.variant==="standard"||this.qualityMode==="perf"&&Q(l+r*13.1+h*71.7)>.66)continue;const d=u.variant==="bulk"?20:u.variant==="skyscraper"?14:u.variant==="billboard"?11:8,m=Da(a,r,h,l,d),g=r*18+m.sOffset,v=xn(a,g,m.lateral,0,this.road.seed),f=Math.PI+v.heading+m.rotationJitter,p=v.heading+m.rotationJitter*.3,M=l+r*29.7+h*97.3,E=tt(c*_e(.88,1.08,Q(M+1)),0,1);if(!(E<.035)){if(m.variant==="shop"){if(n.shop>=this.capacity(this.shopBuildings)||n.awning>=this.capacity(this.shopAwnings))continue;const S=_e(7.8,11.8,Q(M+3))*_e(.72,1,E),A=_e(3.3,5,Q(M+5))*E,y=_e(6.4,9,Q(M+7))*_e(.78,1,E),C=xn(a,g,m.lateral,A*.5,this.road.seed);st(this.shopBuildings,n.shop,C.x,C.y,C.z,S,A,y,f),this.shopBuildings.setColorAt(n.shop,fn.setHSL(.48+Q(M+13)*.12,.22,.62+Q(M+17)*.13)),n.shop++;const x=xn(a,g-m.side*.2,m.lateral-m.side*S*.18,Math.max(1.1,A*.66),this.road.seed);st(this.shopAwnings,n.awning,x.x,x.y,x.z,S*.82,.34*E,1.1*E,f),this.shopAwnings.setColorAt(n.awning,fn.setHSL(.02+Q(M+19)*.56,.54,.48)),n.awning++,this.writeParkingLot(n,a,g,m.side,m.clearance,f,11.5,14.5,E,M);continue}if(m.variant==="bulk"){if(n.bulk>=this.capacity(this.bulkStores))continue;const S=_e(24,36,Q(M+23))*_e(.72,1,E),A=_e(5.5,8.5,Q(M+29))*E,y=_e(14,22,Q(M+31))*_e(.78,1,E),C=xn(a,g,m.lateral,A*.5,this.road.seed);st(this.bulkStores,n.bulk,C.x,C.y,C.z,S,A,y,f),this.bulkStores.setColorAt(n.bulk,fn.setHSL(.52+Q(M+37)*.08,.16,.56+Q(M+41)*.12)),n.bulk++,this.writeParkingLot(n,a,g,m.side,m.clearance,f,24,32,E,M+47);continue}if(m.variant==="skyscraper"){if(n.tower>=this.capacity(this.skyscrapers))continue;const S=_e(10,18,Q(M+43))*_e(.72,1,E),A=_e(48,112,Q(M+47))*E,y=_e(10,22,Q(M+53))*_e(.72,1,E),C=xn(a,g,m.lateral,A*.5,this.road.seed);st(this.skyscrapers,n.tower,C.x,C.y,C.z,S,A,y,f+(Q(M+59)-.5)*.12),this.skyscrapers.setColorAt(n.tower,fn.setHSL(.54+Q(M+61)*.08,.22,.5+Q(M+67)*.14)),n.tower++;continue}if(m.variant==="billboard"){if(n.billboardPost+1>=this.capacity(this.billboardPosts)||n.billboardFace>=this.planeCapacity(this.billboardFaces))continue;const S=_e(13,18,Q(M+71))*_e(.72,1,E),A=_e(5.8,8.5,Q(M+73))*E,y=4.6+A*.54;for(const w of[-S*.42,S*.42]){const L=xn(a,g,m.lateral+w,y*.5,this.road.seed);st(this.billboardPosts,n.billboardPost++,L.x,L.y,L.z,.26,y,.26,f)}const C=xn(a,g,m.lateral,y+A*.12,this.road.seed),x=Math.floor(Q(M+79)*this.billboardMaterials.length)%this.billboardMaterials.length;this.setPlane(this.billboardFaces,n.billboardFace++,C.x,C.y,C.z,S,A,p,this.billboardMaterials[x])}}}}return n}reservesBillboardSlot(e,t){const n=this.qualityMode==="high"?4:6,s=this.road.scenerySceneAt(e*18),r=mr(s);if(Vc(e+Math.floor(r/997),n)!==0)return!1;const a=this.road.seed+r;return Da(s,e,t,a,11).variant==="billboard"}writeParkingLot(e,t,n,s,r,a,o,l,c,h){if(e.lot>=this.capacity(this.parkingLots))return;const u=r+s*(2.8+o*.5),d=n+(Q(h+3)-.5)*2.5,m=xn(t,d,u,.055,this.road.seed);if(st(this.parkingLots,e.lot++,m.x,m.y,m.z,o*_e(.7,1,c),.08,l*_e(.72,1,c),a),c<.34)return;const g=this.qualityMode==="high"?5:3;for(let v=0;v<g&&e.stripe<this.capacity(this.parkingStripes);v++){const f=v/(g-1),p=d+_e(-l*.34,l*.34,f),M=xn(t,p,u,.12,this.road.seed);st(this.parkingStripes,e.stripe++,M.x,M.y,M.z,o*.58,.035,.11,a)}}writeSpeedSigns(e,t,n){const s={post:0,face:0};if(e.road.transition)return s;const r=e.road.scene,a=e.session.startedAt??"";(this.speedSignScene!==r||this.speedSignSessionStartedAt!==a)&&(this.speedSignScene=r,this.speedSignSessionStartedAt=a,this.speedSignAnchor=Math.ceil((e.vehicle.roadPositionM+76)/18));const o=Vt[r].speedLimitMph,l=this.speedSignMaterials.get(o);if(!l||this.speedSignAnchor<t||this.speedSignAnchor>n)return s;const c=Fh(r);if(s.post>=this.capacity(this.speedSignPosts)||s.face>=this.planeCapacity(this.speedSignFaces))return s;const h=this.speedSignAnchor*18+7,u=c.rightWall+3,d=2.27,m=2.12,g=1.7,v=xn(r,h,u,d*.5,this.road.seed);st(this.speedSignPosts,s.post++,v.x,v.y,v.z,.12,d,.12,v.heading);const f=d+.16+m*.5,p=xn(r,h,u,f,this.road.seed);return this.setPlane(this.speedSignFaces,s.face++,p.x,p.y,p.z,g,m,p.heading,l),s}writeTransitionSign(e,t,n){const s={post:0,face:0},r=e.road.transition;if(!r)return s;const a=r.originS+Math.min(82,Math.max(58,(r.taperStartS-r.originS)*.28)),o=Math.floor(a/18);if(o<t||o>n||s.face>=this.planeCapacity(this.transitionSignFaces)||s.post+2>this.capacity(this.transitionSignPosts))return s;const l=z_(r.from,r.to),c=this.transitionSignMaterial(l),u=this.road.boundsAt(a).rightEdge+4.2,d=3.55,m=6.9,g=2.75,f=this.road.worldFromRoad(a,u,0).heading;for(const E of[-m*.34,m*.34]){const S=this.road.worldFromRoad(a,u+E,d*.5);st(this.transitionSignPosts,s.post++,S.x,S.y,S.z,.16,d,.16,f)}const p=d+.22+g*.5,M=this.road.worldFromRoad(a,u,p);return this.setPlane(this.transitionSignFaces,s.face++,M.x,M.y,M.z,m,g,f,c),s}transitionSignMaterial(e){const t=this.transitionSignMaterials.get(e);if(t)return t;const n=new $t({map:B_(e),color:12700872,side:St,fog:!0});return this.transitionSignMaterials.set(e,n),n}createInstanced(e,t,n,s){const r=new xu(e,t,n);return r.instanceMatrix.setUsage(Ji),r.castShadow=s,r.receiveShadow=s,r.frustumCulled=!1,this.scene.add(r),r}createPlanePool(e,t,n,s){for(let r=0;r<t;r++){const a=new rt(new Ti(1,1),n);a.visible=!1,a.castShadow=s,a.receiveShadow=!1,a.frustumCulled=!1,this.scene.add(a),e.push(a)}}setPlane(e,t,n,s,r,a,o,l,c){const h=e[t];h&&(h.material=c,h.visible=!0,h.position.set(n,s,r),h.rotation.set(0,l,0),h.scale.set(a,o,1))}hidePlanePool(e,t){for(let n=0;n<e.length;n++)e[n].visible=n<t}createCrosswalkPaint(){const e=Ia*Ua,t=new Float32Array(e*3),n=new Float32Array(e*3),s=new Float32Array(e*2),r=[];for(let c=0;c<e;c++)n[c*3+1]=1;for(let c=0;c<Ia;c++){const h=c*Ua;for(let u=0;u<As;u++){const d=h+u*2,m=d+1,g=d+2,v=d+3;r.push(d,g,m,m,g,v)}}const a=new Et;a.setAttribute("position",new yt(t,3).setUsage(Ji)),a.setAttribute("normal",new yt(n,3)),a.setAttribute("uv",new yt(s,2).setUsage(Ji)),a.setIndex(r),a.setDrawRange(0,0);const o=new $t({color:15331047,depthWrite:!1,side:St}),l=new rt(a,o);return l.frustumCulled=!1,l.renderOrder=14,this.scene.add(l),{mesh:l,positions:t,uvs:s,maxStripes:Ia}}writeCrosswalkStripe(e,t,n,s,r,a){const o=e*Ua,l=s*.5,c=r*.5;for(let h=0;h<=As;h++){const u=h/As,d=t-c+u*r,m=this.road.worldFromRoad(d,n-l,a),g=this.road.worldFromRoad(d,n+l,a),v=(o+h*2)*3;this.crosswalkPaint.positions[v]=m.x,this.crosswalkPaint.positions[v+1]=m.y,this.crosswalkPaint.positions[v+2]=m.z,this.crosswalkPaint.positions[v+3]=g.x,this.crosswalkPaint.positions[v+4]=g.y,this.crosswalkPaint.positions[v+5]=g.z;const f=(o+h*2)*2;this.crosswalkPaint.uvs[f]=0,this.crosswalkPaint.uvs[f+1]=u,this.crosswalkPaint.uvs[f+2]=1,this.crosswalkPaint.uvs[f+3]=u}}applyCrosswalkCount(e){this.crosswalkPaint.mesh.visible=e>0,this.crosswalkPaint.mesh.geometry.setDrawRange(0,e*As*6),this.crosswalkPaint.mesh.geometry.getAttribute("position").needsUpdate=!0,this.crosswalkPaint.mesh.geometry.getAttribute("uv").needsUpdate=!0}applyCounts(e){for(const[t,n]of e)t.count=n,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}capacity(e){const t=e.instanceMatrix.array.length/16;return this.qualityMode==="high"?t:e===this.guardrailPosts||e===this.reflectorMesh?Math.floor(t*.7):e===this.pedestrianBodies||e===this.pedestrianHeads||e===this.pedestrianArms||e===this.pedestrianLegs?t:Math.floor(t*.52)}planeCapacity(e){return this.qualityMode==="high"?e.length:Math.floor(e.length*.55)}}function st(i,e,t,n,s,r,a,o,l=0){ys.position.set(t,n,s),ys.rotation.set(0,l,0),ys.scale.set(r,a,o),ys.updateMatrix(),i.setMatrixAt(e,ys.matrix)}function Vc(i,e){return(i%e+e)%e}class k_{constructor(e,t){this.physics=t,this.leftTrail=new Hc(e,16716083),this.rightTrail=new Hc(e,16716083),this.group.add(this.exterior);const n=this.createCar();this.headlightLeft=n.left,this.headlightRight=n.right,this.headlightBeam=n.beam,e.add(this.group)}physics;group=new Wn;exterior=new Wn;wheels=[];headlightLeft;headlightRight;headlightBeam;leftTrail;rightTrail;localTailLeft=new R(1.8,.45,-.55);localTailRight=new R(1.8,.45,.55);localRightAxis=new R(0,0,1);tailLeftWorld=new R;tailRightWorld=new R;carRightWorld=new R;wheelSteerAxis=new R(0,1,0);cameraMode="cockpit";setCameraMode(e){this.cameraMode=e;const t=e!=="cockpit";this.exterior.visible=t,this.headlightLeft.visible=t,this.headlightRight.visible=t,this.headlightBeam.visible=t,this.leftTrail.mesh.visible=t,this.rightTrail.mesh.visible=t}update(e,t){const n=e.vehicle.pose;this.group.position.set(n.x,n.y-.35,n.z),this.group.quaternion.copy(this.physics.chassisQuaternion()),this.group.updateMatrixWorld(!0),this.tailLeftWorld.copy(this.localTailLeft).applyMatrix4(this.group.matrixWorld),this.tailRightWorld.copy(this.localTailRight).applyMatrix4(this.group.matrixWorld),this.carRightWorld.copy(this.localRightAxis).applyQuaternion(this.group.quaternion);const s=this.cameraMode!=="cockpit",r=s?this.leftTrail.lastPoint():null;s?r&&r.distanceTo(this.tailLeftWorld)>10&&(this.leftTrail.clear(),this.rightTrail.clear()):(this.leftTrail.clear(),this.rightTrail.clear()),s&&(this.leftTrail.update(this.tailLeftWorld,this.carRightWorld),this.rightTrail.update(this.tailRightWorld,this.carRightWorld),this.updateWheels()),this.animateLights(t)}createCar(){const e=new si({color:15222863,roughness:.58,metalness:.1}),t=new si({color:6756899,roughness:.72,metalness:.05}),n=new si({color:2111563,emissive:new Te(927282).multiplyScalar(.8),emissiveIntensity:.5,roughness:.26,metalness:.08}),s=new si({color:1382427,roughness:.9}),r=new si({color:13883606,roughness:.5,metalness:.24}),a=new si({color:16774320,emissive:new Te(16769661).multiplyScalar(2),emissiveIntensity:2.2}),o=new si({color:16716066,emissive:new Te(16716066).multiplyScalar(3),emissiveIntensity:3}),l=new rt(new Ye(3.85,.54,1.7),e);l.position.y=.36,l.castShadow=!0,this.exterior.add(l);const c=new rt(new Ye(3.95,.18,1.86),t);c.position.y=.18,this.exterior.add(c);const h=new rt(new Ye(1.32,.7,1.25),e);h.position.set(.34,.9,0),h.castShadow=!0,this.exterior.add(h);const u=new rt(new Ye(.12,.46,1.12),n);u.position.set(-.34,1,0),u.rotation.z=-.2,this.exterior.add(u);const d=new rt(new Ye(.12,.42,1.08),n);d.position.set(.98,.98,0),d.rotation.z=.18,this.exterior.add(d);const m=new rt(new Ye(1,.12,1.14),t);m.position.set(.38,1.3,0),this.exterior.add(m);const g=new rt(new Ye(.12,.22,1.78),t);g.position.set(-1.98,.34,0),this.exterior.add(g);const v=new rt(new Ye(.12,.1,1.9),e);v.position.set(1.88,.86,0),v.castShadow=!0,this.exterior.add(v);for(let y=0;y<4;y++){const C=new Wn,x=new rt(new as(.36,.36,.28,14),s);x.rotation.x=Math.PI/2;const w=new rt(new as(.21,.21,.3,8),r);w.rotation.x=Math.PI/2,C.add(x,w),this.wheels.push(C),this.exterior.add(C)}const f=new rt(new Ye(.08,.12,.26),a);f.position.set(-2.02,.5,-.52);const p=f.clone();p.position.z=.52,this.group.add(f,p);const M=L_();this.group.add(M);const E=new Rt;E.position.set(-28,.05,0),this.group.add(E);for(const y of[-.52,.52]){const C=new Uu(16773053,4.2,82,.72,.98,1.08);C.position.set(-1.94,.58,y),C.target=E,C.castShadow=!1,this.group.add(C)}const S=new rt(new Ye(.08,.12,.26),o);S.position.set(1.94,.5,-.52);const A=S.clone();return A.position.z=.52,this.exterior.add(S,A),{left:f,right:p,beam:M}}animateLights(e){const t=.75+Math.sin(e*4.4)*.12;this.headlightLeft.scale.set(1,t,1),this.headlightRight.scale.set(1,t,1),this.headlightBeam.scale.set(1,1,.96+t*.06)}updateWheels(){const e=this.physics.wheelVisuals();for(let t=0;t<this.wheels.length;t++){const n=e[t],s=this.wheels[t];s.position.copy(n.position),s.quaternion.setFromAxisAngle(this.wheelSteerAxis,n.steering),s.rotateZ(n.rotation)}}}class H_{constructor(e,t,n){this.road=t,this.physics=n,this.renderer=new V0({canvas:e,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7)),this.renderer.outputColorSpace=on,this.renderer.toneMapping=Fr,this.renderer.toneMappingExposure=1.16,this.renderer.shadowMap.enabled=!1,this.scene=new du,this.camera=new ln(68,1,.08,1800),this.camera.rotation.order="YXZ",this.composer=new c_(this.renderer),this.composer.addPass(new d_(this.scene,this.camera)),this.bloom=new ls(new Ue(1,1),.14,.28,.75),this.composer.addPass(this.bloom),this.fxaa=new wh(f_),this.composer.addPass(this.fxaa),this.composer.addPass(new h_),this.atmosphere=new p_(this.scene,this.road,this.renderer,this.bloom),this.addLights(),this.roadRibbons=new A_(this.scene,this.road),this.scenery=new G_(this.scene,this.road),this.vehicleVisual=new k_(this.scene,this.physics),this.debugHelper=new qu(this.camera),this.debugHelper.visible=!1,this.scene.add(this.debugHelper),e.addEventListener("webglcontextlost",s=>{s.preventDefault(),console.warn("SLimulator WebGL context lost")}),e.addEventListener("webglcontextrestored",()=>this.resize()),this.resize()}road;physics;renderer;scene;camera;composer;bloom;fxaa;atmosphere;roadRibbons;scenery;vehicleVisual;debugHelper;smoothedCameraPosition=new R;smoothedCameraTarget=new R;cameraForward=new R;cameraRight=new R;cameraTarget=new R;cameraDesired=new R;cameraLookTarget=new R;cameraReady=!1;cameraMode="cockpit";qualityMode="high";setCameraMode(e){this.cameraMode=e,this.debugHelper.visible=e==="debug",this.vehicleVisual.setCameraMode(e)}setHighQuality(e){this.setQualityMode(e?"high":"perf")}setQualityMode(e){this.qualityMode=e,this.renderer.setPixelRatio(e==="high"?Math.min(window.devicePixelRatio||1,1.7):1),this.renderer.shadowMap.enabled=!1,this.bloom.enabled=e==="high",this.fxaa.enabled=e==="high",this.roadRibbons.setQualityMode(e),this.scenery.setQualityMode(e),this.atmosphere.setQualityMode(e),this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,n=e.clientHeight||window.innerHeight;this.renderer.setSize(t,n,!1),this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(t,n),this.fxaa.uniforms.resolution.value.set(1/Math.max(1,t*this.renderer.getPixelRatio()),1/Math.max(1,n*this.renderer.getPixelRatio())),this.camera.aspect=t/Math.max(1,n),this.camera.updateProjectionMatrix()}render(e,t,n){const s=t*.001;this.measure(n,"atmosphere",()=>this.atmosphere.update(e,s)),this.measure(n,"road",()=>this.roadRibbons.update(e)),this.measure(n,"scenery",()=>this.scenery.update(e,s)),this.measure(n,"vehicle",()=>this.vehicleVisual.update(e,s)),this.measure(n,"camera",()=>this.updateCamera(e,t)),this.qualityMode==="high"?this.composer.render():this.renderer.render(this.scene,this.camera)}perfStats(){const e=this.renderer.domElement;return{quality:this.qualityMode,pixelRatio:this.renderer.getPixelRatio(),canvas:{width:e.width,height:e.height,clientWidth:e.clientWidth,clientHeight:e.clientHeight},render:{calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,points:this.renderer.info.render.points,lines:this.renderer.info.render.lines},memory:{geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures}}}addLights(){this.scene.add(new Ou(11065304,.34));const e=new Du(10215644,2050879,.86);this.scene.add(e);const t=new Fu(16770730,.54);t.position.set(-90,115,-55),t.castShadow=!1,this.scene.add(t),this.scene.add(t.target)}measure(e,t,n){e?e.measure(t,n):n()}updateCamera(e,t){const n=e.vehicle.pose,s=this.cameraForward.set(Math.sin(n.yaw),0,-Math.cos(n.yaw)),r=this.cameraRight.set(Math.cos(n.yaw),0,Math.sin(n.yaw)),a=e.vehicle.speedMps>1?Math.sin(t*.008)*Math.min(.018,e.vehicle.speedMps*6e-4):0;if(this.cameraMode==="chase"){const c=this.cameraTarget.set(n.x,n.y+.6,n.z),h=this.cameraDesired.copy(c).addScaledVector(s,-11);h.y+=5,this.cameraReady?this.camera.position.lerp(h,.12):this.camera.position.copy(h),this.cameraLookTarget.copy(c).addScaledVector(s,3.5),this.smoothedCameraTarget.lerp(this.cameraLookTarget,this.cameraReady?.18:1),this.camera.lookAt(this.smoothedCameraTarget),this.cameraReady=!0;return}if(this.cameraMode==="debug"){this.camera.position.set(n.x+24,n.y+28,n.z+24),this.camera.lookAt(n.x,n.y,n.z),this.debugHelper.update();return}const o=this.cameraDesired.set(n.x,1.82+a,n.z).addScaledVector(s,.5).addScaledVector(r,-.28),l=this.cameraLookTarget.copy(o).addScaledVector(s,15);l.y+=-.22-Math.min(.22,e.vehicle.speedMps*.006),this.cameraReady?(this.smoothedCameraPosition.lerp(o,.38),this.smoothedCameraTarget.lerp(l,.28)):(this.smoothedCameraPosition.copy(o),this.smoothedCameraTarget.copy(l)),this.camera.position.copy(this.smoothedCameraPosition),this.camera.lookAt(this.smoothedCameraTarget),this.camera.rotation.z=-n.steerAngle*.035,this.cameraReady=!0}}function V_(i){const e=["SLimulator Driving Performance Log",`Version: ${i.version}`,`SubID: ${i.session.subId||"none"}`,`Duration: ${Ps(i.session.elapsed)}`,`Scene: ${i.road.scene}`,`Distance: ${Ut(i.vehicle.distanceM,1)} m`,`Final speed: ${Ut(i.vehicle.speedMps*ws,1)} mph`,"","Score",`Steering points: ${Ut(i.metrics.steeringPoints,1)}`,`Off-road seconds: ${Ut(i.metrics.offRoadSeconds,2)}`,`Off-road penalty: ${Ut(i.metrics.offRoadPenalty,1)}`,`Crash count: ${i.metrics.crashCount}`,`Crash penalty: ${Ut(i.metrics.crashPenaltyTotal,1)}`,`Total score: ${Ut(i.metrics.totalScore,1)}`,`SDLP: ${Ut(i.metrics.sdlp,3)} m`,`Lane changes: ${i.metrics.laneChanges}`,"","Time by mode",...Object.entries(i.metrics.timeByMode).map(([t,n])=>`${t}: ${Ut(n,2)} s`),"","Alerts",...Object.entries(i.metrics.alertCounts).map(([t,n])=>`${t}: ${n}`),"","Crashes",i.crashes.length?"":"none"];for(const t of i.crashes)e.push(`#${t.index} ${Ps(t.time)} ${t.type} ${t.side} ${Ut(t.mph,1)} mph ${t.zone}`);e.push("","Trials",i.trials.length?"":"none");for(const t of i.trials)e.push(`#${t.index} ${t.type} expected=${t.expectedAction} status=${t.status} pdt=${t.pdt??""} drt=${t.drt??""}`);return`${e.join(`
`)}
`}function W_(i,e){i.className="sim-root",i.innerHTML=`
    <canvas id="world" class="world-canvas" tabindex="0" aria-label="SLimulator forward road view"></canvas>
    <div class="vignette"></div>
    <div class="topbar">
      <div class="top-cluster">
        <div class="brand glass micro"><i class="brand-mark"></i><strong>SLIMULATOR</strong></div>
        <button id="modToggle" class="btn micro" type="button">MOD</button>
        <button id="cockpitToggle" class="btn micro" type="button">COCKPIT</button>
      </div>
      <div class="top-cluster">
        <div id="sceneChip" class="chip glass micro">UNMAPPED</div>
        <div id="fpsChip" class="chip glass micro">-- FPS</div>
      </div>
    </div>
    <aside id="modPanel" class="mod-panel glass" aria-label="Moderator controls">
      <div class="panel-head"><h2>Moderator</h2><button id="closePanel" class="btn micro" type="button">CLOSE</button></div>
      <div class="panel-scroll">
        <section class="section">
          <p class="section-title">Scene</p>
          <div class="grid-3">
            <button class="btn micro scene-btn" data-scene="unmapped" type="button">Unmapped</button>
            <button class="btn micro scene-btn" data-scene="l2" type="button">L2 Hwy</button>
            <button class="btn micro scene-btn" data-scene="l3" type="button">L3 Hwy</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Session</p>
          <div class="grid-2">
            <button id="newSession" class="btn micro accent" type="button">NEW</button>
            <button id="downloadLog" class="btn micro" type="button">LOG</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Driver Source</p>
          <div class="grid-3">
            <button class="btn micro input-btn active" data-input="local" type="button">Local</button>
            <button class="btn micro input-btn" data-input="gamepad" type="button">Gamepad</button>
            <button class="btn micro input-btn" data-input="external" type="button">External</button>
          </div>
          <div id="gamepadConfig" class="gamepad-config" hidden>
            <pre id="gamepadLive" class="gamepad-live label">No gamepad</pre>
            <div id="gamepadAssignStatus" class="gamepad-assign-status label">Ready</div>
            <div class="gamepad-map-list">
              <div class="gamepad-map-row"><span class="label">Steering</span><strong id="gamepadSteerBinding">Axis 0</strong><button class="btn micro" data-gamepad-assign="steer" type="button">Assign</button></div>
              <div class="gamepad-map-row"><span class="label">Accelerator</span><strong id="gamepadAccelBinding">Axis 5</strong><button class="btn micro" data-gamepad-assign="accelerator" type="button">Assign</button></div>
              <div class="gamepad-map-row"><span class="label">Brake</span><strong id="gamepadBrakeBinding">Axis 2</strong><button class="btn micro" data-gamepad-assign="brake" type="button">Assign</button></div>
              <div class="gamepad-map-row"><span class="label">ACC</span><strong id="gamepadAccBinding">Button 0</strong><button class="btn micro" data-gamepad-assign="acc" type="button">Assign</button></div>
              <div class="gamepad-map-row"><span class="label">LCA</span><strong id="gamepadLcaBinding">Button 1</strong><button class="btn micro" data-gamepad-assign="lca" type="button">Assign</button></div>
            </div>
            <button id="gamepadReset" class="btn micro" type="button">Reset Mapping</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Alerts</p>
          <div class="grid-2">
            <button class="btn micro alert-btn" data-alert="earcon" type="button">Earcon</button>
            <button class="btn micro alert-btn" data-alert="haptic" type="button">Haptic</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Camera</p>
          <div class="grid-3">
            <button class="btn micro camera-btn active" data-camera="cockpit" type="button">Cockpit</button>
            <button class="btn micro camera-btn" data-camera="chase" type="button">Chase</button>
            <button class="btn micro camera-btn" data-camera="debug" type="button">Debug</button>
          </div>
        </section>
        <section id="physicsSection" class="section collapsible-section">
          <button id="physicsToggle" class="section-toggle micro" type="button" aria-expanded="false">
            <span>Physics Tuning</span><span id="physicsToggleText">Open</span>
          </button>
          <div id="physicsBody" class="collapsible-body" hidden>
            <div class="field">
              <span class="label" id="lblEngineAccel">Engine Accel: 4.5 m/s²</span>
              <input type="range" id="sliderEngineAccel" min="3.0" max="15.0" step="0.1" value="4.5" />
            </div>
            <div class="field">
              <span class="label" id="lblAeroDrag">Aero Drag: 0.0023</span>
              <input type="range" id="sliderAeroDrag" min="0.0002" max="0.0050" step="0.0001" value="0.0023" />
            </div>
            <div class="field">
              <span class="label" id="lblBrakeDecel">Brake Power: 12.5 m/s²</span>
              <input type="range" id="sliderBrakeDecel" min="5.0" max="20.0" step="0.1" value="12.5" />
            </div>
            <div class="field">
              <span class="label" id="lblSteerResponse">Steer Response: 0.15</span>
              <input type="range" id="sliderSteerResponse" min="0.10" max="1.00" step="0.01" value="0.15" />
            </div>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Render</p>
          <div class="grid-2">
            <button class="btn micro quality-btn active" data-quality="high" type="button">High</button>
            <button class="btn micro quality-btn" data-quality="perf" type="button">Perf</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Status</p>
          <div class="metric-grid">
            <div class="metric"><span class="label">Mode</span><span id="statusMode" class="value">manual</span></div>
            <div class="metric"><span class="label">Lanes</span><span id="statusLanes" class="value">1</span></div>
            <div class="metric"><span class="label">Queue</span><span id="statusQueue" class="value">none</span></div>
            <div class="metric"><span class="label">Crashes</span><span id="statusCrashes" class="value">0</span></div>
          </div>
        </section>
      </div>
    </aside>
    <section id="cockpit" class="cockpit">
      <div class="dash"></div>
      <div class="score-card glass">
        <div class="score-total">
          <span class="label">Total Score</span>
          <strong id="scoreReadout" class="value">0.0</strong>
        </div>
        <div class="score-line"></div>
        <div class="score-row"><span>Steering</span><strong id="steeringScoreReadout">0.0</strong></div>
        <div class="score-row"><span>SDLP</span><strong id="sdlpReadout">0.000 M</strong></div>
        <div class="score-row"><span>Off-road</span><strong id="offRoadReadout">0.0</strong></div>
        <div class="score-row"><span>Crashes</span><strong id="crashReadout">0 x 200</strong></div>
        <div class="score-row"><span>Distance</span><strong id="distanceReadout">0 M</strong></div>
      </div>
      <div class="cluster glass">
        <div class="legacy-cluster">
          <div class="legacy-speed-row">
            <span id="speedReadout" class="legacy-speed">000</span>
            <span class="legacy-mph">mph</span>
          </div>
          <div id="dicIndicatorRow" class="legacy-pill-row">
            <div id="accGauge" class="legacy-pill"><strong id="accGaugeLabel">ACC</strong></div>
            <div id="l2Gauge" class="legacy-pill"><strong>L2</strong></div>
            <div id="l3Gauge" class="legacy-pill"><strong>L3</strong></div>
          </div>
          <div id="dic" class="dic micro">READY - MANUAL</div>
        </div>
      </div>
      <div class="lane-card glass">
        <div id="laneViz" class="lane-viz"><canvas id="laneCanvas" aria-label="Road and lane position visualization"></canvas></div>
        <div class="lane-caption">
          <strong id="miniSceneReadout">UNMAPPED - 1 LANE</strong>
          <span id="miniModeReadout">MANUAL</span>
        </div>
      </div>
      <div class="pedals">
        <div class="pedal-wrap brake-wrap">
          <div class="pedal brake" aria-label="Brake pedal"><i id="brakeFill"></i></div>
          <span>Brake<br>(S)</span>
        </div>
        <div class="pedal-wrap acc-wrap">
          <div class="pedal acc" aria-label="Accelerator pedal"><i id="accelFill"></i></div>
          <span>Accel<br>(W)</span>
        </div>
      </div>
      <div id="steering" class="steering">
        <button id="wheelLca" class="wheel-btn lca btn micro" type="button">LCA</button>
        <button id="wheelAcc" class="wheel-btn acc btn micro" type="button">ACC</button>
        <div class="wheel-hub"></div>
      </div>
    </section>
    <div id="logDialog" class="modal-backdrop" hidden>
      <div class="log-dialog glass" role="dialog" aria-modal="true" aria-labelledby="logDialogTitle">
        <div class="panel-head">
          <h2 id="logDialogTitle">Download Log</h2>
          <button id="cancelLogTop" class="btn micro" type="button">CLOSE</button>
        </div>
        <div class="log-dialog-body">
          <div class="log-preview" aria-label="Current log contents">
            <div class="log-preview-head">
              <span class="label">Total Score</span>
              <strong id="logTotalScore" class="value">0.0</strong>
            </div>
            <div class="log-metric-grid">
              <div class="metric"><span class="label">Steering</span><span id="logSteeringPoints" class="value">0.0</span></div>
              <div class="metric"><span class="label">Off-road</span><span id="logOffRoadPenalty" class="value">0.0</span></div>
              <div class="metric"><span class="label">Crash Penalty</span><span id="logCrashPenalty" class="value">0.0</span></div>
              <div class="metric"><span class="label">SDLP</span><span id="logSdlp" class="value">0.000 M</span></div>
              <div class="metric"><span class="label">Duration</span><span id="logDuration" class="value">00:00</span></div>
              <div class="metric"><span class="label">Distance</span><span id="logDistance" class="value">0 M</span></div>
            </div>
            <div class="log-crash-report">
              <div class="log-preview-title">Crash Report</div>
              <div id="logCrashList" class="log-crash-list">No crashes recorded</div>
            </div>
          </div>
          <label class="field"><span class="label">Subject ID</span><input id="logSubId" autocomplete="off" /></label>
          <div class="grid-2">
            <button id="cancelLog" class="btn micro" type="button">Cancel</button>
            <button id="confirmLog" class="btn micro accent" type="button">Download</button>
          </div>
        </div>
      </div>
    </div>
    <div id="toast" class="toast glass micro"></div>
  `;const t=ve("world"),n=ve("modPanel"),s=ve("cockpit"),r=ve("toast");let a=null,o=0,l=-1/0,c=-1/0,h=-1/0,u=-1/0;ve("modToggle").addEventListener("click",()=>n.classList.toggle("open")),ve("closePanel").addEventListener("click",()=>n.classList.remove("open")),ve("cockpitToggle").addEventListener("click",()=>s.classList.toggle("minimized")),ve("wheelAcc").addEventListener("click",()=>e.onToggleACC()),ve("wheelLca").addEventListener("click",()=>e.onToggleLCA()),ve("newSession").addEventListener("click",()=>e.onNewSession());const d=ve("logDialog"),m=ve("logSubId"),g=()=>{d.hidden=!0},v=p=>{if(!a)return;const M=p.trim(),E={...a,session:{...a.session,subId:M}},S=new Blob([V_(E)],{type:"text/plain"}),A=URL.createObjectURL(S),y=document.createElement("a");y.href=A;const C=M?`${M.replace(/[^a-z0-9_-]/gi,"_")}-`:"";y.download=`slimulator-log-${C}${Date.now()}.txt`,y.click(),URL.revokeObjectURL(A)};ve("downloadLog").addEventListener("click",()=>{a&&(Z_(a),m.value=a.session.subId||"",d.hidden=!1,m.focus(),m.select())}),ve("confirmLog").addEventListener("click",()=>{v(m.value),g()}),ve("cancelLog").addEventListener("click",g),ve("cancelLogTop").addEventListener("click",g),d.addEventListener("click",p=>{p.target===d&&g()}),m.addEventListener("keydown",p=>{p.key==="Enter"&&(v(m.value),g()),p.key==="Escape"&&g()}),q_(e),$_(),document.querySelectorAll(".scene-btn").forEach(p=>{p.addEventListener("click",()=>e.onScene(p.dataset.scene))}),document.querySelectorAll(".input-btn").forEach(p=>{p.addEventListener("click",()=>{Na(".input-btn",p);const M=p.dataset.input;ve("gamepadConfig").hidden=M!=="gamepad",e.onInputSource(M)})}),document.querySelectorAll(".alert-btn").forEach(p=>{p.addEventListener("click",()=>e.onAlert(p.dataset.alert))}),document.querySelectorAll(".camera-btn").forEach(p=>{p.addEventListener("click",()=>{Na(".camera-btn",p),e.onCamera(p.dataset.camera)})}),document.querySelectorAll(".quality-btn").forEach(p=>{p.addEventListener("click",()=>{Na(".quality-btn",p),e.onQuality(p.dataset.quality==="high")})});const f=(p,M,E,S="")=>{const A=ve(p),y=ve(M),C=()=>{const x=parseFloat(A.value);y.textContent=`${E}: ${x.toFixed(p==="sliderAeroDrag"?4:S===""?2:1)}${S}`,e.onPhysicsChange(p.replace("slider","").replace(/^\w/,w=>w.toLowerCase()),x)};A.addEventListener("input",C)};return f("sliderEngineAccel","lblEngineAccel","Engine Accel"," m/s²"),f("sliderAeroDrag","lblAeroDrag","Aero Drag"),f("sliderBrakeDecel","lblBrakeDecel","Brake Power"," m/s²"),f("sliderSteerResponse","lblSteerResponse","Steer Response"),{canvas:t,update(p,M,E){a=p;const S=performance.now(),A=Vt[p.road.scene].label;if(S-h>=500&&(ve("fpsChip").textContent=M?`${Math.round(M)} FPS`:"-- FPS",h=S),S-l>=1e3/15){ve("sceneChip").textContent=`${A}${p.road.transition?` -> ${Vt[p.road.transition.to].label}`:""}`;const y=Math.round(p.vehicle.speedMph);ve("speedReadout").textContent=String(y).padStart(3,"0"),X_(p),ve("dic").textContent=p.dicMessage,ve("scoreReadout").textContent=Ut(p.metrics.totalScore,1),ve("sdlpReadout").textContent=`${Ut(p.metrics.sdlp,3)} M`,ve("steeringScoreReadout").textContent=Ut(p.metrics.steeringPoints,1),ve("offRoadReadout").textContent=p.metrics.offRoadPenalty>0?`-${Ut(p.metrics.offRoadPenalty,1)}`:"0.0",ve("crashReadout").textContent=`${p.metrics.crashCount} x ${Oe.crashPenalty}`,ve("distanceReadout").textContent=`${Math.round(p.vehicle.distanceM)} M`,ve("miniSceneReadout").textContent=`${A} - ${p.road.lanesPerDirection} LANE${p.road.lanesPerDirection===1?"":"S"}`,ve("miniModeReadout").textContent=p.adas.mode.toUpperCase(),ve("statusMode").textContent=p.adas.mode,ve("statusLanes").textContent=String(p.road.lanesPerDirection),ve("statusQueue").textContent=p.road.queue.map(C=>Vt[C.target].label).join(" -> ")||"none",ve("statusCrashes").textContent=String(p.metrics.crashCount),ve("accelFill").style.height=`${Math.round(p.vehicle.controls.accelerator*100)}%`,ve("brakeFill").style.height=`${Math.round(p.vehicle.controls.brake*100)}%`,ve("steering").style.transform=`translateX(-50%) rotate(${(p.vehicle.controls.steer*86).toFixed(1)}deg)`,ve("wheelAcc").classList.toggle("active",p.adas.accActive),ve("wheelLca").classList.toggle("active",p.adas.lcaActive||p.adas.autoArmed),p.vehicle.crashReset&&(ve("dic").textContent=`${p.dicMessage} - ${p.vehicle.crashReset.phase.toUpperCase()}`),ve("cockpitToggle").textContent=s.classList.contains("minimized")?"SHOW":"COCKPIT",ve("statusMode").setAttribute("title",`Elapsed ${Ps(p.session.elapsed)}`),l=S}S-u>=250&&(ve("gamepadLive").textContent=E,u=S),S-c>=100&&(K_(ve("laneCanvas"),p),c=S)},toast(p,M="info",E=2200){r.textContent=p,r.className=`toast glass micro show ${M}`,window.clearTimeout(o),o=window.setTimeout(()=>r.classList.remove("show"),E)}}}function ve(i){const e=document.getElementById(i);if(!e)throw new Error(`Missing UI element #${i}`);return e}function Na(i,e){document.querySelectorAll(i).forEach(t=>t.classList.toggle("active",t===e))}function X_(i){const e=i.adas.mode==="l2",t=i.adas.mode==="l3",n=i.road.scene==="l2",s=i.road.scene==="l3",r=e?"l2-active":n?"ready":i.adas.autoArmed?"armed":"off",a=t?"l3-active":s?"ready":i.adas.autoArmed?"armed":"off",o=Math.round(i.adas.setSpeedMph),l=ve("accGauge");ve("dicIndicatorRow").classList.toggle("l3-active",t),l.classList.toggle("with-speed",i.adas.accActive),ve("accGaugeLabel").textContent=i.adas.accActive?`ACC ${o}`:"ACC",Fa(l,i.adas.accActive?"active":"off"),Fa(ve("l2Gauge"),r),Fa(ve("l3Gauge"),a),l.setAttribute("title",i.adas.accActive?`ACC set to ${o} mph`:"ACC off"),ve("l2Gauge").setAttribute("title",e?"L2 active":n?"L2 available":i.adas.autoArmed?"L2 armed, unavailable":"L2 off"),ve("l3Gauge").setAttribute("title",t?"L3 active":s?"L3 available":i.adas.autoArmed?"L3 armed, unavailable":"L3 off")}function Fa(i,e){i.classList.remove("armed","ready","active","l2-active","l3-active"),e!=="off"&&i.classList.add(e)}function q_(i){const e={steer:"gamepadSteerBinding",accelerator:"gamepadAccelBinding",brake:"gamepadBrakeBinding",acc:"gamepadAccBinding",lca:"gamepadLcaBinding"},t=ve("gamepadAssignStatus");let n=null,s=null,r=null;const a=v=>{ve(e.steer).textContent=rl(v.steer),ve(e.accelerator).textContent=Wc(v.accelerator),ve(e.brake).textContent=Wc(v.brake),ve(e.acc).textContent=Nr(v.acc),ve(e.lca).textContent=Nr(v.lca)},o=v=>{n!==null&&window.clearInterval(n),s!==null&&window.clearTimeout(s),n=null,s=null,r=null,document.querySelectorAll("[data-gamepad-assign]").forEach(f=>f.classList.remove("active")),v&&(t.textContent=v)},l=()=>typeof navigator>"u"?null:navigator.getGamepads?.().find(Boolean)??null,c=v=>({axes:[...v.axes],buttons:v.buttons.map(f=>f.value)}),h=(v,f)=>{let p=-1,M=0;return v.axes.forEach((E,S)=>{const A=Math.abs(E-(f.axes[S]??0));A>M&&Math.abs(E)>.28&&(M=A,p=S)}),p>=0&&M>.32?{kind:"axis",index:p}:null},u=(v,f)=>{for(let p=0;p<v.buttons.length;p++){const M=v.buttons[p],E=f.buttons[p]??0;if((M.pressed||M.value>.5)&&E<=.15)return{kind:"button",index:p}}return null},d=(v,f)=>{const p=l();return p?v==="steer"?h(p,f):v==="acc"||v==="lca"?u(p,f):u(p,f)??h(p,f):null},m=(v,f)=>v==="steer"?f.kind==="axis"?{steer:f}:null:v==="accelerator"?{accelerator:f}:v==="brake"?{brake:f}:v==="acc"?f.kind==="button"?{acc:f}:null:f.kind==="button"?{lca:f}:null,g=(v,f)=>{o(),r=v,f.classList.add("active");const p=l(),M=p?c(p):{axes:[],buttons:[]};t.textContent=`Assigning ${v.toUpperCase()}`,n=window.setInterval(()=>{if(!r)return;const E=d(r,M);if(!E)return;const S=m(r,E);S&&(i.onGamepadMappingChange(S),a(i.getGamepadMapping()),o(`${r.toUpperCase()} ${Y_(E)}`))},60),s=window.setTimeout(()=>o("Assignment timed out"),8e3)};a(i.getGamepadMapping()),document.querySelectorAll("[data-gamepad-assign]").forEach(v=>{const f=v.dataset.gamepadAssign;v.addEventListener("click",()=>g(f,v))}),ve("gamepadReset").addEventListener("click",()=>{o("Mapping reset"),a(i.onGamepadMappingReset())})}function Wc(i){return i.kind==="axis"?rl(i):Nr(i)}function Y_(i){return i.kind==="axis"?rl(i):Nr(i)}function rl(i){return`Axis ${i.index}${i.invert?" inverted":""}`}function Nr(i){return`Button ${i.index}`}function $_(){const i=ve("physicsToggle"),e=ve("physicsBody"),t=ve("physicsToggleText");i.addEventListener("click",()=>{const n=e.hidden;e.hidden=!n,i.setAttribute("aria-expanded",String(n)),t.textContent=n?"Close":"Open"})}function Z_(i){ve("logTotalScore").textContent=Ut(i.metrics.totalScore,1),ve("logSteeringPoints").textContent=Ut(i.metrics.steeringPoints,1),ve("logOffRoadPenalty").textContent=Xc(i.metrics.offRoadPenalty),ve("logCrashPenalty").textContent=Xc(i.metrics.crashPenaltyTotal),ve("logSdlp").textContent=`${Ut(i.metrics.sdlp,3)} M`,ve("logDuration").textContent=Ps(i.session.elapsed),ve("logDistance").textContent=`${Ut(i.vehicle.distanceM,1)} M`;const e=ve("logCrashList");if(e.replaceChildren(),!i.crashes.length){e.textContent="No crashes recorded";return}i.crashes.forEach(t=>{const n=document.createElement("div");n.className="log-crash-row";const s=document.createElement("strong");s.textContent=`#${t.index} ${t.type.toUpperCase()} ${Ut(t.mph,1)} MPH`;const r=document.createElement("span");r.textContent=`${Ps(t.time)} | ${t.side} | ${t.zone}`,n.append(s,r),e.append(n)})}function Xc(i){return i>0?`-${Ut(i,1)}`:"0.0"}function K_(i,e){const t=i.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,2),s=Math.max(1,Math.floor(t.width*n)),r=Math.max(1,Math.floor(t.height*n));(i.width!==s||i.height!==r)&&(i.width=s,i.height=r);const a=i.getContext("2d");if(!a)return;a.clearRect(0,0,s,r);const o=e.road.bounds,l=s/Math.max(1,o.rightWall-o.leftWall),c=(o.rightWall+o.leftWall)/2,h=(g,v)=>s/2+(g+v-c)*l;a.fillStyle="#2d4c3c",a.fillRect(0,0,s,r);const u=e.road.curvePoints||Array.from({length:9},(g,v)=>({sOffset:-5+v*5,xOffset:0}));a.fillStyle="#1c2936",a.beginPath();for(let g=u.length-1;g>=0;g--){const v=u[g],f=r*(1-(v.sOffset+10)/40);g===u.length-1?a.moveTo(h(o.leftEdge,v.xOffset),f):a.lineTo(h(o.leftEdge,v.xOffset),f)}for(let g=0;g<u.length;g++){const v=u[g],f=r*(1-(v.sOffset+10)/40);a.lineTo(h(o.rightEdge,v.xOffset),f)}a.closePath(),a.fill(),a.strokeStyle="rgba(255, 255, 255, 0.9)",a.lineWidth=Math.max(2,n*1.5),a.setLineDash([]),a.beginPath();for(let g=0;g<u.length;g++){const v=u[g],f=r*(1-(v.sOffset+10)/40);g===0?a.moveTo(h(o.leftEdge,v.xOffset),f):a.lineTo(h(o.leftEdge,v.xOffset),f)}a.stroke(),a.beginPath();for(let g=0;g<u.length;g++){const v=u[g],f=r*(1-(v.sOffset+10)/40);g===0?a.moveTo(h(o.rightEdge,v.xOffset),f):a.lineTo(h(o.rightEdge,v.xOffset),f)}a.stroke(),a.strokeStyle="rgba(255, 215, 96, 0.9)",a.lineWidth=Math.max(1,n),a.setLineDash([]);for(const g of[-.16,.16]){a.beginPath();for(let v=0;v<u.length;v++){const f=u[v],p=r*(1-(f.sOffset+10)/40);v===0?a.moveTo(h(g,f.xOffset),p):a.lineTo(h(g,f.xOffset),p)}a.stroke()}a.strokeStyle="rgba(255, 255, 255, 0.82)",a.lineWidth=Math.max(1,n),a.setLineDash([6*n,10*n]);for(let g=0;g<o.laneCount-1;g++){const v=-5.4*(g+1),f=Oe.laneWidth*(g+1);a.beginPath();for(let p=0;p<u.length;p++){const M=u[p],E=r*(1-(M.sOffset+10)/40);p===0?a.moveTo(h(v,M.xOffset),E):a.lineTo(h(v,M.xOffset),E)}a.stroke(),a.beginPath();for(let p=0;p<u.length;p++){const M=u[p],E=r*(1-(M.sOffset+10)/40);p===0?a.moveTo(h(f,M.xOffset),E):a.lineTo(h(f,M.xOffset),E)}a.stroke()}a.setLineDash([]);const d=h(e.vehicle.lateralM,0),m=r*(1-10/40);a.save(),a.translate(d,m),a.rotate(e.vehicle.headingErrorRad),a.fillStyle="#ff6172",a.beginPath(),a.roundRect(-9*n,-15*n,18*n,30*n,4*n),a.fill(),a.restore()}async function J_(){const i=document.getElementById("app");if(!i)throw new Error("Missing #app root");const e=await il.create(),t=new Vh,n=new t_(window),s=new qh;let r="cockpit",a="high",o=!1,l=!1,c="No gamepad",h=-1/0,u=-1/0,d;const m=W_(i,{onScene(f){e.requestScene(f),t.resume()},onNewSession(){e.newSession(),t.resume(),m.toast("Session reset")},onToggleACC(){e.toggleACC(),t.resume()},onToggleLCA(){e.toggleLCA(),t.resume()},onInputSource(f){e.setInputSource(f),m.toast(f==="local"?"Local controls":f==="gamepad"?"Gamepad controls":"External controls")},onAlert(f){e.triggerAlert({type:f}),t.alert(f)},onCamera(f){r=f,d.setCameraMode(r)},onQuality(f){a=f?"high":"perf",d.setQualityMode(a)},onPhysicsChange(f,p){e.physics.setParam(f,p)},onGamepadMappingChange(f){n.setGamepadMapping(f)},onGamepadMappingReset(){return n.resetGamepadMapping()},getGamepadMapping(){return n.getGamepadMapping()}});d=new H_(m.canvas,e.road,e.physics),d.setCameraMode(r),d.setQualityMode(a),window.addEventListener("resize",()=>d.resize()),window.addEventListener("pointerdown",()=>t.resume(),{once:!0}),Co.addEventListener("event",f=>{f.detail.type==="crash"&&(t.burst("impact"),m.toast("Crash recorded","danger",2400))}),window.SLimulator={version:Yc,renderer:d,snapshot:()=>e.snapshot(),perfSnapshot:()=>s.snapshot(d.perfStats()),requestScene:(f,p)=>e.requestScene(f,p),newSession:(f={})=>e.newSession(f),setDriverControls:f=>e.setExternalControls(f),setInputSource:f=>e.setInputSource(f),toggleACC:()=>e.toggleACC(),toggleLCA:()=>e.toggleLCA(),triggerAlert:(f={})=>e.triggerAlert({...f,expectedAction:f.expectedAction}),setPhysicsParam:(f,p)=>e.physics.setParam(f,p)};let g=e.snapshot();function v(f){const p=s.mark(f),M=s.measure("input",()=>n.sample(e.inputSource==="gamepad"?"gamepad":"local"));f-h>=250&&(c=s.measure("input",()=>n.liveGamepadLabel()),h=f),M.accButton&&!o&&e.toggleACC(),M.lcaButton&&!l&&e.toggleLCA(),o=!!M.accButton,l=!!M.lcaButton,g=s.measure("sim",()=>e.update(p,M,s)),s.measure("render",()=>d.render(g,f,s)),s.measure("ui",()=>m.update(g,s.fps,c)),f-u>=1e3/30&&(s.measure("audio",()=>t.update(g)),u=f),requestAnimationFrame(v)}requestAnimationFrame(v)}J_().catch(i=>{console.error(i);const e=document.getElementById("app");e&&(e.innerHTML=`<pre style="padding:20px;color:#ffdce1;background:#18070b;white-space:pre-wrap">${String(i?.stack||i)}</pre>`)});
