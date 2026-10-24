import { useEffect, useRef, memo } from "react";
import { useTheme } from "../context/ThemeContext";

// OriginKit Gauze Blaze "preset=base" default settings
export const GAUZE_BLAZE_PRESET_BASE = {
  background: "#030207",
  baseColor: "#4A4DFF",
  midColor: "#FF2A7E",
  accentColor: "#FF6A1A",
  particles: 400,
  amplitude: 37,
  scale: 89,
  speed: 50,
  pointer: {
    heat: 6,
    stir: 5,
    burst: 6,
  },
  advanced: {
    sheets: 4,
    lineCount: 56,
    ribbonWidth: 12,
    centerY: 50,
    waveLength: 45,
    twistLength: 140,
    lineWidth: 100,
    lineOpacity: 38,
    speckle: 40,
    backDim: 45,
    coreColor: "#FFD36A",
    coreGain: 300,
    edgeGlow: 160,
    glowSize: 24,
    exposure: 300,
    hazeColor: "#1A0A2E",
    haze: 40,
    vignette: 20,
    grain: 0,
    emberSize: 100,
    emberLife: 100,
    emberRise: 5,
    emberDrift: 3,
    travel: 20,
    twistMs: 30000,
    breathe: 15,
    breatheMs: 8000,
    hover: 50,
    pointerLift: 35,
    pointerRadius: 20,
  },
};

// Color parsing helper
const colorCache = new Map();
function parseColor(str, fallback) {
  if (typeof str !== "string") return fallback;
  if (colorCache.has(str)) return colorCache.get(str) ?? fallback;

  let s = str.trim();
  const varMatch = /^var\(\s*--[^,]+,\s*(.+)\)$/.exec(s);
  if (varMatch) s = varMatch[1].trim();

  if (s.startsWith("#")) {
    let hex = s.slice(1);
    const p = (v) => parseInt(v, 16);
    let r, g, b, a = 255;
    if (hex.length === 3 || hex.length === 4) {
      r = p(hex[0] + hex[0]);
      g = p(hex[1] + hex[1]);
      b = p(hex[2] + hex[2]);
      if (hex.length === 4) a = p(hex[3] + hex[3]);
    } else if (hex.length === 6 || hex.length === 8) {
      r = p(hex.slice(0, 2));
      g = p(hex.slice(2, 4));
      b = p(hex.slice(4, 6));
      if (hex.length === 8) a = p(hex.slice(6, 8));
    } else {
      colorCache.set(str, null);
      return fallback;
    }
    const res = [r / 255, g / 255, b / 255, a / 255];
    colorCache.set(str, res);
    return res;
  }

  const rgbMatch = /^(rgba?)\(([^)]*)\)$/i.exec(s);
  if (rgbMatch) {
    const parts = rgbMatch[2].split(/[\s,/]+/).filter(Boolean);
    if (parts.length >= 3) {
      const conv = (v, max) => (v.endsWith("%") ? (parseFloat(v) / 100) * max : parseFloat(v));
      const res = [
        conv(parts[0], 255) / 255,
        conv(parts[1], 255) / 255,
        conv(parts[2], 255) / 255,
        parts.length > 3 ? conv(parts[3], 1) : 1,
      ].map((v) => Math.min(1, Math.max(0, v)));
      colorCache.set(str, res);
      return res;
    }
  }

  colorCache.set(str, null);
  return fallback;
}

// Shader definitions
const encDecGlsl = `
uniform float uStore;
vec3 enc(vec3 c) { return c * uStore; }
vec3 dec(vec3 c) { return c / uStore; }
`;

