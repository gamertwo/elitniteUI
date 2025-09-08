// app/page.js
"use client";

import { useEffect, useRef, useState } from "react";

/* ========== Math & Core Types ========== */
class Vec3 {
  constructor(x=0,y=0,z=0){ this.x=x; this.y=y; this.z=z; }
  add(v){ return new Vec3(this.x+v.x, this.y+v.y, this.z+v.z); }
  sub(v){ return new Vec3(this.x-v.x, this.y-v.y, this.z-v.z); }
  mul(s){ return (s instanceof Vec3) ? new Vec3(this.x*s.x, this.y*s.y, this.z*s.z) : new Vec3(this.x*s, this.y*s, this.z*s); }
  div(s){ return new Vec3(this.x/s, this.y/s, this.z/s); }
  dot(v){ return this.x*v.x + this.y*v.y + this.z*v.z; }
  cross(v){ return new Vec3(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x); }
  len(){ return Math.hypot(this.x,this.y,this.z); }
  norm(){ const L=this.len()||1; return new Vec3(this.x/L,this.y/L,this.z/L); }
  static mix(a,b,t){ return a.mul(1-t).add(b.mul(t)); }
}
class Ray { constructor(o,d){ this.o=o; this.d=d; } }

const reflect = (I,N) => I.sub(N.mul(2*I.dot(N)));
function refract(I, N, eta) {
  const cosi = Math.max(-1, Math.min(1, I.dot(N)*-1));
  const cost2 = 1 - eta*eta*(1 - cosi*cosi);
  if (cost2 < 0) return null;
  return I.mul(eta).add(N.mul(eta*cosi - Math.sqrt(cost2)));
}
const schlick = (cos, n1, n2) => {
  let r0 = (n1-n2)/(n1+n2); r0 *= r0;
  return r0 + (1-r0)*Math.pow(1-cos,5);
};

/* ========== Materials ========== */
const lambert = ({color=[1,1,1], spec=0.1, shininess=32}={}) =>
  ({ type:"lambert", color:new Vec3(...color), spec, shininess });
const metal = ({color=[0.9,0.9,0.9], reflect=0.9, rough=0.0}={}) =>
  ({ type:"metal", color:new Vec3(...color), reflect, rough:Math.max(0,Math.min(1,rough)) });
const mirror = ({reflect=1.0}={}) =>
  ({ type:"mirror", color:new Vec3(1,1,1), reflect:Math.max(0,Math.min(1,reflect)) });
const glass = ({ior=1.5, tint=[1,1,1], transparency=1.0}={}) =>
  ({ type:"glass", color:new Vec3(...tint), ior, transparency:Math.max(0,Math.min(1,transparency)) });

/* ========== Primitives ========== */
class Sphere {
  constructor(center, radius, material){ this.c=center; this.r=radius; this.m=material; }
  intersect(ray){
    const oc = ray.o.sub(this.c);
    const a = ray.d.dot(ray.d);
    const b = 2 * oc.dot(ray.d);
    const c = oc.dot(oc) - this.r*this.r;
    const disc = b*b - 4*a*c;
    if (disc < 1e-9) return null;
    const s = Math.sqrt(disc);
    let t = (-b - s)/(2*a);
    if (t < 1e-4) t = (-b + s)/(2*a);
    if (t < 1e-4) return null;
    const p = ray.o.add(ray.d.mul(t));
    const n = p.sub(this.c).div(this.r).norm();
    return { t, p, n, m:this.m };
  }
}
class Plane {
  constructor(point, normal, material, checker=null){
    this.p0=point; this.n=normal.norm(); this.m=material; this.checker=checker;
  }
  intersect(ray){
    const denom = this.n.dot(ray.d);
    if (Math.abs(denom) < 1e-6) return null;
    const t = this.p0.sub(ray.o).dot(this.n) / denom;
    if (t < 1e-4) return null;
    const p = ray.o.add(ray.d.mul(t));
    const n = this.n;
    const mat = this.checker ? {...this.m, color: this.checker(p)} : this.m;
    return { t, p, n, m:mat };
  }
}

