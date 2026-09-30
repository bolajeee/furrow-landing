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

export default function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectRegion = useRef<(index: number) => void>(() => {});
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
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
    camera.position.set(0, 0, 6.4);

    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function size() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener('resize', size);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const wireGeo = new THREE.SphereGeometry(2.1, 28, 20);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4c7a3f, wireframe: true, transparent: true, opacity: 0.32 });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    const coreGeo = new THREE.SphereGeometry(2.06, 32, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x202e24, transparent: true, opacity: 0.9 });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

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

    // Each region gets two meshes: a small visible pin, and a larger invisible
    // hit-sphere layered on top so clicking/tapping is forgiving on small screens
    // without inflating how big the pin looks. Order matters: index 2*i is always
    // the visible pin for region i, 2*i+1 is its hit-sphere (used below).
    const pinMeshes: THREE.Mesh[] = [];
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xf1ead9 });
    regions.forEach((r, i) => {
      const pos = toVec(r.lat, r.lon, 2.12);

      const geo = new THREE.SphereGeometry(0.045, 10, 10);
      const mesh = new THREE.Mesh(geo, pinMat.clone());
      mesh.position.copy(pos);
      mesh.userData.regionIndex = i;
      globeGroup.add(mesh);
      pinMeshes.push(mesh);

      const hitGeo = new THREE.SphereGeometry(0.13, 8, 8);
      const hitMesh = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.position.copy(pos);
      hitMesh.userData.regionIndex = i;
      globeGroup.add(hitMesh);
      pinMeshes.push(hitMesh);
    });

    // Great-circle-ish arcs connecting consecutive regions, purely decorative.
    const arcMat = new THREE.LineBasicMaterial({ color: 0xf1ead9, transparent: true, opacity: 0.28 });
    for (let i = 0; i < regions.length; i++) {
      const a = toVec(regions[i].lat, regions[i].lon, 2.12);
      const b = toVec(regions[(i + 1) % regions.length].lat, regions[(i + 1) % regions.length].lon, 2.12);
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(2.6);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
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
    paintActive(0);

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
      tooltipHideTimer = setTimeout(hideTooltip, 4200);
    }

    // Rotates the globe so the given region faces the camera. The yaw/pitch
    // formula here is verified against three.js's actual Euler composition
    // (not assumed) — see the project notes if this ever needs revisiting.
    function snapTo(idx: number) {
      if (idx === -1) return;
      paintActive(idx);
      hideTooltip();

      const pos = toVec(regions[idx].lat, regions[idx].lon, 2.12);
      const yaw = Math.atan2(pos.x, pos.z);
      const pitch = Math.atan2(pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
      snapped = true;

      gsap.to(globeGroup.rotation, {
        y: globeGroup.rotation.y + Math.atan2(Math.sin(-yaw - globeGroup.rotation.y), Math.cos(-yaw - globeGroup.rotation.y)),
        x: pitch,
        duration: reduced ? 0 : 1.25,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => showTooltip(idx),
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

    let rafId = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!reduced && !snapped) globeGroup.rotation.y += 0.0018;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('resize', size);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      gsap.killTweensOf(globeGroup.rotation);
      selectRegion.current = () => {};
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
      renderer.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      arcMat.dispose();
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
            <canvas ref={canvasRef} className={styles.canvas} aria-label="Illustrated grower network; explore example regions using the buttons below" role="img" />
            {tooltip.visible && (
              <div className={`${styles.tooltip} ${styles.tooltipVisible}`} style={{ left: tooltip.x, top: tooltip.y }}>
                <div className={styles.tooltipRegion}>{tooltipRegion.name}</div>
                <div className={styles.tooltipComment}>{tooltipRegion.comment}</div>
              </div>
            )}
          </div>

          <div className={styles.globeCopy}>
            <div className="kicker">Local roots. Shared knowledge.</div>
            <h2>A network, not a single feed.</h2>
            <p className="lede">
              A shared season can bring people together. Explore how local growing circles could connect people around their crops and climate.
            </p>

            <p className={styles.exampleNote}>Illustrative community preview. Regions, figures, and conversations shown are examples, not live pilot activity.</p>
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
              <button type="button" className={styles.arrow} aria-label="Previous grower comment" aria-controls="region-comments" onClick={() => goTo(activeRef.current - 1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <div className={styles.statDots}>
              {regions.map((r, i) => (
                <button type="button" key={r.name} className={i === activeIndex ? styles.dotActive : styles.dot} aria-label={`Explore ${r.name}, ${r.country}`} aria-pressed={i === activeIndex} onClick={() => goTo(i)} />
              ))}
              </div>
              <button type="button" className={styles.arrow} aria-label="Next grower comment" aria-controls="region-comments" onClick={() => goTo(activeRef.current + 1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6M16 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
