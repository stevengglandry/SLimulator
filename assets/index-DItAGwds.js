(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const pn=Math.PI*2;function tt(i,e,t){return Math.max(e,Math.min(t,i))}function We(i,e,t){return i+(e-i)*t}function Sh(i){const e=tt(i,0,1);return e*e*(3-2*e)}function _r(i){let e=i;for(;e>Math.PI;)e-=pn;for(;e<-Math.PI;)e+=pn;return e}function el(i,e,t){return i+_r(e-i)*t}function oe(i){const e=Math.sin(i*12.9898+78.233)*43758.5453;return e-Math.floor(e)}function As(i){const e=Math.max(0,Math.floor(i));return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function It(i,e=1){return Number.isFinite(i)?i.toFixed(e):"0"}const bh=38;class yh{ctx=null;master=null;motorFundamental=null;motorHarmonic=null;inverterWhine=null;cabinHum=null;motorGain=null;inverterGain=null;cabinHumGain=null;motorTone=null;tireNoise=null;tireGain=null;tireFilter=null;roadNoise=null;roadGain=null;roadFilter=null;started=!1;lastCrashCount=0;lastImpactBurstAt=-1;resume(){this.ensure().then(()=>this.ctx?.resume())}update(e){if(!this.started)return;const t=this.ctx;if(!t||!this.motorFundamental||!this.motorHarmonic||!this.inverterWhine||!this.cabinHum||!this.motorGain||!this.inverterGain||!this.cabinHumGain||!this.motorTone||!this.tireGain||!this.tireFilter||!this.roadGain||!this.roadFilter)return;const n=tt(e.vehicle.speedMps/bh,0,1),s=Math.pow(n,1.18),r=e.vehicle.controls.accelerator,a=e.vehicle.controls.brake,o=Math.abs(e.vehicle.controls.steer),l=tt(Math.abs(e.vehicle.headingErrorRad)*1.4,0,1),c=tt(n*(o*.7+a*.48+l*.45),0,1),h=tt(r+a*.35,0,1),d=t.currentTime,u=64+s*330+h*52,m=540+s*720+h*160;this.motorFundamental.frequency.setTargetAtTime(u,d,.08),this.motorHarmonic.frequency.setTargetAtTime(u*1.53,d,.08),this.inverterWhine.frequency.setTargetAtTime(m,d,.06),this.cabinHum.frequency.setTargetAtTime(48+n*22+h*18,d,.16),this.motorTone.frequency.setTargetAtTime(420+s*780+h*260,d,.12),this.motorGain.gain.setTargetAtTime(.012+s*.018+h*.04,d,.12),this.inverterGain.gain.setTargetAtTime(12e-5+s*32e-5+h*7e-4,d,.14),this.cabinHumGain.gain.setTargetAtTime(.01+n*.005+h*.009,d,.18),this.roadFilter.frequency.setTargetAtTime(150+n*430,d,.24),this.roadGain.gain.setTargetAtTime(s*.042+a*n*.008,d,.2),this.tireFilter.frequency.setTargetAtTime(420+n*980+c*520,d,.16),this.tireGain.gain.setTargetAtTime(Math.pow(n,1.45)*.014+c*.024,d,.12),e.metrics.crashCount>this.lastCrashCount&&this.burst("impact"),this.lastCrashCount=e.metrics.crashCount}alert(e){this.ensure().then(()=>{const t=this.ctx,n=this.master;if(!t||!n)return;const s=t.createOscillator(),r=t.createGain();s.type=e==="earcon"?"sine":"square",s.frequency.value=e==="earcon"?880:82,r.gain.setValueAtTime(1e-4,t.currentTime),r.gain.exponentialRampToValueAtTime(e==="earcon"?.16:.08,t.currentTime+.03),r.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+(e==="earcon"?.45:.7)),s.connect(r).connect(n),s.start(),s.stop(t.currentTime+.8)})}burst(e){this.ensure().then(()=>{const t=this.ctx,n=this.master;!t||!n||(e==="impact"?this.playImpactCrash(t,n):this.playTireScreech(t,n))})}async ensure(){if(this.started)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.58;const t=this.ctx.createDynamicsCompressor();t.threshold.value=-18,t.knee.value=16,t.ratio.value=3.5,t.attack.value=.004,t.release.value=.18,this.master.connect(t).connect(this.ctx.destination),this.motorGain=this.ctx.createGain(),this.motorGain.gain.value=0,this.motorTone=this.ctx.createBiquadFilter(),this.motorTone.type="lowpass",this.motorTone.frequency.value=620,this.motorTone.Q.value=.72,this.motorFundamental=this.ctx.createOscillator(),this.motorFundamental.type="sine",this.motorHarmonic=this.ctx.createOscillator(),this.motorHarmonic.type="triangle";const n=this.ctx.createGain();n.gain.value=.9;const s=this.ctx.createGain();s.gain.value=.16,this.motorFundamental.connect(n).connect(this.motorTone),this.motorHarmonic.connect(s).connect(this.motorTone),this.motorTone.connect(this.motorGain).connect(this.master),this.motorFundamental.start(),this.motorHarmonic.start(),this.inverterGain=this.ctx.createGain(),this.inverterGain.gain.value=0,this.inverterWhine=this.ctx.createOscillator(),this.inverterWhine.type="sine";const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.value=720,r.Q.value=.5,this.inverterWhine.connect(r).connect(this.inverterGain).connect(this.master),this.inverterWhine.start(),this.cabinHumGain=this.ctx.createGain(),this.cabinHumGain.gain.value=0,this.cabinHum=this.ctx.createOscillator(),this.cabinHum.type="sine";const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=118,this.cabinHum.connect(a).connect(this.cabinHumGain).connect(this.master),this.cabinHum.start();const o=this.createNoiseBuffer("warm");this.roadNoise=this.ctx.createBufferSource(),this.roadNoise.buffer=o,this.roadNoise.loop=!0,this.roadGain=this.ctx.createGain(),this.roadGain.gain.value=0;const l=this.ctx.createBiquadFilter();l.type="highpass",l.frequency.value=34,this.roadFilter=this.ctx.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadFilter.frequency.value=220,this.roadFilter.Q.value=.56,this.roadNoise.connect(l).connect(this.roadFilter).connect(this.roadGain).connect(this.master),this.roadNoise.start();const c=this.createNoiseBuffer("bright");this.tireNoise=this.ctx.createBufferSource(),this.tireNoise.buffer=c,this.tireNoise.loop=!0,this.tireGain=this.ctx.createGain(),this.tireGain.gain.value=0;const h=this.ctx.createBiquadFilter();h.type="highpass",h.frequency.value=170,this.tireFilter=this.ctx.createBiquadFilter(),this.tireFilter.type="bandpass",this.tireFilter.frequency.value=520,this.tireFilter.Q.value=.62,this.tireNoise.connect(h).connect(this.tireFilter).connect(this.tireGain).connect(this.master),this.tireNoise.start(),this.started=!0}playTireScreech(e,t){const n=e.currentTime,s=e.createOscillator(),r=e.createBiquadFilter(),a=e.createGain();s.type="sawtooth",s.frequency.setValueAtTime(680,n),s.frequency.exponentialRampToValueAtTime(420,n+.6),r.type="bandpass",r.frequency.setValueAtTime(980,n),r.frequency.exponentialRampToValueAtTime(640,n+.55),r.Q.value=4.4,a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.13,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.72),s.connect(r).connect(a).connect(t),s.start(n),s.stop(n+.78)}playImpactCrash(e,t){const n=e.currentTime;if(n-this.lastImpactBurstAt<.22)return;this.lastImpactBurstAt=n;const s=e.createOscillator(),r=e.createBiquadFilter(),a=e.createGain();s.type="sawtooth",s.frequency.setValueAtTime(930,n),s.frequency.exponentialRampToValueAtTime(520,n+.36),r.type="bandpass",r.frequency.setValueAtTime(1150,n),r.frequency.exponentialRampToValueAtTime(620,n+.38),r.Q.value=5.2,a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.11,n+.016),a.gain.exponentialRampToValueAtTime(.018,n+.32),a.gain.exponentialRampToValueAtTime(1e-4,n+.54),s.connect(r).connect(a).connect(t),s.start(n),s.stop(n+.58);const o=e.createOscillator(),l=e.createBiquadFilter(),c=e.createGain();o.type="sine",o.frequency.setValueAtTime(62,n+.035),o.frequency.exponentialRampToValueAtTime(34,n+.34),l.type="lowpass",l.frequency.value=160,c.gain.setValueAtTime(1e-4,n),c.gain.exponentialRampToValueAtTime(.32,n+.045),c.gain.exponentialRampToValueAtTime(1e-4,n+.44),o.connect(l).connect(c).connect(t),o.start(n),o.stop(n+.5);const h=e.createBufferSource(),d=e.createBiquadFilter(),u=e.createGain();h.buffer=this.createNoiseBuffer("bright"),d.type="bandpass",d.frequency.value=340,d.Q.value=1.1,u.gain.setValueAtTime(1e-4,n),u.gain.exponentialRampToValueAtTime(.18,n+.045),u.gain.exponentialRampToValueAtTime(1e-4,n+.24),h.connect(d).connect(u).connect(t),h.start(n+.025),h.stop(n+.28)}createNoiseBuffer(e){const t=this.ctx;if(!t)throw new Error("Audio context is not ready");const n=t.createBuffer(1,t.sampleRate*2,t.sampleRate),s=n.getChannelData(0);let r=0;for(let a=0;a<s.length;a++){const o=Math.random()*2-1;e==="warm"?(r=r*.985+o*.015,s[a]=r*4.2):(r=r*.35+o*.65,s[a]=r)}return n}}const Eh=360,Th=.12;class Ah{last=performance.now();frames=0;acc=0;lastFrameMs=0;frameHistory=[];stages=new Map;fps=0;mark(e=performance.now()){const t=Math.min(.1,Math.max(0,(e-this.last)/1e3));return this.last=e,this.lastFrameMs=t*1e3,this.frameHistory.push(this.lastFrameMs),this.frameHistory.length>Eh&&this.frameHistory.shift(),this.frames++,this.acc+=t,this.acc>=.5&&(this.fps=this.frames/this.acc,this.frames=0,this.acc=0),t}measure(e,t){const n=performance.now();try{return t()}finally{this.record(e,performance.now()-n)}}record(e,t){const n=this.stages.get(e);if(!n){this.stages.set(e,{lastMs:t,avgMs:t,maxMs:t});return}n.lastMs=t,n.avgMs+=(t-n.avgMs)*Th,n.maxMs=Math.max(n.maxMs*.985,t)}snapshot(e){const t=this.frameHistory,n=t.length?t.reduce((l,c)=>l+c,0)/t.length:this.lastFrameMs,s=t.length?Math.max(...t):this.lastFrameMs,r=[...t].sort((l,c)=>l-c),a=r.length?r[Math.max(0,Math.floor(r.length*.99)-1)]:this.lastFrameMs,o={};for(const[l,c]of this.stages)o[l]={lastMs:Un(c.lastMs),avgMs:Un(c.avgMs),maxMs:Un(c.maxMs)};return{fps:Un(this.fps),frameMs:{last:Un(this.lastFrameMs),avg:Un(n),max:Un(s),p99:Un(a),onePercentLowFps:a>0?Un(1e3/a):0},stages:o,renderer:e}}}function Un(i){return Math.round(i*100)/100}const wc="6.0.0",ys=2.2369362921,Xi=1/ys,cn={unmapped:{label:"UNMAPPED",lanes:1,curveAmp:11.5,trees:3.84,buildings:0,city:0,median:.8,guardrailDistance:10.7,forest:1,crosswalks:.85,trafficLights:0,buildingScale:0,buildingSetback:16,skylineDensity:0},l2:{label:"L2 HIGHWAY",lanes:2,curveAmp:5.4,trees:.22,buildings:.28,city:.28,median:4.1,guardrailDistance:4.5,forest:.02,crosswalks:0,trafficLights:.12,buildingScale:.45,buildingSetback:8,skylineDensity:0},l3:{label:"L3 HIGHWAY",lanes:3,curveAmp:2.1,trees:0,buildings:.92,city:.18,median:5.2,guardrailDistance:5.25,forest:0,crosswalks:0,trafficLights:0,buildingScale:2.9,buildingSetback:80,skylineDensity:1}},Xe={laneWidth:5.4,shoulderWidth:2.4,vehicleWidth:1.82,vehicleLength:4.6,tireTrack:1.58,wheelbase:2.7,pedestrianHitRadius:.5,maxSpeedMps:80*Xi,routeWaveMeters:360,driverSteerGain:.72,driverSteerExponent:1.22,lowSpeedSteerRad:.52,highSpeedSteerRad:.115,maxSteerRad:.52,steeringPointsPerSecond:10,offRoadPenaltyPerSecond:10,crashPenalty:200,transitionMs:1e4,fixedHz:60,sampleHz:10};function wh(i){const e=tt(i,-1,1);return Math.sign(e)*Math.pow(Math.abs(e),Xe.driverSteerExponent)}function Ch(i,e,t){if(t>.05)return{accelerator:0,brake:t};const n=e-i,s=tt(n*.22+.08,0,.72),r=tt(-n*.2-.03,0,.62);return{accelerator:s,brake:r}}function Rh(i,e,t){const n=Math.max(i.speedMps,4),s=t==="l3"?.78:.48,r=t==="l3"?1.06:.74,o=-(e.error+Math.sin(i.headingError)*Math.min(n*.42,12))*s/Math.max(n,8)-i.headingError*r,l=t==="l3"?Xe.maxSteerRad*.98:Xe.maxSteerRad*.54;return tt(o,-l,l)}function Ph(i){const e=tt(i/Xe.maxSpeedMps,0,1);return We(Xe.lowSpeedSteerRad,Xe.highSpeedSteerRad,e)}function Lh(i,e,t,n,s){const r=Ph(t.speedMps),a=wh(i.steer)*r*Xe.driverSteerGain;let o=a;const l=tt(i.accelerator,0,1);let c=l,h=tt(i.brake,0,1);if(e.accActive){const d=Ch(t.speedMps,e.setSpeedMps,h);c=l>.05?Math.max(l,d.accelerator):d.accelerator,h=l>.05?0:d.brake}if(e.lcaActive){const d=s==="l3"?"l3":"l2",u=Rh(t,n,d);e.assistSteerAngle+=(u-e.assistSteerAngle)*(d==="l3"?.38:.24),o=tt(a+e.assistSteerAngle,-r,r)}else e.assistSteerAngle*=.82;return{steer:tt(o/Xe.maxSteerRad,-1,1),accelerator:c,brake:h}}class Dh{constructor(e){this.seed=e}seed;scene="unmapped";visualFrom="unmapped";visualTo="unmapped";transition=null;queue=[];reset(e="unmapped",t=this.seed){this.seed=t>>>0,this.scene=e,this.visualFrom=e,this.visualTo=e,this.transition=null,this.queue=[]}requestScene(e,t=Xe.transitionMs){if(!cn[e])throw new Error(`Unknown scene: ${e}`);if(!this.transition&&e===this.scene)return"noop";const n=this.queue[this.queue.length-1];return this.transition&&this.transition.to===e&&this.queue.length===0||n?.target===e?"noop":this.transition?(this.queue.push({target:e,transitionMs:t}),"queued"):(this.beginTransition(e,t),"started")}beginTransition(e,t=Xe.transitionMs){this.transition={from:this.scene,to:e,progress:0,duration:tt(t,1e3,6e4)/1e3},this.visualFrom=this.scene,this.visualTo=e}update(e){if(!this.transition)return{};if(this.transition.progress=tt(this.transition.progress+e/this.transition.duration,0,1),this.transition.progress<1)return{};const t=this.transition.from,n=this.transition.to;if(this.scene=n,this.visualFrom=n,this.visualTo=n,this.transition=null,this.queue.length){const s=this.queue.shift();return this.beginTransition(s.target,s.transitionMs),{completed:{from:t,to:n},started:s.target}}return{completed:{from:t,to:n}}}requestedScene(){return this.transition?.to??this.scene}sceneBlend(){return this.transition?{from:this.transition.from,to:this.transition.to,t:Sh(this.transition.progress)}:{from:this.scene,to:this.scene,t:0}}sceneValue(e){const t=this.sceneBlend();return We(cn[t.from][e],cn[t.to][e],t.t)}laneCount(){const e=this.sceneBlend(),t=cn[e.from].lanes,n=cn[e.to].lanes;return e.t>=.85?n:t}laneFloat(){return this.sceneValue("lanes")}frameAt(e){const t=this.sceneValue("curveAmp"),n=Xe.routeWaveMeters,s=this.seed%4096/4096*pn,r=e/n*pn+s,a=e/(n*.43)*pn+s*.37,o=Math.sin(r)*t+Math.sin(a)*t*.28,l=Math.cos(r)*(pn/n)*t+Math.cos(a)*(pn/(n*.43))*t*.28,c=-Math.sin(r)*(pn/n)**2*t-Math.sin(a)*(pn/(n*.43))**2*t*.28,h=Math.atan(l),d=c/Math.pow(1+l*l,1.5),u=Math.cos(h),m=Math.sin(h);return{s:e,x:o,z:-e,heading:h,curvature:d,rightX:u,rightZ:m,forwardX:-m,forwardZ:-u}}worldFromRoad(e,t,n=0){const s=this.frameAt(e);return{x:s.x+s.rightX*t,y:n,z:s.z+s.rightZ*t,heading:s.heading}}roadFromWorld(e,t){let n=Math.max(0,-t);for(let o=0;o<4;o++){const l=this.frameAt(n),c=e-l.x,h=t-l.z,d=Math.tan(l.heading);n=Math.max(0,n+(c*d-h)/(d*d+1))}const s=this.frameAt(n),r=e-s.x,a=t-s.z;return{s:n,lateral:r*s.rightX+a*s.rightZ,heading:s.heading}}boundsAt(e=0){const t=this.laneFloat(),n=this.laneCount(),s=2*t*Xe.laneWidth,r=-t*Xe.laneWidth,a=t*Xe.laneWidth,o=this.sceneValue("guardrailDistance"),l=Array.from({length:n},(c,h)=>Xe.laneWidth*(h+.5));return{laneCount:n,laneFloat:t,leftEdge:r,rightEdge:a,leftWall:r-o,rightWall:a+o,roadWidth:s,medianWidth:this.sceneValue("median"),laneCenters:l}}nearestLane(e){const t=this.boundsAt().laneCenters;let n=0,s=Number.POSITIVE_INFINITY;for(let r=0;r<t.length;r++){const a=Math.abs(e-t[r]);a<s&&(s=a,n=r)}return{index:n,center:t[n]??0,error:e-(t[n]??0)}}normalizeHeadingError(e,t){return _r(e-this.frameAt(t).heading)}pedestrianAt(e,t){const n=this.boundsAt(e*16),s=oe(e*15.71+this.seed),r=s<.5?-1:1,a=s*pn,o=.18+Math.sin(t*1.8+a)*.16;return{lateral:(r<0?n.leftEdge:n.rightEdge)+r*(.95+Math.max(0,o)),side:r<0?"left":"right",active:this.sceneValue("crosswalks")>.3}}}const vo="185",Ih=0,tl=1,Uh=2,hr=1,Nh=2,Ms=3,ri=0,Kt=1,yt=2,Rn=0,Yi=1,Ji=2,nl=3,il=4,Fh=5,pi=100,Oh=101,Bh=102,zh=103,Gh=104,kh=200,Hh=201,Vh=202,Wh=203,Aa=204,wa=205,Xh=206,qh=207,Yh=208,$h=209,Zh=210,Kh=211,Jh=212,Qh=213,jh=214,Ca=0,Ra=1,Pa=2,Qi=3,La=4,Da=5,Ia=6,Ua=7,xo=0,ed=1,td=2,Pn=0,Mo=1,So=2,bo=3,Cr=4,yo=5,Eo=6,To=7,Cc=300,Mi=301,ji=302,Fr=303,Or=304,Rr=306,Si=1e3,Gn=1001,Na=1002,kt=1003,nd=1004,Ds=1005,Xt=1006,Br=1007,_i=1008,rn=1009,Rc=1010,Pc=1011,ws=1012,Ao=1013,Ln=1014,_n=1015,an=1016,wo=1017,Co=1018,Cs=1020,Lc=35902,Dc=35899,Ic=1021,Uc=1022,vn=1023,Wn=1026,vi=1027,Ro=1028,Po=1029,bi=1030,Lo=1031,Do=1033,dr=33776,ur=33777,fr=33778,pr=33779,Fa=35840,Oa=35841,Ba=35842,za=35843,Ga=36196,ka=37492,Ha=37496,Va=37488,Wa=37489,vr=37490,Xa=37491,qa=37808,Ya=37809,$a=37810,Za=37811,Ka=37812,Ja=37813,Qa=37814,ja=37815,eo=37816,to=37817,no=37818,io=37819,so=37820,ro=37821,ao=36492,oo=36494,lo=36495,co=36283,ho=36284,xr=36285,uo=36286,id=3200,Mr=0,sd=1,ni="",nn="srgb",Sr="srgb-linear",br="linear",ct="srgb",Ci=7680,sl=519,rd=512,ad=513,od=514,Io=515,ld=516,cd=517,Uo=518,hd=519,fo=35044,$i=35048,rl="300 es",xn=2e3,es=2001;function dd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function yr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ud(){const i=yr("canvas");return i.style.display="block",i}const al={};function Er(...i){const e="THREE."+i.shift();console.log(e,...i)}function Nc(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ze(...i){i=Nc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ot(...i){i=Nc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Zi(...i){const e=i.join(" ");e in al||(al[e]=!0,ze(...i))}function fd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const pd={[Ca]:Ra,[Pa]:Ia,[La]:Ua,[Qi]:Da,[Ra]:Ca,[Ia]:Pa,[Ua]:La,[Da]:Qi};class Ei{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ol=1234567;const Es=Math.PI/180,ts=180/Math.PI;function Hn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]).toLowerCase()}function $e(i,e,t){return Math.max(e,Math.min(t,i))}function No(i,e){return(i%e+e)%e}function md(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function gd(i,e,t){return i!==e?(t-i)/(e-i):0}function Ts(i,e,t){return(1-t)*i+t*e}function _d(i,e,t,n){return Ts(i,e,1-Math.exp(-t*n))}function vd(i,e=1){return e-Math.abs(No(i,e*2)-e)}function xd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Md(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function bd(i,e){return i+Math.random()*(e-i)}function yd(i){return i*(.5-Math.random())}function Ed(i){i!==void 0&&(ol=i);let e=ol+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Td(i){return i*Es}function Ad(i){return i*ts}function wd(i){return(i&i-1)===0&&i!==0}function Cd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Rd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pd(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*h,o*c);break;default:ze("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Ld={DEG2RAD:Es,RAD2DEG:ts,generateUUID:Hn,clamp:$e,euclideanModulo:No,mapLinear:md,inverseLerp:gd,lerp:Ts,damp:_d,pingpong:vd,smoothstep:xd,smootherstep:Md,randInt:Sd,randFloat:bd,randFloatSpread:yd,seededRandom:Ed,degToRad:Td,radToDeg:Ad,isPowerOfTwo:wd,ceilPowerOfTwo:Cd,floorPowerOfTwo:Rd,setQuaternionFromProperEuler:Pd,normalize:ht,denormalize:mn};class Be{static{Be.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ai{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],m=r[a+1],g=r[a+2],x=r[a+3];if(d!==x||l!==u||c!==m||h!==g){let p=l*u+c*m+h*g+d*x;p<0&&(u=-u,m=-m,g=-g,x=-x,p=-p);let f=1-o;if(p<.9995){const b=Math.acos(p),A=Math.sin(b);f=Math.sin(f*b)/A,o=Math.sin(o*b)/A,l=l*f+u*o,c=c*f+m*o,h=h*f+g*o,d=d*f+x*o}else{l=l*f+u*o,c=c*f+m*o,h=h*f+g*o,d=d*f+x*o;const b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*m-c*u,e[t+1]=l*g+h*u+c*d-o*m,e[t+2]=c*g+h*m+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"YXZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"ZXY":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"ZYX":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"YZX":this._x=u*h*d+c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d-u*m*g;break;case"XZY":this._x=u*h*d-c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d+u*m*g;break;default:ze("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{static{R.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ll.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ll.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return zr.copy(this).projectOnVector(e),this.sub(zr)}reflect(e){return this.sub(zr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const zr=new R,ll=new ai;class qe{static{qe.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],m=n[5],g=n[8],x=s[0],p=s[3],f=s[6],b=s[1],A=s[4],M=s[7],w=s[2],y=s[5],C=s[8];return r[0]=a*x+o*b+l*w,r[3]=a*p+o*A+l*y,r[6]=a*f+o*M+l*C,r[1]=c*x+h*b+d*w,r[4]=c*p+h*A+d*y,r[7]=c*f+h*M+d*C,r[2]=u*x+m*b+g*w,r[5]=u*p+m*A+g*y,r[8]=u*f+m*M+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,m=c*r-a*l,g=t*d+n*u+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=u*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=m*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Gr.makeScale(e,t)),this}rotate(e){return Zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Gr.makeRotation(-e)),this}translate(e,t){return Zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Gr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Gr=new qe,cl=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hl=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dd(){const i={enabled:!0,workingColorSpace:Sr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ct&&(s.r=Vn(s.r),s.g=Vn(s.g),s.b=Vn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ct&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ni?br:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Sr]:{primaries:e,whitePoint:n,transfer:br,toXYZ:cl,fromXYZ:hl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:cl,fromXYZ:hl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),i}const et=Dd();function Vn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ri;class Id{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ri===void 0&&(Ri=yr("canvas")),Ri.width=e.width,Ri.height=e.height;const s=Ri.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ri}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=yr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Vn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Vn(t[n]/255)*255):t[n]=Vn(t[n]);return{data:t,width:e.width,height:e.height}}else return ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ud=0;class Fo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=Hn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(kr(s[a].image)):r.push(kr(s[a]))}else r=kr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function kr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Id.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ze("Texture: Unable to serialize Texture."),{})}let Nd=0;const Hr=new R;class qt extends Ei{constructor(e=qt.DEFAULT_IMAGE,t=qt.DEFAULT_MAPPING,n=Gn,s=Gn,r=Xt,a=_i,o=vn,l=rn,c=qt.DEFAULT_ANISOTROPY,h=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Hn(),this.name="",this.source=new Fo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Be(0,0),this.repeat=new Be(1,1),this.center=new Be(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Hr).x}get height(){return this.source.getSize(Hr).y}get depth(){return this.source.getSize(Hr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ze(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Si:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case Na:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Si:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case Na:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}qt.DEFAULT_IMAGE=null;qt.DEFAULT_MAPPING=Cc;qt.DEFAULT_ANISOTROPY=1;class ut{static{ut.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],m=l[5],g=l[9],x=l[2],p=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(c+1)/2,M=(m+1)/2,w=(f+1)/2,y=(h+u)/4,C=(d+x)/4,v=(g+p)/4;return A>M&&A>w?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=y/n,r=C/n):M>w?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=y/s,r=v/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=v/r),this.set(n,s,r,t),this}let b=Math.sqrt((p-g)*(p-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(d-x)/b,this.z=(u-h)/b,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fd extends Ei{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new qt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Fo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jt extends Fd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Fc extends qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Od extends qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ft{static{ft.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,d,u,m,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,m,g,x,p)}set(e,t,n,s,r,a,o,l,c,h,d,u,m,g,x,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=m,f[7]=g,f[11]=x,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Pi.setFromMatrixColumn(e,0).length(),r=1/Pi.setFromMatrixColumn(e,1).length(),a=1/Pi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,m=a*d,g=o*h,x=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=m+g*c,t[5]=u-x*c,t[9]=-o*l,t[2]=x-u*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,m=l*d,g=c*h,x=c*d;t[0]=u+x*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=m*o-g,t[6]=x+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,m=l*d,g=c*h,x=c*d;t[0]=u-x*o,t[4]=-a*d,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*h,t[9]=x-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,m=a*d,g=o*h,x=o*d;t[0]=l*h,t[4]=g*c-m,t[8]=u*c+x,t[1]=l*d,t[5]=x*c+u,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,m=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=x-u*d,t[8]=g*d+m,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=a*l,m=a*c,g=o*l,x=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+x,t[5]=a*h,t[9]=m*d-g,t[2]=g*d-m,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bd,e,zd)}lookAt(e,t,n){const s=this.elements;return jt.subVectors(e,t),jt.lengthSq()===0&&(jt.z=1),jt.normalize(),$n.crossVectors(n,jt),$n.lengthSq()===0&&(Math.abs(n.z)===1?jt.x+=1e-4:jt.z+=1e-4,jt.normalize(),$n.crossVectors(n,jt)),$n.normalize(),Is.crossVectors(jt,$n),s[0]=$n.x,s[4]=Is.x,s[8]=jt.x,s[1]=$n.y,s[5]=Is.y,s[9]=jt.y,s[2]=$n.z,s[6]=Is.z,s[10]=jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],m=n[13],g=n[2],x=n[6],p=n[10],f=n[14],b=n[3],A=n[7],M=n[11],w=n[15],y=s[0],C=s[4],v=s[8],T=s[12],L=s[1],P=s[5],N=s[9],X=s[13],$=s[2],B=s[6],q=s[10],k=s[14],J=s[3],te=s[7],he=s[11],ue=s[15];return r[0]=a*y+o*L+l*$+c*J,r[4]=a*C+o*P+l*B+c*te,r[8]=a*v+o*N+l*q+c*he,r[12]=a*T+o*X+l*k+c*ue,r[1]=h*y+d*L+u*$+m*J,r[5]=h*C+d*P+u*B+m*te,r[9]=h*v+d*N+u*q+m*he,r[13]=h*T+d*X+u*k+m*ue,r[2]=g*y+x*L+p*$+f*J,r[6]=g*C+x*P+p*B+f*te,r[10]=g*v+x*N+p*q+f*he,r[14]=g*T+x*X+p*k+f*ue,r[3]=b*y+A*L+M*$+w*J,r[7]=b*C+A*P+M*B+w*te,r[11]=b*v+A*N+M*q+w*he,r[15]=b*T+A*X+M*k+w*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],m=e[14],g=e[3],x=e[7],p=e[11],f=e[15],b=l*m-c*u,A=o*m-c*d,M=o*u-l*d,w=a*m-c*h,y=a*u-l*h,C=a*d-o*h;return t*(x*b-p*A+f*M)-n*(g*b-p*w+f*y)+s*(g*A-x*w+f*C)-r*(g*M-x*y+p*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],m=e[11],g=e[12],x=e[13],p=e[14],f=e[15],b=t*o-n*a,A=t*l-s*a,M=t*c-r*a,w=n*l-s*o,y=n*c-r*o,C=s*c-r*l,v=h*x-d*g,T=h*p-u*g,L=h*f-m*g,P=d*p-u*x,N=d*f-m*x,X=u*f-m*p,$=b*X-A*N+M*P+w*L-y*T+C*v;if($===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/$;return e[0]=(o*X-l*N+c*P)*B,e[1]=(s*N-n*X-r*P)*B,e[2]=(x*C-p*y+f*w)*B,e[3]=(u*y-d*C-m*w)*B,e[4]=(l*L-a*X-c*T)*B,e[5]=(t*X-s*L+r*T)*B,e[6]=(p*M-g*C-f*A)*B,e[7]=(h*C-u*M+m*A)*B,e[8]=(a*N-o*L+c*v)*B,e[9]=(n*L-t*N-r*v)*B,e[10]=(g*y-x*M+f*b)*B,e[11]=(d*M-h*y-m*b)*B,e[12]=(o*T-a*P-l*v)*B,e[13]=(t*P-n*T+s*v)*B,e[14]=(x*A-g*w-p*b)*B,e[15]=(h*w-d*A+u*b)*B,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,m=r*h,g=r*d,x=a*h,p=a*d,f=o*d,b=l*c,A=l*h,M=l*d,w=n.x,y=n.y,C=n.z;return s[0]=(1-(x+f))*w,s[1]=(m+M)*w,s[2]=(g-A)*w,s[3]=0,s[4]=(m-M)*y,s[5]=(1-(u+f))*y,s[6]=(p+b)*y,s[7]=0,s[8]=(g+A)*C,s[9]=(p-b)*C,s[10]=(1-(u+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Pi.set(s[0],s[1],s[2]).length();const o=Pi.set(s[4],s[5],s[6]).length(),l=Pi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),dn.copy(this);const c=1/a,h=1/o,d=1/l;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=d,dn.elements[9]*=d,dn.elements[10]*=d,t.setFromRotationMatrix(dn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=xn,l=!1){const c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),m=(n+s)/(n-s);let g,x;if(l)g=r/(a-r),x=a*r/(a-r);else if(o===xn)g=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===es)g=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=xn,l=!1){const c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,x;if(l)g=1/(a-r),x=a/(a-r);else if(o===xn)g=-2/(a-r),x=-(a+r)/(a-r);else if(o===es)g=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Pi=new R,dn=new ft,Bd=new R(0,0,0),zd=new R(1,1,1),$n=new R,Is=new R,jt=new R,dl=new ft,ul=new ai;class Dn{constructor(e=0,t=0,n=0,s=Dn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ul.setFromEuler(this),this.setFromQuaternion(ul,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dn.DEFAULT_ORDER="XYZ";class Oc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gd=0;const fl=new R,Li=new ai,Nn=new ft,Us=new R,cs=new R,kd=new R,Hd=new ai,pl=new R(1,0,0),ml=new R(0,1,0),gl=new R(0,0,1),_l={type:"added"},Vd={type:"removed"},Di={type:"childadded",child:null},Vr={type:"childremoved",child:null};class Ct extends Ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=Hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new R,t=new Dn,n=new ai,s=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new qe}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.multiply(Li),this}rotateOnWorldAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.premultiply(Li),this}rotateX(e){return this.rotateOnAxis(pl,e)}rotateY(e){return this.rotateOnAxis(ml,e)}rotateZ(e){return this.rotateOnAxis(gl,e)}translateOnAxis(e,t){return fl.copy(e).applyQuaternion(this.quaternion),this.position.add(fl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(pl,e)}translateY(e){return this.translateOnAxis(ml,e)}translateZ(e){return this.translateOnAxis(gl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Us.copy(e):Us.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(cs,Us,this.up):Nn.lookAt(Us,cs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),Li.setFromRotationMatrix(Nn),this.quaternion.premultiply(Li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ot("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_l),Di.child=e,this.dispatchEvent(Di),Di.child=null):ot("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Vd),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Nn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Nn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_l),Di.child=e,this.dispatchEvent(Di),Di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,e,kd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,Hd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new R(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class kn extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wd={type:"move"};class Wr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,n),f=this._getHandJoint(c,x);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,g=.005;c.inputState.pinching&&u>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new kn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Bc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Ns={h:0,s:0,l:0};function Xr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Se{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=No(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Xr(a,r,e+1/3),this.g=Xr(a,r,e),this.b=Xr(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=nn){function n(r){r!==void 0&&parseFloat(r)<1&&ze("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ze("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const n=Bc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vn(e.r),this.g=Vn(e.g),this.b=Vn(e.b),this}copyLinearToSRGB(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return et.workingToColorSpace(Wt.copy(this),e),Math.round($e(Wt.r*255,0,255))*65536+Math.round($e(Wt.g*255,0,255))*256+Math.round($e(Wt.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Wt.copy(this),t);const n=Wt.r,s=Wt.g,r=Wt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Wt.copy(this),t),e.r=Wt.r,e.g=Wt.g,e.b=Wt.b,e}getStyle(e=nn){et.workingToColorSpace(Wt.copy(this),e);const t=Wt.r,n=Wt.g,s=Wt.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Zn),this.setHSL(Zn.h+e,Zn.s+t,Zn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Zn),e.getHSL(Ns);const n=Ts(Zn.h,Ns.h,t),s=Ts(Zn.s,Ns.s,t),r=Ts(Zn.l,Ns.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Wt=new Se;Se.NAMES=Bc;class Tr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Se(e),this.near=t,this.far=n}clone(){return new Tr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Xd extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dn,this.environmentIntensity=1,this.environmentRotation=new Dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const un=new R,Fn=new R,qr=new R,On=new R,Ii=new R,Ui=new R,vl=new R,Yr=new R,$r=new R,Zr=new R,Kr=new ut,Jr=new ut,Qr=new ut;class gn{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),un.subVectors(e,t),s.cross(un);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){un.subVectors(s,t),Fn.subVectors(n,t),qr.subVectors(e,t);const a=un.dot(un),o=un.dot(Fn),l=un.dot(qr),c=Fn.dot(Fn),h=Fn.dot(qr),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,m=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,On)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,On.x),l.addScaledVector(a,On.y),l.addScaledVector(o,On.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Kr.setScalar(0),Jr.setScalar(0),Qr.setScalar(0),Kr.fromBufferAttribute(e,t),Jr.fromBufferAttribute(e,n),Qr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Kr,r.x),a.addScaledVector(Jr,r.y),a.addScaledVector(Qr,r.z),a}static isFrontFacing(e,t,n,s){return un.subVectors(n,t),Fn.subVectors(e,t),un.cross(Fn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),un.cross(Fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ii.subVectors(s,n),Ui.subVectors(r,n),Yr.subVectors(e,n);const l=Ii.dot(Yr),c=Ui.dot(Yr);if(l<=0&&c<=0)return t.copy(n);$r.subVectors(e,s);const h=Ii.dot($r),d=Ui.dot($r);if(h>=0&&d<=h)return t.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ii,a);Zr.subVectors(e,r);const m=Ii.dot(Zr),g=Ui.dot(Zr);if(g>=0&&m<=g)return t.copy(r);const x=m*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ui,o);const p=h*g-m*d;if(p<=0&&d-h>=0&&m-g>=0)return vl.subVectors(r,s),o=(d-h)/(d-h+(m-g)),t.copy(s).addScaledVector(vl,o);const f=1/(p+x+u);return a=x*f,o=u*f,t.copy(n).addScaledVector(Ii,a).addScaledVector(Ui,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class In{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,fn):fn.fromBufferAttribute(r,a),fn.applyMatrix4(e.matrixWorld),this.expandByPoint(fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fs.copy(n.boundingBox)),Fs.applyMatrix4(e.matrixWorld),this.union(Fs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fn),fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(hs),Os.subVectors(this.max,hs),Ni.subVectors(e.a,hs),Fi.subVectors(e.b,hs),Oi.subVectors(e.c,hs),Kn.subVectors(Fi,Ni),Jn.subVectors(Oi,Fi),ci.subVectors(Ni,Oi);let t=[0,-Kn.z,Kn.y,0,-Jn.z,Jn.y,0,-ci.z,ci.y,Kn.z,0,-Kn.x,Jn.z,0,-Jn.x,ci.z,0,-ci.x,-Kn.y,Kn.x,0,-Jn.y,Jn.x,0,-ci.y,ci.x,0];return!jr(t,Ni,Fi,Oi,Os)||(t=[1,0,0,0,1,0,0,0,1],!jr(t,Ni,Fi,Oi,Os))?!1:(Bs.crossVectors(Kn,Jn),t=[Bs.x,Bs.y,Bs.z],jr(t,Ni,Fi,Oi,Os))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Bn=[new R,new R,new R,new R,new R,new R,new R,new R],fn=new R,Fs=new In,Ni=new R,Fi=new R,Oi=new R,Kn=new R,Jn=new R,ci=new R,hs=new R,Os=new R,Bs=new R,hi=new R;function jr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){hi.fromArray(i,r);const o=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),l=e.dot(hi),c=t.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Dt=new R,zs=new Be;let qd=0;class bt extends Ei{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=fo,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)zs.fromBufferAttribute(this,t),zs.applyMatrix3(e),this.setXY(t,zs.x,zs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==fo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class zc extends bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Gc extends bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class gt extends bt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Yd=new In,ds=new R,ea=new R;class oi{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Yd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ds.subVectors(e,this.center);const t=ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ds,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ds.copy(e.center).add(ea)),this.expandByPoint(ds.copy(e.center).sub(ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let $d=0;const ln=new ft,ta=new Ct,Bi=new R,en=new In,us=new In,Ot=new R;class Et extends Ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=Hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(dd(e)?Gc:zc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ln.makeRotationFromQuaternion(e),this.applyMatrix4(ln),this}rotateX(e){return ln.makeRotationX(e),this.applyMatrix4(ln),this}rotateY(e){return ln.makeRotationY(e),this.applyMatrix4(ln),this}rotateZ(e){return ln.makeRotationZ(e),this.applyMatrix4(ln),this}translate(e,t,n){return ln.makeTranslation(e,t,n),this.applyMatrix4(ln),this}scale(e,t,n){return ln.makeScale(e,t,n),this.applyMatrix4(ln),this}lookAt(e){return ta.lookAt(e),ta.updateMatrix(),this.applyMatrix4(ta.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new In);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];en.setFromBufferAttribute(r),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];us.setFromBufferAttribute(o),this.morphTargetsRelative?(Ot.addVectors(en.min,us.min),en.expandByPoint(Ot),Ot.addVectors(en.max,us.max),en.expandByPoint(Ot)):(en.expandByPoint(us.min),en.expandByPoint(us.max))}en.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ot.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ot));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ot.fromBufferAttribute(o,c),l&&(Bi.fromBufferAttribute(e,c),Ot.add(Bi)),s=Math.max(s,n.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new bt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new R,l[v]=new R;const c=new R,h=new R,d=new R,u=new Be,m=new Be,g=new Be,x=new R,p=new R;function f(v,T,L){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,L),u.fromBufferAttribute(r,v),m.fromBufferAttribute(r,T),g.fromBufferAttribute(r,L),h.sub(c),d.sub(c),m.sub(u),g.sub(u);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(P),p.copy(d).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(P),o[v].add(x),o[T].add(x),o[L].add(x),l[v].add(p),l[T].add(p),l[L].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let v=0,T=b.length;v<T;++v){const L=b[v],P=L.start,N=L.count;for(let X=P,$=P+N;X<$;X+=3)f(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const A=new R,M=new R,w=new R,y=new R;function C(v){w.fromBufferAttribute(s,v),y.copy(w);const T=o[v];A.copy(T),A.sub(w.multiplyScalar(w.dot(T))).normalize(),M.crossVectors(y,T);const P=M.dot(l[v])<0?-1:1;a.setXYZW(v,A.x,A.y,A.z,P)}for(let v=0,T=b.length;v<T;++v){const L=b[v],P=L.start,N=L.count;for(let X=P,$=P+N;X<$;X+=3)C(e.getX(X+0)),C(e.getX(X+1)),C(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const s=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,d=new R;if(e)for(let u=0,m=e.count;u<m;u+=3){const g=e.getX(u+0),x=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let m=0,g=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*h;for(let f=0;f<h;f++)u[g++]=c[m++]}return new bt(u,h,d)}if(this.index===null)return ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Et,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],m=e(u,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const m=c[d];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=fo,this.updateRanges=[],this.version=0,this.uuid=Hn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Yt=new R;class ii{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyMatrix4(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyNormalMatrix(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.transformDirection(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Er("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ii(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Er("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Kd=0;class Ti extends Ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=Hn(),this.name="",this.type="Material",this.blending=Yi,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=wa,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){ze(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Yi&&(n.blending=this.blending),this.side!==ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==wa&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Se().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Be().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Be().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const zn=new R,na=new R,Gs=new R,Qn=new R,ia=new R,ks=new R,sa=new R;class kc{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){na.copy(e).add(t).multiplyScalar(.5),Gs.copy(t).sub(e).normalize(),Qn.copy(this.origin).sub(na);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Gs),o=Qn.dot(this.direction),l=-Qn.dot(Gs),c=Qn.lengthSq(),h=Math.abs(1-a*a);let d,u,m,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const x=1/h;d*=x,u*=x,m=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),m=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(na).addScaledVector(Gs,u),m}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,n,s,r){ia.subVectors(t,e),ks.subVectors(n,e),sa.crossVectors(ia,ks);let a=this.direction.dot(sa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Qn.subVectors(this.origin,e);const l=o*this.direction.dot(ks.crossVectors(Qn,ks));if(l<0)return null;const c=o*this.direction.dot(ia.cross(Qn));if(c<0||l+c>a)return null;const h=-o*Qn.dot(sa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class hn extends Ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.combine=xo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xl=new ft,di=new kc,Hs=new oi,Ml=new R,Vs=new R,Ws=new R,Xs=new R,ra=new R,qs=new R,Sl=new R,Ys=new R;class rt extends Ct{constructor(e=new Et,t=new hn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(ra.fromBufferAttribute(d,e),a?qs.addScaledVector(ra,h):qs.addScaledVector(ra.sub(t),h))}t.add(qs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(r),di.copy(e.ray).recast(e.near),!(Hs.containsPoint(di.origin)===!1&&(di.intersectSphere(Hs,Ml)===null||di.origin.distanceToSquared(Ml)>(e.far-e.near)**2))&&(xl.copy(r).invert(),di.copy(e.ray).applyMatrix4(xl),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=a[p.materialIndex],b=Math.max(p.start,m.start),A=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=b,w=A;M<w;M+=3){const y=o.getX(M),C=o.getX(M+1),v=o.getX(M+2);s=$s(this,f,e,n,c,h,d,y,C,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const b=o.getX(p),A=o.getX(p+1),M=o.getX(p+2);s=$s(this,a,e,n,c,h,d,b,A,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=a[p.materialIndex],b=Math.max(p.start,m.start),A=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=b,w=A;M<w;M+=3){const y=M,C=M+1,v=M+2;s=$s(this,f,e,n,c,h,d,y,C,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const b=p,A=p+1,M=p+2;s=$s(this,a,e,n,c,h,d,b,A,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Jd(i,e,t,n,s,r,a,o){let l;if(e.side===Kt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===ri,o),l===null)return null;Ys.copy(o),Ys.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ys);return c<t.near||c>t.far?null:{distance:c,point:Ys.clone(),object:i}}function $s(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Vs),i.getVertexPosition(l,Ws),i.getVertexPosition(c,Xs);const h=Jd(i,e,t,n,Vs,Ws,Xs,Sl);if(h){const d=new R;gn.getBarycoord(Sl,Vs,Ws,Xs,d),s&&(h.uv=gn.getInterpolatedAttribute(s,o,l,c,d,new Be)),r&&(h.uv1=gn.getInterpolatedAttribute(r,o,l,c,d,new Be)),a&&(h.normal=gn.getInterpolatedAttribute(a,o,l,c,d,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};gn.getNormal(Vs,Ws,Xs,u.normal),h.face=u,h.barycoord=d}return h}class Hc extends qt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=kt,h=kt,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class bl extends bt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const zi=new ft,yl=new ft,Zs=[],El=new In,Qd=new ft,fs=new rt,ps=new oi;class jd extends rt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Qd)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new In),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zi),El.copy(e.boundingBox).applyMatrix4(zi),this.boundingBox.union(El)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new oi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zi),ps.copy(e.boundingSphere).applyMatrix4(zi),this.boundingSphere.union(ps)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(fs.geometry=this.geometry,fs.material=this.material,fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ps.copy(this.boundingSphere),ps.applyMatrix4(n),e.ray.intersectsSphere(ps)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zi),yl.multiplyMatrices(n,zi),fs.matrixWorld=yl,fs.raycast(e,Zs);for(let a=0,o=Zs.length;a<o;a++){const l=Zs[a];l.instanceId=r,l.object=this,t.push(l)}Zs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hc(new Float32Array(s*this.count),s,this.count,Ro,_n));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const aa=new R,eu=new R,tu=new qe;class fi{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=aa.subVectors(n,t).cross(eu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(aa),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||tu.getNormalMatrix(e),s=this.coplanarPoint(aa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new oi,nu=new Be(.5,.5),Ks=new R;class Oo{constructor(e=new fi,t=new fi,n=new fi,s=new fi,r=new fi,a=new fi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],m=r[7],g=r[8],x=r[9],p=r[10],f=r[11],b=r[12],A=r[13],M=r[14],w=r[15];if(s[0].setComponents(c-a,m-h,f-g,w-b).normalize(),s[1].setComponents(c+a,m+h,f+g,w+b).normalize(),s[2].setComponents(c+o,m+d,f+x,w+A).normalize(),s[3].setComponents(c-o,m-d,f-x,w-A).normalize(),n)s[4].setComponents(l,u,p,M).normalize(),s[5].setComponents(c-l,m-u,f-p,w-M).normalize();else if(s[4].setComponents(c-l,m-u,f-p,w-M).normalize(),t===xn)s[5].setComponents(c+l,m+u,f+p,w+M).normalize();else if(t===es)s[5].setComponents(l,u,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){ui.center.set(0,0,0);const t=nu.distanceTo(e.center);return ui.radius=.7071067811865476+t,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ks.x=s.normal.x>0?e.max.x:e.min.x,Ks.y=s.normal.y>0?e.max.y:e.min.y,Ks.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ks)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Vc extends Ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ar=new R,wr=new R,Tl=new ft,ms=new kc,Js=new oi,oa=new R,Al=new R;class iu extends Ct{constructor(e=new Et,t=new Vc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ar.fromBufferAttribute(t,s-1),wr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ar.distanceTo(wr);e.setAttribute("lineDistance",new gt(n,1))}else ze("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Js.copy(n.boundingSphere),Js.applyMatrix4(s),Js.radius+=r,e.ray.intersectsSphere(Js)===!1)return;Tl.copy(s).invert(),ms.copy(e.ray).applyMatrix4(Tl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=m,p=g-1;x<p;x+=c){const f=h.getX(x),b=h.getX(x+1),A=Qs(this,e,ms,l,f,b,x);A&&t.push(A)}if(this.isLineLoop){const x=h.getX(g-1),p=h.getX(m),f=Qs(this,e,ms,l,x,p,g-1);f&&t.push(f)}}else{const m=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let x=m,p=g-1;x<p;x+=c){const f=Qs(this,e,ms,l,x,x+1,x);f&&t.push(f)}if(this.isLineLoop){const x=Qs(this,e,ms,l,g-1,m,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Qs(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Ar.fromBufferAttribute(o,s),wr.fromBufferAttribute(o,r),t.distanceSqToSegment(Ar,wr,oa,Al)>n)return;oa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(oa);if(!(c<e.near||c>e.far))return{distance:c,point:Al.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const wl=new R,Cl=new R;class su extends iu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)wl.fromBufferAttribute(t,s),Cl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+wl.distanceTo(Cl);e.setAttribute("lineDistance",new gt(n,1))}else ze("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wc extends qt{constructor(e=[],t=Mi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Xc extends qt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ns extends qt{constructor(e,t,n=Ln,s,r,a,o=kt,l=kt,c,h=Wn,d=1){if(h!==Wn&&h!==vi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ru extends ns{constructor(e,t=Ln,n=Mi,s,r,a=kt,o=kt,l,c=Wn){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class qc extends qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class lt extends Et{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(h,3)),this.setAttribute("uv",new gt(d,2));function g(x,p,f,b,A,M,w,y,C,v,T){const L=M/C,P=w/v,N=M/2,X=w/2,$=y/2,B=C+1,q=v+1;let k=0,J=0;const te=new R;for(let he=0;he<q;he++){const ue=he*P-X;for(let ve=0;ve<B;ve++){const nt=ve*L-N;te[x]=nt*b,te[p]=ue*A,te[f]=$,c.push(te.x,te.y,te.z),te[x]=0,te[p]=0,te[f]=y>0?1:-1,h.push(te.x,te.y,te.z),d.push(ve/C),d.push(1-he/v),k+=1}}for(let he=0;he<v;he++)for(let ue=0;ue<C;ue++){const ve=u+ue+B*he,nt=u+ue+B*(he+1),_t=u+(ue+1)+B*(he+1),it=u+(ue+1)+B*he;l.push(ve,nt,it),l.push(nt,_t,it),J+=6}o.addGroup(m,J,T),m+=J,u+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class is extends Et{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],m=[];let g=0;const x=[],p=n/2;let f=0;b(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new gt(d,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(m,2));function b(){const M=new R,w=new R;let y=0;const C=(t-e)/n;for(let v=0;v<=r;v++){const T=[],L=v/r,P=L*(t-e)+e;for(let N=0;N<=s;N++){const X=N/s,$=X*l+o,B=Math.sin($),q=Math.cos($);w.x=P*B,w.y=-L*n+p,w.z=P*q,d.push(w.x,w.y,w.z),M.set(B,C,q).normalize(),u.push(M.x,M.y,M.z),m.push(X,1-L),T.push(g++)}x.push(T)}for(let v=0;v<s;v++)for(let T=0;T<r;T++){const L=x[T][v],P=x[T+1][v],N=x[T+1][v+1],X=x[T][v+1];(e>0||T!==0)&&(h.push(L,P,X),y+=3),(t>0||T!==r-1)&&(h.push(P,N,X),y+=3)}c.addGroup(f,y,0),f+=y}function A(M){const w=g,y=new Be,C=new R;let v=0;const T=M===!0?e:t,L=M===!0?1:-1;for(let N=1;N<=s;N++)d.push(0,p*L,0),u.push(0,L,0),m.push(.5,.5),g++;const P=g;for(let N=0;N<=s;N++){const $=N/s*l+o,B=Math.cos($),q=Math.sin($);C.x=T*q,C.y=p*L,C.z=T*B,d.push(C.x,C.y,C.z),u.push(0,L,0),y.x=B*.5+.5,y.y=q*.5*L+.5,m.push(y.x,y.y),g++}for(let N=0;N<s;N++){const X=w+N,$=P+N;M===!0?h.push($,$+1,X):h.push($+1,$,X),v+=3}c.addGroup(f,v,M===!0?1:2),f+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Bo extends is{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Bo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zo extends Et{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new gt(r,3)),this.setAttribute("normal",new gt(r.slice(),3)),this.setAttribute("uv",new gt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const A=new R,M=new R,w=new R;for(let y=0;y<t.length;y+=3)m(t[y+0],A),m(t[y+1],M),m(t[y+2],w),l(A,M,w,b)}function l(b,A,M,w){const y=w+1,C=[];for(let v=0;v<=y;v++){C[v]=[];const T=b.clone().lerp(M,v/y),L=A.clone().lerp(M,v/y),P=y-v;for(let N=0;N<=P;N++)N===0&&v===y?C[v][N]=T:C[v][N]=T.clone().lerp(L,N/P)}for(let v=0;v<y;v++)for(let T=0;T<2*(y-v)-1;T++){const L=Math.floor(T/2);T%2===0?(u(C[v][L+1]),u(C[v+1][L]),u(C[v][L])):(u(C[v][L+1]),u(C[v+1][L+1]),u(C[v+1][L]))}}function c(b){const A=new R;for(let M=0;M<r.length;M+=3)A.x=r[M+0],A.y=r[M+1],A.z=r[M+2],A.normalize().multiplyScalar(b),r[M+0]=A.x,r[M+1]=A.y,r[M+2]=A.z}function h(){const b=new R;for(let A=0;A<r.length;A+=3){b.x=r[A+0],b.y=r[A+1],b.z=r[A+2];const M=p(b)/2/Math.PI+.5,w=f(b)/Math.PI+.5;a.push(M,1-w)}g(),d()}function d(){for(let b=0;b<a.length;b+=6){const A=a[b+0],M=a[b+2],w=a[b+4],y=Math.max(A,M,w),C=Math.min(A,M,w);y>.9&&C<.1&&(A<.2&&(a[b+0]+=1),M<.2&&(a[b+2]+=1),w<.2&&(a[b+4]+=1))}}function u(b){r.push(b.x,b.y,b.z)}function m(b,A){const M=b*3;A.x=e[M+0],A.y=e[M+1],A.z=e[M+2]}function g(){const b=new R,A=new R,M=new R,w=new R,y=new Be,C=new Be,v=new Be;for(let T=0,L=0;T<r.length;T+=9,L+=6){b.set(r[T+0],r[T+1],r[T+2]),A.set(r[T+3],r[T+4],r[T+5]),M.set(r[T+6],r[T+7],r[T+8]),y.set(a[L+0],a[L+1]),C.set(a[L+2],a[L+3]),v.set(a[L+4],a[L+5]),w.copy(b).add(A).add(M).divideScalar(3);const P=p(w);x(y,L+0,b,P),x(C,L+2,A,P),x(v,L+4,M,P)}}function x(b,A,M,w){w<0&&b.x===1&&(a[A]=b.x-1),M.x===0&&M.z===0&&(a[A]=w/2/Math.PI+.5)}function p(b){return Math.atan2(b.z,-b.x)}function f(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zo(e.vertices,e.indices,e.radius,e.detail)}}class Rs extends zo{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Rs(e.radius,e.detail)}}class ss extends Et{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,m=[],g=[],x=[],p=[];for(let f=0;f<h;f++){const b=f*u-a;for(let A=0;A<c;A++){const M=A*d-r;g.push(M,-b,0),x.push(0,0,1),p.push(A/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){const A=b+c*f,M=b+c*(f+1),w=b+1+c*(f+1),y=b+1+c*f;m.push(A,M,y),m.push(M,w,y)}this.setIndex(m),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(x,3)),this.setAttribute("uv",new gt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ss(e.width,e.height,e.widthSegments,e.heightSegments)}}class Go extends Et{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new R,u=new R,m=[],g=[],x=[],p=[];for(let f=0;f<=n;f++){const b=[],A=f/n,M=a+A*o,w=e*Math.cos(M),y=Math.sqrt(e*e-w*w);let C=0;f===0&&a===0?C=.5/t:f===n&&l===Math.PI&&(C=-.5/t);for(let v=0;v<=t;v++){const T=v/t,L=s+T*r;d.x=-y*Math.cos(L),d.y=w,d.z=y*Math.sin(L),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),p.push(T+C,1-A),b.push(c++)}h.push(b)}for(let f=0;f<n;f++)for(let b=0;b<t;b++){const A=h[f][b+1],M=h[f][b],w=h[f+1][b],y=h[f+1][b+1];(f!==0||a>0)&&m.push(A,M,y),(f!==n-1||l<Math.PI)&&m.push(M,w,y)}this.setIndex(m),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(x,3)),this.setAttribute("uv",new gt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Go(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class au extends Et{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,s=new R,r=new R;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,m=d.count;for(let g=u,x=u+m;g<x;g+=3)for(let p=0;p<3;p++){const f=o.getX(g+p),b=o.getX(g+(p+1)%3);s.fromBufferAttribute(a,f),r.fromBufferAttribute(a,b),Rl(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,d),Rl(s,r,n)===!0&&(t.push(s.x,s.y,s.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new gt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Rl(i,e,t){const n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(s)===!0?!1:(t.add(n),t.add(s),!0)}function rs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Pl(s))s.isRenderTargetTexture?(ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Pl(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function $t(i){const e={};for(let t=0;t<i.length;t++){const n=rs(i[t]);for(const s in n)e[s]=n[s]}return e}function Pl(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function ou(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Yc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const yi={clone:rs,merge:$t};var lu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ut extends Ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lu,this.fragmentShader=cu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=ou(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Se().setHex(s.value);break;case"v2":this.uniforms[n].value=new Be().fromArray(s.value);break;case"v3":this.uniforms[n].value=new R().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(s.value);break;case"m3":this.uniforms[n].value=new qe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ft().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class $c extends Ut{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ti extends Ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mr,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class St extends Ti{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mr,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.combine=xo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hu extends Ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=id,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class du extends Ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Pr extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class uu extends Pr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Se(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const la=new ft,Ll=new R,Dl=new R;class Zc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Be(512,512),this.mapType=rn,this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new Be(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ll.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ll),Dl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Dl),t.updateMatrixWorld(),la.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(la,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===es||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(la)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const js=new R,er=new ai,yn=new R;class ko extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(js,er,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(js,er,yn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(js,er,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(js,er,yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const jn=new R,Il=new Be,Ul=new Be;class sn extends ko{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ts*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,t){return this.getViewBounds(e,Il,Ul),t.subVectors(Ul,Il)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Es*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class fu extends Zc{constructor(){super(new sn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=ts*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class pu extends Pr{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new fu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Lr extends ko{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class mu extends Zc{constructor(){super(new Lr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class gu extends Pr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new mu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class _u extends Pr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class vu extends Et{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Gi=-90,ki=1;class xu extends Ct{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Gi,ki,e,t);s.layers=this.layers,this.add(s);const r=new sn(Gi,ki,e,t);r.layers=this.layers,this.add(r);const a=new sn(Gi,ki,e,t);a.layers=this.layers,this.add(a);const o=new sn(Gi,ki,e,t);o.layers=this.layers,this.add(o);const l=new sn(Gi,ki,e,t);l.layers=this.layers,this.add(l);const c=new sn(Gi,ki,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===es)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Mu extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Su{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=bu.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function bu(){this._document.hidden===!1&&this.reset()}class po extends Zd{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class Kc{static{Kc.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}}const Nl=new R,tr=new R,Hi=new R,Vi=new R,ca=new R,yu=new R,Eu=new R;class Tu{constructor(e=new R,t=new R){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Nl.subVectors(e,this.start),tr.subVectors(this.end,this.start);const n=tr.dot(tr);if(n===0)return 0;let r=tr.dot(Nl)/n;return t&&(r=$e(r,0,1)),r}closestPointToPoint(e,t,n){const s=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(e,t=yu,n=Eu){const s=10000000000000001e-32;let r,a;const o=this.start,l=e.start,c=this.end,h=e.end;Hi.subVectors(c,o),Vi.subVectors(h,l),ca.subVectors(o,l);const d=Hi.dot(Hi),u=Vi.dot(Vi),m=Vi.dot(ca);if(d<=s&&u<=s)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(d<=s)r=0,a=m/u,a=$e(a,0,1);else{const g=Hi.dot(ca);if(u<=s)a=0,r=$e(-g/d,0,1);else{const x=Hi.dot(Vi),p=d*u-x*x;p!==0?r=$e((x*m-g*u)/p,0,1):r=0,a=(x*r+m)/u,a<0?(a=0,r=$e(-g/d,0,1)):a>1&&(a=1,r=$e((x-g)/d,0,1))}}return t.copy(o).addScaledVector(Hi,r),n.copy(l).addScaledVector(Vi,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const nr=new R,wt=new ko;class Au extends su{constructor(e){const t=new Et,n=new Vc({color:16777215,vertexColors:!0,toneMapped:!1}),s=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(g,x){l(g),l(x)}function l(g){s.push(0,0,0),r.push(0,0,0),a[g]===void 0&&(a[g]=[]),a[g].push(s.length/3-1)}t.setAttribute("position",new gt(s,3)),t.setAttribute("color",new gt(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new Se(16755200),h=new Se(16711680),d=new Se(43775),u=new Se(16777215),m=new Se(3355443);this.setColors(c,h,d,u,m)}setColors(e,t,n,s,r){const o=this.geometry.getAttribute("color");return o.setXYZ(0,e.r,e.g,e.b),o.setXYZ(1,e.r,e.g,e.b),o.setXYZ(2,e.r,e.g,e.b),o.setXYZ(3,e.r,e.g,e.b),o.setXYZ(4,e.r,e.g,e.b),o.setXYZ(5,e.r,e.g,e.b),o.setXYZ(6,e.r,e.g,e.b),o.setXYZ(7,e.r,e.g,e.b),o.setXYZ(8,e.r,e.g,e.b),o.setXYZ(9,e.r,e.g,e.b),o.setXYZ(10,e.r,e.g,e.b),o.setXYZ(11,e.r,e.g,e.b),o.setXYZ(12,e.r,e.g,e.b),o.setXYZ(13,e.r,e.g,e.b),o.setXYZ(14,e.r,e.g,e.b),o.setXYZ(15,e.r,e.g,e.b),o.setXYZ(16,e.r,e.g,e.b),o.setXYZ(17,e.r,e.g,e.b),o.setXYZ(18,e.r,e.g,e.b),o.setXYZ(19,e.r,e.g,e.b),o.setXYZ(20,e.r,e.g,e.b),o.setXYZ(21,e.r,e.g,e.b),o.setXYZ(22,e.r,e.g,e.b),o.setXYZ(23,e.r,e.g,e.b),o.setXYZ(24,t.r,t.g,t.b),o.setXYZ(25,t.r,t.g,t.b),o.setXYZ(26,t.r,t.g,t.b),o.setXYZ(27,t.r,t.g,t.b),o.setXYZ(28,t.r,t.g,t.b),o.setXYZ(29,t.r,t.g,t.b),o.setXYZ(30,t.r,t.g,t.b),o.setXYZ(31,t.r,t.g,t.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,s.r,s.g,s.b),o.setXYZ(39,s.r,s.g,s.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){const e=this.geometry,t=this.pointMap,n=1,s=1;let r,a;if(wt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===xn)r=-1,a=1;else if(this.camera.coordinateSystem===es)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Lt("c",t,e,wt,0,0,r),Lt("t",t,e,wt,0,0,a),Lt("n1",t,e,wt,-n,-s,r),Lt("n2",t,e,wt,n,-s,r),Lt("n3",t,e,wt,-n,s,r),Lt("n4",t,e,wt,n,s,r),Lt("f1",t,e,wt,-n,-s,a),Lt("f2",t,e,wt,n,-s,a),Lt("f3",t,e,wt,-n,s,a),Lt("f4",t,e,wt,n,s,a),Lt("u1",t,e,wt,n*.7,s*1.1,r),Lt("u2",t,e,wt,-n*.7,s*1.1,r),Lt("u3",t,e,wt,0,s*2,r),Lt("cf1",t,e,wt,-n,0,a),Lt("cf2",t,e,wt,n,0,a),Lt("cf3",t,e,wt,0,-s,a),Lt("cf4",t,e,wt,0,s,a),Lt("cn1",t,e,wt,-n,0,r),Lt("cn2",t,e,wt,n,0,r),Lt("cn3",t,e,wt,0,-s,r),Lt("cn4",t,e,wt,0,s,r),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Lt(i,e,t,n,s,r,a){nr.set(s,r,a).unproject(n);const o=e[i];if(o!==void 0){const l=t.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],nr.x,nr.y,nr.z)}}function Fl(i,e,t,n){const s=wu(n);switch(t){case Ic:return i*e;case Ro:return i*e/s.components*s.byteLength;case Po:return i*e/s.components*s.byteLength;case bi:return i*e*2/s.components*s.byteLength;case Lo:return i*e*2/s.components*s.byteLength;case Uc:return i*e*3/s.components*s.byteLength;case vn:return i*e*4/s.components*s.byteLength;case Do:return i*e*4/s.components*s.byteLength;case dr:case ur:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case fr:case pr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oa:case za:return Math.max(i,16)*Math.max(e,8)/4;case Fa:case Ba:return Math.max(i,8)*Math.max(e,8)/2;case Ga:case ka:case Va:case Wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ha:case vr:case Xa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case $a:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case eo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case to:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case no:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case io:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case so:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ro:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ao:case oo:case lo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case co:case ho:return Math.ceil(i/4)*Math.ceil(e/4)*8;case xr:case uo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function wu(i){switch(i){case rn:case Rc:return{byteLength:1,components:1};case ws:case Pc:case an:return{byteLength:2,components:1};case wo:case Co:return{byteLength:2,components:4};case Ln:case Ao:case _n:return{byteLength:4,components:1};case Lc:case Dc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vo}}));typeof window<"u"&&(window.__THREE__?ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vo);function Jc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Cu(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((m,g)=>m.start-g.start);let u=0;for(let m=1;m<d.length;m++){const g=d[u],x=d[m];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let m=0,g=d.length;m<g;m++){const x=d[m];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Ru=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pu=`#ifdef USE_ALPHAHASH
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
#endif`,Lu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Du=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Iu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nu=`#ifdef USE_AOMAP
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
#endif`,Fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ou=`#ifdef USE_BATCHING
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
#endif`,Bu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ku=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hu=`#ifdef USE_IRIDESCENCE
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
#endif`,Vu=`#ifdef USE_BUMPMAP
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
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$u=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ku=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ju=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Qu=`#define PI 3.141592653589793
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
} // validated`,ju=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ef=`vec3 transformedNormal = objectNormal;
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
#endif`,tf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,af="gl_FragColor = linearToOutputTexel( gl_FragColor );",of=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,lf=`#ifdef USE_ENVMAP
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
#endif`,cf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hf=`#ifdef USE_ENVMAP
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
#endif`,df=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
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
#endif`,ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_f=`#ifdef USE_GRADIENTMAP
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
}`,vf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sf=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,bf=`#ifdef USE_ENVMAP
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
#endif`,yf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ef=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wf=`PhysicalMaterial material;
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
#endif`,Cf=`uniform sampler2D dfgLUT;
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
}`,Rf=`
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
#endif`,Pf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Df=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,If=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Of=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gf=`#if defined( USE_POINTS_UV )
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
#endif`,kf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qf=`#ifdef USE_MORPHTARGETS
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
#endif`,Yf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$f=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Zf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,jf=`#ifdef USE_NORMALMAP
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
#endif`,ep=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,np=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ip=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,mp=`float getShadowMask() {
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
}`,gp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_p=`#ifdef USE_SKINNING
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
#endif`,vp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xp=`#ifdef USE_SKINNING
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
#endif`,Mp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ep=`#ifdef USE_TRANSMISSION
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
#endif`,Tp=`#ifdef USE_TRANSMISSION
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
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lp=`uniform sampler2D t2D;
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
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ip=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Np=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fp=`#include <common>
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
}`,Op=`#if DEPTH_PACKING == 3200
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
}`,Bp=`#define DISTANCE
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
}`,zp=`#define DISTANCE
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
}`,Gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`uniform float scale;
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
}`,Vp=`uniform vec3 diffuse;
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
}`,Wp=`#include <common>
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
}`,Xp=`uniform vec3 diffuse;
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
}`,qp=`#define LAMBERT
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
}`,Yp=`#define LAMBERT
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
}`,$p=`#define MATCAP
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
}`,Zp=`#define MATCAP
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
}`,Kp=`#define NORMAL
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
}`,Jp=`#define NORMAL
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
}`,Qp=`#define PHONG
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
}`,jp=`#define PHONG
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
}`,em=`#define STANDARD
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
}`,tm=`#define STANDARD
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
}`,nm=`#define TOON
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
}`,im=`#define TOON
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
}`,sm=`uniform float size;
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
}`,rm=`uniform vec3 diffuse;
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
}`,am=`#include <common>
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
}`,om=`uniform vec3 color;
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
}`,lm=`uniform float rotation;
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
}`,cm=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:Ru,alphahash_pars_fragment:Pu,alphamap_fragment:Lu,alphamap_pars_fragment:Du,alphatest_fragment:Iu,alphatest_pars_fragment:Uu,aomap_fragment:Nu,aomap_pars_fragment:Fu,batching_pars_vertex:Ou,batching_vertex:Bu,begin_vertex:zu,beginnormal_vertex:Gu,bsdfs:ku,iridescence_fragment:Hu,bumpmap_pars_fragment:Vu,clipping_planes_fragment:Wu,clipping_planes_pars_fragment:Xu,clipping_planes_pars_vertex:qu,clipping_planes_vertex:Yu,color_fragment:$u,color_pars_fragment:Zu,color_pars_vertex:Ku,color_vertex:Ju,common:Qu,cube_uv_reflection_fragment:ju,defaultnormal_vertex:ef,displacementmap_pars_vertex:tf,displacementmap_vertex:nf,emissivemap_fragment:sf,emissivemap_pars_fragment:rf,colorspace_fragment:af,colorspace_pars_fragment:of,envmap_fragment:lf,envmap_common_pars_fragment:cf,envmap_pars_fragment:hf,envmap_pars_vertex:df,envmap_physical_pars_fragment:bf,envmap_vertex:uf,fog_vertex:ff,fog_pars_vertex:pf,fog_fragment:mf,fog_pars_fragment:gf,gradientmap_pars_fragment:_f,lightmap_pars_fragment:vf,lights_lambert_fragment:xf,lights_lambert_pars_fragment:Mf,lights_pars_begin:Sf,lights_toon_fragment:yf,lights_toon_pars_fragment:Ef,lights_phong_fragment:Tf,lights_phong_pars_fragment:Af,lights_physical_fragment:wf,lights_physical_pars_fragment:Cf,lights_fragment_begin:Rf,lights_fragment_maps:Pf,lights_fragment_end:Lf,lightprobes_pars_fragment:Df,logdepthbuf_fragment:If,logdepthbuf_pars_fragment:Uf,logdepthbuf_pars_vertex:Nf,logdepthbuf_vertex:Ff,map_fragment:Of,map_pars_fragment:Bf,map_particle_fragment:zf,map_particle_pars_fragment:Gf,metalnessmap_fragment:kf,metalnessmap_pars_fragment:Hf,morphinstance_vertex:Vf,morphcolor_vertex:Wf,morphnormal_vertex:Xf,morphtarget_pars_vertex:qf,morphtarget_vertex:Yf,normal_fragment_begin:$f,normal_fragment_maps:Zf,normal_pars_fragment:Kf,normal_pars_vertex:Jf,normal_vertex:Qf,normalmap_pars_fragment:jf,clearcoat_normal_fragment_begin:ep,clearcoat_normal_fragment_maps:tp,clearcoat_pars_fragment:np,iridescence_pars_fragment:ip,opaque_fragment:sp,packing:rp,premultiplied_alpha_fragment:ap,project_vertex:op,dithering_fragment:lp,dithering_pars_fragment:cp,roughnessmap_fragment:hp,roughnessmap_pars_fragment:dp,shadowmap_pars_fragment:up,shadowmap_pars_vertex:fp,shadowmap_vertex:pp,shadowmask_pars_fragment:mp,skinbase_vertex:gp,skinning_pars_vertex:_p,skinning_vertex:vp,skinnormal_vertex:xp,specularmap_fragment:Mp,specularmap_pars_fragment:Sp,tonemapping_fragment:bp,tonemapping_pars_fragment:yp,transmission_fragment:Ep,transmission_pars_fragment:Tp,uv_pars_fragment:Ap,uv_pars_vertex:wp,uv_vertex:Cp,worldpos_vertex:Rp,background_vert:Pp,background_frag:Lp,backgroundCube_vert:Dp,backgroundCube_frag:Ip,cube_vert:Up,cube_frag:Np,depth_vert:Fp,depth_frag:Op,distance_vert:Bp,distance_frag:zp,equirect_vert:Gp,equirect_frag:kp,linedashed_vert:Hp,linedashed_frag:Vp,meshbasic_vert:Wp,meshbasic_frag:Xp,meshlambert_vert:qp,meshlambert_frag:Yp,meshmatcap_vert:$p,meshmatcap_frag:Zp,meshnormal_vert:Kp,meshnormal_frag:Jp,meshphong_vert:Qp,meshphong_frag:jp,meshphysical_vert:em,meshphysical_frag:tm,meshtoon_vert:nm,meshtoon_frag:im,points_vert:sm,points_frag:rm,shadow_vert:am,shadow_frag:om,sprite_vert:lm,sprite_frag:cm},ce={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Be(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new Be(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Zt={basic:{uniforms:$t([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:$t([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Se(0)},envMapIntensity:{value:1}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:$t([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:$t([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:$t([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Se(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:$t([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:$t([ce.points,ce.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:$t([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:$t([ce.common,ce.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:$t([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:$t([ce.sprite,ce.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distance:{uniforms:$t([ce.common,ce.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distance_vert,fragmentShader:Ze.distance_frag},shadow:{uniforms:$t([ce.lights,ce.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Zt.physical={uniforms:$t([Zt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Be(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Be},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Be},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const ir={r:0,b:0,g:0},hm=new ft,Qc=new qe;Qc.set(-1,0,0,0,1,0,0,0,1);function dm(i,e,t,n,s,r){const a=new Se(0);let o=s===!0?0:1,l,c,h=null,d=0,u=null;function m(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){const M=b.backgroundBlurriness>0;A=e.get(A,M)}return A}function g(b){let A=!1;const M=m(b);M===null?p(a,o):M&&M.isColor&&(p(M,1),A=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(b,A){const M=m(A);M&&(M.isCubeTexture||M.mapping===Rr)?(c===void 0&&(c=new rt(new lt(1,1,1),new Ut({name:"BackgroundCubeMaterial",uniforms:rs(Zt.backgroundCube.uniforms),vertexShader:Zt.backgroundCube.vertexShader,fragmentShader:Zt.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,y,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(hm.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Qc),c.material.toneMapped=et.getTransfer(M.colorSpace)!==ct,(h!==M||d!==M.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new rt(new ss(2,2),new Ut({name:"BackgroundMaterial",uniforms:rs(Zt.background.uniforms),vertexShader:Zt.background.vertexShader,fragmentShader:Zt.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=et.getTransfer(M.colorSpace)!==ct,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,A){b.getRGB(ir,Yc(i)),t.buffers.color.setClear(ir.r,ir.g,ir.b,A,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,A=1){a.set(b),o=A,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,p(a,o)},render:g,addToRenderList:x,dispose:f}}function um(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,N,X,$,B){let q=!1;const k=d(P,$,X,N);r!==k&&(r=k,c(r.object)),q=m(P,$,X,B),q&&g(P,$,X,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(P,N,X,$),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,N,X,$){const B=$.wireframe===!0;let q=n[N.id];q===void 0&&(q={},n[N.id]=q);const k=P.isInstancedMesh===!0?P.id:0;let J=q[k];J===void 0&&(J={},q[k]=J);let te=J[X.id];te===void 0&&(te={},J[X.id]=te);let he=te[B];return he===void 0&&(he=u(l()),te[B]=he),he}function u(P){const N=[],X=[],$=[];for(let B=0;B<t;B++)N[B]=0,X[B]=0,$[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:X,attributeDivisors:$,object:P,attributes:{},index:null}}function m(P,N,X,$){const B=r.attributes,q=N.attributes;let k=0;const J=X.getAttributes();for(const te in J)if(J[te].location>=0){const ue=B[te];let ve=q[te];if(ve===void 0&&(te==="instanceMatrix"&&P.instanceMatrix&&(ve=P.instanceMatrix),te==="instanceColor"&&P.instanceColor&&(ve=P.instanceColor)),ue===void 0||ue.attribute!==ve||ve&&ue.data!==ve.data)return!0;k++}return r.attributesNum!==k||r.index!==$}function g(P,N,X,$){const B={},q=N.attributes;let k=0;const J=X.getAttributes();for(const te in J)if(J[te].location>=0){let ue=q[te];ue===void 0&&(te==="instanceMatrix"&&P.instanceMatrix&&(ue=P.instanceMatrix),te==="instanceColor"&&P.instanceColor&&(ue=P.instanceColor));const ve={};ve.attribute=ue,ue&&ue.data&&(ve.data=ue.data),B[te]=ve,k++}r.attributes=B,r.attributesNum=k,r.index=$}function x(){const P=r.newAttributes;for(let N=0,X=P.length;N<X;N++)P[N]=0}function p(P){f(P,0)}function f(P,N){const X=r.newAttributes,$=r.enabledAttributes,B=r.attributeDivisors;X[P]=1,$[P]===0&&(i.enableVertexAttribArray(P),$[P]=1),B[P]!==N&&(i.vertexAttribDivisor(P,N),B[P]=N)}function b(){const P=r.newAttributes,N=r.enabledAttributes;for(let X=0,$=N.length;X<$;X++)N[X]!==P[X]&&(i.disableVertexAttribArray(X),N[X]=0)}function A(P,N,X,$,B,q,k){k===!0?i.vertexAttribIPointer(P,N,X,B,q):i.vertexAttribPointer(P,N,X,$,B,q)}function M(P,N,X,$){x();const B=$.attributes,q=X.getAttributes(),k=N.defaultAttributeValues;for(const J in q){const te=q[J];if(te.location>=0){let he=B[J];if(he===void 0&&(J==="instanceMatrix"&&P.instanceMatrix&&(he=P.instanceMatrix),J==="instanceColor"&&P.instanceColor&&(he=P.instanceColor)),he!==void 0){const ue=he.normalized,ve=he.itemSize,nt=e.get(he);if(nt===void 0)continue;const _t=nt.buffer,it=nt.type,K=nt.bytesPerElement,re=it===i.INT||it===i.UNSIGNED_INT||he.gpuType===Ao;if(he.isInterleavedBufferAttribute){const j=he.data,Re=j.stride,Ge=he.offset;if(j.isInstancedInterleavedBuffer){for(let ge=0;ge<te.locationSize;ge++)f(te.location+ge,j.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ge=0;ge<te.locationSize;ge++)p(te.location+ge);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let ge=0;ge<te.locationSize;ge++)A(te.location+ge,ve/te.locationSize,it,ue,Re*K,(Ge+ve/te.locationSize*ge)*K,re)}else{if(he.isInstancedBufferAttribute){for(let j=0;j<te.locationSize;j++)f(te.location+j,he.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let j=0;j<te.locationSize;j++)p(te.location+j);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let j=0;j<te.locationSize;j++)A(te.location+j,ve/te.locationSize,it,ue,ve*K,ve/te.locationSize*j*K,re)}}else if(k!==void 0){const ue=k[J];if(ue!==void 0)switch(ue.length){case 2:i.vertexAttrib2fv(te.location,ue);break;case 3:i.vertexAttrib3fv(te.location,ue);break;case 4:i.vertexAttrib4fv(te.location,ue);break;default:i.vertexAttrib1fv(te.location,ue)}}}}b()}function w(){T();for(const P in n){const N=n[P];for(const X in N){const $=N[X];for(const B in $){const q=$[B];for(const k in q)h(q[k].object),delete q[k];delete $[B]}}delete n[P]}}function y(P){if(n[P.id]===void 0)return;const N=n[P.id];for(const X in N){const $=N[X];for(const B in $){const q=$[B];for(const k in q)h(q[k].object),delete q[k];delete $[B]}}delete n[P.id]}function C(P){for(const N in n){const X=n[N];for(const $ in X){const B=X[$];if(B[P.id]===void 0)continue;const q=B[P.id];for(const k in q)h(q[k].object),delete q[k];delete B[P.id]}}}function v(P){for(const N in n){const X=n[N],$=P.isInstancedMesh===!0?P.id:0,B=X[$];if(B!==void 0){for(const q in B){const k=B[q];for(const J in k)h(k[J].object),delete k[J];delete B[q]}delete X[$],Object.keys(X).length===0&&delete n[N]}}}function T(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:L,dispose:w,releaseStatesOfGeometry:y,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:p,disableUnusedAttributes:b}}function fm(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let m=0;m<h;m++)u+=c[m];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function pm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==vn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const v=C===an&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==rn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==_n&&!v)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(ze("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),y=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:M,maxSamples:w,samples:y}}function mm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new fi,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const m=d.length!==0||u||n!==0||s;return s=u,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,m){const g=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{const b=r?0:n,A=b*4;let M=f.clippingState||null;l.value=M,M=h(g,u,A,m);for(let w=0;w!==A;++w)M[w]=t[w];f.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,m,g){const x=d!==null?d.length:0;let p=null;if(x!==0){if(p=l.value,g!==!0||p===null){const f=m+x*4,b=u.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<f)&&(p=new Float32Array(f));for(let A=0,M=m;A!==x;++A,M+=4)a.copy(d[A]).applyMatrix4(b,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}const si=4,Ol=[.125,.215,.35,.446,.526,.582],mi=20,gm=256,gs=new Lr,Bl=new Se;let ha=null,da=0,ua=0,fa=!1;const _m=new R;class zl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=_m}=r;ha=this._renderer.getRenderTarget(),da=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),fa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ha,da,ua),this._renderer.xr.enabled=fa,e.scissorTest=!1,Wi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Mi||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ha=this._renderer.getRenderTarget(),da=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),fa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:an,format:vn,colorSpace:Sr,depthBuffer:!1},s=Gl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gl(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=vm(r)),this._blurMaterial=Mm(r,e,t),this._ggxMaterial=xm(r,e,t)}return s}_compileMaterial(e){const t=new rt(new Et,e);this._renderer.compile(t,gs)}_sceneToCubeUV(e,t,n,s,r){const l=new sn(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,m=d.toneMapping;d.getClearColor(Bl),d.toneMapping=Pn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new rt(new lt,new hn({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,p=x.material;let f=!1;const b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,f=!0):(p.color.copy(Bl),f=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):M===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const w=this._cubeSize;Wi(s,M*w,A>2?w:0,w,w),d.setRenderTarget(s),f&&d.render(x,l),d.render(e,l)}d.toneMapping=m,d.autoClear=u,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Mi||e.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Wi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,gs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,m=d*u,{_lodMax:g}=this,x=this._sizeLods[n],p=3*x*(n>g-si?n-g+si:0),f=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=g-t,Wi(r,p,f,3*x,2*x),s.setRenderTarget(r),s.render(o,gs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Wi(e,p,f,3*x,2*x),s.setRenderTarget(e),s.render(o,gs)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ot("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=c;const u=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*mi-1),x=r/g,p=isFinite(r)?1+Math.floor(h*x):mi;p>mi&&ze(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const f=[];let b=0;for(let C=0;C<mi;++C){const v=C/x,T=Math.exp(-v*v/2);f.push(T),C===0?b+=T:C<p&&(b+=2*T)}for(let C=0;C<f.length;C++)f[C]=f[C]/b;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:A}=this;u.dTheta.value=g,u.mipInt.value=A-n;const M=this._sizeLods[s],w=3*M*(s>A-si?s-A+si:0),y=4*(this._cubeSize-M);Wi(t,w,y,3*M,2*M),l.setRenderTarget(t),l.render(d,gs)}}function vm(i){const e=[],t=[],n=[];let s=i;const r=i-si+1+Ol.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-si?l=Ol[a-i+si-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,x=3,p=2,f=1,b=new Float32Array(x*g*m),A=new Float32Array(p*g*m),M=new Float32Array(f*g*m);for(let y=0;y<m;y++){const C=y%3*2/3-1,v=y>2?0:-1,T=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];b.set(T,x*g*y),A.set(u,p*g*y);const L=[y,y,y,y,y,y];M.set(L,f*g*y)}const w=new Et;w.setAttribute("position",new bt(b,x)),w.setAttribute("uv",new bt(A,p)),w.setAttribute("faceIndex",new bt(M,f)),n.push(new rt(w,null)),s>si&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Gl(i,e,t){const n=new Jt(i,e,t);return n.texture.mapping=Rr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function xm(i,e,t){return new Ut({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:gm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Dr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Mm(i,e,t){const n=new Float32Array(mi),s=new R(0,1,0);return new Ut({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Dr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function kl(){return new Ut({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Hl(){return new Ut({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Dr(){return`

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
	`}class jc extends Jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Wc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new lt(5,5,5),r=new Ut({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Kt,blending:Rn});r.uniforms.tEquirect.value=t;const a=new rt(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=Xt),new xu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function Sm(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,m=!1){return u==null?null:m?a(u):r(u)}function r(u){if(u&&u.isTexture){const m=u.mapping;if(m===Fr||m===Or)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const x=new jc(g.height);return x.fromEquirectangularTexture(i,u),e.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const m=u.mapping,g=m===Fr||m===Or,x=m===Mi||m===ji;if(g||x){let p=t.get(u);const f=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return n===null&&(n=new zl(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const b=u.image;return g&&b&&b.height>0||x&&b&&l(b)?(n===null&&(n=new zl(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,m){return m===Fr?u.mapping=Mi:m===Or&&(u.mapping=ji),u}function l(u){let m=0;const g=6;for(let x=0;x<g;x++)u[x]!==void 0&&m++;return m===g}function c(u){const m=u.target;m.removeEventListener("dispose",c);const g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function h(u){const m=u.target;m.removeEventListener("dispose",h);const g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function bm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Zi("WebGLRenderer: "+n+" extension not supported."),s}}}function ym(i,e,t,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];const m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const m in u)e.update(u[m],i.ARRAY_BUFFER)}function c(d){const u=[],m=d.index,g=d.attributes.position;let x=0;if(g===void 0)return;if(m!==null){const b=m.array;x=m.version;for(let A=0,M=b.length;A<M;A+=3){const w=b[A+0],y=b[A+1],C=b[A+2];u.push(w,y,y,C,C,w)}}else{const b=g.array;x=g.version;for(let A=0,M=b.length/3-1;A<M;A+=3){const w=A+0,y=A+1,C=A+2;u.push(w,y,y,C,C,w)}}const p=new(g.count>=65535?Gc:zc)(u,1);p.version=x;const f=r.get(d);f&&e.remove(f),r.set(d,p)}function h(d){const u=r.get(d);if(u){const m=d.index;m!==null&&u.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Em(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,m){m!==0&&(i.drawElementsInstanced(n,u,r,d*a,m),t.update(u,n,m))}function h(d,u,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,m);let x=0;for(let p=0;p<m;p++)x+=u[p];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Tm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ot("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Am(i,e,t){const n=new WeakMap,s=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let L=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",L)};var m=L;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),x===!0&&(M=2),p===!0&&(M=3);let w=o.attributes.position.count*M,y=1;w>e.maxTextureSize&&(y=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const C=new Float32Array(w*y*4*d),v=new Fc(C,w,y,d);v.type=_n,v.needsUpdate=!0;const T=M*4;for(let P=0;P<d;P++){const N=f[P],X=b[P],$=A[P],B=w*y*4*P;for(let q=0;q<N.count;q++){const k=q*T;g===!0&&(s.fromBufferAttribute(N,q),C[B+k+0]=s.x,C[B+k+1]=s.y,C[B+k+2]=s.z,C[B+k+3]=0),x===!0&&(s.fromBufferAttribute(X,q),C[B+k+4]=s.x,C[B+k+5]=s.y,C[B+k+6]=s.z,C[B+k+7]=0),p===!0&&(s.fromBufferAttribute($,q),C[B+k+8]=s.x,C[B+k+9]=s.y,C[B+k+10]=s.z,C[B+k+11]=$.itemSize===4?s.w:1)}}u={count:d,texture:v,size:new Be(w,y)},n.set(o,u),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function wm(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const Cm={[Mo]:"LINEAR_TONE_MAPPING",[So]:"REINHARD_TONE_MAPPING",[bo]:"CINEON_TONE_MAPPING",[Cr]:"ACES_FILMIC_TONE_MAPPING",[Eo]:"AGX_TONE_MAPPING",[To]:"NEUTRAL_TONE_MAPPING",[yo]:"CUSTOM_TONE_MAPPING"};function Rm(i,e,t,n,s,r){const a=new Jt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new ns(e,t):void 0}),o=new Jt(e,t,{type:an,depthBuffer:!1,stencilBuffer:!1}),l=new Et;l.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new gt([0,2,0,0,2,0],2));const c=new $c({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new rt(l,c),d=new Lr(-1,1,1,-1,0,1);let u=null,m=null,g=!1,x,p=null,f=[],b=!1;this.setSize=function(A,M){a.setSize(A,M),o.setSize(A,M);for(let w=0;w<f.length;w++){const y=f[w];y.setSize&&y.setSize(A,M)}},this.setEffects=function(A){f=A,b=f.length>0&&f[0].isRenderPass===!0;const M=a.width,w=a.height;for(let y=0;y<f.length;y++){const C=f[y];C.setSize&&C.setSize(M,w)}},this.begin=function(A,M){if(g||A.toneMapping===Pn&&f.length===0)return!1;if(p=M,M!==null){const w=M.width,y=M.height;(a.width!==w||a.height!==y)&&this.setSize(w,y)}return b===!1&&A.setRenderTarget(a),x=A.toneMapping,A.toneMapping=Pn,!0},this.hasRenderPass=function(){return b},this.end=function(A,M){A.toneMapping=x,g=!0;let w=a,y=o;for(let C=0;C<f.length;C++){const v=f[C];if(v.enabled!==!1&&(v.render(A,y,w,M),v.needsSwap!==!1)){const T=w;w=y,y=T}}if(u!==A.outputColorSpace||m!==A.toneMapping){u=A.outputColorSpace,m=A.toneMapping,c.defines={},et.getTransfer(u)===ct&&(c.defines.SRGB_TRANSFER="");const C=Cm[m];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,A.setRenderTarget(p),A.render(h,d),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const eh=new qt,mo=new ns(1,1),th=new Fc,nh=new Od,ih=new Wc,Vl=[],Wl=[],Xl=new Float32Array(16),ql=new Float32Array(9),Yl=new Float32Array(4);function os(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Vl[s];if(r===void 0&&(r=new Float32Array(s),Vl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Nt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ft(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ir(i,e){let t=Wl[e];t===void 0&&(t=new Int32Array(e),Wl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Pm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Lm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2fv(this.addr,e),Ft(t,e)}}function Dm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;i.uniform3fv(this.addr,e),Ft(t,e)}}function Im(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4fv(this.addr,e),Ft(t,e)}}function Um(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;Yl.set(n),i.uniformMatrix2fv(this.addr,!1,Yl),Ft(t,n)}}function Nm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;ql.set(n),i.uniformMatrix3fv(this.addr,!1,ql),Ft(t,n)}}function Fm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;Xl.set(n),i.uniformMatrix4fv(this.addr,!1,Xl),Ft(t,n)}}function Om(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Bm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2iv(this.addr,e),Ft(t,e)}}function zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3iv(this.addr,e),Ft(t,e)}}function Gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4iv(this.addr,e),Ft(t,e)}}function km(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2uiv(this.addr,e),Ft(t,e)}}function Vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3uiv(this.addr,e),Ft(t,e)}}function Wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4uiv(this.addr,e),Ft(t,e)}}function Xm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(mo.compareFunction=t.isReversedDepthBuffer()?Uo:Io,r=mo):r=eh,t.setTexture2D(e||r,s)}function qm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||nh,s)}function Ym(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ih,s)}function $m(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||th,s)}function Zm(i){switch(i){case 5126:return Pm;case 35664:return Lm;case 35665:return Dm;case 35666:return Im;case 35674:return Um;case 35675:return Nm;case 35676:return Fm;case 5124:case 35670:return Om;case 35667:case 35671:return Bm;case 35668:case 35672:return zm;case 35669:case 35673:return Gm;case 5125:return km;case 36294:return Hm;case 36295:return Vm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Ym;case 36289:case 36303:case 36311:case 36292:return $m}}function Km(i,e){i.uniform1fv(this.addr,e)}function Jm(i,e){const t=os(e,this.size,2);i.uniform2fv(this.addr,t)}function Qm(i,e){const t=os(e,this.size,3);i.uniform3fv(this.addr,t)}function jm(i,e){const t=os(e,this.size,4);i.uniform4fv(this.addr,t)}function eg(i,e){const t=os(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function tg(i,e){const t=os(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function ng(i,e){const t=os(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ig(i,e){i.uniform1iv(this.addr,e)}function sg(i,e){i.uniform2iv(this.addr,e)}function rg(i,e){i.uniform3iv(this.addr,e)}function ag(i,e){i.uniform4iv(this.addr,e)}function og(i,e){i.uniform1uiv(this.addr,e)}function lg(i,e){i.uniform2uiv(this.addr,e)}function cg(i,e){i.uniform3uiv(this.addr,e)}function hg(i,e){i.uniform4uiv(this.addr,e)}function dg(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=mo:a=eh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ug(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||nh,r[a])}function fg(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ih,r[a])}function pg(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||th,r[a])}function mg(i){switch(i){case 5126:return Km;case 35664:return Jm;case 35665:return Qm;case 35666:return jm;case 35674:return eg;case 35675:return tg;case 35676:return ng;case 5124:case 35670:return ig;case 35667:case 35671:return sg;case 35668:case 35672:return rg;case 35669:case 35673:return ag;case 5125:return og;case 36294:return lg;case 36295:return cg;case 36296:return hg;case 35678:case 36198:case 36298:case 36306:case 35682:return dg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return fg;case 36289:case 36303:case 36311:case 36292:return pg}}class gg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zm(t.type)}}class _g{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mg(t.type)}}class vg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const pa=/(\w+)(\])?(\[|\.)?/g;function $l(i,e){i.seq.push(e),i.map[e.id]=e}function xg(i,e,t){const n=i.name,s=n.length;for(pa.lastIndex=0;;){const r=pa.exec(n),a=pa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){$l(t,c===void 0?new gg(o,i,e):new _g(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new vg(o),$l(t,d)),t=d}}}class mr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);xg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Zl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Mg=37297;let Sg=0;function bg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Kl=new qe;function yg(i){et._getMatrix(Kl,et.workingColorSpace,i);const e=`mat3( ${Kl.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case br:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return ze("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Jl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+bg(i.getShaderSource(e),o)}else return r}function Eg(i,e){const t=yg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Tg={[Mo]:"Linear",[So]:"Reinhard",[bo]:"Cineon",[Cr]:"ACESFilmic",[Eo]:"AgX",[To]:"Neutral",[yo]:"Custom"};function Ag(i,e){const t=Tg[e];return t===void 0?(ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const sr=new R;function wg(){et.getLuminanceCoefficients(sr);const i=sr.x.toFixed(4),e=sr.y.toFixed(4),t=sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function Rg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Pg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ss(i){return i!==""}function Ql(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Lg=/^[ \t]*#include +<([\w\d./]+)>/gm;function go(i){return i.replace(Lg,Ig)}const Dg=new Map;function Ig(i,e){let t=Ze[e];if(t===void 0){const n=Dg.get(e);if(n!==void 0)t=Ze[n],ze('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return go(t)}const Ug=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ec(i){return i.replace(Ug,Ng)}function Ng(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function tc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}const Fg={[hr]:"SHADOWMAP_TYPE_PCF",[Ms]:"SHADOWMAP_TYPE_VSM"};function Og(i){return Fg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Bg={[Mi]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[Rr]:"ENVMAP_TYPE_CUBE_UV"};function zg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Bg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Gg={[ji]:"ENVMAP_MODE_REFRACTION"};function kg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Gg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Hg={[xo]:"ENVMAP_BLENDING_MULTIPLY",[ed]:"ENVMAP_BLENDING_MIX",[td]:"ENVMAP_BLENDING_ADD"};function Vg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Hg[i.combine]||"ENVMAP_BLENDING_NONE"}function Wg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Xg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Og(t),c=zg(t),h=kg(t),d=Vg(t),u=Wg(t),m=Cg(t),g=Rg(r),x=s.createProgram();let p,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),f.length>0&&(f+=`
`)):(p=[tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),f=[tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pn?"#define TONE_MAPPING":"",t.toneMapping!==Pn?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Pn?Ag("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Eg("linearToOutputTexel",t.outputColorSpace),wg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),a=go(a),a=Ql(a,t),a=jl(a,t),o=go(o),o=Ql(o,t),o=jl(o,t),a=ec(a),o=ec(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===rl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===rl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const A=b+p+a,M=b+f+o,w=Zl(s,s.VERTEX_SHADER,A),y=Zl(s,s.FRAGMENT_SHADER,M);s.attachShader(x,w),s.attachShader(x,y),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(P){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(x)||"",X=s.getShaderInfoLog(w)||"",$=s.getShaderInfoLog(y)||"",B=N.trim(),q=X.trim(),k=$.trim();let J=!0,te=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,y);else{const he=Jl(s,w,"vertex"),ue=Jl(s,y,"fragment");ot("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+he+`
`+ue)}else B!==""?ze("WebGLProgram: Program Info Log:",B):(q===""||k==="")&&(te=!1);te&&(P.diagnostics={runnable:J,programLog:B,vertexShader:{log:q,prefix:p},fragmentShader:{log:k,prefix:f}})}s.deleteShader(w),s.deleteShader(y),v=new mr(s,x),T=Pg(s,x)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(x,Mg)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Sg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=y,this}let qg=0;class Yg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new $g(e),t.set(e,n)),n}}class $g{constructor(e){this.id=qg++,this.code=e,this.usedTimes=0}}function Zg(i){return i===bi||i===vr||i===xr}function Kg(i,e,t,n,s,r){const a=new Oc,o=new Yg,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,T,L,P,N,X){const $=P.fog,B=N.geometry,q=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,J=e.get(v.envMap||q,k),te=J&&J.mapping===Rr?J.image.height:null,he=m[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&ze("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const ue=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ve=ue!==void 0?ue.length:0;let nt=0;B.morphAttributes.position!==void 0&&(nt=1),B.morphAttributes.normal!==void 0&&(nt=2),B.morphAttributes.color!==void 0&&(nt=3);let _t,it,K,re;if(he){const Te=Zt[he];_t=Te.vertexShader,it=Te.fragmentShader}else{_t=v.vertexShader,it=v.fragmentShader;const Te=o.getVertexShaderStage(v),Tt=o.getFragmentShaderStage(v);o.update(v,Te,Tt),K=Te.id,re=Tt.id}const j=i.getRenderTarget(),Re=i.state.buffers.depth.getReversed(),Ge=N.isInstancedMesh===!0,ge=N.isBatchedMesh===!0,He=!!v.map,Ie=!!v.matcap,st=!!J,Pe=!!v.aoMap,Qe=!!v.lightMap,Ue=!!v.bumpMap&&v.wireframe===!1,Ne=!!v.normalMap,ke=!!v.displacementMap,Fe=!!v.emissiveMap,Oe=!!v.metalnessMap,je=!!v.roughnessMap,D=v.anisotropy>0,Je=v.clearcoat>0,Ee=v.dispersion>0,E=v.iridescence>0,_=v.sheen>0,U=v.transmission>0,O=D&&!!v.anisotropyMap,V=Je&&!!v.clearcoatMap,ee=Je&&!!v.clearcoatNormalMap,ne=Je&&!!v.clearcoatRoughnessMap,W=E&&!!v.iridescenceMap,Y=E&&!!v.iridescenceThicknessMap,ie=_&&!!v.sheenColorMap,be=_&&!!v.sheenRoughnessMap,le=!!v.specularMap,se=!!v.specularColorMap,we=!!v.specularIntensityMap,De=U&&!!v.transmissionMap,Ve=U&&!!v.thicknessMap,I=!!v.gradientMap,ae=!!v.alphaMap,Z=v.alphaTest>0,de=!!v.alphaHash,pe=!!v.extensions;let Q=Pn;v.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Q=i.toneMapping);const ye={shaderID:he,shaderType:v.type,shaderName:v.name,vertexShader:_t,fragmentShader:it,defines:v.defines,customVertexShaderID:K,customFragmentShaderID:re,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:ge,batchingColor:ge&&N._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&N.instanceColor!==null,instancingMorph:Ge&&N.morphTexture!==null,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:He,matcap:Ie,envMap:st,envMapMode:st&&J.mapping,envMapCubeUVHeight:te,aoMap:Pe,lightMap:Qe,bumpMap:Ue,normalMap:Ne,displacementMap:ke,emissiveMap:Fe,normalMapObjectSpace:Ne&&v.normalMapType===sd,normalMapTangentSpace:Ne&&v.normalMapType===Mr,packedNormalMap:Ne&&v.normalMapType===Mr&&Zg(v.normalMap.format),metalnessMap:Oe,roughnessMap:je,anisotropy:D,anisotropyMap:O,clearcoat:Je,clearcoatMap:V,clearcoatNormalMap:ee,clearcoatRoughnessMap:ne,dispersion:Ee,iridescence:E,iridescenceMap:W,iridescenceThicknessMap:Y,sheen:_,sheenColorMap:ie,sheenRoughnessMap:be,specularMap:le,specularColorMap:se,specularIntensityMap:we,transmission:U,transmissionMap:De,thicknessMap:Ve,gradientMap:I,opaque:v.transparent===!1&&v.blending===Yi&&v.alphaToCoverage===!1,alphaMap:ae,alphaTest:Z,alphaHash:de,combine:v.combine,mapUv:He&&g(v.map.channel),aoMapUv:Pe&&g(v.aoMap.channel),lightMapUv:Qe&&g(v.lightMap.channel),bumpMapUv:Ue&&g(v.bumpMap.channel),normalMapUv:Ne&&g(v.normalMap.channel),displacementMapUv:ke&&g(v.displacementMap.channel),emissiveMapUv:Fe&&g(v.emissiveMap.channel),metalnessMapUv:Oe&&g(v.metalnessMap.channel),roughnessMapUv:je&&g(v.roughnessMap.channel),anisotropyMapUv:O&&g(v.anisotropyMap.channel),clearcoatMapUv:V&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ee&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:W&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(v.sheenRoughnessMap.channel),specularMapUv:le&&g(v.specularMap.channel),specularColorMapUv:se&&g(v.specularColorMap.channel),specularIntensityMapUv:we&&g(v.specularIntensityMap.channel),transmissionMapUv:De&&g(v.transmissionMap.channel),thicknessMapUv:Ve&&g(v.thicknessMap.channel),alphaMapUv:ae&&g(v.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Ne||D),vertexNormals:!!B.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!B.attributes.uv&&(He||ae),fog:!!$,useFog:v.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||B.attributes.normal===void 0&&Ne===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Re,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:nt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Q,decodeVideoTexture:He&&v.map.isVideoTexture===!0&&et.getTransfer(v.map.colorSpace)===ct,decodeVideoTextureEmissive:Fe&&v.emissiveMap.isVideoTexture===!0&&et.getTransfer(v.emissiveMap.colorSpace)===ct,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===yt,flipSided:v.side===Kt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:pe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&v.extensions.multiDraw===!0||ge)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ye.vertexUv1s=l.has(1),ye.vertexUv2s=l.has(2),ye.vertexUv3s=l.has(3),l.clear(),ye}function p(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)T.push(L),T.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(f(T,v),b(T,v),T.push(i.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function f(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function b(v,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function A(v){const T=m[v.type];let L;if(T){const P=Zt[T];L=yi.clone(P.uniforms)}else L=v.uniforms;return L}function M(v,T){let L=h.get(T);return L!==void 0?++L.usedTimes:(L=new Xg(i,T,v,s),c.push(L),h.set(T,L)),L}function w(v){if(--v.usedTimes===0){const T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function y(v){o.remove(v)}function C(){o.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:A,acquireProgram:M,releaseProgram:w,releaseShaderCache:y,programs:c,dispose:C}}function Jg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Qg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function nc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ic(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function o(u,m,g,x,p,f){let b=i[e];return b===void 0?(b={id:u.id,object:u,geometry:m,material:g,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:p,group:f},i[e]=b):(b.id=u.id,b.object=u,b.geometry=m,b.material=g,b.materialVariant=a(u),b.groupOrder=x,b.renderOrder=u.renderOrder,b.z=p,b.group=f),e++,b}function l(u,m,g,x,p,f){const b=o(u,m,g,x,p,f);g.transmission>0?n.push(b):g.transparent===!0?s.push(b):t.push(b)}function c(u,m,g,x,p,f){const b=o(u,m,g,x,p,f);g.transmission>0?n.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function h(u,m,g){t.length>1&&t.sort(u||Qg),n.length>1&&n.sort(m||nc),s.length>1&&s.sort(m||nc),g&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let u=e,m=i.length;u<m;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function jg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new ic,i.set(n,[a])):s>=r.length?(a=new ic,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function e0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Se};break;case"SpotLight":t={position:new R,direction:new R,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Se,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":t={color:new Se,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function t0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let n0=0;function i0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function s0(i){const e=new e0,t=t0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const s=new R,r=new ft,a=new ft;function o(c){let h=0,d=0,u=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let m=0,g=0,x=0,p=0,f=0,b=0,A=0,M=0,w=0,y=0,C=0;c.sort(i0);for(let T=0,L=c.length;T<L;T++){const P=c[T],N=P.color,X=P.intensity,$=P.distance;let B=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===bi?B=P.shadow.map.texture:B=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=N.r*X,d+=N.g*X,u+=N.b*X;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],X);C++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const k=P.shadow,J=t.get(P);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,n.directionalShadow[m]=J,n.directionalShadowMap[m]=B,n.directionalShadowMatrix[m]=P.shadow.matrix,b++}n.directional[m]=q,m++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(N).multiplyScalar(X),q.distance=$,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[x]=q;const k=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,k.updateMatrices(P),P.castShadow&&y++),n.spotLightMatrix[x]=k.matrix,P.castShadow){const J=t.get(P);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,n.spotShadow[x]=J,n.spotShadowMap[x]=B,M++}x++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(N).multiplyScalar(X),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=q,p++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const k=P.shadow,J=t.get(P);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,J.shadowCameraNear=k.camera.near,J.shadowCameraFar=k.camera.far,n.pointShadow[g]=J,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=P.shadow.matrix,A++}n.point[g]=q,g++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(X),q.groundColor.copy(P.groundColor).multiplyScalar(X),n.hemi[f]=q,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const v=n.hash;(v.directionalLength!==m||v.pointLength!==g||v.spotLength!==x||v.rectAreaLength!==p||v.hemiLength!==f||v.numDirectionalShadows!==b||v.numPointShadows!==A||v.numSpotShadows!==M||v.numSpotMaps!==w||v.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=x,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=A,n.pointShadowMap.length=A,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=A,n.spotLightMatrix.length=M+w-y,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=C,v.directionalLength=m,v.pointLength=g,v.spotLength=x,v.rectAreaLength=p,v.hemiLength=f,v.numDirectionalShadows=b,v.numPointShadows=A,v.numSpotShadows=M,v.numSpotMaps=w,v.numLightProbes=C,n.version=n0++)}function l(c,h){let d=0,u=0,m=0,g=0,x=0;const p=h.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){const A=c[f];if(A.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),d++}else if(A.isSpotLight){const M=n.spot[m];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),m++}else if(A.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),a.identity(),r.copy(A.matrixWorld),r.premultiply(p),a.extractRotation(r),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(A.isPointLight){const M=n.point[u];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),u++}else if(A.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(p),x++}}}return{setup:o,setupView:l,state:n}}function sc(i){const e=new s0(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function r0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new sc(i),e.set(s,[o])):r>=a.length?(o=new sc(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const a0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,o0=`uniform sampler2D shadow_pass;
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
}`,l0=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],c0=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],rc=new ft,_s=new R,ma=new R;function h0(i,e,t){let n=new Oo;const s=new Be,r=new Be,a=new ut,o=new hu,l=new du,c={},h=t.maxTextureSize,d={[ri]:Kt,[Kt]:ri,[yt]:yt},u=new Ut({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Be},radius:{value:4}},vertexShader:a0,fragmentShader:o0}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new Et;g.setAttribute("position",new bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new rt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hr;let f=this.type;this.render=function(y,C,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;this.type===Nh&&(ze("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=hr);const T=i.getRenderTarget(),L=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Rn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const X=f!==this.type;X&&C.traverse(function($){$.material&&(Array.isArray($.material)?$.material.forEach(B=>B.needsUpdate=!0):$.material.needsUpdate=!0)});for(let $=0,B=y.length;$<B;$++){const q=y[$],k=q.shadow;if(k===void 0){ze("WebGLShadowMap:",q,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const J=k.getFrameExtents();s.multiply(J),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,k.mapSize.y=r.y));const te=i.state.buffers.depth.getReversed();if(k.camera._reversedDepth=te,k.map===null||X===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Ms){if(q.isPointLight){ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Jt(s.x,s.y,{format:bi,type:an,minFilter:Xt,magFilter:Xt,generateMipmaps:!1}),k.map.texture.name=q.name+".shadowMap",k.map.depthTexture=new ns(s.x,s.y,_n),k.map.depthTexture.name=q.name+".shadowMapDepth",k.map.depthTexture.format=Wn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=kt,k.map.depthTexture.magFilter=kt}else q.isPointLight?(k.map=new jc(s.x),k.map.depthTexture=new ru(s.x,Ln)):(k.map=new Jt(s.x,s.y),k.map.depthTexture=new ns(s.x,s.y,Ln)),k.map.depthTexture.name=q.name+".shadowMap",k.map.depthTexture.format=Wn,this.type===hr?(k.map.depthTexture.compareFunction=te?Uo:Io,k.map.depthTexture.minFilter=Xt,k.map.depthTexture.magFilter=Xt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=kt,k.map.depthTexture.magFilter=kt);k.camera.updateProjectionMatrix()}const he=k.map.isWebGLCubeRenderTarget?6:1;for(let ue=0;ue<he;ue++){if(k.map.isWebGLCubeRenderTarget)i.setRenderTarget(k.map,ue),i.clear();else{ue===0&&(i.setRenderTarget(k.map),i.clear());const ve=k.getViewport(ue);a.set(r.x*ve.x,r.y*ve.y,r.x*ve.z,r.y*ve.w),N.viewport(a)}if(q.isPointLight){const ve=k.camera,nt=k.matrix,_t=q.distance||ve.far;_t!==ve.far&&(ve.far=_t,ve.updateProjectionMatrix()),_s.setFromMatrixPosition(q.matrixWorld),ve.position.copy(_s),ma.copy(ve.position),ma.add(l0[ue]),ve.up.copy(c0[ue]),ve.lookAt(ma),ve.updateMatrixWorld(),nt.makeTranslation(-_s.x,-_s.y,-_s.z),rc.multiplyMatrices(ve.projectionMatrix,ve.matrixWorldInverse),k._frustum.setFromProjectionMatrix(rc,ve.coordinateSystem,ve.reversedDepth)}else k.updateMatrices(q);n=k.getFrustum(),M(C,v,k.camera,q,this.type)}k.isPointLightShadow!==!0&&this.type===Ms&&b(k,v),k.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(T,L,P)};function b(y,C){const v=e.update(x);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,m.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Jt(s.x,s.y,{format:bi,type:an})),u.uniforms.shadow_pass.value=y.map.depthTexture,u.uniforms.resolution.value=y.mapSize,u.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(C,null,v,u,x,null),m.uniforms.shadow_pass.value=y.mapPass.texture,m.uniforms.resolution.value=y.mapSize,m.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(C,null,v,m,x,null)}function A(y,C,v,T){let L=null;const P=v.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(P!==void 0)L=P;else if(L=v.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const N=L.uuid,X=C.uuid;let $=c[N];$===void 0&&($={},c[N]=$);let B=$[X];B===void 0&&(B=L.clone(),$[X]=B,C.addEventListener("dispose",w)),L=B}if(L.visible=C.visible,L.wireframe=C.wireframe,T===Ms?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:d[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const N=i.properties.get(L);N.light=v}return L}function M(y,C,v,T,L){if(y.visible===!1)return;if(y.layers.test(C.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&L===Ms)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,y.matrixWorld);const X=e.update(y),$=y.material;if(Array.isArray($)){const B=X.groups;for(let q=0,k=B.length;q<k;q++){const J=B[q],te=$[J.materialIndex];if(te&&te.visible){const he=A(y,te,T,L);y.onBeforeShadow(i,y,C,v,X,he,J),i.renderBufferDirect(v,null,X,he,y,J),y.onAfterShadow(i,y,C,v,X,he,J)}}}else if($.visible){const B=A(y,$,T,L);y.onBeforeShadow(i,y,C,v,X,B,null),i.renderBufferDirect(v,null,X,B,y,null),y.onAfterShadow(i,y,C,v,X,B,null)}}const N=y.children;for(let X=0,$=N.length;X<$;X++)M(N[X],C,v,T,L)}function w(y){y.target.removeEventListener("dispose",w);for(const v in c){const T=c[v],L=y.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function d0(i,e){function t(){let I=!1;const ae=new ut;let Z=null;const de=new ut(0,0,0,0);return{setMask:function(pe){Z!==pe&&!I&&(i.colorMask(pe,pe,pe,pe),Z=pe)},setLocked:function(pe){I=pe},setClear:function(pe,Q,ye,Te,Tt){Tt===!0&&(pe*=Te,Q*=Te,ye*=Te),ae.set(pe,Q,ye,Te),de.equals(ae)===!1&&(i.clearColor(pe,Q,ye,Te),de.copy(ae))},reset:function(){I=!1,Z=null,de.set(-1,0,0,0)}}}function n(){let I=!1,ae=!1,Z=null,de=null,pe=null;return{setReversed:function(Q){if(ae!==Q){const ye=e.get("EXT_clip_control");Q?ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.ZERO_TO_ONE_EXT):ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.NEGATIVE_ONE_TO_ONE_EXT),ae=Q;const Te=pe;pe=null,this.setClear(Te)}},getReversed:function(){return ae},setTest:function(Q){Q?j(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(Q){Z!==Q&&!I&&(i.depthMask(Q),Z=Q)},setFunc:function(Q){if(ae&&(Q=pd[Q]),de!==Q){switch(Q){case Ca:i.depthFunc(i.NEVER);break;case Ra:i.depthFunc(i.ALWAYS);break;case Pa:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case La:i.depthFunc(i.EQUAL);break;case Da:i.depthFunc(i.GEQUAL);break;case Ia:i.depthFunc(i.GREATER);break;case Ua:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=Q}},setLocked:function(Q){I=Q},setClear:function(Q){pe!==Q&&(pe=Q,ae&&(Q=1-Q),i.clearDepth(Q))},reset:function(){I=!1,Z=null,de=null,pe=null,ae=!1}}}function s(){let I=!1,ae=null,Z=null,de=null,pe=null,Q=null,ye=null,Te=null,Tt=null;return{setTest:function(vt){I||(vt?j(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(vt){ae!==vt&&!I&&(i.stencilMask(vt),ae=vt)},setFunc:function(vt,Mn,Sn){(Z!==vt||de!==Mn||pe!==Sn)&&(i.stencilFunc(vt,Mn,Sn),Z=vt,de=Mn,pe=Sn)},setOp:function(vt,Mn,Sn){(Q!==vt||ye!==Mn||Te!==Sn)&&(i.stencilOp(vt,Mn,Sn),Q=vt,ye=Mn,Te=Sn)},setLocked:function(vt){I=vt},setClear:function(vt){Tt!==vt&&(i.clearStencil(vt),Tt=vt)},reset:function(){I=!1,ae=null,Z=null,de=null,pe=null,Q=null,ye=null,Te=null,Tt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u={},m=new WeakMap,g=[],x=null,p=!1,f=null,b=null,A=null,M=null,w=null,y=null,C=null,v=new Se(0,0,0),T=0,L=!1,P=null,N=null,X=null,$=null,B=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,J=0;const te=i.getParameter(i.VERSION);te.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(te)[1]),k=J>=1):te.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),k=J>=2);let he=null,ue={};const ve=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),_t=new ut().fromArray(ve),it=new ut().fromArray(nt);function K(I,ae,Z,de){const pe=new Uint8Array(4),Q=i.createTexture();i.bindTexture(I,Q),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ye=0;ye<Z;ye++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(ae+ye,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return Q}const re={};re[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),re[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),re[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(Qi),Ue(!1),Ne(tl),j(i.CULL_FACE),Pe(Rn);function j(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function Re(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Ge(I,ae){return u[I]!==ae?(i.bindFramebuffer(I,ae),u[I]=ae,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ae),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function ge(I,ae){let Z=g,de=!1;if(I){Z=m.get(ae),Z===void 0&&(Z=[],m.set(ae,Z));const pe=I.textures;if(Z.length!==pe.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,ye=pe.length;Q<ye;Q++)Z[Q]=i.COLOR_ATTACHMENT0+Q;Z.length=pe.length,de=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,de=!0);de&&i.drawBuffers(Z)}function He(I){return x!==I?(i.useProgram(I),x=I,!0):!1}const Ie={[pi]:i.FUNC_ADD,[Oh]:i.FUNC_SUBTRACT,[Bh]:i.FUNC_REVERSE_SUBTRACT};Ie[zh]=i.MIN,Ie[Gh]=i.MAX;const st={[kh]:i.ZERO,[Hh]:i.ONE,[Vh]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[Zh]:i.SRC_ALPHA_SATURATE,[Yh]:i.DST_COLOR,[Xh]:i.DST_ALPHA,[Wh]:i.ONE_MINUS_SRC_COLOR,[wa]:i.ONE_MINUS_SRC_ALPHA,[$h]:i.ONE_MINUS_DST_COLOR,[qh]:i.ONE_MINUS_DST_ALPHA,[Kh]:i.CONSTANT_COLOR,[Jh]:i.ONE_MINUS_CONSTANT_COLOR,[Qh]:i.CONSTANT_ALPHA,[jh]:i.ONE_MINUS_CONSTANT_ALPHA};function Pe(I,ae,Z,de,pe,Q,ye,Te,Tt,vt){if(I===Rn){p===!0&&(Re(i.BLEND),p=!1);return}if(p===!1&&(j(i.BLEND),p=!0),I!==Fh){if(I!==f||vt!==L){if((b!==pi||w!==pi)&&(i.blendEquation(i.FUNC_ADD),b=pi,w=pi),vt)switch(I){case Yi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ji:i.blendFunc(i.ONE,i.ONE);break;case nl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case il:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ot("WebGLState: Invalid blending: ",I);break}else switch(I){case Yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nl:ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case il:ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ot("WebGLState: Invalid blending: ",I);break}A=null,M=null,y=null,C=null,v.set(0,0,0),T=0,f=I,L=vt}return}pe=pe||ae,Q=Q||Z,ye=ye||de,(ae!==b||pe!==w)&&(i.blendEquationSeparate(Ie[ae],Ie[pe]),b=ae,w=pe),(Z!==A||de!==M||Q!==y||ye!==C)&&(i.blendFuncSeparate(st[Z],st[de],st[Q],st[ye]),A=Z,M=de,y=Q,C=ye),(Te.equals(v)===!1||Tt!==T)&&(i.blendColor(Te.r,Te.g,Te.b,Tt),v.copy(Te),T=Tt),f=I,L=!1}function Qe(I,ae){I.side===yt?Re(i.CULL_FACE):j(i.CULL_FACE);let Z=I.side===Kt;ae&&(Z=!Z),Ue(Z),I.blending===Yi&&I.transparent===!1?Pe(Rn):Pe(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const de=I.stencilWrite;o.setTest(de),de&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Fe(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(I){P!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),P=I)}function Ne(I){I!==Ih?(j(i.CULL_FACE),I!==N&&(I===tl?i.cullFace(i.BACK):I===Uh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),N=I}function ke(I){I!==X&&(k&&i.lineWidth(I),X=I)}function Fe(I,ae,Z){I?(j(i.POLYGON_OFFSET_FILL),($!==ae||B!==Z)&&($=ae,B=Z,a.getReversed()&&(ae=-ae),i.polygonOffset(ae,Z))):Re(i.POLYGON_OFFSET_FILL)}function Oe(I){I?j(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function je(I){I===void 0&&(I=i.TEXTURE0+q-1),he!==I&&(i.activeTexture(I),he=I)}function D(I,ae,Z){Z===void 0&&(he===null?Z=i.TEXTURE0+q-1:Z=he);let de=ue[Z];de===void 0&&(de={type:void 0,texture:void 0},ue[Z]=de),(de.type!==I||de.texture!==ae)&&(he!==Z&&(i.activeTexture(Z),he=Z),i.bindTexture(I,ae||re[I]),de.type=I,de.texture=ae)}function Je(){const I=ue[he];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Ee(){try{i.compressedTexImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function E(){try{i.compressedTexImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function _(){try{i.texSubImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function U(){try{i.texSubImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function O(){try{i.compressedTexSubImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function V(){try{i.compressedTexSubImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function ee(){try{i.texStorage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function ne(){try{i.texStorage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function W(){try{i.texImage2D(...arguments)}catch(I){ot("WebGLState:",I)}}function Y(){try{i.texImage3D(...arguments)}catch(I){ot("WebGLState:",I)}}function ie(I){return d[I]!==void 0?d[I]:i.getParameter(I)}function be(I,ae){d[I]!==ae&&(i.pixelStorei(I,ae),d[I]=ae)}function le(I){_t.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),_t.copy(I))}function se(I){it.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),it.copy(I))}function we(I,ae){let Z=c.get(ae);Z===void 0&&(Z=new WeakMap,c.set(ae,Z));let de=Z.get(I);de===void 0&&(de=i.getUniformBlockIndex(ae,I.name),Z.set(I,de))}function De(I,ae){const de=c.get(ae).get(I);l.get(ae)!==de&&(i.uniformBlockBinding(ae,de,I.__bindingPointIndex),l.set(ae,de))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},he=null,ue={},u={},m=new WeakMap,g=[],x=null,p=!1,f=null,b=null,A=null,M=null,w=null,y=null,C=null,v=new Se(0,0,0),T=0,L=!1,P=null,N=null,X=null,$=null,B=null,_t.set(0,0,i.canvas.width,i.canvas.height),it.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:j,disable:Re,bindFramebuffer:Ge,drawBuffers:ge,useProgram:He,setBlending:Pe,setMaterial:Qe,setFlipSided:Ue,setCullFace:Ne,setLineWidth:ke,setPolygonOffset:Fe,setScissorTest:Oe,activeTexture:je,bindTexture:D,unbindTexture:Je,compressedTexImage2D:Ee,compressedTexImage3D:E,texImage2D:W,texImage3D:Y,pixelStorei:be,getParameter:ie,updateUBOMapping:we,uniformBlockBinding:De,texStorage2D:ee,texStorage3D:ne,texSubImage2D:_,texSubImage3D:U,compressedTexSubImage2D:O,compressedTexSubImage3D:V,scissor:le,viewport:se,reset:Ve}}function u0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Be,h=new WeakMap,d=new Set;let u;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(E,_){return g?new OffscreenCanvas(E,_):yr("canvas")}function p(E,_,U){let O=1;const V=Ee(E);if((V.width>U||V.height>U)&&(O=U/Math.max(V.width,V.height)),O<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const ee=Math.floor(O*V.width),ne=Math.floor(O*V.height);u===void 0&&(u=x(ee,ne));const W=_?x(ee,ne):u;return W.width=ee,W.height=ne,W.getContext("2d").drawImage(E,0,0,ee,ne),ze("WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+ee+"x"+ne+")."),W}else return"data"in E&&ze("WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),E;return E}function f(E){return E.generateMipmaps}function b(E){i.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(E,_,U,O,V,ee=!1){if(E!==null){if(i[E]!==void 0)return i[E];ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ne;O&&(ne=e.get("EXT_texture_norm16"),ne||ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=_;if(_===i.RED&&(U===i.FLOAT&&(W=i.R32F),U===i.HALF_FLOAT&&(W=i.R16F),U===i.UNSIGNED_BYTE&&(W=i.R8),U===i.UNSIGNED_SHORT&&ne&&(W=ne.R16_EXT),U===i.SHORT&&ne&&(W=ne.R16_SNORM_EXT)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.R8UI),U===i.UNSIGNED_SHORT&&(W=i.R16UI),U===i.UNSIGNED_INT&&(W=i.R32UI),U===i.BYTE&&(W=i.R8I),U===i.SHORT&&(W=i.R16I),U===i.INT&&(W=i.R32I)),_===i.RG&&(U===i.FLOAT&&(W=i.RG32F),U===i.HALF_FLOAT&&(W=i.RG16F),U===i.UNSIGNED_BYTE&&(W=i.RG8),U===i.UNSIGNED_SHORT&&ne&&(W=ne.RG16_EXT),U===i.SHORT&&ne&&(W=ne.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RG8UI),U===i.UNSIGNED_SHORT&&(W=i.RG16UI),U===i.UNSIGNED_INT&&(W=i.RG32UI),U===i.BYTE&&(W=i.RG8I),U===i.SHORT&&(W=i.RG16I),U===i.INT&&(W=i.RG32I)),_===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGB8UI),U===i.UNSIGNED_SHORT&&(W=i.RGB16UI),U===i.UNSIGNED_INT&&(W=i.RGB32UI),U===i.BYTE&&(W=i.RGB8I),U===i.SHORT&&(W=i.RGB16I),U===i.INT&&(W=i.RGB32I)),_===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),U===i.UNSIGNED_INT&&(W=i.RGBA32UI),U===i.BYTE&&(W=i.RGBA8I),U===i.SHORT&&(W=i.RGBA16I),U===i.INT&&(W=i.RGBA32I)),_===i.RGB&&(U===i.UNSIGNED_SHORT&&ne&&(W=ne.RGB16_EXT),U===i.SHORT&&ne&&(W=ne.RGB16_SNORM_EXT),U===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),U===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),_===i.RGBA){const Y=ee?br:et.getTransfer(V);U===i.FLOAT&&(W=i.RGBA32F),U===i.HALF_FLOAT&&(W=i.RGBA16F),U===i.UNSIGNED_BYTE&&(W=Y===ct?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT&&ne&&(W=ne.RGBA16_EXT),U===i.SHORT&&ne&&(W=ne.RGBA16_SNORM_EXT),U===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function w(E,_){let U;return E?_===null||_===Ln||_===Cs?U=i.DEPTH24_STENCIL8:_===_n?U=i.DEPTH32F_STENCIL8:_===ws&&(U=i.DEPTH24_STENCIL8,ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ln||_===Cs?U=i.DEPTH_COMPONENT24:_===_n?U=i.DEPTH_COMPONENT32F:_===ws&&(U=i.DEPTH_COMPONENT16),U}function y(E,_){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==kt&&E.minFilter!==Xt?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function C(E){const _=E.target;_.removeEventListener("dispose",C),T(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&d.delete(_)}function v(E){const _=E.target;_.removeEventListener("dispose",v),P(_)}function T(E){const _=n.get(E);if(_.__webglInit===void 0)return;const U=E.source,O=m.get(U);if(O){const V=O[_.__cacheKey];V.usedTimes--,V.usedTimes===0&&L(E),Object.keys(O).length===0&&m.delete(U)}n.remove(E)}function L(E){const _=n.get(E);i.deleteTexture(_.__webglTexture);const U=E.source,O=m.get(U);delete O[_.__cacheKey],a.memory.textures--}function P(E){const _=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let V=0;V<_.__webglFramebuffer[O].length;V++)i.deleteFramebuffer(_.__webglFramebuffer[O][V]);else i.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)i.deleteFramebuffer(_.__webglFramebuffer[O]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const U=E.textures;for(let O=0,V=U.length;O<V;O++){const ee=n.get(U[O]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),a.memory.textures--),n.remove(U[O])}n.remove(E)}let N=0;function X(){N=0}function $(){return N}function B(E){N=E}function q(){const E=N;return E>=s.maxTextures&&ze("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),N+=1,E}function k(E){const _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function J(E,_){const U=n.get(E);if(E.isVideoTexture&&D(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&U.__version!==E.version){const O=E.image;if(O===null)ze("WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)ze("WebGLRenderer: Texture marked for update but image is incomplete");else{Re(U,E,_);return}}else E.isExternalTexture&&(U.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function te(E,_){const U=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&U.__version!==E.version){Re(U,E,_);return}else E.isExternalTexture&&(U.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function he(E,_){const U=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&U.__version!==E.version){Re(U,E,_);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function ue(E,_){const U=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&U.__version!==E.version){Ge(U,E,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}const ve={[Si]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},nt={[kt]:i.NEAREST,[nd]:i.NEAREST_MIPMAP_NEAREST,[Ds]:i.NEAREST_MIPMAP_LINEAR,[Xt]:i.LINEAR,[Br]:i.LINEAR_MIPMAP_NEAREST,[_i]:i.LINEAR_MIPMAP_LINEAR},_t={[rd]:i.NEVER,[hd]:i.ALWAYS,[ad]:i.LESS,[Io]:i.LEQUAL,[od]:i.EQUAL,[Uo]:i.GEQUAL,[ld]:i.GREATER,[cd]:i.NOTEQUAL};function it(E,_){if(_.type===_n&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Xt||_.magFilter===Br||_.magFilter===Ds||_.magFilter===_i||_.minFilter===Xt||_.minFilter===Br||_.minFilter===Ds||_.minFilter===_i)&&ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,ve[_.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,ve[_.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,ve[_.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,nt[_.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,nt[_.minFilter]),_.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,_t[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===kt||_.minFilter!==Ds&&_.minFilter!==_i||_.type===_n&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function K(E,_){let U=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",C));const O=_.source;let V=m.get(O);V===void 0&&(V={},m.set(O,V));const ee=k(_);if(ee!==E.__cacheKey){V[ee]===void 0&&(V[ee]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),V[ee].usedTimes++;const ne=V[E.__cacheKey];ne!==void 0&&(V[E.__cacheKey].usedTimes--,ne.usedTimes===0&&L(_)),E.__cacheKey=ee,E.__webglTexture=V[ee].texture}return U}function re(E,_,U){return Math.floor(Math.floor(E/U)/_)}function j(E,_,U,O){const ee=E.updateRanges;if(ee.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,U,O,_.data);else{ee.sort((be,le)=>be.start-le.start);let ne=0;for(let be=1;be<ee.length;be++){const le=ee[ne],se=ee[be],we=le.start+le.count,De=re(se.start,_.width,4),Ve=re(le.start,_.width,4);se.start<=we+1&&De===Ve&&re(se.start+se.count-1,_.width,4)===De?le.count=Math.max(le.count,se.start+se.count-le.start):(++ne,ee[ne]=se)}ee.length=ne+1;const W=t.getParameter(i.UNPACK_ROW_LENGTH),Y=t.getParameter(i.UNPACK_SKIP_PIXELS),ie=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let be=0,le=ee.length;be<le;be++){const se=ee[be],we=Math.floor(se.start/4),De=Math.ceil(se.count/4),Ve=we%_.width,I=Math.floor(we/_.width),ae=De,Z=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,Ve,I,ae,Z,U,O,_.data)}E.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,W),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(i.UNPACK_SKIP_ROWS,ie)}}function Re(E,_,U){let O=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=i.TEXTURE_3D);const V=K(E,_),ee=_.source;t.bindTexture(O,E.__webglTexture,i.TEXTURE0+U);const ne=n.get(ee);if(ee.version!==ne.__version||V===!0){if(t.activeTexture(i.TEXTURE0+U),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const Z=et.getPrimaries(et.workingColorSpace),de=_.colorSpace===ni?null:et.getPrimaries(_.colorSpace),pe=_.colorSpace===ni||Z===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let Y=p(_.image,!1,s.maxTextureSize);Y=Je(_,Y);const ie=r.convert(_.format,_.colorSpace),be=r.convert(_.type);let le=M(_.internalFormat,ie,be,_.normalized,_.colorSpace,_.isVideoTexture);it(O,_);let se;const we=_.mipmaps,De=_.isVideoTexture!==!0,Ve=ne.__version===void 0||V===!0,I=ee.dataReady,ae=y(_,Y);if(_.isDepthTexture)le=w(_.format===vi,_.type),Ve&&(De?t.texStorage2D(i.TEXTURE_2D,1,le,Y.width,Y.height):t.texImage2D(i.TEXTURE_2D,0,le,Y.width,Y.height,0,ie,be,null));else if(_.isDataTexture)if(we.length>0){De&&Ve&&t.texStorage2D(i.TEXTURE_2D,ae,le,we[0].width,we[0].height);for(let Z=0,de=we.length;Z<de;Z++)se=we[Z],De?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,se.width,se.height,ie,be,se.data):t.texImage2D(i.TEXTURE_2D,Z,le,se.width,se.height,0,ie,be,se.data);_.generateMipmaps=!1}else De?(Ve&&t.texStorage2D(i.TEXTURE_2D,ae,le,Y.width,Y.height),I&&j(_,Y,ie,be)):t.texImage2D(i.TEXTURE_2D,0,le,Y.width,Y.height,0,ie,be,Y.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){De&&Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,le,we[0].width,we[0].height,Y.depth);for(let Z=0,de=we.length;Z<de;Z++)if(se=we[Z],_.format!==vn)if(ie!==null)if(De){if(I)if(_.layerUpdates.size>0){const pe=Fl(se.width,se.height,_.format,_.type);for(const Q of _.layerUpdates){const ye=se.data.subarray(Q*pe/se.data.BYTES_PER_ELEMENT,(Q+1)*pe/se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,Q,se.width,se.height,1,ie,ye)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,se.width,se.height,Y.depth,ie,se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,le,se.width,se.height,Y.depth,0,se.data,0,0);else ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?I&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,se.width,se.height,Y.depth,ie,be,se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,le,se.width,se.height,Y.depth,0,ie,be,se.data)}else{De&&Ve&&t.texStorage2D(i.TEXTURE_2D,ae,le,we[0].width,we[0].height);for(let Z=0,de=we.length;Z<de;Z++)se=we[Z],_.format!==vn?ie!==null?De?I&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,se.width,se.height,ie,se.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,le,se.width,se.height,0,se.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,se.width,se.height,ie,be,se.data):t.texImage2D(i.TEXTURE_2D,Z,le,se.width,se.height,0,ie,be,se.data)}else if(_.isDataArrayTexture)if(De){if(Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,le,Y.width,Y.height,Y.depth),I)if(_.layerUpdates.size>0){const Z=Fl(Y.width,Y.height,_.format,_.type);for(const de of _.layerUpdates){const pe=Y.data.subarray(de*Z/Y.data.BYTES_PER_ELEMENT,(de+1)*Z/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,de,Y.width,Y.height,1,ie,be,pe)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,ie,be,Y.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,le,Y.width,Y.height,Y.depth,0,ie,be,Y.data);else if(_.isData3DTexture)De?(Ve&&t.texStorage3D(i.TEXTURE_3D,ae,le,Y.width,Y.height,Y.depth),I&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,ie,be,Y.data)):t.texImage3D(i.TEXTURE_3D,0,le,Y.width,Y.height,Y.depth,0,ie,be,Y.data);else if(_.isFramebufferTexture){if(Ve)if(De)t.texStorage2D(i.TEXTURE_2D,ae,le,Y.width,Y.height);else{let Z=Y.width,de=Y.height;for(let pe=0;pe<ae;pe++)t.texImage2D(i.TEXTURE_2D,pe,le,Z,de,0,ie,be,null),Z>>=1,de>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){const Z=i.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),Y.parentNode!==Z){Z.appendChild(Y),d.add(_),Z.onpaint=de=>{const pe=de.changedElements;for(const Q of d)pe.includes(Q.image)&&(Q.needsUpdate=!0)},Z.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Y);else{const pe=i.RGBA,Q=i.RGBA,ye=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pe,Q,ye,Y)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(we.length>0){if(De&&Ve){const Z=Ee(we[0]);t.texStorage2D(i.TEXTURE_2D,ae,le,Z.width,Z.height)}for(let Z=0,de=we.length;Z<de;Z++)se=we[Z],De?I&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ie,be,se):t.texImage2D(i.TEXTURE_2D,Z,le,ie,be,se);_.generateMipmaps=!1}else if(De){if(Ve){const Z=Ee(Y);t.texStorage2D(i.TEXTURE_2D,ae,le,Z.width,Z.height)}I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,be,Y)}else t.texImage2D(i.TEXTURE_2D,0,le,ie,be,Y);f(_)&&b(O),ne.__version=ee.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Ge(E,_,U){if(_.image.length!==6)return;const O=K(E,_),V=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+U);const ee=n.get(V);if(V.version!==ee.__version||O===!0){t.activeTexture(i.TEXTURE0+U);const ne=et.getPrimaries(et.workingColorSpace),W=_.colorSpace===ni?null:et.getPrimaries(_.colorSpace),Y=_.colorSpace===ni||ne===W?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const ie=_.isCompressedTexture||_.image[0].isCompressedTexture,be=_.image[0]&&_.image[0].isDataTexture,le=[];for(let Q=0;Q<6;Q++)!ie&&!be?le[Q]=p(_.image[Q],!0,s.maxCubemapSize):le[Q]=be?_.image[Q].image:_.image[Q],le[Q]=Je(_,le[Q]);const se=le[0],we=r.convert(_.format,_.colorSpace),De=r.convert(_.type),Ve=M(_.internalFormat,we,De,_.normalized,_.colorSpace),I=_.isVideoTexture!==!0,ae=ee.__version===void 0||O===!0,Z=V.dataReady;let de=y(_,se);it(i.TEXTURE_CUBE_MAP,_);let pe;if(ie){I&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ve,se.width,se.height);for(let Q=0;Q<6;Q++){pe=le[Q].mipmaps;for(let ye=0;ye<pe.length;ye++){const Te=pe[ye];_.format!==vn?we!==null?I?Z&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,0,0,Te.width,Te.height,we,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,Ve,Te.width,Te.height,0,Te.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,0,0,Te.width,Te.height,we,De,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye,Ve,Te.width,Te.height,0,we,De,Te.data)}}}else{if(pe=_.mipmaps,I&&ae){pe.length>0&&de++;const Q=Ee(le[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ve,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(be){I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,le[Q].width,le[Q].height,we,De,le[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,le[Q].width,le[Q].height,0,we,De,le[Q].data);for(let ye=0;ye<pe.length;ye++){const Tt=pe[ye].image[Q].image;I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,0,0,Tt.width,Tt.height,we,De,Tt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,Ve,Tt.width,Tt.height,0,we,De,Tt.data)}}else{I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,we,De,le[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,we,De,le[Q]);for(let ye=0;ye<pe.length;ye++){const Te=pe[ye];I?Z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,0,0,we,De,Te.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ye+1,Ve,we,De,Te.image[Q])}}}f(_)&&b(i.TEXTURE_CUBE_MAP),ee.__version=V.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function ge(E,_,U,O,V,ee){const ne=r.convert(U.format,U.colorSpace),W=r.convert(U.type),Y=M(U.internalFormat,ne,W,U.normalized,U.colorSpace),ie=n.get(_),be=n.get(U);if(be.__renderTarget=_,!ie.__hasExternalTextures){const le=Math.max(1,_.width>>ee),se=Math.max(1,_.height>>ee);V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?t.texImage3D(V,ee,Y,le,se,_.depth,0,ne,W,null):t.texImage2D(V,ee,Y,le,se,0,ne,W,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),je(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,O,V,be.__webglTexture,0,Oe(_)):(V===i.TEXTURE_2D||V>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,O,V,be.__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(E,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,E),_.depthBuffer){const O=_.depthTexture,V=O&&O.isDepthTexture?O.type:null,ee=w(_.stencilBuffer,V),ne=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;je(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Oe(_),ee,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe(_),ee,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ee,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,E)}else{const O=_.textures;for(let V=0;V<O.length;V++){const ee=O[V],ne=r.convert(ee.format,ee.colorSpace),W=r.convert(ee.type),Y=M(ee.internalFormat,ne,W,ee.normalized,ee.colorSpace);je(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Oe(_),Y,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe(_),Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(E,_,U){const O=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const V=n.get(_.depthTexture);if(V.__renderTarget=_,(!V.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),O){if(V.__webglInit===void 0&&(V.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),V.__webglTexture===void 0){V.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),it(i.TEXTURE_CUBE_MAP,_.depthTexture);const ie=r.convert(_.depthTexture.format),be=r.convert(_.depthTexture.type);let le;_.depthTexture.format===Wn?le=i.DEPTH_COMPONENT24:_.depthTexture.format===vi&&(le=i.DEPTH24_STENCIL8);for(let se=0;se<6;se++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,le,_.width,_.height,0,ie,be,null)}}else J(_.depthTexture,0);const ee=V.__webglTexture,ne=Oe(_),W=O?i.TEXTURE_CUBE_MAP_POSITIVE_X+U:i.TEXTURE_2D,Y=_.depthTexture.format===vi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Wn)je(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,W,ee,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,Y,W,ee,0);else if(_.depthTexture.format===vi)je(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,W,ee,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,Y,W,ee,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function st(E){const _=n.get(E),U=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){const O=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const V=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",V)};O.addEventListener("dispose",V),_.__depthDisposeCallback=V}_.__boundDepthTexture=O}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(U)for(let O=0;O<6;O++)Ie(_.__webglFramebuffer[O],E,O);else{const O=E.texture.mipmaps;O&&O.length>0?Ie(_.__webglFramebuffer[0],E,0):Ie(_.__webglFramebuffer,E,0)}else if(U){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=i.createRenderbuffer(),He(_.__webglDepthbuffer[O],E,!1);else{const V=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer[O];i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,ee)}}else{const O=E.texture.mipmaps;if(O&&O.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),He(_.__webglDepthbuffer,E,!1);else{const V=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,ee)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pe(E,_,U){const O=n.get(E);_!==void 0&&ge(O.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&st(E)}function Qe(E){const _=E.texture,U=n.get(E),O=n.get(_);E.addEventListener("dispose",v);const V=E.textures,ee=E.isWebGLCubeRenderTarget===!0,ne=V.length>1;if(ne||(O.__webglTexture===void 0&&(O.__webglTexture=i.createTexture()),O.__version=_.version,a.memory.textures++),ee){U.__webglFramebuffer=[];for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[W]=[];for(let Y=0;Y<_.mipmaps.length;Y++)U.__webglFramebuffer[W][Y]=i.createFramebuffer()}else U.__webglFramebuffer[W]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let W=0;W<_.mipmaps.length;W++)U.__webglFramebuffer[W]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(ne)for(let W=0,Y=V.length;W<Y;W++){const ie=n.get(V[W]);ie.__webglTexture===void 0&&(ie.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&je(E)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let W=0;W<V.length;W++){const Y=V[W];U.__webglColorRenderbuffer[W]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[W]);const ie=r.convert(Y.format,Y.colorSpace),be=r.convert(Y.type),le=M(Y.internalFormat,ie,be,Y.normalized,Y.colorSpace,E.isXRRenderTarget===!0),se=Oe(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,se,le,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+W,i.RENDERBUFFER,U.__webglColorRenderbuffer[W])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),He(U.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture),it(i.TEXTURE_CUBE_MAP,_);for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)ge(U.__webglFramebuffer[W][Y],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,Y);else ge(U.__webglFramebuffer[W],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);f(_)&&b(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ne){for(let W=0,Y=V.length;W<Y;W++){const ie=V[W],be=n.get(ie);let le=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(le=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,be.__webglTexture),it(le,ie),ge(U.__webglFramebuffer,E,ie,i.COLOR_ATTACHMENT0+W,le,0),f(ie)&&b(le)}t.unbindTexture()}else{let W=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(W=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(W,O.__webglTexture),it(W,_),_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)ge(U.__webglFramebuffer[Y],E,_,i.COLOR_ATTACHMENT0,W,Y);else ge(U.__webglFramebuffer,E,_,i.COLOR_ATTACHMENT0,W,0);f(_)&&b(W),t.unbindTexture()}E.depthBuffer&&st(E)}function Ue(E){const _=E.textures;for(let U=0,O=_.length;U<O;U++){const V=_[U];if(f(V)){const ee=A(E),ne=n.get(V).__webglTexture;t.bindTexture(ee,ne),b(ee),t.unbindTexture()}}}const Ne=[],ke=[];function Fe(E){if(E.samples>0){if(je(E)===!1){const _=E.textures,U=E.width,O=E.height;let V=i.COLOR_BUFFER_BIT;const ee=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=n.get(E),W=_.length>1;if(W)for(let ie=0;ie<_.length;ie++)t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ne.__webglMultisampledFramebuffer);const Y=E.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ne.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ne.__webglFramebuffer);for(let ie=0;ie<_.length;ie++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(V|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(V|=i.STENCIL_BUFFER_BIT)),W){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ne.__webglColorRenderbuffer[ie]);const be=n.get(_[ie]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,be,0)}i.blitFramebuffer(0,0,U,O,0,0,U,O,V,i.NEAREST),l===!0&&(Ne.length=0,ke.length=0,Ne.push(i.COLOR_ATTACHMENT0+ie),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Ne.push(ee),ke.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ke)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ne))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),W)for(let ie=0;ie<_.length;ie++){t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,ne.__webglColorRenderbuffer[ie]);const be=n.get(_[ie]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ne.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const _=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Oe(E){return Math.min(s.maxSamples,E.samples)}function je(E){const _=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function D(E){const _=a.render.frame;h.get(E)!==_&&(h.set(E,_),E.update())}function Je(E,_){const U=E.colorSpace,O=E.format,V=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||U!==Sr&&U!==ni&&(et.getTransfer(U)===ct?(O!==vn||V!==rn)&&ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ot("WebGLTextures: Unsupported texture color space:",U)),_}function Ee(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=X,this.getTextureUnits=$,this.setTextureUnits=B,this.setTexture2D=J,this.setTexture2DArray=te,this.setTexture3D=he,this.setTextureCube=ue,this.rebindTextures=Pe,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Ue,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function f0(i,e){function t(n,s=ni){let r;const a=et.getTransfer(s);if(n===rn)return i.UNSIGNED_BYTE;if(n===wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Co)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Lc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Dc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Rc)return i.BYTE;if(n===Pc)return i.SHORT;if(n===ws)return i.UNSIGNED_SHORT;if(n===Ao)return i.INT;if(n===Ln)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===an)return i.HALF_FLOAT;if(n===Ic)return i.ALPHA;if(n===Uc)return i.RGB;if(n===vn)return i.RGBA;if(n===Wn)return i.DEPTH_COMPONENT;if(n===vi)return i.DEPTH_STENCIL;if(n===Ro)return i.RED;if(n===Po)return i.RED_INTEGER;if(n===bi)return i.RG;if(n===Lo)return i.RG_INTEGER;if(n===Do)return i.RGBA_INTEGER;if(n===dr||n===ur||n===fr||n===pr)if(a===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===dr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===dr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===fr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fa||n===Oa||n===Ba||n===za)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ga||n===ka||n===Ha||n===Va||n===Wa||n===vr||n===Xa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ga||n===ka)return a===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ha)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Va)return r.COMPRESSED_R11_EAC;if(n===Wa)return r.COMPRESSED_SIGNED_R11_EAC;if(n===vr)return r.COMPRESSED_RG11_EAC;if(n===Xa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===qa||n===Ya||n===$a||n===Za||n===Ka||n===Ja||n===Qa||n===ja||n===eo||n===to||n===no||n===io||n===so||n===ro)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ya)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$a)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Za)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ka)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ja)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===eo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===to)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===no)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===io)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===so)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ro)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ao||n===oo||n===lo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ao)return a===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===lo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===co||n===ho||n===xr||n===uo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ho)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===xr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const p0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,m0=`
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

}`;class g0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new qc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ut({vertexShader:p0,fragmentShader:m0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new ss(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _0 extends Ei{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,m=null,g=null;const x=typeof XRWebGLBinding<"u",p=new g0,f={},b=t.getContextAttributes();let A=null,M=null;const w=[],y=[],C=new Be;let v=null;const T=new sn;T.viewport=new ut;const L=new sn;L.viewport=new ut;const P=[T,L],N=new Mu;let X=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=w[K];return re===void 0&&(re=new Wr,w[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=w[K];return re===void 0&&(re=new Wr,w[K]=re),re.getGripSpace()},this.getHand=function(K){let re=w[K];return re===void 0&&(re=new Wr,w[K]=re),re.getHandSpace()};function B(K){const re=y.indexOf(K.inputSource);if(re===-1)return;const j=w[re];j!==void 0&&(j.update(K.inputSource,K.frame,c||a),j.dispatchEvent({type:K.type,data:K.inputSource}))}function q(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",k);for(let K=0;K<w.length;K++){const re=y[K];re!==null&&(y[K]=null,w[K].disconnect(re))}X=null,$=null,p.reset();for(const K in f)delete f[K];e.setRenderTarget(A),m=null,u=null,d=null,s=null,M=null,it.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",q),s.addEventListener("inputsourceschange",k),b.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,Re=null,Ge=null;b.depth&&(Ge=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=b.stencil?vi:Wn,Re=b.stencil?Cs:Ln);const ge={colorFormat:t.RGBA8,depthFormat:Ge,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ge),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new Jt(u.textureWidth,u.textureHeight,{format:vn,type:rn,depthTexture:new ns(u.textureWidth,u.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const j={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,j),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new Jt(m.framebufferWidth,m.framebufferHeight,{format:vn,type:rn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),it.setContext(s),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function k(K){for(let re=0;re<K.removed.length;re++){const j=K.removed[re],Re=y.indexOf(j);Re>=0&&(y[Re]=null,w[Re].disconnect(j))}for(let re=0;re<K.added.length;re++){const j=K.added[re];let Re=y.indexOf(j);if(Re===-1){for(let ge=0;ge<w.length;ge++)if(ge>=y.length){y.push(j),Re=ge;break}else if(y[ge]===null){y[ge]=j,Re=ge;break}if(Re===-1)break}const Ge=w[Re];Ge&&Ge.connect(j)}}const J=new R,te=new R;function he(K,re,j){J.setFromMatrixPosition(re.matrixWorld),te.setFromMatrixPosition(j.matrixWorld);const Re=J.distanceTo(te),Ge=re.projectionMatrix.elements,ge=j.projectionMatrix.elements,He=Ge[14]/(Ge[10]-1),Ie=Ge[14]/(Ge[10]+1),st=(Ge[9]+1)/Ge[5],Pe=(Ge[9]-1)/Ge[5],Qe=(Ge[8]-1)/Ge[0],Ue=(ge[8]+1)/ge[0],Ne=He*Qe,ke=He*Ue,Fe=Re/(-Qe+Ue),Oe=Fe*-Qe;if(re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Oe),K.translateZ(Fe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ge[10]===-1)K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const je=He+Fe,D=Ie+Fe,Je=Ne-Oe,Ee=ke+(Re-Oe),E=st*Ie/D*je,_=Pe*Ie/D*je;K.projectionMatrix.makePerspective(Je,Ee,E,_,je,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ue(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let re=K.near,j=K.far;p.texture!==null&&(p.depthNear>0&&(re=p.depthNear),p.depthFar>0&&(j=p.depthFar)),N.near=L.near=T.near=re,N.far=L.far=T.far=j,(X!==N.near||$!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),X=N.near,$=N.far),N.layers.mask=K.layers.mask|6,T.layers.mask=N.layers.mask&-5,L.layers.mask=N.layers.mask&-3;const Re=K.parent,Ge=N.cameras;ue(N,Re);for(let ge=0;ge<Ge.length;ge++)ue(Ge[ge],Re);Ge.length===2?he(N,T,L):N.projectionMatrix.copy(T.projectionMatrix),ve(K,N,Re)};function ve(K,re,j){j===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(j.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=ts*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(N)},this.getCameraTexture=function(K){return f[K]};let nt=null;function _t(K,re){if(h=re.getViewerPose(c||a),g=re,h!==null){const j=h.views;m!==null&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let Re=!1;j.length!==N.cameras.length&&(N.cameras.length=0,Re=!0);for(let Ie=0;Ie<j.length;Ie++){const st=j[Ie];let Pe=null;if(m!==null)Pe=m.getViewport(st);else{const Ue=d.getViewSubImage(u,st);Pe=Ue.viewport,Ie===0&&(e.setRenderTargetTextures(M,Ue.colorTexture,Ue.depthStencilTexture),e.setRenderTarget(M))}let Qe=P[Ie];Qe===void 0&&(Qe=new sn,Qe.layers.enable(Ie),Qe.viewport=new ut,P[Ie]=Qe),Qe.matrix.fromArray(st.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(st.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),Ie===0&&(N.matrix.copy(Qe.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Re===!0&&N.cameras.push(Qe)}const Ge=s.enabledFeatures;if(Ge&&Ge.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const Ie=d.getDepthInformation(j[0]);Ie&&Ie.isValid&&Ie.texture&&p.init(Ie,s.renderState)}if(Ge&&Ge.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Ie=0;Ie<j.length;Ie++){const st=j[Ie].camera;if(st){let Pe=f[st];Pe||(Pe=new qc,f[st]=Pe);const Qe=d.getCameraImage(st);Pe.sourceTexture=Qe}}}}for(let j=0;j<w.length;j++){const Re=y[j],Ge=w[j];Re!==null&&Ge!==void 0&&Ge.update(Re,re,c||a)}nt&&nt(K,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),g=null}const it=new Jc;it.setAnimationLoop(_t),this.setAnimationLoop=function(K){nt=K},this.dispose=function(){}}}const v0=new ft,sh=new qe;sh.set(-1,0,0,0,1,0,0,0,1);function x0(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Yc(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,b,A,M){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(p,f):f.isMeshLambertMaterial?(r(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(p,f),d(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(p,f),u(p,f),f.isMeshPhysicalMaterial&&m(p,f,M)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),x(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,b,A):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Kt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Kt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const b=e.get(f),A=b.envMap,M=b.envMapRotation;A&&(p.envMap.value=A,p.envMapRotation.value.setFromMatrix4(v0.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(sh),p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,b,A){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*b,p.scale.value=A*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function u(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,b){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Kt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){const b=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function M0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){const y=w.program;n.uniformBlockBinding(M,y)}function c(M,w){let y=s[M.id];y===void 0&&(p(M),y=h(M),s[M.id]=y,M.addEventListener("dispose",b));const C=w.program;n.updateUBOMapping(M,C);const v=e.render.frame;r[M.id]!==v&&(u(M),r[M.id]=v)}function h(M){const w=d();M.__bindingPointIndex=w;const y=i.createBuffer(),C=M.__size,v=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,C,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,y),y}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const w=s[M.id],y=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let v=0,T=y.length;v<T;v++){const L=y[v];if(Array.isArray(L))for(let P=0,N=L.length;P<N;P++)m(L[P],v,P,C);else m(L,v,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(M,w,y,C){if(x(M,w,y,C)===!0){const v=M.__offset,T=M.value;if(Array.isArray(T)){let L=0;for(let P=0;P<T.length;P++){const N=T[P],X=f(N);g(N,M.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,M.__data)}}function g(M,w,y){typeof M=="number"||typeof M=="boolean"?w[0]=M:M.isMatrix3?(w[0]=M.elements[0],w[1]=M.elements[1],w[2]=M.elements[2],w[3]=0,w[4]=M.elements[3],w[5]=M.elements[4],w[6]=M.elements[5],w[7]=0,w[8]=M.elements[6],w[9]=M.elements[7],w[10]=M.elements[8],w[11]=0):ArrayBuffer.isView(M)?w.set(new M.constructor(M.buffer,M.byteOffset,w.length)):M.toArray(w,y)}function x(M,w,y,C){const v=M.value,T=w+"_"+y;if(C[T]===void 0)return typeof v=="number"||typeof v=="boolean"?C[T]=v:ArrayBuffer.isView(v)?C[T]=v.slice():C[T]=v.clone(),!0;{const L=C[T];if(typeof v=="number"||typeof v=="boolean"){if(L!==v)return C[T]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(L.equals(v)===!1)return L.copy(v),!0}}return!1}function p(M){const w=M.uniforms;let y=0;const C=16;for(let T=0,L=w.length;T<L;T++){const P=Array.isArray(w[T])?w[T]:[w[T]];for(let N=0,X=P.length;N<X;N++){const $=P[N],B=Array.isArray($.value)?$.value:[$.value];for(let q=0,k=B.length;q<k;q++){const J=B[q],te=f(J),he=y%C,ue=he%te.boundary,ve=he+ue;y+=ue,ve!==0&&C-ve<te.storage&&(y+=C-ve),$.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=y,y+=te.storage}}}const v=y%C;return v>0&&(y+=C-v),M.__size=y,M.__cache={},this}function f(M){const w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(w.boundary=16,w.storage=M.byteLength):ze("WebGLRenderer: Unsupported uniform value type.",M),w}function b(M){const w=M.target;w.removeEventListener("dispose",b);const y=a.indexOf(w.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function A(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}const S0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let En=null;function b0(){return En===null&&(En=new Hc(S0,16,16,bi,an),En.name="DFG_LUT",En.minFilter=Xt,En.magFilter=Xt,En.wrapS=Gn,En.wrapT=Gn,En.generateMipmaps=!1,En.needsUpdate=!0),En}class y0{constructor(e={}){const{canvas:t=ud(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:m=rn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const x=m,p=new Set([Do,Lo,Po]),f=new Set([rn,Ln,ws,Cs,wo,Co]),b=new Uint32Array(4),A=new Int32Array(4),M=new R;let w=null,y=null;const C=[],v=[];let T=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let P=!1,N=null,X=null,$=null,B=null;this._outputColorSpace=nn;let q=0,k=0,J=null,te=-1,he=null;const ue=new ut,ve=new ut;let nt=null;const _t=new Se(0);let it=0,K=t.width,re=t.height,j=1,Re=null,Ge=null;const ge=new ut(0,0,K,re),He=new ut(0,0,K,re);let Ie=!1;const st=new Oo;let Pe=!1,Qe=!1;const Ue=new ft,Ne=new R,ke=new ut,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function je(){return J===null?j:1}let D=n;function Je(S,F){return t.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vo}`),t.addEventListener("webglcontextlost",Tt,!1),t.addEventListener("webglcontextrestored",vt,!1),t.addEventListener("webglcontextcreationerror",Mn,!1),D===null){const F="webgl2";if(D=Je(F,S),D===null)throw Je(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw ot("WebGLRenderer: "+S.message),S}let Ee,E,_,U,O,V,ee,ne,W,Y,ie,be,le,se,we,De,Ve,I,ae,Z,de,pe,Q;function ye(){Ee=new bm(D),Ee.init(),de=new f0(D,Ee),E=new pm(D,Ee,e,de),_=new d0(D,Ee),E.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),X=D.createFramebuffer(),$=D.createFramebuffer(),B=D.createFramebuffer(),U=new Tm(D),O=new Jg,V=new u0(D,Ee,_,O,E,de,U),ee=new Sm(L),ne=new Cu(D),pe=new um(D,ne),W=new ym(D,ne,U,pe),Y=new wm(D,W,ne,pe,U),I=new Am(D,E,V),we=new mm(O),ie=new Kg(L,ee,Ee,E,pe,we),be=new x0(L,O),le=new jg,se=new r0(Ee),Ve=new dm(L,ee,_,Y,g,l),De=new h0(L,Y,E),Q=new M0(D,U,E,_),ae=new fm(D,Ee,U),Z=new Em(D,Ee,U),U.programs=ie.programs,L.capabilities=E,L.extensions=Ee,L.properties=O,L.renderLists=le,L.shadowMap=De,L.state=_,L.info=U}ye(),x!==rn&&(T=new Rm(x,t.width,t.height,o,s,r));const Te=new _0(L,D);this.xr=Te,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const S=Ee.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ee.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(S){S!==void 0&&(j=S,this.setSize(K,re,!1))},this.getSize=function(S){return S.set(K,re)},this.setSize=function(S,F,H=!0){if(Te.isPresenting){ze("WebGLRenderer: Can't change size while VR device is presenting.");return}K=S,re=F,t.width=Math.floor(S*j),t.height=Math.floor(F*j),H===!0&&(t.style.width=S+"px",t.style.height=F+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(K*j,re*j).floor()},this.setDrawingBufferSize=function(S,F,H){K=S,re=F,j=H,t.width=Math.floor(S*H),t.height=Math.floor(F*H),this.setViewport(0,0,S,F)},this.setEffects=function(S){if(x===rn){ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let F=0;F<S.length;F++)if(S[F].isOutputPass===!0){ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ue)},this.getViewport=function(S){return S.copy(ge)},this.setViewport=function(S,F,H,z){S.isVector4?ge.set(S.x,S.y,S.z,S.w):ge.set(S,F,H,z),_.viewport(ue.copy(ge).multiplyScalar(j).round())},this.getScissor=function(S){return S.copy(He)},this.setScissor=function(S,F,H,z){S.isVector4?He.set(S.x,S.y,S.z,S.w):He.set(S,F,H,z),_.scissor(ve.copy(He).multiplyScalar(j).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(S){_.setScissorTest(Ie=S)},this.setOpaqueSort=function(S){Re=S},this.setTransparentSort=function(S){Ge=S},this.getClearColor=function(S){return S.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,H=!0){let z=0;if(S){let G=!1;if(J!==null){const me=J.texture.format;G=p.has(me)}if(G){const me=J.texture.type,Me=f.has(me),fe=Ve.getClearColor(),Ae=Ve.getClearAlpha(),Ce=fe.r,Ye=fe.g,Ke=fe.b;Me?(b[0]=Ce,b[1]=Ye,b[2]=Ke,b[3]=Ae,D.clearBufferuiv(D.COLOR,0,b)):(A[0]=Ce,A[1]=Ye,A[2]=Ke,A[3]=Ae,D.clearBufferiv(D.COLOR,0,A))}else z|=D.COLOR_BUFFER_BIT}F&&(z|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),H&&(z|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&D.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),N=S},this.dispose=function(){t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",vt,!1),t.removeEventListener("webglcontextcreationerror",Mn,!1),Ve.dispose(),le.dispose(),se.dispose(),O.dispose(),ee.dispose(),Y.dispose(),pe.dispose(),Q.dispose(),ie.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",qo),Te.removeEventListener("sessionend",Yo),li.stop()};function Tt(S){S.preventDefault(),Er("WebGLRenderer: Context Lost."),P=!0}function vt(){Er("WebGLRenderer: Context Restored."),P=!1;const S=U.autoReset,F=De.enabled,H=De.autoUpdate,z=De.needsUpdate,G=De.type;ye(),U.autoReset=S,De.enabled=F,De.autoUpdate=H,De.needsUpdate=z,De.type=G}function Mn(S){ot("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Sn(S){const F=S.target;F.removeEventListener("dispose",Sn),ph(F)}function ph(S){mh(S),O.remove(S)}function mh(S){const F=O.get(S).programs;F!==void 0&&(F.forEach(function(H){ie.releaseProgram(H)}),S.isShaderMaterial&&ie.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,H,z,G,me){F===null&&(F=Fe);const Me=G.isMesh&&G.matrixWorld.determinantAffine()<0,fe=vh(S,F,H,z,G);_.setMaterial(z,Me);let Ae=H.index,Ce=1;if(z.wireframe===!0){if(Ae=W.getWireframeAttribute(H),Ae===void 0)return;Ce=2}const Ye=H.drawRange,Ke=H.attributes.position;let Le=Ye.start*Ce,dt=(Ye.start+Ye.count)*Ce;me!==null&&(Le=Math.max(Le,me.start*Ce),dt=Math.min(dt,(me.start+me.count)*Ce)),Ae!==null?(Le=Math.max(Le,0),dt=Math.min(dt,Ae.count)):Ke!=null&&(Le=Math.max(Le,0),dt=Math.min(dt,Ke.count));const Rt=dt-Le;if(Rt<0||Rt===1/0)return;pe.setup(G,z,fe,H,Ae);let At,pt=ae;if(Ae!==null&&(At=ne.get(Ae),pt=Z,pt.setIndex(At)),G.isMesh)z.wireframe===!0?(_.setLineWidth(z.wireframeLinewidth*je()),pt.setMode(D.LINES)):pt.setMode(D.TRIANGLES);else if(G.isLine){let Ht=z.linewidth;Ht===void 0&&(Ht=1),_.setLineWidth(Ht*je()),G.isLineSegments?pt.setMode(D.LINES):G.isLineLoop?pt.setMode(D.LINE_LOOP):pt.setMode(D.LINE_STRIP)}else G.isPoints?pt.setMode(D.POINTS):G.isSprite&&pt.setMode(D.TRIANGLES);if(G.isBatchedMesh)if(Ee.get("WEBGL_multi_draw"))pt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ht=G._multiDrawStarts,xe=G._multiDrawCounts,Qt=G._multiDrawCount,at=Ae?ne.get(Ae).bytesPerElement:1,on=O.get(z).currentProgram.getUniforms();for(let bn=0;bn<Qt;bn++)on.setValue(D,"_gl_DrawID",bn),pt.render(Ht[bn]/at,xe[bn])}else if(G.isInstancedMesh)pt.renderInstances(Le,Rt,G.count);else if(H.isInstancedBufferGeometry){const Ht=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,xe=Math.min(H.instanceCount,Ht);pt.renderInstances(Le,Rt,xe)}else pt.render(Le,Rt)};function Xo(S,F,H){S.transparent===!0&&S.side===yt&&S.forceSinglePass===!1?(S.side=Kt,S.needsUpdate=!0,Ls(S,F,H),S.side=ri,S.needsUpdate=!0,Ls(S,F,H),S.side=yt):Ls(S,F,H)}this.compile=function(S,F,H=null){H===null&&(H=S),y=se.get(H),y.init(F),v.push(y),H.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),S!==H&&S.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(y.pushLight(G),G.castShadow&&y.pushShadow(G))}),y.setupLights();const z=new Set;return S.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const me=G.material;if(me)if(Array.isArray(me))for(let Me=0;Me<me.length;Me++){const fe=me[Me];Xo(fe,H,G),z.add(fe)}else Xo(me,H,G),z.add(me)}),y=v.pop(),z},this.compileAsync=function(S,F,H=null){const z=this.compile(S,F,H);return new Promise(G=>{function me(){if(z.forEach(function(Me){O.get(Me).currentProgram.isReady()&&z.delete(Me)}),z.size===0){G(S);return}setTimeout(me,10)}Ee.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Ur=null;function gh(S){Ur&&Ur(S)}function qo(){li.stop()}function Yo(){li.start()}const li=new Jc;li.setAnimationLoop(gh),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(S){Ur=S,Te.setAnimationLoop(S),S===null?li.stop():li.start()},Te.addEventListener("sessionstart",qo),Te.addEventListener("sessionend",Yo),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;N!==null&&N.renderStart(S,F);const H=Te.enabled===!0&&Te.isPresenting===!0,z=T!==null&&(J===null||H)&&T.begin(L,J);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(F),F=Te.getCamera()),S.isScene===!0&&S.onBeforeRender(L,S,F,J),y=se.get(S,v.length),y.init(F),y.state.textureUnits=V.getTextureUnits(),v.push(y),Ue.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),st.setFromProjectionMatrix(Ue,xn,F.reversedDepth),Qe=this.localClippingEnabled,Pe=we.init(this.clippingPlanes,Qe),w=le.get(S,C.length),w.init(),C.push(w),Te.enabled===!0&&Te.isPresenting===!0){const Me=L.xr.getDepthSensingMesh();Me!==null&&Nr(Me,F,-1/0,L.sortObjects)}Nr(S,F,0,L.sortObjects),w.finish(),L.sortObjects===!0&&w.sort(Re,Ge,F.reversedDepth),Oe=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,Oe&&Ve.addToRenderList(w,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Pe===!0&&we.beginShadows();const G=y.state.shadowsArray;if(De.render(G,S,F),Pe===!0&&we.endShadows(),(z&&T.hasRenderPass())===!1){const Me=w.opaque,fe=w.transmissive;if(y.setupLights(),F.isArrayCamera){const Ae=F.cameras;if(fe.length>0)for(let Ce=0,Ye=Ae.length;Ce<Ye;Ce++){const Ke=Ae[Ce];Zo(Me,fe,S,Ke)}Oe&&Ve.render(S);for(let Ce=0,Ye=Ae.length;Ce<Ye;Ce++){const Ke=Ae[Ce];$o(w,S,Ke,Ke.viewport)}}else fe.length>0&&Zo(Me,fe,S,F),Oe&&Ve.render(S),$o(w,S,F)}J!==null&&k===0&&(V.updateMultisampleRenderTarget(J),V.updateRenderTargetMipmap(J)),z&&T.end(L),S.isScene===!0&&S.onAfterRender(L,S,F),pe.resetDefaultState(),te=-1,he=null,v.pop(),v.length>0?(y=v[v.length-1],V.setTextureUnits(y.state.textureUnits),Pe===!0&&we.setGlobalState(L.clippingPlanes,y.state.camera)):y=null,C.pop(),C.length>0?w=C[C.length-1]:w=null,N!==null&&N.renderEnd()};function Nr(S,F,H,z){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)H=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLightProbeGrid)y.pushLightProbeGrid(S);else if(S.isLight)y.pushLight(S),S.castShadow&&y.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||st.intersectsSprite(S)){z&&ke.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Ue);const Me=Y.update(S),fe=S.material;fe.visible&&w.push(S,Me,fe,H,ke.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||st.intersectsObject(S))){const Me=Y.update(S),fe=S.material;if(z&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ke.copy(S.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),ke.copy(Me.boundingSphere.center)),ke.applyMatrix4(S.matrixWorld).applyMatrix4(Ue)),Array.isArray(fe)){const Ae=Me.groups;for(let Ce=0,Ye=Ae.length;Ce<Ye;Ce++){const Ke=Ae[Ce],Le=fe[Ke.materialIndex];Le&&Le.visible&&w.push(S,Me,Le,H,ke.z,Ke)}}else fe.visible&&w.push(S,Me,fe,H,ke.z,null)}}const me=S.children;for(let Me=0,fe=me.length;Me<fe;Me++)Nr(me[Me],F,H,z)}function $o(S,F,H,z){const{opaque:G,transmissive:me,transparent:Me}=S;y.setupLightsView(H),Pe===!0&&we.setGlobalState(L.clippingPlanes,H),z&&_.viewport(ue.copy(z)),G.length>0&&Ps(G,F,H),me.length>0&&Ps(me,F,H),Me.length>0&&Ps(Me,F,H),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Zo(S,F,H,z){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[z.id]===void 0){const Le=Ee.has("EXT_color_buffer_half_float")||Ee.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[z.id]=new Jt(1,1,{generateMipmaps:!0,type:Le?an:rn,minFilter:_i,samples:Math.max(4,E.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const me=y.state.transmissionRenderTarget[z.id],Me=z.viewport||ue;me.setSize(Me.z*L.transmissionResolutionScale,Me.w*L.transmissionResolutionScale);const fe=L.getRenderTarget(),Ae=L.getActiveCubeFace(),Ce=L.getActiveMipmapLevel();L.setRenderTarget(me),L.getClearColor(_t),it=L.getClearAlpha(),it<1&&L.setClearColor(16777215,.5),L.clear(),Oe&&Ve.render(H);const Ye=L.toneMapping;L.toneMapping=Pn;const Ke=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),y.setupLightsView(z),Pe===!0&&we.setGlobalState(L.clippingPlanes,z),Ps(S,H,z),V.updateMultisampleRenderTarget(me),V.updateRenderTargetMipmap(me),Ee.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let dt=0,Rt=F.length;dt<Rt;dt++){const At=F[dt],{object:pt,geometry:Ht,material:xe,group:Qt}=At;if(xe.side===yt&&pt.layers.test(z.layers)){const at=xe.side;xe.side=Kt,xe.needsUpdate=!0,Ko(pt,H,z,Ht,xe,Qt),xe.side=at,xe.needsUpdate=!0,Le=!0}}Le===!0&&(V.updateMultisampleRenderTarget(me),V.updateRenderTargetMipmap(me))}L.setRenderTarget(fe,Ae,Ce),L.setClearColor(_t,it),Ke!==void 0&&(z.viewport=Ke),L.toneMapping=Ye}function Ps(S,F,H){const z=F.isScene===!0?F.overrideMaterial:null;for(let G=0,me=S.length;G<me;G++){const Me=S[G],{object:fe,geometry:Ae,group:Ce}=Me;let Ye=Me.material;Ye.allowOverride===!0&&z!==null&&(Ye=z),fe.layers.test(H.layers)&&Ko(fe,F,H,Ae,Ye,Ce)}}function Ko(S,F,H,z,G,me){S.onBeforeRender(L,F,H,z,G,me),S.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),G.onBeforeRender(L,F,H,z,S,me),G.transparent===!0&&G.side===yt&&G.forceSinglePass===!1?(G.side=Kt,G.needsUpdate=!0,L.renderBufferDirect(H,F,z,G,S,me),G.side=ri,G.needsUpdate=!0,L.renderBufferDirect(H,F,z,G,S,me),G.side=yt):L.renderBufferDirect(H,F,z,G,S,me),S.onAfterRender(L,F,H,z,G,me)}function Ls(S,F,H){F.isScene!==!0&&(F=Fe);const z=O.get(S),G=y.state.lights,me=y.state.shadowsArray,Me=G.state.version,fe=ie.getParameters(S,G.state,me,F,H,y.state.lightProbeGridArray),Ae=ie.getProgramCacheKey(fe);let Ce=z.programs;z.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?F.environment:null,z.fog=F.fog;const Ye=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;z.envMap=ee.get(S.envMap||z.environment,Ye),z.envMapRotation=z.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ce===void 0&&(S.addEventListener("dispose",Sn),Ce=new Map,z.programs=Ce);let Ke=Ce.get(Ae);if(Ke!==void 0){if(z.currentProgram===Ke&&z.lightsStateVersion===Me)return Qo(S,fe),Ke}else fe.uniforms=ie.getUniforms(S),N!==null&&S.isNodeMaterial&&N.build(S,H,fe),S.onBeforeCompile(fe,L),Ke=ie.acquireProgram(fe,Ae),Ce.set(Ae,Ke),z.uniforms=fe.uniforms;const Le=z.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Le.clippingPlanes=we.uniform),Qo(S,fe),z.needsLights=Mh(S),z.lightsStateVersion=Me,z.needsLights&&(Le.ambientLightColor.value=G.state.ambient,Le.lightProbe.value=G.state.probe,Le.directionalLights.value=G.state.directional,Le.directionalLightShadows.value=G.state.directionalShadow,Le.spotLights.value=G.state.spot,Le.spotLightShadows.value=G.state.spotShadow,Le.rectAreaLights.value=G.state.rectArea,Le.ltc_1.value=G.state.rectAreaLTC1,Le.ltc_2.value=G.state.rectAreaLTC2,Le.pointLights.value=G.state.point,Le.pointLightShadows.value=G.state.pointShadow,Le.hemisphereLights.value=G.state.hemi,Le.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Le.spotLightMatrix.value=G.state.spotLightMatrix,Le.spotLightMap.value=G.state.spotLightMap,Le.pointShadowMatrix.value=G.state.pointShadowMatrix),z.lightProbeGrid=y.state.lightProbeGridArray.length>0,z.currentProgram=Ke,z.uniformsList=null,Ke}function Jo(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=mr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Qo(S,F){const H=O.get(S);H.outputColorSpace=F.outputColorSpace,H.batching=F.batching,H.batchingColor=F.batchingColor,H.instancing=F.instancing,H.instancingColor=F.instancingColor,H.instancingMorph=F.instancingMorph,H.skinning=F.skinning,H.morphTargets=F.morphTargets,H.morphNormals=F.morphNormals,H.morphColors=F.morphColors,H.morphTargetsCount=F.morphTargetsCount,H.numClippingPlanes=F.numClippingPlanes,H.numIntersection=F.numClipIntersection,H.vertexAlphas=F.vertexAlphas,H.vertexTangents=F.vertexTangents,H.toneMapping=F.toneMapping}function _h(S,F){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;M.setFromMatrixPosition(F.matrixWorld);for(let H=0,z=S.length;H<z;H++){const G=S[H];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function vh(S,F,H,z,G){F.isScene!==!0&&(F=Fe),V.resetTextureUnits();const me=F.fog,Me=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?F.environment:null,fe=J===null?L.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:et.workingColorSpace,Ae=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Ce=ee.get(z.envMap||Me,Ae),Ye=z.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ke=!!H.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Le=!!H.morphAttributes.position,dt=!!H.morphAttributes.normal,Rt=!!H.morphAttributes.color;let At=Pn;z.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(At=L.toneMapping);const pt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ht=pt!==void 0?pt.length:0,xe=O.get(z),Qt=y.state.lights;if(Pe===!0&&(Qe===!0||S!==he)){const xt=S===he&&z.id===te;we.setState(z,S,xt)}let at=!1;z.version===xe.__version?(xe.needsLights&&xe.lightsStateVersion!==Qt.state.version||xe.outputColorSpace!==fe||G.isBatchedMesh&&xe.batching===!1||!G.isBatchedMesh&&xe.batching===!0||G.isBatchedMesh&&xe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&xe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&xe.instancing===!1||!G.isInstancedMesh&&xe.instancing===!0||G.isSkinnedMesh&&xe.skinning===!1||!G.isSkinnedMesh&&xe.skinning===!0||G.isInstancedMesh&&xe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&xe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&xe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&xe.instancingMorph===!1&&G.morphTexture!==null||xe.envMap!==Ce||z.fog===!0&&xe.fog!==me||xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==we.numPlanes||xe.numIntersection!==we.numIntersection)||xe.vertexAlphas!==Ye||xe.vertexTangents!==Ke||xe.morphTargets!==Le||xe.morphNormals!==dt||xe.morphColors!==Rt||xe.toneMapping!==At||xe.morphTargetsCount!==Ht||!!xe.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(at=!0):(at=!0,xe.__version=z.version);let on=xe.currentProgram;at===!0&&(on=Ls(z,F,G),N&&z.isNodeMaterial&&N.onUpdateProgram(z,on,xe));let bn=!1,Xn=!1,Ai=!1;const mt=on.getUniforms(),Pt=xe.uniforms;if(_.useProgram(on.program)&&(bn=!0,Xn=!0,Ai=!0),z.id!==te&&(te=z.id,Xn=!0),xe.needsLights){const xt=_h(y.state.lightProbeGridArray,G);xe.lightProbeGrid!==xt&&(xe.lightProbeGrid=xt,Xn=!0)}if(bn||he!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),mt.setValue(D,"projectionMatrix",S.projectionMatrix),mt.setValue(D,"viewMatrix",S.matrixWorldInverse);const Yn=mt.map.cameraPosition;Yn!==void 0&&Yn.setValue(D,Ne.setFromMatrixPosition(S.matrixWorld)),E.logarithmicDepthBuffer&&mt.setValue(D,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&mt.setValue(D,"isOrthographic",S.isOrthographicCamera===!0),he!==S&&(he=S,Xn=!0,Ai=!0)}if(xe.needsLights&&(Qt.state.directionalShadowMap.length>0&&mt.setValue(D,"directionalShadowMap",Qt.state.directionalShadowMap,V),Qt.state.spotShadowMap.length>0&&mt.setValue(D,"spotShadowMap",Qt.state.spotShadowMap,V),Qt.state.pointShadowMap.length>0&&mt.setValue(D,"pointShadowMap",Qt.state.pointShadowMap,V)),G.isSkinnedMesh){mt.setOptional(D,G,"bindMatrix"),mt.setOptional(D,G,"bindMatrixInverse");const xt=G.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),mt.setValue(D,"boneTexture",xt.boneTexture,V))}G.isBatchedMesh&&(mt.setOptional(D,G,"batchingTexture"),mt.setValue(D,"batchingTexture",G._matricesTexture,V),mt.setOptional(D,G,"batchingIdTexture"),mt.setValue(D,"batchingIdTexture",G._indirectTexture,V),mt.setOptional(D,G,"batchingColorTexture"),G._colorsTexture!==null&&mt.setValue(D,"batchingColorTexture",G._colorsTexture,V));const qn=H.morphAttributes;if((qn.position!==void 0||qn.normal!==void 0||qn.color!==void 0)&&I.update(G,H,on),(Xn||xe.receiveShadow!==G.receiveShadow)&&(xe.receiveShadow=G.receiveShadow,mt.setValue(D,"receiveShadow",G.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&F.environment!==null&&(Pt.envMapIntensity.value=F.environmentIntensity),Pt.dfgLUT!==void 0&&(Pt.dfgLUT.value=b0()),Xn){if(mt.setValue(D,"toneMappingExposure",L.toneMappingExposure),xe.needsLights&&xh(Pt,Ai),me&&z.fog===!0&&be.refreshFogUniforms(Pt,me),be.refreshMaterialUniforms(Pt,z,j,re,y.state.transmissionRenderTarget[S.id]),xe.needsLights&&xe.lightProbeGrid){const xt=xe.lightProbeGrid;Pt.probesSH.value=xt.texture,Pt.probesMin.value.copy(xt.boundingBox.min),Pt.probesMax.value.copy(xt.boundingBox.max),Pt.probesResolution.value.copy(xt.resolution)}mr.upload(D,Jo(xe),Pt,V)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(mr.upload(D,Jo(xe),Pt,V),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&mt.setValue(D,"center",G.center),mt.setValue(D,"modelViewMatrix",G.modelViewMatrix),mt.setValue(D,"normalMatrix",G.normalMatrix),mt.setValue(D,"modelMatrix",G.matrixWorld),z.uniformsGroups!==void 0){const xt=z.uniformsGroups;for(let Yn=0,wi=xt.length;Yn<wi;Yn++){const jo=xt[Yn];Q.update(jo,on),Q.bind(jo,on)}}return on}function xh(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Mh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(S,F,H){const z=O.get(S);z.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),O.get(S.texture).__webglTexture=F,O.get(S.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:H,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){const H=O.get(S);H.__webglFramebuffer=F,H.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,H=0){J=S,q=F,k=H;let z=null,G=!1,me=!1;if(S){const fe=O.get(S);if(fe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(D.FRAMEBUFFER,fe.__webglFramebuffer),ue.copy(S.viewport),ve.copy(S.scissor),nt=S.scissorTest,_.viewport(ue),_.scissor(ve),_.setScissorTest(nt),te=-1;return}else if(fe.__webglFramebuffer===void 0)V.setupRenderTarget(S);else if(fe.__hasExternalTextures)V.rebindTextures(S,O.get(S.texture).__webglTexture,O.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ye=S.depthTexture;if(fe.__boundDepthTexture!==Ye){if(Ye!==null&&O.has(Ye)&&(S.width!==Ye.image.width||S.height!==Ye.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");V.setupDepthRenderbuffer(S)}}const Ae=S.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(me=!0);const Ce=O.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ce[F])?z=Ce[F][H]:z=Ce[F],G=!0):S.samples>0&&V.useMultisampledRTT(S)===!1?z=O.get(S).__webglMultisampledFramebuffer:Array.isArray(Ce)?z=Ce[H]:z=Ce,ue.copy(S.viewport),ve.copy(S.scissor),nt=S.scissorTest}else ue.copy(ge).multiplyScalar(j).floor(),ve.copy(He).multiplyScalar(j).floor(),nt=Ie;if(H!==0&&(z=X),_.bindFramebuffer(D.FRAMEBUFFER,z)&&_.drawBuffers(S,z),_.viewport(ue),_.scissor(ve),_.setScissorTest(nt),G){const fe=O.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,fe.__webglTexture,H)}else if(me){const fe=F;for(let Ae=0;Ae<S.textures.length;Ae++){const Ce=O.get(S.textures[Ae]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ae,Ce.__webglTexture,H,fe)}}else if(S!==null&&H!==0){const fe=O.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,fe.__webglTexture,H)}te=-1},this.readRenderTargetPixels=function(S,F,H,z,G,me,Me,fe=0){if(!(S&&S.isWebGLRenderTarget)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=O.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Me!==void 0&&(Ae=Ae[Me]),Ae){_.bindFramebuffer(D.FRAMEBUFFER,Ae);try{const Ce=S.textures[fe],Ye=Ce.format,Ke=Ce.type;if(S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+fe),!E.textureFormatReadable(Ye)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!E.textureTypeReadable(Ke)){ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-z&&H>=0&&H<=S.height-G&&D.readPixels(F,H,z,G,de.convert(Ye),de.convert(Ke),me)}finally{const Ce=J!==null?O.get(J).__webglFramebuffer:null;_.bindFramebuffer(D.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(S,F,H,z,G,me,Me,fe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=O.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Me!==void 0&&(Ae=Ae[Me]),Ae)if(F>=0&&F<=S.width-z&&H>=0&&H<=S.height-G){_.bindFramebuffer(D.FRAMEBUFFER,Ae);const Ce=S.textures[fe],Ye=Ce.format,Ke=Ce.type;if(S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+fe),!E.textureFormatReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!E.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Le),D.bufferData(D.PIXEL_PACK_BUFFER,me.byteLength,D.STREAM_READ),D.readPixels(F,H,z,G,de.convert(Ye),de.convert(Ke),0);const dt=J!==null?O.get(J).__webglFramebuffer:null;_.bindFramebuffer(D.FRAMEBUFFER,dt);const Rt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await fd(D,Rt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Le),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,me),D.deleteBuffer(Le),D.deleteSync(Rt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,H=0){const z=Math.pow(2,-H),G=Math.floor(S.image.width*z),me=Math.floor(S.image.height*z),Me=F!==null?F.x:0,fe=F!==null?F.y:0;V.setTexture2D(S,0),D.copyTexSubImage2D(D.TEXTURE_2D,H,0,0,Me,fe,G,me),_.unbindTexture()},this.copyTextureToTexture=function(S,F,H=null,z=null,G=0,me=0){let Me,fe,Ae,Ce,Ye,Ke,Le,dt,Rt;const At=S.isCompressedTexture?S.mipmaps[me]:S.image;if(H!==null)Me=H.max.x-H.min.x,fe=H.max.y-H.min.y,Ae=H.isBox3?H.max.z-H.min.z:1,Ce=H.min.x,Ye=H.min.y,Ke=H.isBox3?H.min.z:0;else{const Pt=Math.pow(2,-G);Me=Math.floor(At.width*Pt),fe=Math.floor(At.height*Pt),S.isDataArrayTexture?Ae=At.depth:S.isData3DTexture?Ae=Math.floor(At.depth*Pt):Ae=1,Ce=0,Ye=0,Ke=0}z!==null?(Le=z.x,dt=z.y,Rt=z.z):(Le=0,dt=0,Rt=0);const pt=de.convert(F.format),Ht=de.convert(F.type);let xe;F.isData3DTexture?(V.setTexture3D(F,0),xe=D.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(V.setTexture2DArray(F,0),xe=D.TEXTURE_2D_ARRAY):(V.setTexture2D(F,0),xe=D.TEXTURE_2D),_.activeTexture(D.TEXTURE0),_.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const Qt=_.getParameter(D.UNPACK_ROW_LENGTH),at=_.getParameter(D.UNPACK_IMAGE_HEIGHT),on=_.getParameter(D.UNPACK_SKIP_PIXELS),bn=_.getParameter(D.UNPACK_SKIP_ROWS),Xn=_.getParameter(D.UNPACK_SKIP_IMAGES);_.pixelStorei(D.UNPACK_ROW_LENGTH,At.width),_.pixelStorei(D.UNPACK_IMAGE_HEIGHT,At.height),_.pixelStorei(D.UNPACK_SKIP_PIXELS,Ce),_.pixelStorei(D.UNPACK_SKIP_ROWS,Ye),_.pixelStorei(D.UNPACK_SKIP_IMAGES,Ke);const Ai=S.isDataArrayTexture||S.isData3DTexture,mt=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){const Pt=O.get(S),qn=O.get(F),xt=O.get(Pt.__renderTarget),Yn=O.get(qn.__renderTarget);_.bindFramebuffer(D.READ_FRAMEBUFFER,xt.__webglFramebuffer),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,Yn.__webglFramebuffer);for(let wi=0;wi<Ae;wi++)Ai&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,O.get(S).__webglTexture,G,Ke+wi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,O.get(F).__webglTexture,me,Rt+wi)),D.blitFramebuffer(Ce,Ye,Me,fe,Le,dt,Me,fe,D.DEPTH_BUFFER_BIT,D.NEAREST);_.bindFramebuffer(D.READ_FRAMEBUFFER,null),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(G!==0||S.isRenderTargetTexture||O.has(S)){const Pt=O.get(S),qn=O.get(F);_.bindFramebuffer(D.READ_FRAMEBUFFER,$),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,B);for(let xt=0;xt<Ae;xt++)Ai?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Pt.__webglTexture,G,Ke+xt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Pt.__webglTexture,G),mt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,qn.__webglTexture,me,Rt+xt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,qn.__webglTexture,me),G!==0?D.blitFramebuffer(Ce,Ye,Me,fe,Le,dt,Me,fe,D.COLOR_BUFFER_BIT,D.NEAREST):mt?D.copyTexSubImage3D(xe,me,Le,dt,Rt+xt,Ce,Ye,Me,fe):D.copyTexSubImage2D(xe,me,Le,dt,Ce,Ye,Me,fe);_.bindFramebuffer(D.READ_FRAMEBUFFER,null),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else mt?S.isDataTexture||S.isData3DTexture?D.texSubImage3D(xe,me,Le,dt,Rt,Me,fe,Ae,pt,Ht,At.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(xe,me,Le,dt,Rt,Me,fe,Ae,pt,At.data):D.texSubImage3D(xe,me,Le,dt,Rt,Me,fe,Ae,pt,Ht,At):S.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,me,Le,dt,Me,fe,pt,Ht,At.data):S.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,me,Le,dt,At.width,At.height,pt,At.data):D.texSubImage2D(D.TEXTURE_2D,me,Le,dt,Me,fe,pt,Ht,At);_.pixelStorei(D.UNPACK_ROW_LENGTH,Qt),_.pixelStorei(D.UNPACK_IMAGE_HEIGHT,at),_.pixelStorei(D.UNPACK_SKIP_PIXELS,on),_.pixelStorei(D.UNPACK_SKIP_ROWS,bn),_.pixelStorei(D.UNPACK_SKIP_IMAGES,Xn),me===0&&F.generateMipmaps&&D.generateMipmap(xe),_.unbindTexture()},this.initRenderTarget=function(S){O.get(S).__webglFramebuffer===void 0&&V.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?V.setTextureCube(S,0):S.isData3DTexture?V.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?V.setTexture2DArray(S,0):V.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){q=0,k=0,J=null,_.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}const ac=.36,rr=.82,oc=-1.28,lc=1.22,E0=.84;class Ho{fixedDt=1/Xe.fixedHz;engineAccel=4.5;brakeDecel=12.5;rollingDrag=.18;aeroDrag=.0023;steerResponse=.15;headingDamping=.34;reverseAccel=1.2;wheelPositions=[new R(oc,-.25,-rr),new R(oc,-.25,rr),new R(lc,-.25,-rr),new R(lc,-.25,rr)];cachedQuaternion=new ai;state={s:0,lateral:Xe.laneWidth/2,headingError:0,speedMps:0,steerAngle:0,wheelSpin:0};lastControls={steer:0,accelerator:0,brake:0};lastPose=null;lastGuardrailContact=null;constructor(){}static async create(){return new Ho}dispose(){}setParam(e,t){e==="engineAccel"?this.engineAccel=t:e==="aeroDrag"?this.aeroDrag=t:e==="brakeDecel"?this.brakeDecel=t:e==="steerResponse"?this.steerResponse=t:e==="headingDamping"&&(this.headingDamping=t)}getParams(){return{engineAccel:this.engineAccel,aeroDrag:this.aeroDrag,brakeDecel:this.brakeDecel,steerResponse:this.steerResponse,headingDamping:this.headingDamping}}resetToRoad(e,t,n,s=0){this.state={s:Math.max(0,t),lateral:n,headingError:0,speedMps:tt(s,0,Xe.maxSpeedMps),steerAngle:0,wheelSpin:0},this.lastControls={steer:0,accelerator:0,brake:0},this.lastGuardrailContact=null,this.lastPose=this.computePose(e)}step(e,t){const n=this.fixedDt,s=this.state,r=tt(t.steer,-1,1)*Xe.maxSteerRad;s.steerAngle+=(r-s.steerAngle)*this.steerResponse;const a=tt(s.speedMps/Xe.maxSpeedMps,0,1),o=t.accelerator*this.engineAccel*(1-a*.76),l=t.brake*this.brakeDecel,c=this.rollingDrag+s.speedMps*s.speedMps*this.aeroDrag;let h=o-l-c;s.speedMps<=.08&&t.brake>.85&&t.accelerator<.05&&(h=-this.reverseAccel),s.speedMps=tt(s.speedMps+h*n,0,Xe.maxSpeedMps);const u=e.frameAt(s.s).curvature,m=Math.max(0,s.speedMps*Math.cos(s.headingError))/Math.max(.62,1-u*s.lateral),g=s.speedMps*Math.sin(s.headingError),x=s.speedMps/Xe.wheelbase*Math.tan(s.steerAngle);return s.s=Math.max(0,s.s+m*n),s.lateral+=g*n,s.headingError=_r(s.headingError+(x-u*m)*n),s.headingError-=s.headingError*this.headingDamping*n*tt(1-Math.abs(t.steer),0,1),s.wheelSpin+=s.speedMps*n/ac,this.lastControls={...t},this.lastPose=this.computePose(e),this.lastGuardrailContact=this.guardrailContactAt(e,this.lastPose),this.lastPose}pose(e){return this.lastPose=this.computePose(e),this.lastGuardrailContact=this.guardrailContactAt(e,this.lastPose),this.lastPose}wheelVisuals(){return this.wheelPositions.map((e,t)=>({position:e,steering:t<2?-this.state.steerAngle:0,rotation:this.state.wheelSpin,suspension:0,radius:ac}))}chassisQuaternion(){return this.cachedQuaternion}controls(){return{...this.lastControls}}guardrailContactSide(){return this.lastGuardrailContact}computePose(e){const t=this.state,n=e.worldFromRoad(t.s,t.lateral,E0),s=_r(n.heading+t.headingError);return this.cachedQuaternion.copy(T0(s)),{x:n.x,y:n.y,z:n.z,yaw:s,speedMps:t.speedMps,s:t.s,lateral:t.lateral,headingError:t.headingError,steerAngle:t.steerAngle}}guardrailContactAt(e,t){const n=e.boundsAt(t.s),s=Xe.vehicleWidth/2;return t.lateral-s<=n.leftWall?"left":t.lateral+s>=n.rightWall?"right":null}}function T0(i){return new ai().setFromEuler(new Dn(0,-Math.PI/2-i,0,"YXZ"))}const _o=new EventTarget;function A0(i){return typeof structuredClone=="function"?structuredClone(i):JSON.parse(JSON.stringify(i))}function tn(i,e,t=!0){const n=A0(e);if(_o.dispatchEvent(new CustomEvent(i,{detail:n})),window.dispatchEvent(new CustomEvent(`slimulator:${i}`,{detail:n})),t&&i!=="event"){const s={type:i,data:n};_o.dispatchEvent(new CustomEvent("event",{detail:s})),window.dispatchEvent(new CustomEvent("slimulator:event",{detail:s}))}}const ga=18,w0=44,C0=4,R0=-1.3,P0=3,L0=.08,cc=.16,hc=.03;function dc(){return{steeringPoints:0,offRoadPenalty:0,offRoadSeconds:0,crashCount:0,laneChanges:0,sdlp:0,sdlpN:0,sdlpMean:0,sdlpM2:0,timeByMode:{manual:0,acc:0,l2:0,l3:0},alertCounts:{earcon:0,haptic:0}}}class Vo{road;physics;inputSource="local";externalControls={steer:0,accelerator:0,brake:0};session={subId:"",started:!1,status:"idle",elapsed:0,startedAt:null};adas={accActive:!1,lcaActive:!1,autoArmed:!1,setSpeedMps:0,assistSteerAngle:0};metrics=dc();crashes=[];trials=[];activeTrial=null;crashState=null;dicMessage="READY - MANUAL";dicUntil=0;fixedAccumulator=0;currentControls={steer:0,accelerator:0,brake:0};sampleClock=0;lastLane=0;laneCandidate=null;laneCandidateTime=0;distanceOffset=0;previousPose=null;currentPose=null;constructor(e,t=Date.now()>>>0){this.physics=e,this.road=new Dh(t),this.newSession({seed:t})}static async create(e=Date.now()>>>0){const t=await Ho.create();return new Vo(t,e)}newSession({subId:e="",seed:t=Date.now()>>>0}={}){this.road.reset("unmapped",t),this.session={subId:String(e||""),started:!1,status:"idle",elapsed:0,startedAt:null},this.adas={accActive:!1,lcaActive:!1,autoArmed:!1,setSpeedMps:0,assistSteerAngle:0},this.metrics=dc(),this.crashes=[],this.trials=[],this.activeTrial=null,this.crashState=null,this.currentControls={steer:0,accelerator:0,brake:0},this.sampleClock=0,this.lastLane=0,this.laneCandidate=null,this.laneCandidateTime=0,this.distanceOffset=0,this.dicMessage="READY - MANUAL",this.dicUntil=0,this.fixedAccumulator=0;const s=this.road.boundsAt(0).laneCenters[0]??0;this.physics.resetToRoad(this.road,0,s,0);const r=this.physics.pose(this.road);this.previousPose={...r},this.currentPose={...r},tn("session",this.snapshot(),!1)}update(e,t,n){const s=tt(e,0,.1);this.fixedAccumulator+=s;const r=this.physics.fixedDt;let a=0;for(;this.fixedAccumulator>=r&&a++<8;)this.stepFixed(r,t,n),this.fixedAccumulator-=r;const o=this.snapshot(!0);return tn("state",o,!1),o}setInputSource(e){this.inputSource=e,tn("event",{type:"input-source",source:e},!1)}setExternalControls(e){this.externalControls={steer:tt(Number(e.steer??this.externalControls.steer)||0,-1,1),accelerator:tt(Number(e.accelerator??this.externalControls.accelerator)||0,0,1),brake:tt(Number(e.brake??this.externalControls.brake)||0,0,1)}}requestScene(e,t=Xe.transitionMs){const n=this.road.requestScene(e,t);n==="started"?(this.setDIC(`TRANSITION - ${cn[e].label}`,3),tn("event",{type:"scene-transition-start",from:this.road.scene,to:e,durationMs:t},!1)):n==="queued"&&(this.setDIC(`QUEUED - ${cn[e].label}`,2.4),tn("event",{type:"scene-transition-queued",to:e,queue:[...this.road.queue]},!1))}toggleACC(){const e=this.physics.pose(this.road);this.adas.accActive?(this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.setDIC("ACC OFF",2)):e.speedMps>=15*Xi?(this.adas.accActive=!0,this.adas.setSpeedMps=e.speedMps,this.setDIC(`ACC SET - ${Math.round(e.speedMps*ys)} MPH`,2.6)):(this.setDIC("ACC UNAVAILABLE",2),tn("event",{type:"acc-rejected",reason:"below-min-speed"},!1))}toggleLCA(){const e=this.physics.pose(this.road);if(this.adas.lcaActive){this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.adas.accActive?this.setDIC("LANE CENTER OFF - ACC",2.4):this.setDIC("LANE CENTER OFF",2.4);return}if(this.road.scene==="unmapped"&&!this.road.transition){this.adas.autoArmed=!0,this.adas.accActive=e.speedMps>=15*Xi,this.adas.setSpeedMps=Math.max(e.speedMps,15*Xi),this.setDIC("LCA ARMED",2.4);return}if(this.road.scene==="l2"||this.road.scene==="l3"){this.adas.lcaActive=!0,this.adas.accActive=!0,this.adas.autoArmed=!1,this.adas.setSpeedMps=Math.max(e.speedMps,15*Xi),this.setDIC(`${this.road.scene.toUpperCase()} ACTIVE`,2.4);return}this.setDIC("LCA UNAVAILABLE",2)}triggerAlert({type:e="earcon",expectedAction:t="brake",id:n}={}){this.activeTrial&&this.finishTrial("superseded"),this.startIfNeeded();const s={id:n||`trial-${this.trials.length+1}`,index:this.trials.length+1,type:e,expectedAction:t,mode:this.mode(),startedAt:this.session.elapsed,pdt:null,drt:null,status:"active",baseline:{...this.currentControls}};return this.activeTrial=s,this.trials.push(s),this.metrics.alertCounts[e]++,this.setDIC(`${e==="earcon"?"AUDITORY":"HAPTIC"} ALERT - RESPOND`,3),tn("event",{type:"alert-triggered",trial:s},!1),s.id}snapshot(e=!1){const t=this.physics.pose(this.road),n=e?this.interpolatedPose(t):t,s=this.road.nearestLane(n.lateral);return{version:wc,session:{...this.session,seed:this.road.seed},inputSource:this.inputSource,vehicle:{speedMps:n.speedMps,speedMph:n.speedMps*ys,roadPositionM:n.s,distanceM:this.distanceOffset+n.s,lateralM:n.lateral,headingErrorRad:n.headingError,steerAngleRad:n.steerAngle,controls:{...this.currentControls},pose:n,crashReset:this.crashState?{...this.crashState}:null},road:{scene:this.road.scene,requestedScene:this.road.requestedScene(),lanesPerDirection:this.road.laneCount(),transition:this.road.transition?{...this.road.transition}:null,queue:this.road.queue.map(r=>({...r})),seed:this.road.seed,bounds:this.road.boundsAt(n.s),lane:s,curvePoints:Array.from({length:9},(r,a)=>{const o=-10+a*5,l=this.road.frameAt(n.s),c=this.road.frameAt(n.s+o),h=c.x-l.x,d=c.z-l.z;return{sOffset:o,xOffset:h*l.rightX+d*l.rightZ}})},adas:{...this.adas,mode:this.mode(),setSpeedMph:this.adas.setSpeedMps*ys},metrics:{...this.metrics,totalScore:this.totalScore(),crashPenaltyTotal:this.metrics.crashCount*Xe.crashPenalty},crashes:this.crashes.map(r=>({...r})),trials:this.trials.map(r=>({...r})),dicMessage:this.session.elapsed>this.dicUntil&&!this.crashState?`${this.mode().toUpperCase()} - ${cn[this.road.scene].label}`:this.dicMessage}}totalScore(){return this.metrics.steeringPoints-this.metrics.offRoadPenalty-this.metrics.crashCount*Xe.crashPenalty}mode(){return this.adas.lcaActive&&this.road.scene==="l3"?"l3":this.adas.lcaActive&&this.road.scene==="l2"?"l2":this.adas.accActive?"acc":"manual"}stepFixed(e,t,n){const s=this.road.update(e);s.completed&&this.finishSceneTransition(s.completed.from,s.completed.to),s.started&&tn("event",{type:"scene-transition-start",from:this.road.scene,to:s.started,durationMs:Xe.transitionMs},!1);let r=this.inputSource==="external"?{...this.externalControls}:{...t};r={steer:tt(Number(r.steer)||0,-1,1),accelerator:tt(Number(r.accelerator)||0,0,1),brake:tt(Number(r.brake)||0,0,1)},r.brake>.05&&(this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1),this.meaningful(r)&&this.startIfNeeded(),this.session.started&&(this.session.elapsed+=e);const a=this.physics.pose(this.road),o=this.road.nearestLane(a.lateral);this.crashState&&(r={steer:0,accelerator:0,brake:1});const l=this.crashState?{steer:0,accelerator:0,brake:1}:Lh(r,this.adas,a,o,this.road.scene);this.currentControls=l,this.previousPose={...a};const c=n?n.measure("physics",()=>this.physics.step(this.road,l)):this.physics.step(this.road,l);this.noteControlActions(r),this.detectCrashes(a,c),this.updateMetrics(e,c),this.updateCrashReset(e,c),this.currentPose={...this.physics.pose(this.road)}}interpolatedPose(e){if(!this.previousPose||!this.currentPose)return e;const t=tt(this.fixedAccumulator/this.physics.fixedDt,0,1);return{x:We(this.previousPose.x,this.currentPose.x,t),y:We(this.previousPose.y,this.currentPose.y,t),z:We(this.previousPose.z,this.currentPose.z,t),yaw:el(this.previousPose.yaw,this.currentPose.yaw,t),speedMps:We(this.previousPose.speedMps,this.currentPose.speedMps,t),s:We(this.previousPose.s,this.currentPose.s,t),lateral:We(this.previousPose.lateral,this.currentPose.lateral,t),headingError:el(this.previousPose.headingError,this.currentPose.headingError,t),steerAngle:We(this.previousPose.steerAngle,this.currentPose.steerAngle,t)}}finishSceneTransition(e,t){t==="unmapped"?(this.adas.lcaActive&&(this.adas.autoArmed=!0),this.adas.lcaActive=!1):this.adas.autoArmed&&(this.adas.lcaActive=!0,this.adas.accActive=!0,this.adas.setSpeedMps=Math.max(this.physics.pose(this.road).speedMps,15*Xi),this.adas.autoArmed=!1);const n=this.physics.pose(this.road),s=this.road.boundsAt(n.s),r=n.lateral<s.leftEdge||n.lateral>s.rightEdge;if(!this.session.started||n.speedMps<2||r){const a=this.road.nearestLane(n.lateral);this.physics.resetToRoad(this.road,n.s,a.center,0),this.currentControls={steer:0,accelerator:0,brake:0}}this.setDIC(`${cn[t].label} ACTIVE`,2.6),tn("event",{type:"scene-transition-complete",from:e,to:t,mode:this.mode()},!1)}updateMetrics(e,t){if(!this.session.started)return;const n=this.mode();this.metrics.timeByMode[n]+=e;const s=this.road.boundsAt(t.s),r=this.road.nearestLane(t.lateral),a=t.lateral-Xe.tireTrack/2,o=t.lateral+Xe.tireTrack/2;if(a<s.leftEdge||o>s.rightEdge)this.metrics.offRoadSeconds+=e,this.metrics.offRoadPenalty+=Xe.offRoadPenaltyPerSecond*e;else if(t.speedMps>2){const h=tt(1-Math.abs(r.error)/(Xe.laneWidth/2),0,1);this.metrics.steeringPoints+=Xe.steeringPointsPerSecond*h*e}if(this.sampleClock+=e,this.sampleClock>=1/Xe.sampleHz&&(this.sampleClock%=1/Xe.sampleHz,t.speedMps>2&&!this.crashState)){const h=r.error;this.metrics.sdlpN++;const d=h-this.metrics.sdlpMean;this.metrics.sdlpMean+=d/this.metrics.sdlpN,this.metrics.sdlpM2+=d*(h-this.metrics.sdlpMean),this.metrics.sdlp=this.metrics.sdlpN>1?Math.sqrt(this.metrics.sdlpM2/(this.metrics.sdlpN-1)):0}const c=r.index;c!==this.lastLane?(this.laneCandidate===c?this.laneCandidateTime+=e:(this.laneCandidate=c,this.laneCandidateTime=0),this.laneCandidateTime>.55&&(this.metrics.laneChanges++,this.lastLane=c,this.laneCandidate=null)):(this.laneCandidate=null,this.laneCandidateTime=0)}detectCrashes(e,t){if(this.crashState)return;const n=this.findPedestrianCollision(e,t);if(n){this.crash(n.side,{type:"pedestrian",zone:"Pedestrian crosswalk",pedestrian:n});return}const s=this.physics.guardrailContactSide()??this.findGuardrailContact(e,t);s&&this.crash(s,{type:"wall",zone:"Guard rail"})}findGuardrailContact(e,t){for(let s=0;s<=4;s++){const r=s/4,a=We(e.s,t.s,r),o=We(e.lateral,t.lateral,r),l=this.guardrailContactAt(a,o);if(l)return l}return null}guardrailContactAt(e,t){const n=this.road.boundsAt(e),s=Xe.vehicleWidth/2,r=t-s,a=t+s;return r<=n.leftWall+cc+hc?"left":a>=n.rightWall-cc-hc?"right":null}updateCrashReset(e,t){if(this.crashState&&(this.crashState.stoppedFor+=e,this.crashState.phase=t.speedMps<L0?"waiting":"braking",this.crashState.stoppedFor>=P0)){const n=this.road.nearestLane(t.lateral);this.physics.resetToRoad(this.road,t.s,n.center,0),this.currentControls={steer:0,accelerator:0,brake:0},this.crashState=null,this.setDIC("CONTROL RESTORED",2.5),tn("event",{type:"crash-reset-complete",laneCenter:n.center},!1)}}crash(e,t){if(this.crashState)return;this.startIfNeeded();const n=this.snapshot(),s={index:this.crashes.length+1,time:this.session.elapsed,type:t.type,side:e,zone:t.zone||"Crash boundary wall",mph:n.vehicle.speedMph,mode:this.mode(),odometer:n.vehicle.distanceM,lateral:n.vehicle.lateralM,score:this.totalScore()-Xe.crashPenalty};t.pedestrian&&(s.pedestrian={...t.pedestrian}),this.crashes.push(s),this.metrics.crashCount++,this.adas.accActive=!1,this.adas.lcaActive=!1,this.adas.autoArmed=!1,this.crashState={phase:"braking",stoppedFor:0},this.setDIC(t.type==="pedestrian"?"PEDESTRIAN CRASH!":"CRASH!",10),tn("event",{type:"crash",crash:s},!1)}findPedestrianCollision(e,t){if(this.road.sceneValue("crosswalks")<=.3)return null;const n=Xe.pedestrianHitRadius,s=Xe.vehicleLength/2,r=Xe.vehicleWidth/2,a=Math.min(e.s,t.s)-s-n,o=Math.max(e.s,t.s)+s+n,l=Math.floor(a/ga),c=Math.ceil(o/ga);for(let h=l;h<=c;h++){if((h-C0)%w0!==0)continue;const d=h*ga+R0;if(d<a||d>o)continue;const u=this.road.pedestrianAt(h,this.session.elapsed);if(!u.active)continue;const m=t.s-e.s,g=Math.abs(m)>.01?tt((d-e.s)/m,0,1):0,x=We(e.s,t.s,g),p=e.lateral+(t.lateral-e.lateral)*g,f=Math.abs(d-x)<=s+n,b=Math.abs(p-u.lateral)<=r+n;if(f&&b)return{id:`ped-${h}`,segment:h,side:u.side,s:d,lateral:u.lateral}}return null}startIfNeeded(){this.session.started||(this.session.started=!0,this.session.status="running",this.session.startedAt=new Date().toISOString(),tn("event",{type:"session-started",startedAt:this.session.startedAt},!1))}meaningful(e){return Math.abs(e.steer)>.08||e.accelerator>.05||e.brake>.05}setDIC(e,t=2){this.dicMessage=e,this.dicUntil=this.session.elapsed+t}noteControlActions(e){if(!this.activeTrial)return;const t=this.activeTrial.baseline||{steer:0,accelerator:0,brake:0};e.brake-t.brake>.22&&e.brake>.3?this.noteAction("brake"):e.accelerator-t.accelerator>.22&&e.accelerator>.3?this.noteAction("accelerate"):e.steer-t.steer<-.28&&e.steer<-.3?this.noteAction("steerLeft"):e.steer-t.steer>.28&&e.steer>.3&&this.noteAction("steerRight")}noteAction(e){if(!this.activeTrial)return;const t=Math.max(0,this.session.elapsed-this.activeTrial.startedAt);this.activeTrial.pdt==null&&(this.activeTrial.pdt=t),this.activeTrial.drt==null&&e===this.activeTrial.expectedAction&&(this.activeTrial.drt=t,this.finishTrial("complete"))}finishTrial(e){this.activeTrial&&(this.activeTrial.status=e,tn("event",{type:`alert-trial-${e}`,trial:this.activeTrial},!1),this.activeTrial=null)}}const D0=1.35,I0=1.3,U0=.08,_a="slimulator-gamepad-mapping",gi={steerAxis:0,acceleratorAxis:5,brakeAxis:2,accButton:0,lcaButton:1,deadzone:.08,steerGain:.75};class N0{constructor(e=window,t={}){this.target=e,this.now=t.now??(()=>performance.now()),this.gamepadMapping=this.loadGamepadMapping(),e.addEventListener("keydown",this.onKeyDown),e.addEventListener("keyup",this.onKeyUp),this.isTouchDevice()&&this.createTouchOverlay()}target;keys=new Set;latches={acc:!1,lca:!1};now;gamepadMapping={...gi};touchControls={steer:0,accelerator:0,brake:0};touchOverlay=null;keyboardSteer=0;lastKeyboardSteerSampleMs=null;dispose(){this.target.removeEventListener("keydown",this.onKeyDown),this.target.removeEventListener("keyup",this.onKeyUp),this.touchOverlay&&(this.touchOverlay.remove(),this.touchOverlay=null)}sample(e="local"){if(e==="gamepad")return this.gamepadControls();const t=this.keyboardControls(),n=this.gamepadControls(),s=this.touchControls;let r=t.steer;Math.abs(n.steer)>Math.abs(r)&&(r=n.steer),Math.abs(s.steer)>Math.abs(r)&&(r=s.steer);const a=Math.max(t.accelerator,n.accelerator,s.accelerator),o=Math.max(t.brake,n.brake,s.brake),l=this.consumeLatch("acc")||n.accButton,c=this.consumeLatch("lca")||n.lcaButton;return{steer:r,accelerator:a,brake:o,accButton:l,lcaButton:c}}getGamepadMapping(){return{...this.gamepadMapping}}setGamepadMapping(e){this.gamepadMapping=fc({...this.gamepadMapping,...e}),typeof localStorage<"u"&&localStorage.setItem(_a,JSON.stringify(this.gamepadMapping))}resetGamepadMapping(){return this.gamepadMapping={...gi},typeof localStorage<"u"&&localStorage.removeItem(_a),this.getGamepadMapping()}isTouchDevice(){return typeof window<"u"&&"ontouchstart"in window||typeof navigator<"u"&&navigator.maxTouchPoints>0}createTouchOverlay(){const e=document.createElement("div");e.className="mobile-touch-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e),this.touchOverlay=e;const t=e.querySelector("#touchLeft"),n=e.querySelector("#touchRight"),s=e.querySelector("#touchGas"),r=e.querySelector("#touchBrake"),a=e.querySelector("#touchAcc"),o=e.querySelector("#touchLca");let l=!1,c=!1;const h=()=>{this.touchControls.steer=(c?1:0)-(l?1:0)};t.addEventListener("touchstart",d=>{d.preventDefault(),l=!0,h()},{passive:!1}),t.addEventListener("touchend",d=>{d.preventDefault(),l=!1,h()},{passive:!1}),t.addEventListener("touchcancel",d=>{d.preventDefault(),l=!1,h()},{passive:!1}),n.addEventListener("touchstart",d=>{d.preventDefault(),c=!0,h()},{passive:!1}),n.addEventListener("touchend",d=>{d.preventDefault(),c=!1,h()},{passive:!1}),n.addEventListener("touchcancel",d=>{d.preventDefault(),c=!1,h()},{passive:!1}),s.addEventListener("touchstart",d=>{d.preventDefault(),this.touchControls.accelerator=1},{passive:!1}),s.addEventListener("touchend",d=>{d.preventDefault(),this.touchControls.accelerator=0},{passive:!1}),s.addEventListener("touchcancel",d=>{d.preventDefault(),this.touchControls.accelerator=0},{passive:!1}),r.addEventListener("touchstart",d=>{d.preventDefault(),this.touchControls.brake=1},{passive:!1}),r.addEventListener("touchend",d=>{d.preventDefault(),this.touchControls.brake=0},{passive:!1}),r.addEventListener("touchcancel",d=>{d.preventDefault(),this.touchControls.brake=0},{passive:!1}),a.addEventListener("touchstart",d=>{d.preventDefault(),this.latches.acc=!0},{passive:!1}),o.addEventListener("touchstart",d=>{d.preventDefault(),this.latches.lca=!0},{passive:!1})}liveGamepadLabel(){if(typeof navigator>"u")return"No gamepad";const e=navigator.getGamepads?.().find(Boolean);if(!e)return"No gamepad";const t=this.gamepadControls(),n=e.axes.map((r,a)=>`A${a}:${r.toFixed(2)}`).join(" "),s=e.buttons.map((r,a)=>r.pressed||r.value>.02?`B${a}:${r.value.toFixed(2)}`:"").filter(Boolean).join(" ");return[e.id,`Mapped steer:${t.steer.toFixed(2)} acc:${t.accelerator.toFixed(2)} brake:${t.brake.toFixed(2)} ACC:${t.accButton?"on":"off"} LCA:${t.lcaButton?"on":"off"}`,`Axes ${n}`,s?`Buttons ${s}`:"Buttons none"].join(`
`)}loadGamepadMapping(){if(typeof localStorage>"u")return{...gi};try{const e=JSON.parse(localStorage.getItem(_a)||"{}");return fc({...gi,...e})}catch{return{...gi}}}keyboardControls(){const e=this.keys.has("KeyA")||this.keys.has("ArrowLeft"),n=(this.keys.has("KeyD")||this.keys.has("ArrowRight")?1:0)-(e?1:0),s=this.now(),r=this.lastKeyboardSteerSampleMs??s,a=tt((s-r)/1e3,0,U0),o=n===0?I0:D0;return this.lastKeyboardSteerSampleMs=s,this.keyboardSteer=F0(this.keyboardSteer,n,o*a),{steer:this.keyboardSteer,accelerator:this.keys.has("KeyW")?1:0,brake:this.keys.has("KeyS")||this.keys.has("Space")?1:0}}gamepadControls(){if(typeof navigator>"u")return{steer:0,accelerator:0,brake:0};const e=navigator.getGamepads?.().find(Boolean);if(!e)return{steer:0,accelerator:0,brake:0};const t=this.gamepadMapping,n=Number.isFinite(e.axes[t.steerAxis])?e.axes[t.steerAxis]:0,s=Math.abs(n)<t.deadzone?0:tt(n*t.steerGain,-1,1),r=uc(e.axes[t.acceleratorAxis]),a=uc(e.axes[t.brakeAxis]);return{steer:s,accelerator:r,brake:a,accButton:!!e.buttons[t.accButton]?.pressed,lcaButton:!!e.buttons[t.lcaButton]?.pressed}}consumeLatch(e){const t=this.latches[e];return this.latches[e]=!1,t}onKeyDown=e=>{e.repeat||(e.code==="ArrowDown"&&(this.latches.acc=!0),e.code==="ArrowUp"&&(this.latches.lca=!0),this.keys.add(e.code))};onKeyUp=e=>{this.keys.delete(e.code)}}function uc(i){return Number.isFinite(i)?tt((i+1)/2,0,1):0}function F0(i,e,t){const n=e-i;return Math.abs(n)<=t?e:i+Math.sign(n)*t}function fc(i){return{steerAxis:vs(i.steerAxis),acceleratorAxis:vs(i.acceleratorAxis),brakeAxis:vs(i.brakeAxis),accButton:vs(i.accButton),lcaButton:vs(i.lcaButton),deadzone:tt(Number(i.deadzone)||gi.deadzone,0,.5),steerGain:tt(Number(i.steerGain)||gi.steerGain,.1,1.5)}}function vs(i){return Math.max(0,Math.min(31,Math.round(Number(i)||0)))}const gr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ls{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const O0=new Lr(-1,1,1,-1,0,1);class B0 extends Et{constructor(){super(),this.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new gt([0,2,0,0,2,0],2))}}const z0=new B0;class Wo{constructor(e){this._mesh=new rt(z0,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,O0)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class rh extends ls{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ut?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=yi.clone(e.uniforms),this.material=new Ut({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Wo(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class pc extends ls{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class G0 extends ls{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class k0{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Be);this._width=n.width,this._height=n.height,t=new Jt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:an}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new rh(gr),this.copyPass.material.blending=Rn,this.timer=new Su}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}pc!==void 0&&(a instanceof pc?n=!0:a instanceof G0&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Be);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const ar={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class H0 extends ls{constructor(){super(),this.isOutputPass=!0,this.uniforms=yi.clone(ar.uniforms),this.material=new $c({name:ar.name,uniforms:this.uniforms,vertexShader:ar.vertexShader,fragmentShader:ar.fragmentShader}),this._fsQuad=new Wo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===ct&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Mo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===So?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===bo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Cr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Eo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===To?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===yo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class V0 extends ls{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Se}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const W0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Se(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class as extends ls{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Be(e.x,e.y):new Be(256,256),this.clearColor=new Se(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Jt(r,a,{type:an}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const d=new Jt(r,a,{type:an});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const u=new Jt(r,a,{type:an});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}const o=W0;this.highPassUniforms=yi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ut({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Be(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=yi.clone(gr.uniforms),this.blendMaterial=new Ut({uniforms:this.copyUniforms,vertexShader:gr.vertexShader,fragmentShader:gr.fragmentShader,premultipliedAlpha:!0,blending:Ji,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Se,this._oldClearAlpha=1,this._basic=new hn,this._fsQuad=new Wo(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Be(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=as.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=as.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Ut({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Be(.5,.5)},direction:{value:new Be(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Ut({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}as.BlurDirectionX=new Be(1,0);as.BlurDirectionY=new Be(0,1);const X0={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Be(1/1024,1/512)}},vertexShader:`

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

		}`};class q0{constructor(e,t,n,s){this.scene=e,this.road=t,this.renderer=n,this.bloom=s,this.scene.background=new Se(4952730),this.scene.fog=new Tr(4952730,54,370),this.sky.position.set(0,420,-900),this.sky.rotation.x=-Math.PI/2.7,this.scene.add(this.sky),this.mountainFar=this.createMountainRidge(3501945,.36,31),this.mountainNear=this.createMountainRidge(2645094,.44,83),this.lowFogBand=new rt(new ss(1800,115),new hn({color:9224381,transparent:!0,opacity:.14,depthWrite:!1,side:yt})),this.lowFogBand.renderOrder=-3,this.scene.add(this.lowFogBand);const r=new Rs(1,1),a=new ti({color:16120058,roughness:.95,metalness:.05,flatShading:!0,fog:!1});for(let o=0;o<18;o++){const l=new kn,c=6+Math.floor(oe(o*47)*6);for(let h=0;h<c;h++){const d=o*73+h*19,u=(h-(c-1)/2)/Math.max(1,(c-1)/2),m=1-Math.abs(u)*.6,g=(14+oe(d)*16)*m,x=(10+oe(d+5)*10)*m,p=(12+oe(d+11)*14)*m,f=new rt(r,a);f.scale.set(g,x,p);const b=(h-(c-1)/2)*(8+oe(d+17)*8),A=x*.4+(oe(d+23)-.5)*2,M=(oe(d+29)-.5)*(10+oe(d+31)*8);if(f.position.set(b,A,M),f.rotation.set(oe(d+31)*Math.PI,oe(d+37)*Math.PI,oe(d+41)*Math.PI),l.add(f),oe(d+43)>.35){const w=new rt(r,a),y=g*(.45+oe(d+47)*.2),C=x*(.45+oe(d+53)*.2),v=p*(.45+oe(d+59)*.2);w.scale.set(y,C,v),w.position.set(b+(oe(d+61)-.5)*g*.3,A+x*.4+C*.2,M+(oe(d+67)-.5)*p*.3),w.rotation.set(oe(d+71)*Math.PI,oe(d+73)*Math.PI,oe(d+79)*Math.PI),l.add(w)}}l.scale.set(We(.72,1.34,oe(o*53)),We(.82,1.18,oe(o*59)),We(.72,1.38,oe(o*61))),l.rotation.y=(oe(o*67)-.5)*.35,l.position.set(-430+oe(o*31)*860,82+oe(o*37)*122,-150-oe(o*41)*640),this.cloudGroup.add(l)}this.scene.add(this.cloudGroup)}scene;road;renderer;bloom;sky=new rt(new ss(4e3,1600),new hn({color:9419207,depthWrite:!1}));mountainFar;mountainNear;lowFogBand;cloudGroup=new kn;qualityMode="high";setQualityMode(e){this.qualityMode=e,this.cloudGroup.visible=e==="high"}update(e){const t=this.qualityMode==="high",n=this.road.sceneValue("forest"),s=this.road.sceneValue("buildingScale"),r=Math.min(1,s),a=new Se(4426385).lerp(new Se(3239802),n*.34).lerp(new Se(2447720),r*.26);this.scene.background instanceof Se&&this.scene.background.copy(a);const o=this.scene.fog;o instanceof Tr&&(o.color.copy(a),o.near=We(62,42,n),o.far=We(390,260,n),r>.75&&(o.near=72,o.far=470)),this.sky.material.color.copy(a),this.renderer.toneMappingExposure=We(1.2,1.06,n)+r*.05,this.bloom.strength=t?We(.06,.11,r):0;const l=e.vehicle.pose;this.sky.position.set(l.x,420,l.z-900),t&&this.cloudGroup.position.set(l.x,0,l.z);const c=this.road.worldFromRoad(l.s+720,0,0),h=this.road.worldFromRoad(l.s+430,0,0);this.mountainFar.position.set(c.x,-2,c.z),this.mountainNear.position.set(h.x,-6,h.z),this.mountainFar.material.opacity=We(.22,.42,n),this.mountainNear.material.opacity=We(.14,.52,n),this.mountainFar.visible=n>.08,this.mountainNear.visible=n>.08;const d=this.road.worldFromRoad(l.s+260,0,28);this.lowFogBand.position.set(d.x,d.y,d.z),this.lowFogBand.material.opacity=We(.04,.2,n),this.lowFogBand.visible=n>.08}createMountainRidge(e,t,n){const r=[],a=[];for(let c=0;c<19;c++){const h=We(-900,900,c/18),d=Math.sin((c+n)*.72)*34,u=Math.sin((c+n)*1.31)*18,m=58+d+u+oe(c*19.7+n)*52;r.push(h,-24,0,h,m,0)}for(let c=0;c<18;c++){const h=c*2;a.push(h,h+2,h+1,h+1,h+2,h+3)}const o=new Et;o.setAttribute("position",new bt(new Float32Array(r),3)),o.setIndex(a),o.computeVertexNormals();const l=new rt(o,new hn({color:e,transparent:!0,opacity:t,depthWrite:!1,side:yt}));return l.frustumCulled=!1,l.renderOrder=-4,this.scene.add(l),l}}const mc=new In,or=new R;class ah extends vu{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new gt(e,3)),this.setAttribute("uv",new gt(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new po(t,6,1);return this.setAttribute("instanceStart",new ii(n,3,0)),this.setAttribute("instanceEnd",new ii(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new po(t,6,1);return this.setAttribute("instanceColorStart",new ii(n,3,0)),this.setAttribute("instanceColorEnd",new ii(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new au(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new In);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),mc.setFromBufferAttribute(t),this.boundingBox.union(mc))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oi),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)or.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(or)),or.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(or));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ce.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Be},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Zt.line={uniforms:yi.merge([ce.common,ce.fog,ce.line]),vertexShader:`
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
		`};class qi extends Ut{constructor(e){super({type:"LineMaterial",uniforms:yi.clone(Zt.line.uniforms),vertexShader:Zt.line.vertexShader,fragmentShader:Zt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const va=new ut,gc=new R,_c=new R,Bt=new ut,zt=new ut,Tn=new ut,xa=new R,Ma=new ft,Gt=new Tu,vc=new R,lr=new In,cr=new oi,An=new ut;let Cn,xi;function xc(i,e,t){return An.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),An.multiplyScalar(1/An.w),An.x=xi/t.width,An.y=xi/t.height,An.applyMatrix4(i.projectionMatrixInverse),An.multiplyScalar(1/An.w),Math.abs(Math.max(An.x,An.y))}function Y0(i,e){const t=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){Gt.start.fromBufferAttribute(s,o),Gt.end.fromBufferAttribute(r,o),Gt.applyMatrix4(t);const c=new R,h=new R;Cn.distanceSqToSegment(Gt.start,Gt.end,h,c),h.distanceTo(c)<xi*.5&&e.push({point:h,pointOnLine:c,distance:Cn.origin.distanceTo(h),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function $0(i,e,t){const n=e.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,h=Math.min(o.instanceCount,l.count),d=-e.near;Cn.at(1,Tn),Tn.w=1,Tn.applyMatrix4(e.matrixWorldInverse),Tn.applyMatrix4(n),Tn.multiplyScalar(1/Tn.w),Tn.x*=r.x/2,Tn.y*=r.y/2,Tn.z=0,xa.copy(Tn),Ma.multiplyMatrices(e.matrixWorldInverse,a);for(let u=0,m=h;u<m;u++){if(Bt.fromBufferAttribute(l,u),zt.fromBufferAttribute(c,u),Bt.w=1,zt.w=1,Bt.applyMatrix4(Ma),zt.applyMatrix4(Ma),Bt.z>d&&zt.z>d)continue;if(Bt.z>d){const A=Bt.z-zt.z,M=(Bt.z-d)/A;Bt.lerp(zt,M)}else if(zt.z>d){const A=zt.z-Bt.z,M=(zt.z-d)/A;zt.lerp(Bt,M)}Bt.applyMatrix4(n),zt.applyMatrix4(n),Bt.multiplyScalar(1/Bt.w),zt.multiplyScalar(1/zt.w),Bt.x*=r.x/2,Bt.y*=r.y/2,zt.x*=r.x/2,zt.y*=r.y/2,Gt.start.copy(Bt),Gt.start.z=0,Gt.end.copy(zt),Gt.end.z=0;const x=Gt.closestPointToPointParameter(xa,!0);Gt.at(x,vc);const p=Ld.lerp(Bt.z,zt.z,x),f=p>=-1&&p<=1,b=xa.distanceTo(vc)<xi*.5;if(f&&b){Gt.start.fromBufferAttribute(l,u),Gt.end.fromBufferAttribute(c,u),Gt.start.applyMatrix4(a),Gt.end.applyMatrix4(a);const A=new R,M=new R;Cn.distanceSqToSegment(Gt.start,Gt.end,M,A),t.push({point:M,pointOnLine:A,distance:Cn.origin.distanceTo(M),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class Z0 extends rt{constructor(e=new ah,t=new qi({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,s=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)gc.fromBufferAttribute(t,a),_c.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+gc.distanceTo(_c);const r=new po(s,2,1);return e.setAttribute("instanceDistanceStart",new ii(r,1,0)),e.setAttribute("instanceDistanceEnd",new ii(r,1,1)),this}raycast(e,t){const n=this.material.worldUnits,s=e.camera;if(s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Cn=e.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;xi=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),cr.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=xi*.5;else{const d=Math.max(s.near,cr.distanceToPoint(Cn.origin));c=xc(s,d,l.resolution)}if(cr.radius+=c,Cn.intersectsSphere(cr)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),lr.copy(o.boundingBox).applyMatrix4(a);let h;if(n)h=xi*.5;else{const d=Math.max(s.near,lr.distanceToPoint(Cn.origin));h=xc(s,d,l.resolution)}lr.expandByScalar(h),Cn.intersectsBox(lr)!==!1&&(n?Y0(this,t):$0(this,s,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(va),this.material.uniforms.resolution.value.set(va.z,va.w))}}class oh extends ah{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setPositions(n),this}setColors(e){const t=e.length-3,n=new Float32Array(2*t);for(let s=0;s<t;s+=3)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];return super.setColors(n),this}setFromPoints(e){const t=e.length-1,n=new Float32Array(6*t);for(let s=0;s<t;s++)n[6*s]=e[s].x,n[6*s+1]=e[s].y,n[6*s+2]=e[s].z||0,n[6*s+3]=e[s+1].x,n[6*s+4]=e[s+1].y,n[6*s+5]=e[s+1].z||0;return super.setPositions(n),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class K0 extends Z0{constructor(e=new oh,t=new qi({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}function J0(){const i=document.createElement("canvas");i.width=128,i.height=256;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#112430"),t.addColorStop(1,"#18232c"),e.fillStyle=t,e.fillRect(0,0,128,256);const n=8,s=24,r=128/n,a=256/s;for(let l=0;l<s;l++)for(let c=0;c<n;c++){const h=Math.sin(l*12.9898+c*78.233)*43758.5453%1,d=Math.abs(h);d>.65?e.fillStyle=d>.88?"#ffc640":"#5be5f7":e.fillStyle="#0c151c",e.fillRect(c*r+3,l*a+2,r-6,a-4)}const o=new Xc(i);return o.wrapS=Si,o.wrapT=Si,o.repeat.set(1,1),o}const lh=160,Q0=96,Mc=lh,ch=432,j0=224,wn=ch,hh=3.1,dh=5.1,Sa=hh+dh;function e_(i){const e=Math.max(0,Math.min(1,i));return e*e*(3-2*e)}function uh(i){return i==="high"?{sampleCount:lh,spacing:3,backDistance:42}:{sampleCount:Q0,spacing:3.4,backDistance:30}}function t_(i,e,t){const n=uh(t),s=Math.floor((e-n.backDistance)/n.spacing)*n.spacing;for(let r=0;r<n.sampleCount;r++)i[r]=s+r*n.spacing;return{base:s,sampleCount:n.sampleCount,spacing:n.spacing}}function fh(i){return i==="high"?{sampleCount:ch,spacing:1.1,backDistance:42}:{sampleCount:j0,spacing:1.45,backDistance:30}}function n_(i,e,t){const n=fh(t),s=Math.floor((e-n.backDistance)/n.spacing)*n.spacing;for(let r=0;r<n.sampleCount;r++)i[r]=s+r*n.spacing;return{base:s,sampleCount:n.sampleCount,spacing:n.spacing}}function i_(i){return(i%Sa+Sa)%Sa}class s_{constructor(e,t){this.scene=e,this.road=t;const n=this.createRoadRibbons();this.ribbons=n.ribbons,this.guardrailLines=n.guardrailLines,this.markingLines=n.markingLines}scene;road;ribbons;guardrailLines;markingLines;laneLines=[];roadSamples=new Float32Array(Mc);guardrailSamples=new Float32Array(wn);qualityMode="high";lastUpdateKey="";setQualityMode(e){this.qualityMode!==e&&(this.qualityMode=e,this.lastUpdateKey="")}update(e){const t=uh(this.qualityMode),n=fh(this.qualityMode),s=Math.floor((e.vehicle.roadPositionM-t.backDistance)/t.spacing)*t.spacing,r=Math.floor((e.vehicle.roadPositionM-n.backDistance)/n.spacing)*n.spacing,a=e.road.transition,o=a?Math.floor(a.progress*24):0,l=`${this.qualityMode}:${s}:${r}:${e.road.scene}:${a?.from??""}:${a?.to??""}:${o}`;if(l===this.lastUpdateKey)return;this.lastUpdateKey=l,t_(this.roadSamples,e.vehicle.roadPositionM,this.qualityMode);const c=n_(this.guardrailSamples,e.vehicle.roadPositionM,this.qualityMode);this.updateLaneDashPhase(c.base);const h=this.roadSamples,d=this.guardrailSamples,u=this.road.boundsAt(e.vehicle.roadPositionM);this.updateRibbon(this.ribbons.ground,h,t.sampleCount,u.leftWall-60,u.rightWall+60,-.18),this.updateRibbon(this.ribbons.road,h,t.sampleCount,u.leftEdge,u.rightEdge,.02),this.updateRibbon(this.ribbons.shoulderL,h,t.sampleCount,u.leftEdge-Xe.shoulderWidth,u.leftEdge,.012),this.updateRibbon(this.ribbons.shoulderR,h,t.sampleCount,u.rightEdge,u.rightEdge+Xe.shoulderWidth,.012),this.updateRibbon(this.ribbons.roadSheen,h,t.sampleCount,u.leftEdge+.08,u.rightEdge-.08,.043),this.updateRibbon(this.ribbons.shoulderGlowL,h,t.sampleCount,u.leftEdge-.24,u.leftEdge+.08,.062),this.updateRibbon(this.ribbons.shoulderGlowR,h,t.sampleCount,u.rightEdge-.08,u.rightEdge+.24,.062),this.updateRibbon(this.ribbons.wallL,h,t.sampleCount,u.leftWall-.14,u.leftWall+.14,.46),this.updateRibbon(this.ribbons.wallR,h,t.sampleCount,u.rightWall-.14,u.rightWall+.14,.46),this.updateVerticalRibbon(this.ribbons.guardrailFaceL,d,n.sampleCount,u.leftWall,.5,.82),this.updateVerticalRibbon(this.ribbons.guardrailFaceR,d,n.sampleCount,u.rightWall,.5,.82),this.updateGuardrailLine(this.guardrailLines.left,d,n.sampleCount,u.leftWall,.86,e.vehicle.roadPositionM),this.updateGuardrailLine(this.guardrailLines.right,d,n.sampleCount,u.rightWall,.86,e.vehicle.roadPositionM),this.ribbons.urbanFacadeL.mesh.visible=!1,this.ribbons.urbanFacadeR.mesh.visible=!1,this.updateGuardrailLine(this.markingLines.edgeL,d,n.sampleCount,u.leftEdge+.06,.076,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.edgeR,d,n.sampleCount,u.rightEdge-.06,.076,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.centerL,d,n.sampleCount,-.17,.082,e.vehicle.roadPositionM),this.updateGuardrailLine(this.markingLines.centerR,d,n.sampleCount,.17,.082,e.vehicle.roadPositionM);for(let x=0;x<this.laneLines.length;x++)this.laneLines[x].line.visible=!1;const m=u.laneCount;let g=0;for(let x=0;x<m-1;x++){const p=-5.4*(x+1);if(g<this.laneLines.length){const b=this.laneLines[g++];b.line.visible=!0,this.updateGuardrailLine(b,d,n.sampleCount,p,.086,e.vehicle.roadPositionM)}const f=Xe.laneWidth*(x+1);if(g<this.laneLines.length){const b=this.laneLines[g++];b.line.visible=!0,this.updateGuardrailLine(b,d,n.sampleCount,f,.086,e.vehicle.roadPositionM)}}}createRoadRibbons(){const e=new St({color:5398874,emissive:2042151,emissiveIntensity:.42,side:yt}),t=new St({color:3364687,side:yt}),n=new St({color:2973519,side:yt}),s=new St({color:4812144,side:yt}),r=J0(),a=new hn({map:r,side:yt,transparent:!0,opacity:.82}),o=new hn({color:11191741,side:yt,transparent:!0,opacity:.68,depthWrite:!1}),l=new qi({color:13953248,linewidth:.18,worldUnits:!0,transparent:!0,opacity:.7,alphaToCoverage:!0,depthWrite:!1}),c=new qi({color:16777215,linewidth:.105,worldUnits:!0,vertexColors:!0,transparent:!0,opacity:.72,alphaToCoverage:!0,depthWrite:!1}),h=new qi({color:16777215,linewidth:.105,worldUnits:!0,vertexColors:!0,transparent:!0,opacity:.72,alphaToCoverage:!0,depthWrite:!1}),d=new qi({color:16777215,linewidth:.095,worldUnits:!0,vertexColors:!0,dashed:!0,dashSize:hh,gapSize:dh,transparent:!0,opacity:.7,alphaToCoverage:!0,depthWrite:!1}),u=new hn({color:9478294,transparent:!0,opacity:.13,depthWrite:!1,side:yt}),m=new hn({color:10024413,transparent:!0,opacity:.13,depthWrite:!1,side:yt}),g=Mc,x={ground:this.createRibbon(g,n,"ground"),road:this.createRibbon(g,e,"road"),shoulderL:this.createRibbon(g,t,"shoulderL"),shoulderR:this.createRibbon(g,t,"shoulderR"),roadSheen:this.createRibbon(g,u,"roadSheen"),shoulderGlowL:this.createRibbon(g,m,"shoulderGlowL"),shoulderGlowR:this.createRibbon(g,m,"shoulderGlowR"),wallL:this.createRibbon(g,s,"wallL"),wallR:this.createRibbon(g,s,"wallR"),guardrailFaceL:this.createRibbon(wn,o,"guardrailFaceL"),guardrailFaceR:this.createRibbon(wn,o,"guardrailFaceR"),urbanFacadeL:this.createRibbon(g,a,"urbanFacadeL"),urbanFacadeR:this.createRibbon(g,a,"urbanFacadeR")};for(let p=0;p<6;p++)this.laneLines.push(this.createGuardrailLine(wn,d,`lane${p}`,{dashed:!0,renderOrder:4,nearColor:14809329,farColor:4678750,fadeStartM:70,fadeEndM:175}));return{ribbons:x,guardrailLines:{left:this.createGuardrailLine(wn,l,"guardrailTopL",{renderOrder:2}),right:this.createGuardrailLine(wn,l,"guardrailTopR",{renderOrder:2})},markingLines:{edgeL:this.createGuardrailLine(wn,c,"edgeL",{renderOrder:4,nearColor:14218990,farColor:5205350,fadeStartM:82,fadeEndM:190}),edgeR:this.createGuardrailLine(wn,c,"edgeR",{renderOrder:4,nearColor:14218990,farColor:5205350,fadeStartM:82,fadeEndM:190}),centerL:this.createGuardrailLine(wn,h,"centerL",{renderOrder:4,nearColor:15781461,farColor:7300934,fadeStartM:78,fadeEndM:185}),centerR:this.createGuardrailLine(wn,h,"centerR",{renderOrder:4,nearColor:15781461,farColor:7300934,fadeStartM:78,fadeEndM:185})}}}createRibbon(e,t,n){const s=new Float32Array(e*2*3),r=new Float32Array(e*2*3),a=new Float32Array(e*2*2),o=[];for(let h=0;h<e-1;h++){const d=h*2;o.push(d,d+2,d+1,d+1,d+2,d+3)}for(let h=0;h<e*2;h++)r[h*3+1]=1;const l=new Et;l.setAttribute("position",new bt(s,3).setUsage($i)),l.setAttribute("normal",new bt(r,3)),l.setAttribute("uv",new bt(a,2).setUsage($i)),l.setIndex(o);const c=new rt(l,t);return c.name=n,c.receiveShadow=!0,c.frustumCulled=!1,this.scene.add(c),{mesh:c,positions:s,uvs:a,maxSampleCount:e}}createGuardrailLine(e,t,n,s={}){const r=new oh,a=new Float32Array(e*3),o=s.nearColor===void 0?void 0:new Float32Array(e*3);r.setPositions(a),o&&r.setColors(o);const l=new K0(r,t);return l.name=n,l.frustumCulled=!1,l.renderOrder=s.renderOrder??2,this.scene.add(l),{line:l,geometry:r,positions:a,colors:o,nearColor:s.nearColor===void 0?void 0:new Se(s.nearColor),farColor:s.farColor===void 0?void 0:new Se(s.farColor),fadeStartM:s.fadeStartM,fadeEndM:s.fadeEndM,maxSampleCount:e,dashed:s.dashed??!1}}updateRibbon(e,t,n,s,r,a,o){for(let h=0;h<n;h++){const d=t[h],u=this.road.worldFromRoad(d,s,a),m=this.road.worldFromRoad(d,r,a),g=h*6;e.positions[g]=u.x,e.positions[g+1]=u.y,e.positions[g+2]=u.z,e.positions[g+3]=m.x,e.positions[g+4]=m.y,e.positions[g+5]=m.z;const x=o?d/o:h/(n-1),p=h*4;e.uvs[p]=0,e.uvs[p+1]=x,e.uvs[p+2]=1,e.uvs[p+3]=x}const l=e.mesh.geometry.getAttribute("position"),c=e.mesh.geometry.getAttribute("uv");e.mesh.geometry.setDrawRange(0,Math.max(0,n-1)*6),l.needsUpdate=!0,c.needsUpdate=!0}updateVerticalRibbon(e,t,n,s,r,a){for(let c=0;c<n;c++){const h=t[c],d=this.road.worldFromRoad(h,s,r),u=this.road.worldFromRoad(h,s,a),m=c*6;e.positions[m]=d.x,e.positions[m+1]=d.y,e.positions[m+2]=d.z,e.positions[m+3]=u.x,e.positions[m+4]=u.y,e.positions[m+5]=u.z;const g=c/(n-1),x=c*4;e.uvs[x]=0,e.uvs[x+1]=g,e.uvs[x+2]=1,e.uvs[x+3]=g}const o=e.mesh.geometry.getAttribute("position"),l=e.mesh.geometry.getAttribute("uv");e.mesh.geometry.setDrawRange(0,Math.max(0,n-1)*6),o.needsUpdate=!0,l.needsUpdate=!0}updateGuardrailLine(e,t,n,s,r,a){const o=Math.min(n,e.maxSampleCount);for(let l=0;l<o;l++){const c=t[l],h=this.road.worldFromRoad(c,s,r),d=l*3;if(e.positions[d]=h.x,e.positions[d+1]=h.y,e.positions[d+2]=h.z,e.colors&&e.nearColor&&e.farColor&&e.fadeStartM!==void 0&&e.fadeEndM!==void 0){const u=e_((c-a-e.fadeStartM)/Math.max(1,e.fadeEndM-e.fadeStartM));e.colors[d]=e.nearColor.r+(e.farColor.r-e.nearColor.r)*u,e.colors[d+1]=e.nearColor.g+(e.farColor.g-e.nearColor.g)*u,e.colors[d+2]=e.nearColor.b+(e.farColor.b-e.nearColor.b)*u}}e.geometry.setPositions(e.positions.subarray(0,o*3)),e.colors&&e.geometry.setColors(e.colors.subarray(0,o*3)),e.dashed&&e.line.computeLineDistances()}updateLaneDashPhase(e){const t=i_(e);for(const n of this.laneLines)n.dashed&&(n.line.material.dashOffset=t)}}function r_(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Et;let c=0;for(let h=0;h<i.length;++h){const d=i[h];let u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in d.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(d.attributes[m]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in d.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(d.morphAttributes[m])}if(e){let m;if(t)m=d.index.count;else if(d.attributes.position!==void 0)m=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0;const d=[];for(let u=0;u<i.length;++u){const m=i[u].index;for(let g=0;g<m.count;++g)d.push(m.getX(g)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(const h in r){const d=Sc(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){const m=[];for(let x=0;x<a[h].length;++x)m.push(a[h][x][u]);const g=Sc(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function Sc(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new bt(a,t,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const d=l/t;for(let u=0,m=h.count;u<m;u++)for(let g=0;g<t;g++){const x=h.getComponent(u,g);o.setComponent(u+d,g,x)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}function bc(){const i=[],e=new Rs(1.2,1);i.push(e);const t=[new R(.6,.4,.5),new R(-.6,-.2,.4),new R(.4,-.3,-.6),new R(-.5,.5,-.4),new R(0,.8,.1),new R(.2,-.5,.5)];for(let s=0;s<t.length;s++){const r=.65+Math.random()*.45,a=new Rs(r,1);a.translate(t[s].x,t[s].y,t[s].z),i.push(a)}const n=r_(i);return n.computeVertexNormals(),n}const yc={vertexShader:`
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
  `};class Ec{constructor(e,t,n=96,s=.22){this.maxPoints=n,this.width=s;const r=new Et,a=this.maxPoints*2;this.positions=new Float32Array(a*3),this.history=Array.from({length:this.maxPoints},()=>new R);const o=new Float32Array(a*2),l=[];for(let h=0;h<this.maxPoints-1;h++){const d=h*2;l.push(d,d+2,d+1,d+1,d+2,d+3)}for(let h=0;h<this.maxPoints;h++){const d=h/(this.maxPoints-1);o[h*4]=0,o[h*4+1]=d,o[h*4+2]=1,o[h*4+3]=d}r.setAttribute("position",new bt(this.positions,3).setUsage($i)),r.setAttribute("uv",new bt(o,2)),r.setIndex(l);const c=new Ut({uniforms:{uColor:{value:new Se(t).multiplyScalar(4.4)}},vertexShader:yc.vertexShader,fragmentShader:yc.fragmentShader,transparent:!0,depthWrite:!1,blending:Ji,side:yt});this.mesh=new rt(r,c),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3,e.add(this.mesh)}maxPoints;width;mesh;positions;history;halfRight=new R;historyCount=0;update(e,t){const n=Math.min(this.historyCount,this.maxPoints-1);for(let r=n;r>0;r--)this.history[r].copy(this.history[r-1]);this.history[0].copy(e),this.historyCount=Math.min(this.historyCount+1,this.maxPoints),this.halfRight.copy(t).normalize().multiplyScalar(this.width*.5);for(let r=0;r<this.maxPoints;r++){const a=this.history[Math.min(r,this.historyCount-1)],o=r*6;this.positions[o]=a.x-this.halfRight.x,this.positions[o+1]=a.y-this.halfRight.y,this.positions[o+2]=a.z-this.halfRight.z,this.positions[o+3]=a.x+this.halfRight.x,this.positions[o+4]=a.y+this.halfRight.y,this.positions[o+5]=a.z+this.halfRight.z}const s=this.mesh.geometry.getAttribute("position");s.needsUpdate=!0}lastPoint(){return this.historyCount>0?this.history[0]:null}clear(){this.historyCount=0}}function a_(){return new Ut({uniforms:{uColor:{value:new Se(16768896).multiplyScalar(1.85)}},vertexShader:`
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
    `,transparent:!0,depthWrite:!1,blending:Ji,side:yt})}function o_(){const i=new Float32Array([-2.1,.38,-1.55,-2.1,.38,1.55,-16.5,.42,-4.1,-16.5,.42,4.1,-30,.46,-5.8,-30,.46,5.8]),e=new Float32Array([.34,0,.66,0,.16,.55,.84,.55,0,1,1,1]),t=new Et;t.setAttribute("position",new bt(i,3)),t.setAttribute("uv",new bt(e,2)),t.setIndex([0,2,1,1,2,3,2,4,3,3,4,5]);const n=new Ut({uniforms:{uColor:{value:new Se(16773053).multiplyScalar(1.55)}},vertexShader:`
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
    `,transparent:!0,depthWrite:!1,blending:Ji,side:yt}),s=new rt(t,n);return s.frustumCulled=!1,s.renderOrder=2,s}const xs=new Ct,ei=new Se,ba=240,bs=4,ya=(bs+1)*2;function l_(){const i=document.createElement("canvas");i.width=64,i.height=128;const e=i.getContext("2d");e.fillStyle="#f1f5f9",e.fillRect(0,0,64,128);const t=4,n=12,s=64/t,r=128/n;for(let o=0;o<n;o++)for(let l=0;l<t;l++){const c=Math.sin(o*12.9898+l*78.233)*43758.5453%1;Math.abs(c)>.6?e.fillStyle="#fff59d":e.fillStyle="#1e293b",e.fillRect(l*s+3,o*r+3,s-6,r-6)}const a=new Xc(i);return a.wrapS=Si,a.wrapT=Si,a}class c_{constructor(e,t){this.scene=e,this.road=t;const n=l_();this.buildingMesh=this.createInstanced(new lt(1,1,1),new St({map:n,color:16777215}),180,!0),this.buildingCaps=this.createInstanced(new lt(1,1,1),new St({color:11850186}),180,!0),this.treeTrunks=this.createInstanced(new is(.45,.55,1,5),new St({color:2970697}),180,!0),this.treeCrowns=this.createInstanced(bc(),new St({color:3832929}),260,!0),this.roadsideBrush=this.createInstanced(bc(),new St({color:3501910}),420,!0),this.trafficPoles=this.createInstanced(new lt(1,1,1),new St({color:7904160}),90,!0),this.trafficLights=this.createInstanced(new lt(1,1,1),new St({color:1059374,emissive:new Se(6156186).multiplyScalar(4.2),emissiveIntensity:1}),90,!1),this.utilityPoles=this.createInstanced(new lt(1,1,1),new St({color:2111805}),180,!0),this.utilityCrossbars=this.createInstanced(new lt(1,1,1),new St({color:1913912}),300,!0),this.utilityWires=this.createInstanced(new lt(1,1,1),new hn({color:794661,transparent:!0,opacity:.72}),420,!1);const s=new Bo(2.2,5.8,8,1,!0);s.translate(0,-2.9,0),this.streetlightCones=this.createInstanced(s,a_(),180,!1),this.crosswalkPaint=this.createCrosswalkPaint(),this.crosswalkLampPosts=this.createInstanced(new lt(1,1,1),new St({color:9087402}),64,!0),this.crosswalkLampHeads=this.createInstanced(new lt(1,1,1),new St({color:16773296,emissive:new Se(16768378).multiplyScalar(3.8),emissiveIntensity:1}),64,!1),this.reflectorMesh=this.createInstanced(new lt(1,1,1),new St({color:14350207,emissive:new Se(14282842).multiplyScalar(4.6),emissiveIntensity:1}),180,!1),this.guardrailPosts=this.createInstanced(new lt(1,1,1),new St({color:8163987}),280,!0),this.pedestrianBodies=this.createInstanced(new lt(1,1,1),new St({color:14179176}),48,!0),this.pedestrianHeads=this.createInstanced(new Go(1,8,6),new St({color:15844751}),48,!0),this.pedestrianArms=this.createInstanced(new lt(1,1,1),new St({color:15844751}),96,!0),this.pedestrianLegs=this.createInstanced(new lt(1,1,1),new St({color:2700093}),96,!0),this.buildingWings=this.createInstanced(new lt(1,1,1),new St({map:n,color:16777215}),180,!0),this.urbanBlocks=this.createInstanced(new lt(1,1,1),new St({map:n,color:16777215}),180,!0),this.urbanRoofCaps=this.createInstanced(new lt(1,1,1),new St({color:9680059}),180,!0)}scene;road;buildingMesh;buildingCaps;treeTrunks;treeCrowns;roadsideBrush;trafficPoles;trafficLights;utilityPoles;utilityCrossbars;utilityWires;streetlightCones;crosswalkPaint;crosswalkLampPosts;crosswalkLampHeads;reflectorMesh;guardrailPosts;pedestrianBodies;pedestrianHeads;pedestrianArms;pedestrianLegs;urbanBlocks;urbanRoofCaps;buildingWings;qualityMode="high";lastUpdateKey="";setQualityMode(e){this.qualityMode!==e&&(this.qualityMode=e,this.lastUpdateKey="")}update(e,t){const n=this.qualityMode==="high"?{backDistance:50,forwardDistance:420,timeHz:8,density:1}:{backDistance:36,forwardDistance:260,timeHz:4,density:.54},s=e.road.transition,r=s?Math.floor(s.progress*16):0,a=Math.floor((e.vehicle.roadPositionM-n.backDistance)/18),o=Math.ceil((e.vehicle.roadPositionM+n.forwardDistance)/18),l=Math.floor(t*n.timeHz),c=`${this.qualityMode}:${a}:${o}:${l}:${e.road.scene}:${s?.from??""}:${s?.to??""}:${r}`;if(c===this.lastUpdateKey)return;this.lastUpdateKey=c;const h=this.road.sceneValue("city");let d=this.road.sceneValue("buildings"),u=this.road.sceneValue("trees");const m=this.road.sceneValue("forest"),g=this.road.sceneValue("crosswalks"),x=this.road.sceneValue("trafficLights"),p=this.road.sceneValue("buildingScale"),f=this.road.sceneValue("buildingSetback"),b=this.road.sceneValue("skylineDensity");d*=n.density,u*=this.qualityMode==="high"?1:.48;const A=p,M=b*1.45,w=b>.01,y=this.road.seed%1e4,C=e.vehicle.roadPositionM;let v=0,T=0,L=0,P=0,N=0,X=0,$=0,B=0,q=0,k=0,J=0,te=0,he=0,ue=0,ve=0,nt=0,_t=0,it=0,K=0,re=0,j=0,Re=0,Ge=0;for(let ge=a;ge<=o;ge++){const He=ge*18,Ie=this.road.boundsAt(He),st=this.road.frameAt(He),Pe=Math.PI+st.heading;for(const Ue of[Ie.leftWall,Ie.rightWall]){if(nt<this.capacity(this.guardrailPosts)){const Ne=this.road.worldFromRoad(He,Ue,.4);Mt(this.guardrailPosts,nt++,Ne.x,Ne.y,Ne.z,.16,.8,.16,Pe)}if(ve<this.capacity(this.reflectorMesh)){const Ne=this.road.worldFromRoad(He,Ue,.62);Mt(this.reflectorMesh,ve++,Ne.x,Ne.y,Ne.z,.1,.18,.75,Pe)}}if(h<.72&&p<1.2){const Ue=Math.min(.96,.38+m*.58+(1-h)*.2);for(let Ne=0;Ne<2&&!(N>=this.capacity(this.roadsideBrush));Ne++){const ke=Ne?1:-1,Fe=ge*17.13+Ne*47.9+y;if(oe(Fe)>Ue)continue;const Oe=He+(oe(Fe+2)-.5)*15,je=We(.55,1.35,oe(Fe+3)),D=We(.95,2.75,oe(Fe+5)),Je=We(.9,2.65,oe(Fe+7)),Ee=ke<0?Ie.leftWall:Ie.rightWall,E=Math.max(3.4,D*1.55+1.35+oe(Fe+1)*3.8),_=Ee+ke*E,U=this.road.worldFromRoad(Oe,_,je*.52);Mt(this.roadsideBrush,N,U.x,U.y,U.z,D,je,Je,Pe+(oe(Fe+11)-.5)*.52),this.roadsideBrush.setColorAt(N,ei.setHSL(.41+oe(Fe+13)*.08,.36,.3+oe(Fe+17)*.14)),N++}}if(g>.35&&(ge-4)%44===0){const Ue=Math.max(4,Math.floor(Ie.roadWidth/.82)),Ne=Ie.roadWidth-.62,ke=5.2,Fe=Math.min(.48,Ne/(Ue*1.55)),Oe=-Ne/2+Fe/2,je=Ne/Math.max(1,Ue-1);for(let Je=0;Je<Ue&&te<this.crosswalkPaint.maxStripes;Je++){const Ee=Oe+Je*je;this.writeCrosswalkStripe(te++,He,Ee,Fe,ke,.074)}for(const Je of[Ie.leftEdge-1.35,Ie.rightEdge+1.35]){if(he<this.capacity(this.crosswalkLampPosts)){const Ee=this.road.worldFromRoad(He-.85,Je,2.35);Mt(this.crosswalkLampPosts,he++,Ee.x,Ee.y,Ee.z,.13,4.7,.13,Pe)}if(ue<this.capacity(this.crosswalkLampHeads)){const Ee=this.road.worldFromRoad(He-.85,Je,4.85);Mt(this.crosswalkLampHeads,ue++,Ee.x,Ee.y,Ee.z,.52,.18,.34,Pe+Math.PI/2)}if(J<this.capacity(this.streetlightCones)){const Ee=this.road.worldFromRoad(He-.85,Je,4.78);Mt(this.streetlightCones,J++,Ee.x,Ee.y,Ee.z,.72,.72,.72,Pe)}}const D=this.road.pedestrianAt(ge,t);if(D.active&&_t<this.capacity(this.pedestrianBodies)&&it<this.capacity(this.pedestrianHeads)&&K+1<this.capacity(this.pedestrianArms)&&re+1<this.capacity(this.pedestrianLegs)){const Je=Math.sin(t*2.2+ge)*.08,Ee=Math.sin(t*3.1+ge)*.08,E=this.road.worldFromRoad(He-1.3,D.lateral+Je,.82);Mt(this.pedestrianBodies,_t++,E.x,E.y,E.z,.26,.68,.2,Pe);const _=this.road.worldFromRoad(He-1.3,D.lateral+Je,1.28);Mt(this.pedestrianHeads,it++,_.x,_.y,_.z,.18,.2,.18,Pe);for(const U of[-.22,.22]){const O=this.road.worldFromRoad(He-1.3,D.lateral+Je+U,.78);Mt(this.pedestrianArms,K++,O.x,O.y,O.z,.06,.48,.07,Pe)}for(const U of[-.07,.07]){const O=this.road.worldFromRoad(He-1.3+Ee*Math.sign(U),D.lateral+Je+U,.3);Mt(this.pedestrianLegs,re++,O.x,O.y,O.z,.07,.52,.08,Pe)}}if(x>.45)for(const Je of[Ie.leftEdge-3.4,Ie.rightEdge+3.4]){const Ee=this.road.worldFromRoad(He+2.8,Je,2.65);X<this.capacity(this.trafficPoles)&&Mt(this.trafficPoles,X++,Ee.x,Ee.y,Ee.z,.14,5.3,.14,Pe),$<this.capacity(this.trafficLights)&&Mt(this.trafficLights,$++,Ee.x,5.15,Ee.z,.46,.8,.24,Pe)}}if(w&&ge%(M>1.1?2:3)===0)for(let Ue=0;Ue<2&&!(j>=this.capacity(this.urbanBlocks)||Re>=this.capacity(this.urbanRoofCaps));Ue++){const Ne=Ue?1:-1,ke=ge*23.9+Ue*71.1+y,Fe=(Ne<0?Ie.leftWall:Ie.rightWall)+Ne*(f+We(12,36,oe(ke))),Oe=We(M>1.1?42:24,M>1.1?100:52,oe(ke+3))*b,je=We(M>1.1?16:12,M>1.1?38:28,oe(ke+5))*b,D=We(M>1.1?18:14,M>1.1?42:32,oe(ke+7))*b,Je=He+(oe(ke+11)-.5)*7,Ee=this.road.worldFromRoad(Je,Fe,Oe/2);Mt(this.urbanBlocks,j,Ee.x,Ee.y,Ee.z,je,Oe,D,Pe+(oe(ke+13)-.5)*.18),this.urbanBlocks.setColorAt(j,ei.setHSL(.53+oe(ke+17)*.06,.26,.42+oe(ke+19)*.18));const E=this.road.worldFromRoad(Je,Fe,Oe+.42);Mt(this.urbanRoofCaps,Re,E.x,E.y,E.z,je*.78,.48,D*.78,Pe),this.urbanRoofCaps.setColorAt(Re,ei.setHSL(.47+oe(ke+29)*.08,.18,.58+oe(ke+31)*.12)),j++,Re++}if(ge%4===0&&h<.55&&p<1.15)for(const Ue of[Ie.leftWall-2.8,Ie.rightWall+2.8]){if(B>=this.capacity(this.utilityPoles))break;const Ne=this.road.worldFromRoad(He+3,Ue,4.15);Mt(this.utilityPoles,B++,Ne.x,Ne.y,Ne.z,.18,8.3,.18,Pe);const ke=this.road.worldFromRoad(He+3,Ue,7.2);if(Mt(this.utilityCrossbars,q++,ke.x,ke.y,ke.z,.12,.12,4.3,Pe+Math.PI/2),q<this.capacity(this.utilityCrossbars)){const Fe=this.road.worldFromRoad(He+3,Ue,7.68);Mt(this.utilityCrossbars,q++,Fe.x,Fe.y,Fe.z,.09,.09,2.7,Pe+Math.PI/2)}if(this.qualityMode==="high"&&He>=C+28)for(const Fe of[-1.35,-.45,.45,1.35]){if(k>=this.capacity(this.utilityWires))break;const Oe=this.road.worldFromRoad(He+58,Ue+Fe,7.74+Math.abs(Fe)*.04);Mt(this.utilityWires,k++,Oe.x,Oe.y,Oe.z,.016,.016,46,Pe)}if(this.qualityMode==="high"&&J<this.capacity(this.streetlightCones)){const Fe=Ue<0?1.7:-1.7,Oe=this.road.worldFromRoad(He+3,Ue+Fe,6.9);Mt(this.streetlightCones,J++,Oe.x,Oe.y,Oe.z,1,1,1,Pe)}}for(let Ue=0;Ue<2;Ue++){const Ne=Ue?1:-1,ke=oe(ge*11.17+Ue*43+y),Fe=He+(oe(ge*5.13+Ue)-.5)*12,Oe=this.road.boundsAt(Fe),je=Ne<0?Oe.leftWall:Oe.rightWall,D=m>.45?8.2:A>0?6.6:13.5,Je=m>.45?38:A>1.1?30:A>0?28:44,Ee=je+Ne*We(D,Je,ke),E=A>.05&&b>.05&&ge>a+2&&ge%(A>1.1?2:4)===Ue,_=this.road.frameAt(Fe),U=Math.PI+_.heading;if(A>0&&(ke<d||E)){if(v>=this.capacity(this.buildingMesh)||T>=this.capacity(this.buildingCaps))continue;const O=ge*12.31+Ue*91.7+y,ee=(E?We(18,A>1.1?66:38,oe(O+5)):We(10,A>1.1?58:44,Math.pow(oe(O),.75)))*A,ne=We(6.5,A>1.1?26:20,oe(O+3)),W=We(7,A>1.1?30:22,oe(O+7)),ie=Math.sqrt(ne*ne+W*W)/2+f,be=(oe(O+11)-.5)*2.8,le=We(4,24,oe(O+2)),se=je+Ne*(ie+le)+be,we=Ne<0?Math.min(je-ie,se):Math.max(je+ie,se),De=this.road.worldFromRoad(Fe,we,ee/2);Mt(this.buildingMesh,v,De.x,De.y,De.z,ne,ee,W,U+(oe(O+13)-.5)*.4),this.buildingMesh.setColorAt(v,ei.setHSL(.54+oe(O+17)*.08,.28,.34+oe(O+19)*.22));const Ve=this.road.worldFromRoad(Fe,we,ee+.35);if(Mt(this.buildingCaps,T++,Ve.x,Ve.y,Ve.z,ne*.78,.48,W*.78,U),v++,this.qualityMode==="high"&&oe(O+37)>.36&&Ge<this.capacity(this.buildingWings)){const I=ne*We(.4,.75,oe(O+41)),ae=ee*We(.35,.8,oe(O+43)),Z=W*We(.4,.75,oe(O+47)),Q=we+Ne*(ne+I)/2,ye=this.road.worldFromRoad(Fe,Q,ae/2);Mt(this.buildingWings,Ge++,ye.x,ye.y,ye.z,I,ae,Z,U),this.buildingWings.setColorAt(Ge-1,ei.setHSL(.53+oe(O+59)*.08,.26,.3+oe(O+61)*.18))}}else{const O=Math.floor(u)+(ke<u%1?1:0);for(let V=0;V<O&&!(L>=this.capacity(this.treeTrunks)||P>=this.capacity(this.treeCrowns));V++){const ee=ge*15.41+Ue*59.3+V*113.7+y,ne=m>.45?We(7.4,21,oe(ee)):We(5.4,14.6,oe(ee)),W=Ee+(oe(ee+11)-.5)*8,Y=Fe+(oe(ee+13)-.5)*10,ie=this.road.worldFromRoad(Y,W,0),be=ne*.44;Mt(this.treeTrunks,L++,ie.x,be*.5,ie.z,.62,be,.62,U);const le=m>.45?1.34:1.08,se=this.road.worldFromRoad(Y,W,be);Mt(this.treeCrowns,P,se.x,se.y,se.z,3.3*le,2.5*le,3*le,oe(ee+19)*pn),this.treeCrowns.setColorAt(P,ei.setHSL(.42+oe(ee+23)*.05,.46,.28+oe(ee+29)*.14)),P++}}}}if(w){const ge=M>1.1?42:56,He=Math.floor((C-n.backDistance)/ge),Ie=Math.ceil((C+n.forwardDistance)/ge);for(let st=He;st<=Ie;st++){const Pe=st*ge,Qe=this.road.boundsAt(Pe),Ue=this.road.frameAt(Pe),Ne=Math.PI+Ue.heading;for(let ke=0;ke<2&&!(j>=this.capacity(this.urbanBlocks)||Re>=this.capacity(this.urbanRoofCaps));ke++){const Fe=ke?1:-1,Oe=st*31.7+ke*79.3+y,je=(Fe<0?Qe.leftWall:Qe.rightWall)+Fe*(f+We(36,90,oe(Oe))),D=We(M>1.1?48:24,M>1.1?110:48,oe(Oe+3)),Je=We(M>1.1?18:12,M>1.1?42:28,oe(Oe+5)),Ee=We(M>1.1?20:14,M>1.1?46:32,oe(Oe+7)),E=D*b,_=Je*b,U=Ee*b,O=this.road.worldFromRoad(Pe+(oe(Oe+11)-.5)*5,je,E/2);Mt(this.urbanBlocks,j,O.x,O.y,O.z,_,E,U,Ne+(oe(Oe+13)-.5)*.16),this.urbanBlocks.setColorAt(j,ei.setHSL(.53+oe(Oe+17)*.06,.26,.46+oe(Oe+19)*.18));const V=this.road.worldFromRoad(Pe,je,E+.42);Mt(this.urbanRoofCaps,Re,V.x,V.y,V.z,_*.76,.5,U*.76,Ne),this.urbanRoofCaps.setColorAt(Re,ei.setHSL(.47+oe(Oe+29)*.08,.18,.58+oe(Oe+31)*.14)),j++,Re++}}}this.applyCrosswalkCount(te),this.applyCounts([[this.buildingMesh,v],[this.buildingCaps,T],[this.buildingWings,Ge],[this.treeTrunks,L],[this.treeCrowns,P],[this.roadsideBrush,N],[this.trafficPoles,X],[this.trafficLights,$],[this.utilityPoles,B],[this.utilityCrossbars,q],[this.utilityWires,k],[this.streetlightCones,J],[this.crosswalkLampPosts,he],[this.crosswalkLampHeads,ue],[this.reflectorMesh,ve],[this.guardrailPosts,nt],[this.pedestrianBodies,_t],[this.pedestrianHeads,it],[this.pedestrianArms,K],[this.pedestrianLegs,re],[this.urbanBlocks,j],[this.urbanRoofCaps,Re]])}createInstanced(e,t,n,s){const r=new jd(e,t,n);return r.instanceMatrix.setUsage($i),r.castShadow=s,r.receiveShadow=s,r.frustumCulled=!1,this.scene.add(r),r}createCrosswalkPaint(){const e=ba*ya,t=new Float32Array(e*3),n=new Float32Array(e*3),s=new Float32Array(e*2),r=[];for(let c=0;c<e;c++)n[c*3+1]=1;for(let c=0;c<ba;c++){const h=c*ya;for(let d=0;d<bs;d++){const u=h+d*2,m=u+1,g=u+2,x=u+3;r.push(u,g,m,m,g,x)}}const a=new Et;a.setAttribute("position",new bt(t,3).setUsage($i)),a.setAttribute("normal",new bt(n,3)),a.setAttribute("uv",new bt(s,2).setUsage($i)),a.setIndex(r),a.setDrawRange(0,0);const o=new hn({color:15331047,depthWrite:!1,side:yt}),l=new rt(a,o);return l.frustumCulled=!1,l.renderOrder=14,this.scene.add(l),{mesh:l,positions:t,uvs:s,maxStripes:ba}}writeCrosswalkStripe(e,t,n,s,r,a){const o=e*ya,l=s*.5,c=r*.5;for(let h=0;h<=bs;h++){const d=h/bs,u=t-c+d*r,m=this.road.worldFromRoad(u,n-l,a),g=this.road.worldFromRoad(u,n+l,a),x=(o+h*2)*3;this.crosswalkPaint.positions[x]=m.x,this.crosswalkPaint.positions[x+1]=m.y,this.crosswalkPaint.positions[x+2]=m.z,this.crosswalkPaint.positions[x+3]=g.x,this.crosswalkPaint.positions[x+4]=g.y,this.crosswalkPaint.positions[x+5]=g.z;const p=(o+h*2)*2;this.crosswalkPaint.uvs[p]=0,this.crosswalkPaint.uvs[p+1]=d,this.crosswalkPaint.uvs[p+2]=1,this.crosswalkPaint.uvs[p+3]=d}}applyCrosswalkCount(e){this.crosswalkPaint.mesh.visible=e>0,this.crosswalkPaint.mesh.geometry.setDrawRange(0,e*bs*6),this.crosswalkPaint.mesh.geometry.getAttribute("position").needsUpdate=!0,this.crosswalkPaint.mesh.geometry.getAttribute("uv").needsUpdate=!0}applyCounts(e){for(const[t,n]of e)t.count=n,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}capacity(e){const t=e.instanceMatrix.array.length/16;return this.qualityMode==="high"?t:e===this.guardrailPosts||e===this.reflectorMesh?Math.floor(t*.7):e===this.pedestrianBodies||e===this.pedestrianHeads||e===this.pedestrianArms||e===this.pedestrianLegs?t:Math.floor(t*.52)}}function Mt(i,e,t,n,s,r,a,o,l=0){xs.position.set(t,n,s),xs.rotation.set(0,l,0),xs.scale.set(r,a,o),xs.updateMatrix(),i.setMatrixAt(e,xs.matrix)}class h_{constructor(e,t){this.physics=t,this.leftTrail=new Ec(e,16716083),this.rightTrail=new Ec(e,16716083),this.group.add(this.exterior);const n=this.createCar();this.headlightLeft=n.left,this.headlightRight=n.right,this.headlightBeam=n.beam,e.add(this.group)}physics;group=new kn;exterior=new kn;wheels=[];headlightLeft;headlightRight;headlightBeam;leftTrail;rightTrail;localTailLeft=new R(1.8,.45,-.55);localTailRight=new R(1.8,.45,.55);localRightAxis=new R(0,0,1);tailLeftWorld=new R;tailRightWorld=new R;carRightWorld=new R;wheelSteerAxis=new R(0,1,0);cameraMode="cockpit";setCameraMode(e){this.cameraMode=e;const t=e!=="cockpit";this.exterior.visible=t,this.headlightLeft.visible=t,this.headlightRight.visible=t,this.headlightBeam.visible=t,this.leftTrail.mesh.visible=t,this.rightTrail.mesh.visible=t}update(e,t){const n=e.vehicle.pose;this.group.position.set(n.x,n.y-.35,n.z),this.group.quaternion.copy(this.physics.chassisQuaternion()),this.group.updateMatrixWorld(!0),this.tailLeftWorld.copy(this.localTailLeft).applyMatrix4(this.group.matrixWorld),this.tailRightWorld.copy(this.localTailRight).applyMatrix4(this.group.matrixWorld),this.carRightWorld.copy(this.localRightAxis).applyQuaternion(this.group.quaternion);const s=this.cameraMode!=="cockpit",r=s?this.leftTrail.lastPoint():null;s?r&&r.distanceTo(this.tailLeftWorld)>10&&(this.leftTrail.clear(),this.rightTrail.clear()):(this.leftTrail.clear(),this.rightTrail.clear()),s&&(this.leftTrail.update(this.tailLeftWorld,this.carRightWorld),this.rightTrail.update(this.tailRightWorld,this.carRightWorld),this.updateWheels()),this.animateLights(t)}createCar(){const e=new ti({color:15222863,roughness:.58,metalness:.1}),t=new ti({color:6756899,roughness:.72,metalness:.05}),n=new ti({color:2111563,emissive:new Se(927282).multiplyScalar(.8),emissiveIntensity:.5,roughness:.26,metalness:.08}),s=new ti({color:1382427,roughness:.9}),r=new ti({color:13883606,roughness:.5,metalness:.24}),a=new ti({color:16774320,emissive:new Se(16769661).multiplyScalar(2),emissiveIntensity:2.2}),o=new ti({color:16716066,emissive:new Se(16716066).multiplyScalar(3),emissiveIntensity:3}),l=new rt(new lt(3.85,.54,1.7),e);l.position.y=.36,l.castShadow=!0,this.exterior.add(l);const c=new rt(new lt(3.95,.18,1.86),t);c.position.y=.18,this.exterior.add(c);const h=new rt(new lt(1.32,.7,1.25),e);h.position.set(.34,.9,0),h.castShadow=!0,this.exterior.add(h);const d=new rt(new lt(.12,.46,1.12),n);d.position.set(-.34,1,0),d.rotation.z=-.2,this.exterior.add(d);const u=new rt(new lt(.12,.42,1.08),n);u.position.set(.98,.98,0),u.rotation.z=.18,this.exterior.add(u);const m=new rt(new lt(1,.12,1.14),t);m.position.set(.38,1.3,0),this.exterior.add(m);const g=new rt(new lt(.12,.22,1.78),t);g.position.set(-1.98,.34,0),this.exterior.add(g);const x=new rt(new lt(.12,.1,1.9),e);x.position.set(1.88,.86,0),x.castShadow=!0,this.exterior.add(x);for(let y=0;y<4;y++){const C=new kn,v=new rt(new is(.36,.36,.28,14),s);v.rotation.x=Math.PI/2;const T=new rt(new is(.21,.21,.3,8),r);T.rotation.x=Math.PI/2,C.add(v,T),this.wheels.push(C),this.exterior.add(C)}const p=new rt(new lt(.08,.12,.26),a);p.position.set(-2.02,.5,-.52);const f=p.clone();f.position.z=.52,this.group.add(p,f);const b=o_();this.group.add(b);const A=new Ct;A.position.set(-28,.05,0),this.group.add(A);for(const y of[-.52,.52]){const C=new pu(16773053,4.2,82,.72,.98,1.08);C.position.set(-1.94,.58,y),C.target=A,C.castShadow=!1,this.group.add(C)}const M=new rt(new lt(.08,.12,.26),o);M.position.set(1.94,.5,-.52);const w=M.clone();return w.position.z=.52,this.exterior.add(M,w),{left:p,right:f,beam:b}}animateLights(e){const t=.75+Math.sin(e*4.4)*.12;this.headlightLeft.scale.set(1,t,1),this.headlightRight.scale.set(1,t,1),this.headlightBeam.scale.set(1,1,.96+t*.06)}updateWheels(){const e=this.physics.wheelVisuals();for(let t=0;t<this.wheels.length;t++){const n=e[t],s=this.wheels[t];s.position.copy(n.position),s.quaternion.setFromAxisAngle(this.wheelSteerAxis,n.steering),s.rotateZ(n.rotation)}}}class d_{constructor(e,t,n){this.road=t,this.physics=n,this.renderer=new y0({canvas:e,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7)),this.renderer.outputColorSpace=nn,this.renderer.toneMapping=Cr,this.renderer.toneMappingExposure=1.16,this.renderer.shadowMap.enabled=!1,this.scene=new Xd,this.camera=new sn(68,1,.08,1800),this.camera.rotation.order="YXZ",this.composer=new k0(this.renderer),this.composer.addPass(new V0(this.scene,this.camera)),this.bloom=new as(new Be(1,1),.14,.28,.75),this.composer.addPass(this.bloom),this.fxaa=new rh(X0),this.composer.addPass(this.fxaa),this.composer.addPass(new H0),this.atmosphere=new q0(this.scene,this.road,this.renderer,this.bloom),this.addLights(),this.roadRibbons=new s_(this.scene,this.road),this.scenery=new c_(this.scene,this.road),this.vehicleVisual=new h_(this.scene,this.physics),this.debugHelper=new Au(this.camera),this.debugHelper.visible=!1,this.scene.add(this.debugHelper),e.addEventListener("webglcontextlost",s=>{s.preventDefault(),console.warn("SLimulator WebGL context lost")}),e.addEventListener("webglcontextrestored",()=>this.resize()),this.resize()}road;physics;renderer;scene;camera;composer;bloom;fxaa;atmosphere;roadRibbons;scenery;vehicleVisual;debugHelper;smoothedCameraPosition=new R;smoothedCameraTarget=new R;cameraForward=new R;cameraRight=new R;cameraTarget=new R;cameraDesired=new R;cameraLookTarget=new R;cameraReady=!1;cameraMode="cockpit";qualityMode="high";setCameraMode(e){this.cameraMode=e,this.debugHelper.visible=e==="debug",this.vehicleVisual.setCameraMode(e)}setHighQuality(e){this.setQualityMode(e?"high":"perf")}setQualityMode(e){this.qualityMode=e,this.renderer.setPixelRatio(e==="high"?Math.min(window.devicePixelRatio||1,1.7):1),this.renderer.shadowMap.enabled=!1,this.bloom.enabled=e==="high",this.fxaa.enabled=e==="high",this.roadRibbons.setQualityMode(e),this.scenery.setQualityMode(e),this.atmosphere.setQualityMode(e),this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,n=e.clientHeight||window.innerHeight;this.renderer.setSize(t,n,!1),this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(t,n),this.fxaa.uniforms.resolution.value.set(1/Math.max(1,t*this.renderer.getPixelRatio()),1/Math.max(1,n*this.renderer.getPixelRatio())),this.camera.aspect=t/Math.max(1,n),this.camera.updateProjectionMatrix()}render(e,t,n){const s=t*.001;this.measure(n,"atmosphere",()=>this.atmosphere.update(e)),this.measure(n,"road",()=>this.roadRibbons.update(e)),this.measure(n,"scenery",()=>this.scenery.update(e,s)),this.measure(n,"vehicle",()=>this.vehicleVisual.update(e,s)),this.measure(n,"camera",()=>this.updateCamera(e,t)),this.qualityMode==="high"?this.composer.render():this.renderer.render(this.scene,this.camera)}perfStats(){const e=this.renderer.domElement;return{quality:this.qualityMode,pixelRatio:this.renderer.getPixelRatio(),canvas:{width:e.width,height:e.height,clientWidth:e.clientWidth,clientHeight:e.clientHeight},render:{calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,points:this.renderer.info.render.points,lines:this.renderer.info.render.lines},memory:{geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures}}}addLights(){this.scene.add(new _u(11065304,.34));const e=new uu(10215644,2050879,.86);this.scene.add(e);const t=new gu(16770730,.54);t.position.set(-90,115,-55),t.castShadow=!1,this.scene.add(t),this.scene.add(t.target)}measure(e,t,n){e?e.measure(t,n):n()}updateCamera(e,t){const n=e.vehicle.pose,s=this.cameraForward.set(Math.sin(n.yaw),0,-Math.cos(n.yaw)),r=this.cameraRight.set(Math.cos(n.yaw),0,Math.sin(n.yaw)),a=e.vehicle.speedMps>1?Math.sin(t*.008)*Math.min(.018,e.vehicle.speedMps*6e-4):0;if(this.cameraMode==="chase"){const c=this.cameraTarget.set(n.x,n.y+.6,n.z),h=this.cameraDesired.copy(c).addScaledVector(s,-11);h.y+=5,this.cameraReady?this.camera.position.lerp(h,.12):this.camera.position.copy(h),this.cameraLookTarget.copy(c).addScaledVector(s,3.5),this.smoothedCameraTarget.lerp(this.cameraLookTarget,this.cameraReady?.18:1),this.camera.lookAt(this.smoothedCameraTarget),this.cameraReady=!0;return}if(this.cameraMode==="debug"){this.camera.position.set(n.x+24,n.y+28,n.z+24),this.camera.lookAt(n.x,n.y,n.z),this.debugHelper.update();return}const o=this.cameraDesired.set(n.x,1.82+a,n.z).addScaledVector(s,.5).addScaledVector(r,-.28),l=this.cameraLookTarget.copy(o).addScaledVector(s,15);l.y+=-.22-Math.min(.22,e.vehicle.speedMps*.006),this.cameraReady?(this.smoothedCameraPosition.lerp(o,.38),this.smoothedCameraTarget.lerp(l,.28)):(this.smoothedCameraPosition.copy(o),this.smoothedCameraTarget.copy(l)),this.camera.position.copy(this.smoothedCameraPosition),this.camera.lookAt(this.smoothedCameraTarget),this.camera.rotation.z=-n.steerAngle*.035,this.cameraReady=!0}}function u_(i){const e=["SLimulator Driving Performance Log",`Version: ${i.version}`,`SubID: ${i.session.subId||"none"}`,`Duration: ${As(i.session.elapsed)}`,`Scene: ${i.road.scene}`,`Distance: ${It(i.vehicle.distanceM,1)} m`,`Final speed: ${It(i.vehicle.speedMps*ys,1)} mph`,"","Score",`Steering points: ${It(i.metrics.steeringPoints,1)}`,`Off-road seconds: ${It(i.metrics.offRoadSeconds,2)}`,`Off-road penalty: ${It(i.metrics.offRoadPenalty,1)}`,`Crash count: ${i.metrics.crashCount}`,`Crash penalty: ${It(i.metrics.crashPenaltyTotal,1)}`,`Total score: ${It(i.metrics.totalScore,1)}`,`SDLP: ${It(i.metrics.sdlp,3)} m`,`Lane changes: ${i.metrics.laneChanges}`,"","Time by mode",...Object.entries(i.metrics.timeByMode).map(([t,n])=>`${t}: ${It(n,2)} s`),"","Alerts",...Object.entries(i.metrics.alertCounts).map(([t,n])=>`${t}: ${n}`),"","Crashes",i.crashes.length?"":"none"];for(const t of i.crashes)e.push(`#${t.index} ${As(t.time)} ${t.type} ${t.side} ${It(t.mph,1)} mph ${t.zone}`);e.push("","Trials",i.trials.length?"":"none");for(const t of i.trials)e.push(`#${t.index} ${t.type} expected=${t.expectedAction} status=${t.status} pdt=${t.pdt??""} drt=${t.drt??""}`);return`${e.join(`
`)}
`}function f_(i,e){i.className="sim-root",i.innerHTML=`
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
            <div class="compact-fields">
              <label class="field"><span class="label">Steering Axis</span><select id="gamepadSteerAxis"></select></label>
              <label class="field"><span class="label">Accel Axis</span><select id="gamepadAccelAxis"></select></label>
              <label class="field"><span class="label">Brake Axis</span><select id="gamepadBrakeAxis"></select></label>
              <label class="field"><span class="label">ACC Button</span><select id="gamepadAccButton"></select></label>
              <label class="field"><span class="label">LCA Button</span><select id="gamepadLcaButton"></select></label>
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
  `;const t=_e("world"),n=_e("modPanel"),s=_e("cockpit"),r=_e("toast");let a=null,o=0,l=-1/0,c=-1/0,h=-1/0,d=-1/0;_e("modToggle").addEventListener("click",()=>n.classList.toggle("open")),_e("closePanel").addEventListener("click",()=>n.classList.remove("open")),_e("cockpitToggle").addEventListener("click",()=>s.classList.toggle("minimized")),_e("wheelAcc").addEventListener("click",()=>e.onToggleACC()),_e("wheelLca").addEventListener("click",()=>e.onToggleLCA()),_e("newSession").addEventListener("click",()=>e.onNewSession());const u=_e("logDialog"),m=_e("logSubId"),g=()=>{u.hidden=!0},x=f=>{if(!a)return;const b=f.trim(),A={...a,session:{...a.session,subId:b}},M=new Blob([u_(A)],{type:"text/plain"}),w=URL.createObjectURL(M),y=document.createElement("a");y.href=w;const C=b?`${b.replace(/[^a-z0-9_-]/gi,"_")}-`:"";y.download=`slimulator-log-${C}${Date.now()}.txt`,y.click(),URL.revokeObjectURL(w)};_e("downloadLog").addEventListener("click",()=>{a&&(__(a),m.value=a.session.subId||"",u.hidden=!1,m.focus(),m.select())}),_e("confirmLog").addEventListener("click",()=>{x(m.value),g()}),_e("cancelLog").addEventListener("click",g),_e("cancelLogTop").addEventListener("click",g),u.addEventListener("click",f=>{f.target===u&&g()}),m.addEventListener("keydown",f=>{f.key==="Enter"&&(x(m.value),g()),f.key==="Escape"&&g()}),m_(e),g_(),document.querySelectorAll(".scene-btn").forEach(f=>{f.addEventListener("click",()=>e.onScene(f.dataset.scene))}),document.querySelectorAll(".input-btn").forEach(f=>{f.addEventListener("click",()=>{Ea(".input-btn",f);const b=f.dataset.input;_e("gamepadConfig").hidden=b!=="gamepad",e.onInputSource(b)})}),document.querySelectorAll(".alert-btn").forEach(f=>{f.addEventListener("click",()=>e.onAlert(f.dataset.alert))}),document.querySelectorAll(".camera-btn").forEach(f=>{f.addEventListener("click",()=>{Ea(".camera-btn",f),e.onCamera(f.dataset.camera)})}),document.querySelectorAll(".quality-btn").forEach(f=>{f.addEventListener("click",()=>{Ea(".quality-btn",f),e.onQuality(f.dataset.quality==="high")})});const p=(f,b,A,M="")=>{const w=_e(f),y=_e(b),C=()=>{const v=parseFloat(w.value);y.textContent=`${A}: ${v.toFixed(f==="sliderAeroDrag"?4:M===""?2:1)}${M}`,e.onPhysicsChange(f.replace("slider","").replace(/^\w/,T=>T.toLowerCase()),v)};w.addEventListener("input",C)};return p("sliderEngineAccel","lblEngineAccel","Engine Accel"," m/s²"),p("sliderAeroDrag","lblAeroDrag","Aero Drag"),p("sliderBrakeDecel","lblBrakeDecel","Brake Power"," m/s²"),p("sliderSteerResponse","lblSteerResponse","Steer Response"),{canvas:t,update(f,b,A){a=f;const M=performance.now(),w=cn[f.road.scene].label;if(M-h>=500&&(_e("fpsChip").textContent=b?`${Math.round(b)} FPS`:"-- FPS",h=M),M-l>=1e3/15){_e("sceneChip").textContent=`${w}${f.road.transition?` -> ${cn[f.road.transition.to].label}`:""}`;const y=Math.round(f.vehicle.speedMph);_e("speedReadout").textContent=String(y).padStart(3,"0"),p_(f),_e("dic").textContent=f.dicMessage,_e("scoreReadout").textContent=It(f.metrics.totalScore,1),_e("sdlpReadout").textContent=`${It(f.metrics.sdlp,3)} M`,_e("steeringScoreReadout").textContent=It(f.metrics.steeringPoints,1),_e("offRoadReadout").textContent=f.metrics.offRoadPenalty>0?`-${It(f.metrics.offRoadPenalty,1)}`:"0.0",_e("crashReadout").textContent=`${f.metrics.crashCount} x ${Xe.crashPenalty}`,_e("distanceReadout").textContent=`${Math.round(f.vehicle.distanceM)} M`,_e("miniSceneReadout").textContent=`${w} - ${f.road.lanesPerDirection} LANE${f.road.lanesPerDirection===1?"":"S"}`,_e("miniModeReadout").textContent=f.adas.mode.toUpperCase(),_e("statusMode").textContent=f.adas.mode,_e("statusLanes").textContent=String(f.road.lanesPerDirection),_e("statusQueue").textContent=f.road.queue.map(C=>cn[C.target].label).join(" -> ")||"none",_e("statusCrashes").textContent=String(f.metrics.crashCount),_e("accelFill").style.height=`${Math.round(f.vehicle.controls.accelerator*100)}%`,_e("brakeFill").style.height=`${Math.round(f.vehicle.controls.brake*100)}%`,_e("steering").style.transform=`translateX(-50%) rotate(${(f.vehicle.controls.steer*86).toFixed(1)}deg)`,_e("wheelAcc").classList.toggle("active",f.adas.accActive),_e("wheelLca").classList.toggle("active",f.adas.lcaActive||f.adas.autoArmed),f.vehicle.crashReset&&(_e("dic").textContent=`${f.dicMessage} - ${f.vehicle.crashReset.phase.toUpperCase()}`),_e("cockpitToggle").textContent=s.classList.contains("minimized")?"SHOW":"COCKPIT",_e("statusMode").setAttribute("title",`Elapsed ${As(f.session.elapsed)}`),l=M}M-d>=250&&(_e("gamepadLive").textContent=A,d=M),M-c>=100&&(v_(_e("laneCanvas"),f),c=M)},toast(f,b="info",A=2200){r.textContent=f,r.className=`toast glass micro show ${b}`,window.clearTimeout(o),o=window.setTimeout(()=>r.classList.remove("show"),A)}}}function _e(i){const e=document.getElementById(i);if(!e)throw new Error(`Missing UI element #${i}`);return e}function Ea(i,e){document.querySelectorAll(i).forEach(t=>t.classList.toggle("active",t===e))}function p_(i){const e=i.adas.mode==="l2",t=i.adas.mode==="l3",n=i.road.scene==="l2",s=i.road.scene==="l3",r=e?"l2-active":n?"ready":i.adas.autoArmed?"armed":"off",a=t?"l3-active":s?"ready":i.adas.autoArmed?"armed":"off",o=Math.round(i.adas.setSpeedMph),l=_e("accGauge");_e("dicIndicatorRow").classList.toggle("l3-active",t),l.classList.toggle("with-speed",i.adas.accActive),_e("accGaugeLabel").textContent=i.adas.accActive?`ACC ${o}`:"ACC",Ta(l,i.adas.accActive?"active":"off"),Ta(_e("l2Gauge"),r),Ta(_e("l3Gauge"),a),l.setAttribute("title",i.adas.accActive?`ACC set to ${o} mph`:"ACC off"),_e("l2Gauge").setAttribute("title",e?"L2 active":n?"L2 available":i.adas.autoArmed?"L2 armed, unavailable":"L2 off"),_e("l3Gauge").setAttribute("title",t?"L3 active":s?"L3 available":i.adas.autoArmed?"L3 armed, unavailable":"L3 off")}function Ta(i,e){i.classList.remove("armed","ready","active","l2-active","l3-active"),e!=="off"&&i.classList.add(e)}function m_(i){const e=[["steerAxis","gamepadSteerAxis"],["acceleratorAxis","gamepadAccelAxis"],["brakeAxis","gamepadBrakeAxis"]],t=[["accButton","gamepadAccButton"],["lcaButton","gamepadLcaButton"]];e.forEach(([,r])=>Tc(_e(r),"Axis",8)),t.forEach(([,r])=>Tc(_e(r),"Button",16));const n=r=>{[...e,...t].forEach(([a,o])=>{_e(o).value=String(r[a])})},s=()=>{const r={};return[...e,...t].forEach(([a,o])=>{r[a]=Number(_e(o).value)}),r};n(i.getGamepadMapping()),[...e,...t].forEach(([,r])=>{_e(r).addEventListener("change",()=>i.onGamepadMappingChange(s()))}),_e("gamepadReset").addEventListener("click",()=>n(i.onGamepadMappingReset()))}function g_(){const i=_e("physicsToggle"),e=_e("physicsBody"),t=_e("physicsToggleText");i.addEventListener("click",()=>{const n=e.hidden;e.hidden=!n,i.setAttribute("aria-expanded",String(n)),t.textContent=n?"Close":"Open"})}function Tc(i,e,t){i.innerHTML=Array.from({length:t},(n,s)=>`<option value="${s}">${e} ${s}</option>`).join("")}function __(i){_e("logTotalScore").textContent=It(i.metrics.totalScore,1),_e("logSteeringPoints").textContent=It(i.metrics.steeringPoints,1),_e("logOffRoadPenalty").textContent=Ac(i.metrics.offRoadPenalty),_e("logCrashPenalty").textContent=Ac(i.metrics.crashPenaltyTotal),_e("logSdlp").textContent=`${It(i.metrics.sdlp,3)} M`,_e("logDuration").textContent=As(i.session.elapsed),_e("logDistance").textContent=`${It(i.vehicle.distanceM,1)} M`;const e=_e("logCrashList");if(e.replaceChildren(),!i.crashes.length){e.textContent="No crashes recorded";return}i.crashes.forEach(t=>{const n=document.createElement("div");n.className="log-crash-row";const s=document.createElement("strong");s.textContent=`#${t.index} ${t.type.toUpperCase()} ${It(t.mph,1)} MPH`;const r=document.createElement("span");r.textContent=`${As(t.time)} | ${t.side} | ${t.zone}`,n.append(s,r),e.append(n)})}function Ac(i){return i>0?`-${It(i,1)}`:"0.0"}function v_(i,e){const t=i.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,2),s=Math.max(1,Math.floor(t.width*n)),r=Math.max(1,Math.floor(t.height*n));(i.width!==s||i.height!==r)&&(i.width=s,i.height=r);const a=i.getContext("2d");if(!a)return;a.clearRect(0,0,s,r);const o=e.road.bounds,l=s/Math.max(1,o.rightWall-o.leftWall),c=(o.rightWall+o.leftWall)/2,h=(g,x)=>s/2+(g+x-c)*l;a.fillStyle="#2d4c3c",a.fillRect(0,0,s,r);const d=e.road.curvePoints||Array.from({length:9},(g,x)=>({sOffset:-5+x*5,xOffset:0}));a.fillStyle="#1c2936",a.beginPath();for(let g=d.length-1;g>=0;g--){const x=d[g],p=r*(1-(x.sOffset+10)/40);g===d.length-1?a.moveTo(h(o.leftEdge,x.xOffset),p):a.lineTo(h(o.leftEdge,x.xOffset),p)}for(let g=0;g<d.length;g++){const x=d[g],p=r*(1-(x.sOffset+10)/40);a.lineTo(h(o.rightEdge,x.xOffset),p)}a.closePath(),a.fill(),a.strokeStyle="rgba(255, 255, 255, 0.9)",a.lineWidth=Math.max(2,n*1.5),a.setLineDash([]),a.beginPath();for(let g=0;g<d.length;g++){const x=d[g],p=r*(1-(x.sOffset+10)/40);g===0?a.moveTo(h(o.leftEdge,x.xOffset),p):a.lineTo(h(o.leftEdge,x.xOffset),p)}a.stroke(),a.beginPath();for(let g=0;g<d.length;g++){const x=d[g],p=r*(1-(x.sOffset+10)/40);g===0?a.moveTo(h(o.rightEdge,x.xOffset),p):a.lineTo(h(o.rightEdge,x.xOffset),p)}a.stroke(),a.strokeStyle="rgba(255, 215, 96, 0.9)",a.lineWidth=Math.max(1,n),a.setLineDash([]);for(const g of[-.16,.16]){a.beginPath();for(let x=0;x<d.length;x++){const p=d[x],f=r*(1-(p.sOffset+10)/40);x===0?a.moveTo(h(g,p.xOffset),f):a.lineTo(h(g,p.xOffset),f)}a.stroke()}a.strokeStyle="rgba(255, 255, 255, 0.82)",a.lineWidth=Math.max(1,n),a.setLineDash([6*n,10*n]);for(let g=0;g<o.laneCount-1;g++){const x=-5.4*(g+1),p=Xe.laneWidth*(g+1);a.beginPath();for(let f=0;f<d.length;f++){const b=d[f],A=r*(1-(b.sOffset+10)/40);f===0?a.moveTo(h(x,b.xOffset),A):a.lineTo(h(x,b.xOffset),A)}a.stroke(),a.beginPath();for(let f=0;f<d.length;f++){const b=d[f],A=r*(1-(b.sOffset+10)/40);f===0?a.moveTo(h(p,b.xOffset),A):a.lineTo(h(p,b.xOffset),A)}a.stroke()}a.setLineDash([]);const u=h(e.vehicle.lateralM,0),m=r*(1-10/40);a.save(),a.translate(u,m),a.rotate(e.vehicle.headingErrorRad),a.fillStyle="#ff6172",a.beginPath(),a.roundRect(-9*n,-15*n,18*n,30*n,4*n),a.fill(),a.restore()}async function x_(){const i=document.getElementById("app");if(!i)throw new Error("Missing #app root");const e=await Vo.create(),t=new yh,n=new N0(window),s=new Ah;let r="cockpit",a="high",o=!1,l=!1,c="No gamepad",h=-1/0,d=-1/0,u;const m=f_(i,{onScene(p){e.requestScene(p),t.resume()},onNewSession(){e.newSession(),t.resume(),m.toast("Session reset")},onToggleACC(){e.toggleACC(),t.resume()},onToggleLCA(){e.toggleLCA(),t.resume()},onInputSource(p){e.setInputSource(p),m.toast(p==="local"?"Local controls":p==="gamepad"?"Gamepad controls":"External controls")},onAlert(p){e.triggerAlert({type:p}),t.alert(p)},onCamera(p){r=p,u.setCameraMode(r)},onQuality(p){a=p?"high":"perf",u.setQualityMode(a)},onPhysicsChange(p,f){e.physics.setParam(p,f)},onGamepadMappingChange(p){n.setGamepadMapping(p)},onGamepadMappingReset(){return n.resetGamepadMapping()},getGamepadMapping(){return n.getGamepadMapping()}});u=new d_(m.canvas,e.road,e.physics),u.setCameraMode(r),u.setQualityMode(a),window.addEventListener("resize",()=>u.resize()),window.addEventListener("pointerdown",()=>t.resume(),{once:!0}),_o.addEventListener("event",p=>{p.detail.type==="crash"&&(t.burst("impact"),m.toast("Crash recorded","danger",2400))}),window.SLimulator={version:wc,renderer:u,snapshot:()=>e.snapshot(),perfSnapshot:()=>s.snapshot(u.perfStats()),requestScene:(p,f)=>e.requestScene(p,f),newSession:(p={})=>e.newSession(p),setDriverControls:p=>e.setExternalControls(p),setInputSource:p=>e.setInputSource(p),toggleACC:()=>e.toggleACC(),toggleLCA:()=>e.toggleLCA(),triggerAlert:(p={})=>e.triggerAlert({...p,expectedAction:p.expectedAction}),setPhysicsParam:(p,f)=>e.physics.setParam(p,f)};let g=e.snapshot();function x(p){const f=s.mark(p),b=s.measure("input",()=>n.sample(e.inputSource==="gamepad"?"gamepad":"local"));p-h>=250&&(c=s.measure("input",()=>n.liveGamepadLabel()),h=p),b.accButton&&!o&&e.toggleACC(),b.lcaButton&&!l&&e.toggleLCA(),o=!!b.accButton,l=!!b.lcaButton,g=s.measure("sim",()=>e.update(f,b,s)),s.measure("render",()=>u.render(g,p,s)),s.measure("ui",()=>m.update(g,s.fps,c)),p-d>=1e3/30&&(s.measure("audio",()=>t.update(g)),d=p),requestAnimationFrame(x)}requestAnimationFrame(x)}x_().catch(i=>{console.error(i);const e=document.getElementById("app");e&&(e.innerHTML=`<pre style="padding:20px;color:#ffdce1;background:#18070b;white-space:pre-wrap">${String(i?.stack||i)}</pre>`)});