/* ========== Scene, Camera, Lights ========== */
class PointLight { constructor(position, color=[1,1,1], intensity=1){ this.p=position; this.c=new Vec3(...color); this.i=intensity; } }
class Camera {
  constructor(pos, lookAt, up=new Vec3(0,1,0), fovDeg=60, aspect=16/9){
    this.pos=pos;
    const fwd = lookAt.sub(pos).norm();
    const right = fwd.cross(up).norm();
    const newUp = right.cross(fwd).norm();
    const fov = fovDeg * Math.PI/180;
    this.h = Math.tan(fov/2);
    this.w = this.h * aspect;
    this.fwd=fwd; this.right=right; this.up=newUp;
  }
  rayFor(u, v){
    const dir = this.fwd.add(this.right.mul(u*this.w)).add(this.up.mul(v*this.h)).norm();
    return new Ray(this.pos, dir);
  }
}
class Scene {
  constructor(){
    this.objs=[]; this.lights=[];
    this.bgTop=new Vec3(.7,.85,1); this.bgBot=new Vec3(.02,.02,.04);
  }
  addSphere(pos, r, m){ this.objs.push(new Sphere(new Vec3(...pos), r, m)); }
  addPlane(point, normal, m, checker=null){ this.objs.push(new Plane(new Vec3(...point), new Vec3(...normal), m, checker)); }
  addLight(pos, color=[1,1,1], i=1){ this.lights.push(new PointLight(new Vec3(...pos), color, i)); }
}

/* ========== Renderer (DPR-aware, sharp) ========== */
function trace(scene, ray, depth, opts){
  if (depth > opts.maxDepth) {
    const t = 0.5*(ray.d.y + 1);
    return Vec3.mix(scene.bgBot, scene.bgTop, t);
  }
  let closest=null;
  for (const o of scene.objs){
    const hit=o.intersect(ray);
    if (hit && (!closest || hit.t < closest.t)) closest=hit;
  }
  if (!closest){
    const t = 0.5*(ray.d.y + 1);
    return Vec3.mix(scene.bgBot, scene.bgTop, t);
  }

  let { p, n, m } = closest;
  const eps = 1e-4;
  const view = ray.d.mul(-1).norm();
  const baseColor = m.color || new Vec3(1,1,1);
  let color = new Vec3(0,0,0);

  if (m.type === "lambert" || m.type === "metal"){
    for (const L of scene.lights){
      const toL=L.p.sub(p), dist=toL.len(), ldir=toL.div(dist);
      let inShadow=false;
      if (opts.shadows){
        const shadowRay = new Ray(p.add(n.mul(eps*2)), ldir);
        for (const o of scene.objs){
          const hit=o.intersect(shadowRay);
          if (hit && hit.t < dist-1e-4){ inShadow=true; break; }
        }
      }
      if (!inShadow){
        const ndotl=Math.max(0, n.dot(ldir));
        const diffuse=baseColor.mul(ndotl).mul(L.i).mul(L.c);
        const specPow=(m.shininess ?? 48), specAmt=(m.spec ?? 0.25);
        const h=ldir.add(view).norm();
        const spec=Math.pow(Math.max(0, n.dot(h)), specPow) * specAmt;
        const specular=new Vec3(spec,spec,spec).mul(L.i).mul(L.c);
        color=color.add(diffuse.add(specular));
      }
    }
    color=color.mul(0.9);
  }

  if (opts.reflections && (m.type==="metal"||m.type==="mirror"||m.type==="glass")){
    const reflDir=reflect(ray.d,n).norm();
    let reflRay=new Ray(p.add(n.mul(eps)), reflDir);
    let reflCol=trace(scene, reflRay, depth+1, opts);

    if (m.type==="metal"){
      if (m.rough>0){
        const r1=Math.random()*2-1, r2=Math.random()*2-1, r3=Math.random()*2-1;
        const jitter=new Vec3(r1,r2,r3).norm().mul(m.rough*0.25);
        reflRay=new Ray(p.add(n.mul(eps)), reflDir.add(jitter).norm());
        reflCol=reflCol.mul(0.5).add(trace(scene, reflRay, depth+1, opts).mul(0.5));
      }
      color = color.mul(1-m.reflect).add(reflCol.mul(m.reflect).mul(m.color));
    } else if (m.type==="mirror"){
      color = reflCol.mul(m.reflect);
    } else if (m.type==="glass" && opts.refraction){
      const inside = ray.d.dot(n) > 0;
      const n1 = inside ? m.ior : 1.0;
      const n2 = inside ? 1.0 : m.ior;
      const N  = inside ? n.mul(-1) : n;
      const eta = n1/n2;
      const cosi=Math.max(0, N.dot(view));
      const kr=schlick(cosi, n1, n2);
      let refrCol=new Vec3(0,0,0);
      const refrDir=refract(ray.d, N, eta);
      if (refrDir){
        const refrRay=new Ray(p.add(refrDir.mul(eps)), refrDir.norm());
        refrCol=trace(scene, refrRay, depth+1, opts).mul(m.transparency).mul(m.color);
      }
      color = reflCol.mul(kr).add(refrCol.mul(1-kr));
    }
  }
  return color;
}