const commonUniformsGlsl = `
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBase;
uniform vec3 uMid;
uniform vec3 uAccent;
uniform vec3 uCore;
uniform float uScale;
uniform float uAmp;
uniform float uWave;
uniform float uCy;
uniform float uTravel;
uniform float uBreathe;
uniform float uBreatheT;
uniform float uLift;
uniform float uPRad;
uniform float uCoreGain;
uniform float uNow;
uniform vec4 uImp[8];
uniform vec4 uBursts[4];
${encDecGlsl}
const float TAU = 6.2831853;
const float PH[6] = float[6](-2.02, -1.35, -2.75, -0.75, -3.3, -1.75);
const float OFF[6] = float[6](0.0, 0.03, -0.035, 0.05, -0.02, 0.012);
const float WA[6] = float[6](1.0, 0.85, 1.15, 0.75, 0.95, 0.6);
const float LK[6] = float[6](1.0, 0.82, 1.18, 0.9, 1.3, 0.75);
const float SPD[6] = float[6](0.0, -1.0, 1.0, -2.0, 2.0, -1.0);

float h11(float n) {
    uint x = floatBitsToUint(n) * 747796405u + 2891336453u;
    x = ((x >> ((x >> 28u) + 4u)) ^ x) * 277803737u;
    x = (x >> 22u) ^ x;
    return float(x) * (1.0 / 4294967296.0);
}

vec3 ramp(float x) {
    vec3 c = mix(mix(uMid, uAccent, 0.2), uMid, smoothstep(0.0, 0.1, x));
    c = mix(c, mix(uMid, uAccent, 0.6), smoothstep(0.1, 0.22, x));
    c = mix(c, uAccent, smoothstep(0.22, 0.32, x));
    c = mix(c, uMid, smoothstep(0.5, 0.6, x));
    c = mix(c, mix(uMid, uBase, 0.55), smoothstep(0.62, 0.72, x));
    c = mix(c, uBase, smoothstep(0.72, 0.84, x));
    c = mix(c, mix(uBase, uMid, 0.55), exp(-pow((x - 0.9) / 0.06, 2.0)));
    return mix(c, uCore, 0.15 * exp(-pow((x - 0.42) / 0.08, 2.0)));
}

const float RIPPLE_SPEED = 0.45;
const float RIPPLE_WIDTH = 0.07;
const float RIPPLE_DECAY = 1.4;
const float RIPPLE_LIFE = 3.0;

float pull(float xn) { 
    return uHover * exp(-pow((xn - uMouse.x) / max(uPRad, 1e-3), 2.0)); 
}

vec2 spine(float xn, int k, float t) {
    float sc = max(uScale, 0.1);
    float pg = pull(xn);
    float A = uAmp * sc * (1.0 + uBreathe * sin(TAU * t / max(uBreatheT, 0.1))) * (1.0 + 0.3 * pg);
    float lam = max(uWave * sc * LK[k], 0.02);
    float n = max(1.0, uTravel + SPD[k]);
    float w1 = TAU * n / 40.0;
    float w2 = TAU * floor(n * 0.5 + 0.5) / 40.0;
    float w3 = TAU * floor(n * 0.25 + 0.5) / 40.0;
    float ph = PH[k];
    float y = (uCy - 0.5) + OFF[k] * sc + A * WA[k] * (sin(TAU * xn / lam - w1 * t + ph)
        + 0.3 * sin(TAU * xn / (lam * 0.55) + w2 * t + ph * 1.7 + 1.3)
        + 0.6 * sin(TAU * xn / (lam * 2.7) - w3 * t + ph * 0.6 + 0.4));
    y += ((uMouse.y - 0.5) - y) * uLift * pg;
    float z = A * 1.4 * cos(TAU * xn / (lam * 1.3) - w1 * t + ph * 1.3 + float(k));
    for (int j = 0; j < 8; j++) {
        vec4 I = uImp[j];
        float age = uNow - I.z;
        if (I.y == 0.0 || age < 0.0 || age > RIPPLE_LIFE) continue;
        float r = abs(xn - I.x) - age * RIPPLE_SPEED;
        float env = exp(-r * r / (RIPPLE_WIDTH * RIPPLE_WIDTH) - age * RIPPLE_DECAY);
        float ph2 = r * TAU / (RIPPLE_WIDTH * 3.0);
        y += I.y * env * cos(ph2);
        z += I.y * 0.8 * env * sin(ph2 + float(k));
    }
    return vec2(y, z);
}
`;

