import{I as Y,F as I,a as P,b as U,W as Z,B as R,S as q,V as S,c as ee,d as L,U as X,e as te,f as D,M as ie,g as z,L as ne,h as re,i as se,j as oe,k as ae}from"./three-core-sICVRidE.js";const j=new R,B=new S;class J extends Y{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new I(e,3)),this.setAttribute("uv",new I(i,2))}applyMatrix4(e){const i=this.attributes.instanceStart,n=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(e),n.applyMatrix4(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const n=new P(i,6,1);return this.setAttribute("instanceStart",new U(n,3,0)),this.setAttribute("instanceEnd",new U(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const n=new P(i,6,1);return this.setAttribute("instanceColorStart",new U(n,3,0)),this.setAttribute("instanceColorEnd",new U(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Z(e.geometry)),this}fromLineSegments(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new R);const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;e!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(e),j.setFromBufferAttribute(i),this.boundingBox.union(j))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new q),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(e!==void 0&&i!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let t=0;for(let l=0,c=e.count;l<c;l++)B.fromBufferAttribute(e,l),t=Math.max(t,n.distanceToSquared(B)),B.fromBufferAttribute(i,l),t=Math.max(t,n.distanceToSquared(B));this.boundingSphere.radius=Math.sqrt(t),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}D.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new te},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};L.line={uniforms:X.merge([D.common,D.fog,D.line]),vertexShader:`
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
		`};class $ extends ee{constructor(e){super({type:"LineMaterial",uniforms:X.clone(L.line.uniforms),vertexShader:L.line.vertexShader,fragmentShader:L.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const G=new z,W=new S,F=new S,m=new z,h=new z,v=new z,O=new S,C=new re,g=new ne,N=new S,T=new R,M=new q,b=new z;let w,A;function V(o,e,i){return b.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),b.multiplyScalar(1/b.w),b.x=A/i.width,b.y=A/i.height,b.applyMatrix4(o.projectionMatrixInverse),b.multiplyScalar(1/b.w),Math.abs(Math.max(b.x,b.y))}function le(o,e){const i=o.matrixWorld,n=o.geometry,t=n.attributes.instanceStart,l=n.attributes.instanceEnd,c=Math.min(n.instanceCount,t.count);for(let a=0,u=c;a<u;a++){g.start.fromBufferAttribute(t,a),g.end.fromBufferAttribute(l,a),g.applyMatrix4(i);const p=new S,r=new S;w.distanceSqToSegment(g.start,g.end,r,p),r.distanceTo(p)<A*.5&&e.push({point:r,pointOnLine:p,distance:w.origin.distanceTo(r),object:o,face:null,faceIndex:a,uv:null,uv1:null})}}function de(o,e,i){const n=e.projectionMatrix,l=o.material.resolution,c=o.matrixWorld,a=o.geometry,u=a.attributes.instanceStart,p=a.attributes.instanceEnd,r=Math.min(a.instanceCount,u.count),s=-e.near;w.at(1,v),v.w=1,v.applyMatrix4(e.matrixWorldInverse),v.applyMatrix4(n),v.multiplyScalar(1/v.w),v.x*=l.x/2,v.y*=l.y/2,v.z=0,O.copy(v),C.multiplyMatrices(e.matrixWorldInverse,c);for(let f=0,d=r;f<d;f++){if(m.fromBufferAttribute(u,f),h.fromBufferAttribute(p,f),m.w=1,h.w=1,m.applyMatrix4(C),h.applyMatrix4(C),m.z>s&&h.z>s)continue;if(m.z>s){const _=m.z-h.z,E=(m.z-s)/_;m.lerp(h,E)}else if(h.z>s){const _=h.z-m.z,E=(h.z-s)/_;h.lerp(m,E)}m.applyMatrix4(n),h.applyMatrix4(n),m.multiplyScalar(1/m.w),h.multiplyScalar(1/h.w),m.x*=l.x/2,m.y*=l.y/2,h.x*=l.x/2,h.y*=l.y/2,g.start.copy(m),g.start.z=0,g.end.copy(h),g.end.z=0;const x=g.closestPointToPointParameter(O,!0);g.at(x,N);const H=se.lerp(m.z,h.z,x),K=H>=-1&&H<=1,Q=O.distanceTo(N)<A*.5;if(K&&Q){g.start.fromBufferAttribute(u,f),g.end.fromBufferAttribute(p,f),g.start.applyMatrix4(c),g.end.applyMatrix4(c);const _=new S,E=new S;w.distanceSqToSegment(g.start,g.end,E,_),i.push({point:E,pointOnLine:_,distance:w.origin.distanceTo(E),object:o,face:null,faceIndex:f,uv:null,uv1:null})}}}class ce extends ie{constructor(e=new J,i=new $({color:Math.random()*16777215})){super(e,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,i=e.attributes.instanceStart,n=e.attributes.instanceEnd,t=new Float32Array(2*i.count);for(let c=0,a=0,u=i.count;c<u;c++,a+=2)W.fromBufferAttribute(i,c),F.fromBufferAttribute(n,c),t[a]=a===0?0:t[a-1],t[a+1]=t[a]+W.distanceTo(F);const l=new P(t,2,1);return e.setAttribute("instanceDistanceStart",new U(l,1,0)),e.setAttribute("instanceDistanceEnd",new U(l,1,1)),this}raycast(e,i){const n=this.material.worldUnits,t=e.camera;if(t===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;const l=e.params.Line2!==void 0&&e.params.Line2.threshold||0;w=e.ray;const c=this.matrixWorld,a=this.geometry,u=this.material;A=u.linewidth+l,a.boundingSphere===null&&a.computeBoundingSphere(),M.copy(a.boundingSphere).applyMatrix4(c);let p;if(n)p=A*.5;else{const s=Math.max(t.near,M.distanceToPoint(w.origin));p=V(t,s,u.resolution)}if(M.radius+=p,w.intersectsSphere(M)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),T.copy(a.boundingBox).applyMatrix4(c);let r;if(n)r=A*.5;else{const s=Math.max(t.near,T.distanceToPoint(w.origin));r=V(t,s,u.resolution)}T.expandByScalar(r),w.intersectsBox(T)!==!1&&(n?le(this,i):de(this,t,i))}onBeforeRender(e){const i=this.material.uniforms;i&&i.resolution&&(e.getViewport(G),this.material.uniforms.resolution.value.set(G.z,G.w))}}class ue extends J{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const i=e.length-3,n=new Float32Array(2*i);for(let t=0;t<i;t+=3)n[2*t]=e[t],n[2*t+1]=e[t+1],n[2*t+2]=e[t+2],n[2*t+3]=e[t+3],n[2*t+4]=e[t+4],n[2*t+5]=e[t+5];return super.setPositions(n),this}setColors(e){const i=e.length-3,n=new Float32Array(2*i);for(let t=0;t<i;t+=3)n[2*t]=e[t],n[2*t+1]=e[t+1],n[2*t+2]=e[t+2],n[2*t+3]=e[t+3],n[2*t+4]=e[t+4],n[2*t+5]=e[t+5];return super.setColors(n),this}setFromPoints(e){const i=e.length-1,n=new Float32Array(6*i);for(let t=0;t<i;t++)n[6*t]=e[t].x,n[6*t+1]=e[t].y,n[6*t+2]=e[t].z||0,n[6*t+3]=e[t+1].x,n[6*t+4]=e[t+1].y,n[6*t+5]=e[t+1].z||0;return super.setPositions(n),this}fromLine(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}}class pe extends ce{constructor(e=new ue,i=new $({color:Math.random()*16777215})){super(e,i),this.isLine2=!0,this.type="Line2"}}function me(o,e=!1){const i=o[0].index!==null,n=new Set(Object.keys(o[0].attributes)),t=new Set(Object.keys(o[0].morphAttributes)),l={},c={},a=o[0].morphTargetsRelative,u=new oe;let p=0;for(let r=0;r<o.length;++r){const s=o[r];let f=0;if(i!==(s.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in s.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;l[d]===void 0&&(l[d]=[]),l[d].push(s.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". Make sure all geometries have the same number of attributes."),null;if(a!==s.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in s.morphAttributes){if(!t.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+".  .morphAttributes must be consistent throughout all geometries."),null;c[d]===void 0&&(c[d]=[]),c[d].push(s.morphAttributes[d])}if(e){let d;if(i)d=s.index.count;else if(s.attributes.position!==void 0)d=s.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+r+". The geometry must have either an index or a position attribute"),null;u.addGroup(p,d,r),p+=d}}if(i){let r=0;const s=[];for(let f=0;f<o.length;++f){const d=o[f].index;for(let y=0;y<d.count;++y)s.push(d.getX(y)+r);r+=o[f].attributes.position.count}u.setIndex(s)}for(const r in l){const s=k(l[r]);if(!s)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+r+" attribute."),null;u.setAttribute(r,s)}for(const r in c){const s=c[r][0].length;if(s!==0){u.morphAttributes=u.morphAttributes||{},u.morphAttributes[r]=[];for(let f=0;f<s;++f){const d=[];for(let x=0;x<c[r].length;++x)d.push(c[r][x][f]);const y=k(d);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+r+" morphAttribute."),null;u.morphAttributes[r].push(y)}}}return u}function k(o){let e,i,n,t=-1,l=0;for(let p=0;p<o.length;++p){const r=o[p];if(e===void 0&&(e=r.array.constructor),e!==r.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(i===void 0&&(i=r.itemSize),i!==r.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=r.normalized),n!==r.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(t===-1&&(t=r.gpuType),t!==r.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;l+=r.count*i}const c=new e(l),a=new ae(c,i,n);let u=0;for(let p=0;p<o.length;++p){const r=o[p];if(r.isInterleavedBufferAttribute){const s=u/i;for(let f=0,d=r.count;f<d;f++)for(let y=0;y<i;y++){const x=r.getComponent(f,y);a.setComponent(f+s,y,x)}}else c.set(r.array,u);u+=r.count*i}return t!==void 0&&(a.gpuType=t),a}export{$ as L,ue as a,pe as b,me as m};
