'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { regions } from './regions';
import styles from './Globe.module.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionIndex: number;
}

// Camera distances: the wide view shows the whole globe while it spins; the near view is
// where it settles once the section is on screen, close enough that the Nigerian city pins
// read as separate points.
const FAR_Z = 6.4;
const NEAR_Z = 4.4;
const PIN_R = 2.12;

// Simplified Nigeria border (lat, lon), clockwise from the Lagos coast. Decorative only.
const NIGERIA_OUTLINE: [number, number][] = [
  [6.37, 2.7], [7.1, 2.72], [8.1, 2.7], [9.05, 2.8], [9.9, 3.4], [10.7, 3.75], [11.7, 3.6],
  [12.5, 4.1], [13.4, 4.15], [13.75, 4.9], [13.55, 6.3], [12.95, 7.8], [13.25, 9.0],
  [13.3, 10.6], [13.25, 12.4], [13.65, 13.3], [13.08, 14.08], [12.3, 14.2], [11.4, 13.9],
  [10.6, 13.5], [10.0, 13.2], [9.1, 12.8], [8.4, 12.2], [7.4, 11.8], [6.7, 11.4],
  [6.45, 10.6], [6.9, 10.1], [6.3, 9.7], [5.5, 9.0], [4.65, 8.55], [4.45, 8.2], [4.35, 7.4],
  [4.3, 6.1], [4.9, 5.4], [5.6, 4.95], [6.2, 4.5], [6.4, 3.6], [6.37, 2.7],
];