const ribbonVertexShader = `#version 300 es
precision highp float;
${commonUniformsGlsl}
uniform float uSamples;
uniform float uLines;
uniform float uLineW;
uniform float uLineA;
uniform float uWidth;
uniform float uTwistLen;
uniform float uTwistT;
uniform float uEdge;
uniform float uBack;
uniform float uSpeck;
uniform float uHeat;
out vec3 vCol;

const float WK[6] = float[6](1.0, 0.85, 0.75, 0.95, 0.7, 0.8);
const float SH[6] = float[6](1.0, 0.8, 0.68, 0.58, 0.5, 0.45);
const float TW[6] = float[6](1.15, 2.4, 3.7, 5.0, 0.4, 4.3);
const float TDIR[6] = float[6](1.0, -1.0, 1.0, -1.0, 1.0, -1.0);
const float CAM = 2.2;
const float CURL = 0.6;
const float SHEAR = 0.4;
const float DOT = 1.6;
const float NEON = 0.9;
const float LINE_GAIN = 0.55;
const float GLITTER = 0.03;
const float HEAT_WAVE_SPEED = 0.55;

void main() {
    int ns = int(uSamples);
    int nl = int(uLines);
    int id = gl_VertexID;
    int si = id % ns;
    int rest = id / ns;
    int li = rest % nl;
    int k = rest / nl;
    float t = uTime;
    float fk = float(k);
    float aspect = uRes.x / max(uRes.y, 1.0);
    float px = uRes.y / 800.0;
    float sc = max(uScale, 0.1);

    float u = float(si) / float(max(ns - 1, 1));
    float hs = h11(float(li) * 7.13 + fk * 31.7);
    float s = ((float(li) + 0.5) / float(nl)) * 2.0 - 1.0 + (hs - 0.5) / float(nl);
    float xn = mix(-0.1, 1.1, u);

    vec2 yz = spine(xn, k, t);
    float tl = max(uTwistLen * sc, 0.02);
    float th = TAU * xn / tl + TW[k] + 0.45 * sin(TAU * xn / (tl * 0.63) + fk * 1.9)
        - TAU * t / max(uTwistT, 0.1) * TDIR[k];
    float hw = uWidth * sc * WK[k] * (0.7 + 0.6 * xn);
    float lam = max(uWave * sc * LK[k], 0.02);
    vec3 D = vec3(SHEAR * sin(TAU * xn / (lam * 0.8) + fk * 2.3 - t * 0.35 * TDIR[k]), cos(th), sin(th));
    vec3 N = vec3(0.0, -sin(th), cos(th));
    vec3 P = vec3((xn - 0.5) * aspect, yz.x, yz.y) + hw * (s * D + CURL * (s * s - 0.33) * N);
    P.y += hw * 0.1 * sin(TAU * (xn * 5.0 + s * 0.6) - t * 1.3 + fk * 1.7);
    P.z += hw * 0.25 * sin(TAU * (xn * 3.0 - s * 0.5) + t * 0.9 + fk);

    float persp = CAM / max(CAM - P.z, 0.2);
    vec2 sp = P.xy * persp;
    gl_Position = vec4(sp.x / (aspect * 0.5), sp.y / 0.5, 0.0, 1.0);

    float sx = sp.x / aspect + 0.5;
    float core = exp(-pow((sx - 0.42) / 0.16, 2.0));
    float back = smoothstep(0.0, -0.15 * sc, P.z);
    float gain = mix(1.0, uCoreGain, core);
    vec3 col = mix(ramp(sx), uBase, back * 0.65 * (1.0 - 0.7 * core));

    float neon = li == nl - 1 ? 1.0 : (li == 0 ? 0.45 : 0.0);
    col = mix(col, uCore, neon * core * 0.6);
    float shade = SH[k] * mix(1.0, uBack, back) * gain;
    float b = uLineA * LINE_GAIN * mix(0.55, 1.3, hs) * shade;
    b = max(b, uEdge * NEON * neon * shade);

    float hg = h11(float(id) * 0.6180339 + 3.1);
    float glit = step(hg, uSpeck * GLITTER);
    b *= 1.0 + glit * 5.0 * (0.5 + 0.5 * sin(t * (3.0 + 4.0 * h11(hg * 91.0)) + hg * 400.0));

    vec2 dm = sp - vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
    float reach = max(uPRad * aspect * 0.45, 0.02);
    float heat = uHeat * uHover * exp(-dot(dm, dm) / (reach * reach));
    for (int j = 0; j < 4; j++) {
        vec4 B = uBursts[j];
        float age = uNow - B.z;
        if (B.w <= 0.0 || age < 0.0 || age > 3.0) continue;
        float d = length(sp - vec2((B.x - 0.5) * aspect, B.y - 0.5));
        float ring = d - age * HEAT_WAVE_SPEED;
        heat += B.w * exp(-age * 1.6) * (exp(-ring * ring / 0.004) + exp(-d * d / 0.003 - age * 5.0));
    }
    heat = min(heat, 3.0);
    col = mix(col, uCore, min(heat, 1.0) * 0.75);
    b *= 1.0 + 1.2 * heat;

    float size = DOT * uLineW * px * persp * (1.0 + 0.7 * neon) * (1.0 + 0.6 * glit) * (1.0 + 0.25 * min(heat, 1.0));
    gl_PointSize = max(size, 1.0);
    vCol = enc(col * b);
}
`;

const embersVertexShader = `#version 300 es
precision highp float;
${commonUniformsGlsl}
uniform float uEmberSize;
uniform float uLife;
uniform vec2 uDrift;
out vec3 vCol;

const float BOKEH = 0.07;
const float EMBER = 8.0;

void main() {
    float i = float(gl_VertexID);
    float t = uTime;
    float aspect = uRes.x / max(uRes.y, 1.0);
    float px = uRes.y / 800.0;
    float sc = max(uScale, 0.1);

    float life = mix(1.5, 4.0, h11(i * 1.31 + 0.7)) * max(uLife, 0.05);
    float tt = t / life + h11(i * 2.17 + 0.3);
    float cyc = floor(tt);
    float age = tt - cyc;
    float sd = i * 3.7 + cyc * 17.31;

    float xs = 0.42 + (h11(sd + 1.0) + h11(sd + 2.0) + h11(sd + 3.0) - 1.5) * 0.62;
    float spread = h11(sd + 4.0) + h11(sd + 5.0) - 1.0;
    vec2 yz = spine(xs, int(h11(sd + 9.0) * 3.0), t);
    vec2 pos = vec2((xs - 0.5) * aspect, yz.x + spread * 0.22 * sc)
        + vec2(uDrift.x * aspect, uDrift.y) * age * mix(0.55, 1.0, h11(sd + 6.0));
    vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
    vec2 dm = pos - m;
    float dl = length(dm);
    pos += dm / max(dl, 1e-4) * 0.03 * uHover * exp(-dl * dl / 0.02);
    gl_Position = vec4(pos.x / (aspect * 0.5), pos.y / 0.5, 0.0, 1.0);

    float sx = pos.x / aspect + 0.5;
    float core = exp(-pow((sx - 0.42) / 0.2, 2.0));
    float bokeh = step(1.0 - BOKEH, h11(sd + 8.8));
    float fade = smoothstep(0.0, 0.15, age) * (1.0 - smoothstep(0.55, 1.0, age));
    float twk = 0.65 + 0.35 * sin(t * (5.0 + 6.0 * h11(sd + 1.1)) + h11(sd) * TAU);
    vec3 col = mix(ramp(sx), mix(uAccent, uCore, h11(sd + 5.5)), 0.75 * core);
    float b = EMBER * mix(0.3, 1.0, pow(h11(sd + 3.3), 1.5)) * fade * twk
        * mix(1.0, 0.22, bokeh) * mix(0.55, 1.0, core) * (1.0 - 0.75 * abs(spread));
    gl_PointSize = max(mix(2.4, 5.2, pow(h11(sd + 7.7), 2.0)) * px * uEmberSize * mix(1.0, 3.2, bokeh), 1.0);
    vCol = enc(col * b);
}
`;

