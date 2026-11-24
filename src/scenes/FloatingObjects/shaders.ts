// Ashima / Stefan Gustavson 3D simplex noise (MIT).
const simplex = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`

/* ----------------------------------------------------------- liquid orb */

export const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisp;
  ${simplex}

  float field(vec3 p){
    return snoise(p * 1.25 + vec3(0.0, uTime * 0.32, 0.0)) * 0.75
         + snoise(p * 2.9 - vec3(uTime * 0.45)) * 0.25;
  }

  void main(){
    vec3 p = position;
    float d = field(normalize(p)) * uAmp;
    vec3 displaced = p + normal * d;

    // Recompute the normal from neighbouring displaced points (finite differences).
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
    vec3 bitangent = normalize(cross(normal, tangent));
    float e = 0.012;
    vec3 pa = p + tangent * e;
    vec3 pb = p + bitangent * e;
    vec3 da = pa + normalize(pa) * field(normalize(pa)) * uAmp;
    vec3 db = pb + normalize(pb) * field(normalize(pb)) * uAmp;
    vec3 n = normalize(cross(da - displaced, db - displaced));
    if (dot(n, normal) < 0.0) n = -n;

    vDisp = d;
    vNormal = normalize(normalMatrix * n);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

export const orbFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vDisp;

  void main(){
    vec3 n = normalize(vNormal);
    vec3 v = normalize(-vViewPos);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);

    vec3 col = mix(uColorB, uColorA, smoothstep(-0.25, 0.35, vDisp) * 0.75 + fres * 0.5);
    float bands = sin(vDisp * 22.0 - uTime * 1.4) * 0.5 + 0.5;
    col += uColorA * pow(bands, 6.0) * 0.25;

    vec3 l1 = normalize(vec3(-0.5, 0.8, 0.7));
    vec3 l2 = normalize(vec3(0.8, -0.2, 0.4));
    float spec = pow(max(dot(n, normalize(l1 + v)), 0.0), 90.0);
    float spec2 = pow(max(dot(n, normalize(l2 + v)), 0.0), 30.0);
    col += vec3(1.0) * spec * 1.1 + uColorA * spec2 * 0.5;
    col += vec3(0.62, 0.86, 0.26) * fres * 0.6; // lime rim, like the logo's green panel

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

/* ----------------------------------------------------------- background */

export const bgVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

export const bgFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uGlow;
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform float uHue;
  varying vec2 vUv;
  ${simplex}

  float fbm(vec3 p){
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++){ s += a * snoise(p); p *= 2.03; a *= 0.5; }
    return s;
  }

  void main(){
    float aspect = uRes.x / uRes.y;
    vec2 p = vUv; p.x *= aspect;
    vec2 g = uGlow; g.x *= aspect;

    float n = fbm(vec3(p * 1.6, uTime * 0.045));
    float d = length(p - g + n * 0.12);
    float glow = exp(-d * d * 2.6) * (0.6 + n * 0.55);

    vec2 m = uMouse * 0.5 + 0.5; m.x *= aspect;
    float md = length(p - m);
    float mg = exp(-md * md * 10.0) * 0.22;

    // Brand nebula: violet ↔ cobalt drifting across the frame, lime under the cursor.
    vec3 violet = vec3(0.545, 0.247, 0.851);
    vec3 cobalt = vec3(0.122, 0.357, 0.878);
    vec3 lime = vec3(0.608, 0.761, 0.227);
    float side = smoothstep(0.1, 0.9, vUv.x + n * 0.35 + (uHue - 0.15) * 0.8);
    vec3 red = mix(violet, cobalt, side);
    vec3 base = vec3(0.0196);
    vec3 col = base + red * glow * 0.34 * uIntensity + lime * mg * 0.8 * uIntensity;

    // faint horizon line of light
    float horizon = exp(-pow((vUv.y - 0.18 - n * 0.04) * 9.0, 2.0)) * 0.05;
    col += mix(lime, cobalt, vUv.x) * horizon * uIntensity;

    float vig = smoothstep(1.2, 0.2, length((vUv - 0.5) * vec2(1.15, 1.35)));
    col *= mix(0.45, 1.0, vig);

    // sRGB → linear so the renderer / composer encode it back correctly
    gl_FragColor = vec4(pow(col, vec3(2.2)), 1.0);
    #include <colorspace_fragment>
  }
`
