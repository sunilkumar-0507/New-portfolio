export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    float twinkle = 0.6 + 0.4 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 60.0);
    gl_PointSize = uSize * aSize * uPixelRatio * twinkle / depth;
    vColor = aColor;
    // fade out very far particles and those that drift in front of the lens
    vAlpha = smoothstep(32.0, 6.0, depth) * smoothstep(0.6, 2.8, depth) * (0.55 + 0.45 * twinkle);
  }
`

export const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    float a = (pow(glow, 2.4) * 0.75 + core * 0.6) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor * (0.9 + core * 0.9), a);
  }
`