const burstsVertexShader = `#version 300 es
precision highp float;
${commonUniformsGlsl}
uniform float uEmberSize;
out vec3 vCol;

const int PER_BURST = 90;
const float DRAG = 2.6;
const float SPARK = 12.0;

void main() {
    int bi = gl_VertexID / PER_BURST;
    float fi = float(gl_VertexID);
    vec4 B = uBursts[bi];
    float age = uNow - B.z;
    float life = mix(0.7, 1.9, h11(fi * 1.7 + B.z));
    if (B.w <= 0.0 || age < 0.0 || age > life) {
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        gl_PointSize = 0.0;
        vCol = vec3(0.0);
        return;
    }
    float aspect = uRes.x / max(uRes.y, 1.0);
    float px = uRes.y / 800.0;
    float ang = TAU * h11(fi * 3.1 + B.z);
    float spd = mix(0.08, 0.5, pow(h11(fi * 5.3 + B.z), 2.0)) * (0.6 + 0.4 * min(B.w, 2.0));
    vec2 dir = vec2(cos(ang), sin(ang) * 0.75);
    vec2 pos = vec2((B.x - 0.5) * aspect, B.y - 0.5)
        + dir * spd * (1.0 - exp(-age * DRAG)) / DRAG + vec2(0.02, 0.07) * age * age;
    gl_Position = vec4(pos.x / (aspect * 0.5), pos.y / 0.5, 0.0, 1.0);

    float k = age / life;
    vec3 col = mix(mix(uCore, uAccent, smoothstep(0.0, 0.5, k)), uMid, smoothstep(0.5, 1.0, k));
    float fade = pow(1.0 - k, 1.5) * smoothstep(0.0, 0.04, age);
    float twk = 0.7 + 0.3 * sin(age * (18.0 + 10.0 * h11(fi)) + fi);
    gl_PointSize = max(mix(2.2, 4.6, h11(fi * 7.7 + B.z)) * px * uEmberSize, 1.0);
    vCol = enc(col * SPARK * fade * twk * min(B.w, 2.0));
}
`;

const pointsFragmentShader = `#version 300 es
precision highp float;
in vec3 vCol;
out vec4 outColor;
void main() {
    vec2 d = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(d, d);
    if (r2 > 1.0) discard;
    outColor = vec4(vCol * exp(-r2 * 4.0), 1.0);
}
`;

const quadVertexShader = `#version 300 es
layout(location = 0) in vec2 aPos;
void main() { 
    gl_Position = vec4(aPos, 0.0, 1.0); 
}
`;

const downsampleFragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uSrcTexel;
uniform vec2 uOutRes;
uniform float uThresh;
${encDecGlsl}
out vec4 outColor;
vec3 hot(vec3 c) {
    float m = max(c.r, max(c.g, c.b));
    return c * max(m - uThresh, 0.0) / max(m, 1e-4);
}
void main() {
    vec2 uv = gl_FragCoord.xy / uOutRes;
    vec2 o = uSrcTexel;
    vec3 c = hot(dec(texture(uSrc, uv + vec2(-o.x, -o.y)).rgb)) + hot(dec(texture(uSrc, uv + vec2(o.x, -o.y)).rgb))
           + hot(dec(texture(uSrc, uv + vec2(-o.x, o.y)).rgb)) + hot(dec(texture(uSrc, uv + vec2(o.x, o.y)).rgb));
    outColor = vec4(enc(c * 0.25), 1.0);
}
`;

const blurFragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uDir;
uniform vec2 uOutRes;
${encDecGlsl}
out vec4 outColor;
void main() {
    vec2 uv = gl_FragCoord.xy / uOutRes;
    vec2 a = uDir * 1.3846153846 / uOutRes;
    vec2 b = uDir * 3.2307692308 / uOutRes;
    vec3 c = dec(texture(uSrc, uv).rgb) * 0.2270270270
        + (dec(texture(uSrc, uv + a).rgb) + dec(texture(uSrc, uv - a).rgb)) * 0.3162162162
        + (dec(texture(uSrc, uv + b).rgb) + dec(texture(uSrc, uv - b).rgb)) * 0.0702702703;
    outColor = vec4(enc(c), 1.0);
}
`;

const compositeFragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloomA;
uniform sampler2D uBloomB;
uniform vec2 uRes;
uniform float uTime;
uniform float uBloom;
uniform float uExposure;
uniform vec3 uBg;
uniform vec3 uHaze;
uniform float uHazeAmt;
uniform float uCy;
uniform float uVig;
uniform float uGrain;
${encDecGlsl}
out vec4 outColor;
const float BLOOM = 1.0;

float h21(vec2 p) { 
    p = fract(p * vec2(123.34, 456.21)); 
    p += dot(p, p + 45.32); 
    return fract(p.x * p.y); 
}

vec3 up(sampler2D s, vec2 uv) {
    vec2 o = 0.5 / vec2(textureSize(s, 0));
    return 0.25 * (dec(texture(s, uv + vec2(-o.x, -o.y)).rgb) + dec(texture(s, uv + vec2(o.x, -o.y)).rgb)
        + dec(texture(s, uv + vec2(-o.x, o.y)).rgb) + dec(texture(s, uv + vec2(o.x, o.y)).rgb));
}

void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec3 L = dec(texelFetch(uScene, ivec2(gl_FragCoord.xy), 0).rgb)
        + uBloom * BLOOM * (0.5 * up(uBloomA, uv) + 0.5 * up(uBloomB, uv));
    float hz = exp(-pow((uv.y - uCy) / 0.16, 2.0)) * (0.5 + 0.7 * exp(-pow((uv.x - 0.45) / 0.3, 2.0)));
    vec3 col = uBg + uHaze * hz * uHazeAmt;
    col += vec3(1.0) - exp(-L * uExposure);
    float vd = length((uv - 0.5) * vec2(aspect, 1.0)) / max(length(vec2(aspect, 1.0) * 0.5), 1e-4);
    col *= 1.0 - uVig * smoothstep(0.35, 1.0, vd);
    float n = h21(gl_FragCoord.xy + fract(uTime * 13.7) * 311.0) - 0.5;
    col += n * (uGrain * 0.18 + 1.0 / 255.0);
    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const MAX_BURSTS = 4;
const MAX_RIPPLES = 8;
const PARTICLES_MULT = 3;
const SPARKS_PER_BURST = 90;
const DOWNSAMPLE_THRESHOLD = 0.1;