/** Renders at true device pixels for crisp output. */
function render(scene, camera, ctx, opts, samples){
  const { width:w, height:h } = ctx.canvas;
  const img = ctx.getImageData(0,0,w,h);
  const data = img.data;

  // tiny stratified grid only if AA>1 (keeps sharpness when AA=1)
  const perSide = Math.round(Math.sqrt(Math.max(1, samples)));
  const totalSamples = perSide*perSide;

  for (let y=0; y<h; y++){
    for (let x=0; x<w; x++){
      let col=new Vec3(0,0,0);

      if (samples <= 1){
        // center-of-pixel sampling (very sharp)
        const u = ((x + 0.5) / w) * 2 - 1;
        const v = ((y + 0.5) / h) * 2 - 1;
        const ray = camera.rayFor(u, -v);
        col = col.add(trace(scene, ray, 0, opts));
      } else {
        // stratified AA (minimal blur)
        for (let sy=0; sy<perSide; sy++){
          for (let sx=0; sx<perSide; sx++){
            const jitterU = (sx + 0.5) / perSide;
            const jitterV = (sy + 0.5) / perSide;
            const u = ((x + jitterU) / w) * 2 - 1;
            const v = ((y + jitterV) / h) * 2 - 1;
            const ray = camera.rayFor(u, -v);
            col = col.add(trace(scene, ray, 0, opts));
          }
        }
        col = col.div(totalSamples);
      }

      // gamma
      const g = 1/2.2;
      const r = Math.pow(Math.max(0, col.x), g);
      const gch = Math.pow(Math.max(0, col.y), g);
      const b = Math.pow(Math.max(0, col.z), g);
      const i = (y*w + x)*4;
      data[i+0] = Math.round(255 * Math.min(1, r));
      data[i+1] = Math.round(255 * Math.min(1, gch));
      data[i+2] = Math.round(255 * Math.min(1, b));
      data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* ========== React Page (DPR-aware canvas) ========== */
export default function Page(){
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Defaults tuned for sharpness
  const [shadows, setShadows] = useState(true);
  const [reflections, setReflections] = useState(true);
  const [refraction, setRefraction] = useState(true);
  const [aa, setAa] = useState(1); // AA=1 is razor sharp with center sampling

  // re-render when settings change or on resize/DPR change
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const renderNow = () => {
      // desired CSS display size
      const displayW = 960;
      const displayH = 540;

      // match CSS size
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;

      // render at true device pixels for sharp output
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const targetW = Math.round(displayW * dpr);
      const targetH = Math.round(displayH * dpr);

      // only resize backing store if needed
      if (canvas.width !== targetW || canvas.height !== targetH){
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // build scene fresh (simple + deterministic)
      const scene = new Scene();

      const checker = (p) => {
        const scale = 0.75;
        const c = (Math.floor(p.x/scale) + Math.floor(p.z/scale)) & 1;
        return c ? new Vec3(0.08,0.08,0.08) : new Vec3(0.92,0.92,0.92);
      };
      scene.addPlane([0,-1,0], [0,1,0], lambert({color:[1,1,1], spec:0}), checker);

      scene.addSphere([0, 0, -3.2], 1.0, glass({ ior:1.5, tint:[0.95,1,1], transparency:1 }));
      scene.addSphere([-2.0, 0.0, -4.5], 1.0, metal({ color:[0.83,0.69,0.22], reflect:0.85, rough:0.08 }));
      scene.addSphere([ 2.2, 0.0, -4.2], 1.0, lambert({ color:[0.9,0.25,0.2], spec:0.2, shininess:48 }));
      scene.addSphere([ 0.2,-0.35,-1.7], 0.35, mirror({ reflect:1.0 }));

      scene.addLight([5, 6, 2], [1.0, 0.95, 0.9], 1.4);
      scene.addLight([-3, 4, -2], [0.7, 0.85, 1.0], 0.9);

      const camera = new Camera(
        new Vec3(0, 0.5, 1.5),
        new Vec3(0, 0, -3),
        new Vec3(0,1,0),
        60,
        canvas.width / canvas.height // aspect from true pixel size
      );

      const opts = { shadows, reflections, refraction, maxDepth: 4 };
      render(scene, camera, ctx, opts, aa);
    };

    // initial + respond to DPR changes
    renderNow();

    // re-render on container resize or DPR changes
    const ro = new ResizeObserver(renderNow);
    ro.observe(container);

    // DPR change listener
    const mq = window.matchMedia(`(resolution: ${Math.round(window.devicePixelRatio || 1)}dppx)`);
    const onChange = () => renderNow();
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      ro.disconnect();
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [shadows, reflections, refraction, aa]);

  return (
    <main style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      background: "radial-gradient(1200px 600px at 50% -100px, rgba(255,255,255,.07), transparent)"
    }}>
      <div ref={containerRef} style={{
        width: "min(1000px, 95vw)",
        padding: "16px 18px 24px",
        borderRadius: 14,
        background: "#111814",
        boxShadow: "0 20px 50px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)",
        color: "white"
      }}>
        <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ fontSize: 18, margin: 0, letterSpacing: ".3px" }}>
            Ray Tracing — Crisp / DPR-aware
          </h1>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
            <label style={chipStyle}>
              <input type="checkbox" checked={shadows} onChange={e=>setShadows(e.target.checked)} />
              Shadows
            </label>
            <label style={chipStyle}>
              <input type="checkbox" checked={reflections} onChange={e=>setReflections(e.target.checked)} />
              Reflections
            </label>
            <label style={chipStyle}>
              <input type="checkbox" checked={refraction} onChange={e=>setRefraction(e.target.checked)} />
              Refraction
            </label>
            <label style={chipStyle}>
              AA&nbsp;
              <select value={aa} onChange={(e)=>setAa(Number(e.target.value))}>
                <option value={1}>1× (sharp)</option>
                <option value={4}>4×</option>
                <option value={9}>9×</option>
              </select>
            </label>
          </div>
        </header>

        <div style={{ marginTop: 12 }}>
          <canvas
            ref={canvasRef}
            // Backing store size is set dynamically; these are just initial values.
            width={960}
            height={540}
            style={{ width: 960, height: 540, borderRadius: 10, display: "block" }}
          />
        </div>

        <p style={{ color: "#cdd5cf" }}>
          It auto-renders at true device pixels for maximum sharpness. Increase the display size or AA for more detail.
        </p>
      </div>
    </main>
  );
}

const chipStyle = {
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,.10)",
};