// lat/lon -> point on the sphere. Matches the convention used for every pin and arc below.
function toVec(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Static stand-in for browsers or devices where WebGL is unavailable or the context is lost.
// Places the same cities by a flat projection of Nigeria's bounding box.
function GlobeFallback({ activeIndex, onSelect }: { activeIndex: number; onSelect: (index: number) => void }) {
  const project = (lat: number, lon: number) => ({ x: 60 + ((lon - 2.6) / 11.8) * 280, y: 340 - ((lat - 4.2) / 9.8) * 280 });
  const outline = NIGERIA_OUTLINE.map(([lat, lon]) => { const p = project(lat, lon); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
  return (
    <svg className={styles.fallback} viewBox="0 0 400 400" role="img" aria-label="Map of example grower circles in Nigerian cities">
      <circle cx="200" cy="200" r="190" className={styles.fallbackDisc} />
      <polygon points={outline} className={styles.fallbackOutline} />
      {regions.map((r, i) => {
        const p = project(r.lat, r.lon);
        const active = i === activeIndex;
        return (
          <g key={r.name} className={styles.fallbackPin} onClick={() => onSelect(i)}>
            <circle cx={p.x} cy={p.y} r={active ? 7 : 4.5} className={active ? styles.fallbackDotActive : styles.fallbackDot} />
            <text x={p.x + 10} y={p.y + 4} className={styles.fallbackLabel}>{r.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectRegion = useRef<(index: number) => void>(() => {});
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionIndex: 0 });

  function goTo(index: number) {
    const next = (index + regions.length) % regions.length;
    activeRef.current = next;
    setActiveIndex(next);
    selectRegion.current(next);
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, reduced ? NEAR_Z : FAR_Z);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      // No WebGL (disabled, blocklisted GPU, or too many contexts): show the static map
      // instead of an empty dark box.
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Size from the container, not the window: the container can be 0 wide on first paint
    // or change width without a window resize (fonts, grid reflow, orientation), and a
    // canvas sized once at the wrong moment stays blank.
    let hasSize = false;
    function size() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      if (!w || !h) { hasSize = false; return; }
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      hasSize = true;
    }
    size();
    const resizeObserver = new ResizeObserver(size);
    resizeObserver.observe(wrap);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const wireGeo = new THREE.SphereGeometry(2.1, 28, 20);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4c7a3f, wireframe: true, transparent: true, opacity: 0.32 });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    const coreGeo = new THREE.SphereGeometry(2.06, 32, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x202e24, transparent: true, opacity: 0.9 });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const outlineGeo = new THREE.BufferGeometry().setFromPoints(NIGERIA_OUTLINE.map(([lat, lon]) => toVec(lat, lon, 2.105)));
    const outlineMat = new THREE.LineBasicMaterial({ color: 0xa9c392, transparent: true, opacity: 0.55 });
    globeGroup.add(new THREE.Line(outlineGeo, outlineMat));

    // Each region gets two meshes: a small visible pin, and a larger invisible
    // hit-sphere layered on top so clicking/tapping is forgiving on small screens
    // without inflating how big the pin looks. Order matters: index 2*i is always
    // the visible pin for region i, 2*i+1 is its hit-sphere (used below).
    // Sizes are small because the cities sit close together once the camera moves in.
    const pinMeshes: THREE.Mesh[] = [];
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xf1ead9 });
    regions.forEach((r, i) => {
      const pos = toVec(r.lat, r.lon, PIN_R);

      const geo = new THREE.SphereGeometry(0.014, 10, 10);
      const mesh = new THREE.Mesh(geo, pinMat.clone());
      mesh.position.copy(pos);
      mesh.userData.regionIndex = i;
      globeGroup.add(mesh);
      pinMeshes.push(mesh);

      const hitGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const hitMesh = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.position.copy(pos);
      hitMesh.userData.regionIndex = i;
      globeGroup.add(hitMesh);
      pinMeshes.push(hitMesh);
    });

    // Low arcs connecting consecutive regions, purely decorative. The lift scales with the
    // distance between the two cities so short hops stay close to the surface.
    const arcMat = new THREE.LineBasicMaterial({ color: 0xf1ead9, transparent: true, opacity: 0.32 });
    const arcGeos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < regions.length; i++) {
      const a = toVec(regions[i].lat, regions[i].lon, PIN_R);
      const b = toVec(regions[(i + 1) % regions.length].lat, regions[(i + 1) % regions.length].lon, PIN_R);
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(PIN_R + a.distanceTo(b) * 0.35);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      arcGeos.push(arcGeo);
      globeGroup.add(new THREE.Line(arcGeo, arcMat));
    }

    function paintActive(idx: number) {
      pinMeshes.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        if (!mat.visible) return; // skip the invisible hit-spheres
        const isActive = m.userData.regionIndex === idx;
        mat.color.set(isActive ? 0x6e9d5e : 0xf1ead9);
        m.scale.setScalar(isActive ? 1.8 : 1);
      });
      activeRef.current = idx;
      setActiveIndex(idx);
    }
    paintActive(activeRef.current);

    /* ---- click-to-snap: rotate the globe to face a clicked region, show its comment ---- */
    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    let snapped = false;
    let tooltipHideTimer: ReturnType<typeof setTimeout> | null = null;

    function pointerFromEvent(evt: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointerVec.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
      pointerVec.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function pickRegion(evt: MouseEvent): number {
      pointerFromEvent(evt);
      raycaster.setFromCamera(pointerVec, camera);
      const hits = raycaster.intersectObjects(pinMeshes);
      return hits.length ? (hits[0].object.userData.regionIndex as number) : -1;
    }

    function hideTooltip() {
      setTooltip((prev: TooltipState) => (prev.visible ? { ...prev, visible: false } : prev));
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
    }

    function showTooltip(idx: number) {
      const worldPos = new THREE.Vector3();
      pinMeshes[idx * 2].getWorldPosition(worldPos);
      const proj = worldPos.clone().project(camera);
      const rect = wrap!.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: (proj.x * 0.5 + 0.5) * rect.width,
        y: (-proj.y * 0.5 + 0.5) * rect.height,
        regionIndex: idx,
      });
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
      tooltipHideTimer = setTimeout(hideTooltip, 4200);
    }

    // Rotates the globe so the given region faces the camera, and moves the camera in to
    // the near view if it isn't there yet. The yaw/pitch formula here is verified against
    // three.js's actual Euler composition (not assumed) — see the project notes if this
    // ever needs revisiting.
    function snapTo(idx: number, withTooltip = true) {
      if (idx === -1) return;
      paintActive(idx);
      hideTooltip();

      const pos = toVec(regions[idx].lat, regions[idx].lon, PIN_R);
      const yaw = Math.atan2(pos.x, pos.z);
      const pitch = Math.atan2(pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
      snapped = true;

      gsap.to(camera.position, { z: NEAR_Z, duration: reduced ? 0 : 1.6, ease: 'power3.inOut', overwrite: true });
      gsap.to(globeGroup.rotation, {
        y: globeGroup.rotation.y + Math.atan2(Math.sin(-yaw - globeGroup.rotation.y), Math.cos(-yaw - globeGroup.rotation.y)),
        x: pitch,
        duration: reduced ? 0 : 1.25,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => { if (withTooltip) showTooltip(idx); },
      });
    }

    selectRegion.current = snapTo;

    function onClick(evt: MouseEvent) {
      snapTo(pickRegion(evt));
    }
    function onMouseMove(evt: MouseEvent) {
      canvas!.classList.toggle(styles.hoverable, pickRegion(evt) !== -1);
    }

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);

    // three.js recovers from a lost context on its own when the browser restores it. If it
    // doesn't come back (common on low-memory phones), fall back to the static map.
    let lostTimer: ReturnType<typeof setTimeout> | null = null;
    function onContextLost() {
      lostTimer = setTimeout(() => {
        visibility.disconnect();
        cancelAnimationFrame(rafId);
        selectRegion.current = () => {};
        setWebglFailed(true);
      }, 2500);
    }
    function onContextRestored() {
      if (lostTimer) clearTimeout(lostTimer);
    }
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    // Only animate while the section is on screen. The first time it comes into view the
    // globe stops spinning and settles on Nigeria.
    let rafId = 0;
    let onScreen = false;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!hasSize) return;
      if (!reduced && !snapped) globeGroup.rotation.y += 0.0018;
      renderer.render(scene, camera);
    }
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === onScreen) return;
      onScreen = entry.isIntersecting;
      if (onScreen) {
        animate();
        if (!snapped) setTimeout(() => { if (!snapped) snapTo(activeRef.current, false); }, reduced ? 0 : 900);
      } else {
        cancelAnimationFrame(rafId);
      }
    }, { threshold: 0.2 });
    visibility.observe(wrap);

    return () => {
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      cancelAnimationFrame(rafId);
      gsap.killTweensOf(globeGroup.rotation);
      gsap.killTweensOf(camera.position);
      selectRegion.current = () => {};
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
      if (lostTimer) clearTimeout(lostTimer);
      renderer.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      outlineGeo.dispose();
      outlineMat.dispose();
      arcMat.dispose();
      arcGeos.forEach((g) => g.dispose());
      pinMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    };
  }, []);

  const tooltipRegion = regions[tooltip.regionIndex];

  return (
    <div className={styles.globePin} id="globePin">
      <div className={styles.globeStage}>
        <div className={`wrap ${styles.globeGrid}`}>
          <div className={styles.canvasWrap} ref={wrapRef}>
            {webglFailed ? (
              <GlobeFallback activeIndex={activeIndex} onSelect={goTo} />
            ) : (
              <canvas ref={canvasRef} className={styles.canvas} aria-label="Illustrated map of example grower circles in Nigerian cities; explore them using the buttons below" role="img" />
            )}
            {tooltip.visible && !webglFailed && (
              <div className={`${styles.tooltip} ${styles.tooltipVisible}`} style={{ left: tooltip.x, top: tooltip.y }}>
                <div className={styles.tooltipRegion}>{tooltipRegion.name}</div>
                <div className={styles.tooltipComment}>{tooltipRegion.comment}</div>
              </div>
            )}
          </div>

          <div className={styles.globeCopy}>
            <div className="kicker">Local roots. Shared knowledge.</div>
            <h2>Circles close to home.</h2>
            <p className="lede">
              Each circle is a small, invite-only group of households in the same city, growing in the same season and swapping what works on balconies, rooftops, and compounds.
            </p>

            <p className={styles.exampleNote}>Illustrative preview. The cities, circles, and quotes shown are examples, not live pilot activity.</p>
            <div className={styles.statQueue} id="region-comments" aria-live="polite" aria-atomic="true">
              {regions.map((region, index) => <div key={region.name} className={`${styles.statCard} ${index === activeIndex ? styles.cardActive : ''}`} aria-hidden={index !== activeIndex}>
                <div className={styles.statRegion}>
                  {region.name}, {region.country}
                </div>
                <blockquote className={styles.comment}>{region.comment}</blockquote>
                <div className={styles.statHeadline}>{region.headline}</div>
              </div>)}
            </div>
            <div className={styles.controls} onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                goTo(activeRef.current + (event.key === 'ArrowRight' ? 1 : -1));
              }
            }}>
              <button type="button" className={styles.arrow} aria-label="Previous city" aria-controls="region-comments" onClick={() => goTo(activeRef.current - 1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <div className={styles.statDots}>
              {regions.map((r, i) => (
                <button type="button" key={r.name} className={i === activeIndex ? styles.dotActive : styles.dot} aria-label={`Explore ${r.name}, ${r.country}`} aria-pressed={i === activeIndex} onClick={() => goTo(i)} />
              ))}
              </div>
              <button type="button" className={styles.arrow} aria-label="Next city" aria-controls="region-comments" onClick={() => goTo(activeRef.current + 1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6M16 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