function initGauzeBlazeGL(canvas) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const hasFloat = !!gl.getExtension("EXT_color_buffer_float");
  const storeScale = hasFloat ? 1.0 : 0.25;

  const compileProgram = (vsSource, fsSource) => {
    const prog = gl.createProgram();
    for (const [type, src] of [
      [gl.VERTEX_SHADER, vsSource],
      [gl.FRAGMENT_SHADER, fsSource],
    ]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(shader) || "Shader compile failed";
        gl.deleteShader(shader);
        throw new Error(err);
      }
      gl.attachShader(prog, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "Program link failed");
    }

    const uniformMap = new Map();
    return {
      p: prog,
      u: (name) => {
        if (!uniformMap.has(name)) {
          uniformMap.set(name, gl.getUniformLocation(prog, name));
        }
        return uniformMap.get(name) ?? null;
      },
    };
  };

  const ribbonProg = compileProgram(ribbonVertexShader, pointsFragmentShader);
  const embersProg = compileProgram(embersVertexShader, pointsFragmentShader);
  const burstsProg = compileProgram(burstsVertexShader, pointsFragmentShader);
  const downsampleProg = compileProgram(quadVertexShader, downsampleFragmentShader);
  const blurProg = compileProgram(quadVertexShader, blurFragmentShader);
  const compositeProg = compileProgram(quadVertexShader, compositeFragmentShader);

  const emptyVAO = gl.createVertexArray();
  const quadVAO = gl.createVertexArray();
  gl.bindVertexArray(quadVAO);

  const quadVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const createFBO = (w, h) => {
    w = Math.max(1, w);
    h = Math.max(1, h);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      hasFloat ? gl.RGBA16F : gl.RGBA8,
      w,
      h,
      0,
      gl.RGBA,
      hasFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );
    return { tex, fb, w, h };
  };

  let fbos = [];
  const deleteFBOs = () => {
    for (const item of fbos) {
      gl.deleteTexture(item.tex);
      gl.deleteFramebuffer(item.fb);
    }
    fbos = [];
  };

  let curW = 0;
  let curH = 0;
  const updateFBOs = () => {
    if (canvas.width === curW && canvas.height === curH && fbos.length) return;
    deleteFBOs();
    curW = canvas.width;
    curH = canvas.height;
    const f = (scale) => createFBO(Math.ceil(curW / scale), Math.ceil(curH / scale));
    fbos = [f(1), f(2), f(4), f(4), f(8), f(8)];
  };

  const bindTarget = (target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
    gl.viewport(0, 0, target ? target.w : canvas.width, target ? target.h : canvas.height);
  };

  const drawQuad = (progWrap, target, setupUniforms) => {
    bindTarget(target);
    gl.useProgram(progWrap.p);
    gl.uniform1f(progWrap.u("uStore"), storeScale);
    setupUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const setTexUniform = (progWrap, name, unit, texObj) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texObj.tex);
    gl.uniform1i(progWrap.u(name), unit);
  };

  const passDownsample = (srcFBO, dstFBO, thresh = 0) =>
    drawQuad(downsampleProg, dstFBO, () => {
      setTexUniform(downsampleProg, "uSrc", 0, srcFBO);
      gl.uniform1f(downsampleProg.u("uThresh"), thresh);
      gl.uniform2f(downsampleProg.u("uSrcTexel"), 1 / srcFBO.w, 1 / srcFBO.h);
      gl.uniform2f(downsampleProg.u("uOutRes"), dstFBO.w, dstFBO.h);
    });

  const passBlur = (srcFBO, dstFBO, dirX, dirY) =>
    drawQuad(blurProg, dstFBO, () => {
      setTexUniform(blurProg, "uSrc", 0, srcFBO);
      gl.uniform2f(blurProg.u("uDir"), dirX, dirY);
      gl.uniform2f(blurProg.u("uOutRes"), dstFBO.w, dstFBO.h);
    });

  return {
    render: (config, timeSec, mouseX, mouseY, hoverVal, pointerState) => {
      updateFBOs();
      const adv = { ...GAUZE_BLAZE_PRESET_BASE.advanced, ...(config.advanced || {}) };
      const ptr = { ...GAUZE_BLAZE_PRESET_BASE.pointer, ...(config.pointer || {}) };
      const clampVal = (v, def, min, max) =>
        Math.max(min, Math.min(max, typeof v === "number" && Number.isFinite(v) ? v : def));

      const [fboScene, fboHalf, fboQ1, fboQ2, fboE1, fboE2] = fbos;
      const width = canvas.width;
      const height = canvas.height;
      const waveLength = clampVal(adv.waveLength, 45, 5, 200);
      const centerY = 1 - clampVal(adv.centerY, 50, 0, 100) / 100;

      const setupCommonUniforms = (progWrap) => {
        const u = progWrap.u;
        const setVec3 = (name, arr) => gl.uniform3f(u(name), arr[0], arr[1], arr[2]);

        gl.useProgram(progWrap.p);
        gl.uniform1f(u("uStore"), storeScale);
        gl.uniform2f(u("uRes"), width, height);
        gl.uniform1f(u("uTime"), timeSec);
        gl.uniform2f(u("uMouse"), mouseX, mouseY);
        gl.uniform1f(u("uHover"), hoverVal * (clampVal(adv.hover, 50, 0, 100) / 50));

        setVec3("uBase", parseColor(config.baseColor, [0.29, 0.3, 1]));
        setVec3("uMid", parseColor(config.midColor, [1, 0.16, 0.49]));
        setVec3("uAccent", parseColor(config.accentColor, [1, 0.42, 0.1]));
        setVec3("uCore", parseColor(adv.coreColor, [1, 0.83, 0.42]));

        gl.uniform1f(u("uScale"), clampVal(config.scale, 89, 10, 300) / 100);
        gl.uniform1f(u("uAmp"), (clampVal(config.amplitude, 37, 0, 100) / 50) * 0.07);
        gl.uniform1f(u("uWave"), waveLength / 100);
        gl.uniform1f(u("uCy"), centerY);
        gl.uniform1f(
          u("uTravel"),
          Math.max(1, Math.round((clampVal(adv.travel, 20, 0, 50) * 40) / waveLength))
        );
        gl.uniform1f(u("uBreathe"), clampVal(adv.breathe, 15, 0, 100) / 100);
        gl.uniform1f(u("uBreatheT"), clampVal(adv.breatheMs, 8000, 500, 60000) / 1000);
        gl.uniform1f(u("uLift"), clampVal(adv.pointerLift, 35, 0, 100) / 100);
        gl.uniform1f(u("uPRad"), clampVal(adv.pointerRadius, 20, 2, 100) / 100);
        gl.uniform1f(u("uCoreGain"), clampVal(adv.coreGain, 300, 50, 400) / 100);
        gl.uniform1f(u("uNow"), pointerState.now);
        gl.uniform4fv(u("uImp"), pointerState.ripples);
        gl.uniform4fv(u("uBursts"), pointerState.bursts);
      };

      // 1. Draw ribbon points to full-res scene buffer
      bindTarget(fboScene);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindVertexArray(emptyVAO);

      const clientW = canvas.clientWidth || width;
      // High-resolution sampling with mobile throttling
      const samplesCount = Math.round(Math.max(160, Math.min(1800, clientW * 1.1)));
      const sheetsCount = Math.round(clampVal(adv.sheets, 4, 1, 6));
      const lineCount = Math.round(clampVal(adv.lineCount, 56, 4, 200));

      setupCommonUniforms(ribbonProg);
      {
        const u = ribbonProg.u;
        gl.uniform1f(u("uSamples"), samplesCount);
        gl.uniform1f(u("uLines"), lineCount);
        gl.uniform1f(u("uLineW"), clampVal(adv.lineWidth, 100, 20, 400) / 100);
        gl.uniform1f(u("uLineA"), clampVal(adv.lineOpacity, 38, 0, 100) / 100);
        gl.uniform1f(u("uWidth"), clampVal(adv.ribbonWidth, 12, 2, 60) / 100);
        gl.uniform1f(u("uTwistLen"), clampVal(adv.twistLength, 140, 5, 300) / 100);
        gl.uniform1f(u("uTwistT"), clampVal(adv.twistMs, 30000, 500, 60000) / 1000);
        gl.uniform1f(u("uEdge"), clampVal(adv.edgeGlow, 160, 0, 300) / 100);
        gl.uniform1f(u("uBack"), clampVal(adv.backDim, 45, 0, 100) / 100);
        gl.uniform1f(u("uSpeck"), clampVal(adv.speckle, 40, 0, 100) / 100);
        gl.uniform1f(u("uHeat"), clampVal(ptr.heat, 6, 0, 10) / 5);
      }
      gl.drawArrays(gl.POINTS, 0, sheetsCount * lineCount * samplesCount);

      // 2. Drifting Embers pass
      const totalParticles = Math.round(clampVal(config.particles, 400, 0, 400)) * PARTICLES_MULT;
      if (totalParticles > 0) {
        setupCommonUniforms(embersProg);
        const u = embersProg.u;
        gl.uniform1f(u("uEmberSize"), clampVal(adv.emberSize, 100, 10, 400) / 100);
        gl.uniform2f(
          u("uDrift"),
          clampVal(adv.emberDrift, 3, 0, 10) / 100,
          clampVal(adv.emberRise, 5, 0, 10) / 100
        );
        gl.uniform1f(u("uLife"), clampVal(adv.emberLife, 100, 20, 400) / 100);
        gl.drawArrays(gl.POINTS, 0, totalParticles);
      }

      // 3. Click Bursts / Sparks pass
      const hasActiveBursts = pointerState.bursts.some((v, idx) => idx % 4 === 3 && v > 0);
      if (hasActiveBursts) {
        setupCommonUniforms(burstsProg);
        gl.uniform1f(burstsProg.u("uEmberSize"), clampVal(adv.emberSize, 100, 10, 400) / 100);
        gl.drawArrays(gl.POINTS, 0, MAX_BURSTS * SPARKS_PER_BURST);
      }

      gl.disable(gl.BLEND);
      gl.bindVertexArray(quadVAO);

      // 4. Downsampling and Bloom blur passes
      const glowScale = clampVal(adv.glowSize, 24, 1, 40) / 24;
      passDownsample(fboScene, fboHalf, DOWNSAMPLE_THRESHOLD);
      passDownsample(fboHalf, fboQ1);
      passDownsample(fboQ1, fboE1);

      passBlur(fboQ1, fboQ2, glowScale, 0);
      passBlur(fboQ2, fboQ1, 0, glowScale);

      passBlur(fboE1, fboE2, glowScale, 0);
      passBlur(fboE2, fboE1, 0, glowScale);

      passBlur(fboE1, fboE2, glowScale * 1.6, 0);
      passBlur(fboE2, fboE1, 0, glowScale * 1.6);

      // 5. Final Composite & Tone Mapping pass
      drawQuad(compositeProg, null, () => {
        const u = compositeProg.u;
        const bg = parseColor(config.background, [0.01, 0.01, 0.03]);
        const haze = parseColor(adv.hazeColor, [0.1, 0.04, 0.18]);

        setTexUniform(compositeProg, "uScene", 0, fboScene);
        setTexUniform(compositeProg, "uBloomA", 1, fboQ1);
        setTexUniform(compositeProg, "uBloomB", 2, fboE1);

        gl.uniform2f(u("uRes"), width, height);
        gl.uniform1f(u("uTime"), timeSec);
        gl.uniform1f(u("uBloom"), clampVal(adv.edgeGlow, 160, 0, 300) / 100);
        gl.uniform1f(u("uExposure"), clampVal(adv.exposure, 300, 10, 500) / 100);
        gl.uniform3f(u("uBg"), bg[0], bg[1], bg[2]);
        gl.uniform3f(u("uHaze"), haze[0], haze[1], haze[2]);
        gl.uniform1f(u("uHazeAmt"), clampVal(adv.haze, 40, 0, 200) / 100);
        gl.uniform1f(u("uCy"), centerY);
        gl.uniform1f(u("uVig"), clampVal(adv.vignette, 20, 0, 100) / 100);
        gl.uniform1f(u("uGrain"), clampVal(adv.grain, 0, 0, 100) / 100);
      });
    },

    dispose: () => {
      deleteFBOs();
      for (const progWrap of [
        ribbonProg,
        embersProg,
        burstsProg,
        downsampleProg,
        blurProg,
        compositeProg,
      ]) {
        gl.deleteProgram(progWrap.p);
      }
      gl.deleteBuffer(quadVBO);
      gl.deleteVertexArray(emptyVAO);
      gl.deleteVertexArray(quadVAO);
    },
  };
}

const RIPPLE_MIN_INTERVAL = 0.07;
const RIPPLE_MIN_VELOCITY = 0.15;
const RIPPLE_MAX_AMP = 0.07;
const BURST_KICK = 0.045;

const GauzeBlaze = memo(({ className = "", options = {} }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();

  const config = {
    ...GAUZE_BLAZE_PRESET_BASE,
    ...options,
    // When in dark mode, deep cosmic background matching slate-950/OriginKit
    // When in light mode, adjust background cleanly
    background: darkMode ? (options.background || "#030207") : "#f8fafc",
  };

  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let glInstance = null;
    try {
      glInstance = initGauzeBlazeGL(canvas);
    } catch (err) {
      console.warn("WebGL2 GauzeBlaze could not be initialized:", err);
      return;
    }
    if (!glInstance) return;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(container.offsetWidth * dpr));
      const h = Math.max(1, Math.round(container.offsetHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Global pointer & burst tracking
    let smoothMouseX = 0.5;
    let smoothMouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let targetHover = 0;
    let smoothHover = 0;

    const startTime = performance.now();
    const pointerState = {
      now: 0,
      ripples: new Float32Array(MAX_RIPPLES * 4),
      bursts: new Float32Array(MAX_BURSTS * 4),
    };
    let rippleIdx = 0;
    let burstIdx = 0;
    let lastRippleTime = -1;

    const pushRipple = (x, height) => {
      pointerState.ripples.set([x, height, pointerState.now, 0], rippleIdx * 4);
      rippleIdx = (rippleIdx + 1) % MAX_RIPPLES;
    };

    const updatePointerPos = (e) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = 1 - (e.clientY - rect.top) / rect.height;
      return true;
    };

    const handlePointerMove = (e) => {
      if (updatePointerPos(e)) {
        targetHover = 1;
      }
    };

    const handlePointerLeave = () => {
      targetHover = 0;
    };

    const handlePointerDown = (e) => {
      if (!updatePointerPos(e)) return;
      targetHover = 1;
      const ptr = { ...GAUZE_BLAZE_PRESET_BASE.pointer, ...(configRef.current.pointer || {}) };
      const burstStrength = Math.max(0, Math.min(10, ptr.burst ?? 6)) / 5;
      if (burstStrength > 0) {
        pointerState.bursts.set(
          [targetMouseX, targetMouseY, pointerState.now, burstStrength],
          burstIdx * 4
        );
        burstIdx = (burstIdx + 1) % MAX_BURSTS;
        pushRipple(targetMouseX, BURST_KICK * burstStrength);
      }
    };

    // Attach to window so moving anywhere or clicking buttons still produces ripples/heat/sparks
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    let prevMouseX = targetMouseX;
    let prevMouseY = targetMouseY;
    let animTimeSec = 0;
    let animFrameId = 0;
    let lastFrameTime = -1;

    const loop = (timestamp) => {
      animFrameId = requestAnimationFrame(loop);
      const dt = lastFrameTime < 0 ? 0 : Math.min((timestamp - lastFrameTime) / 1000, 0.05);
      lastFrameTime = timestamp;

      if (!isVisible) return;

      const currentConfig = configRef.current;
      const speedNorm = (Math.max(0, Math.min(100, currentConfig.speed ?? 50)) / 50) * (reducedMotion ? 0.25 : 1);
      animTimeSec = (animTimeSec + dt * speedNorm) % 3600;

      // Pointer smoothing
      const damp = 1 - Math.exp(-dt * 6);
      smoothMouseX += (targetMouseX - smoothMouseX) * damp;
      smoothMouseY += (targetMouseY - smoothMouseY) * damp;
      smoothHover += (targetHover - smoothHover) * damp;
      pointerState.now = (timestamp - startTime) / 1000;

      // Calculate pointer speed and trigger ripples along ribbon
      const velX = dt > 0 ? (targetMouseX - prevMouseX) / dt : 0;
      const velY = dt > 0 ? (targetMouseY - prevMouseY) / dt : 0;
      prevMouseX = targetMouseX;
      prevMouseY = targetMouseY;

      const ptr = { ...GAUZE_BLAZE_PRESET_BASE.pointer, ...(currentConfig.pointer || {}) };
      const stirGain = Math.max(0, Math.min(10, ptr.stir ?? 5)) / 5;

      if (
        targetHover &&
        stirGain > 0 &&
        pointerState.now - lastRippleTime > RIPPLE_MIN_INTERVAL &&
        Math.hypot(velX, velY) > RIPPLE_MIN_VELOCITY
      ) {
        const centerY = 1 - Math.max(0, Math.min(100, currentConfig.advanced?.centerY ?? 50)) / 100;
        const kick = (velY * 0.02 + Math.abs(velX) * 0.008 * (targetMouseY > centerY ? 1 : -1)) * stirGain;
        pushRipple(targetMouseX, Math.max(-RIPPLE_MAX_AMP, Math.min(RIPPLE_MAX_AMP, kick)));
        lastRippleTime = pointerState.now;
      }

      glInstance.render(
        currentConfig,
        animTimeSec,
        smoothMouseX,
        smoothMouseY,
        smoothHover,
        pointerState
      );
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      glInstance.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${
        darkMode ? "opacity-100" : "opacity-35"
      } ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
});

GauzeBlaze.displayName = "GauzeBlaze";

export default GauzeBlaze;
