'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 861px) and (min-height: 740px)', reduced: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 860px), (max-height: 739px)' }, (context) => {
      const hero = heroRef.current;
      if (!hero || context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      const stem = hero.querySelector<SVGPathElement>('[data-stem]')!;
      const length = stem.getTotalLength();
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: desktop ? hero : hero.querySelector('[data-journal]'),
        start: desktop ? 'top top' : 'top 65%',
        end: desktop ? () => `+=${window.innerHeight * 0.65}` : 'center 45%',
        pin: desktop ? hero : false, scrub: 0.65, invalidateOnRefresh: true,
      } });
      timeline.fromTo('[data-seed]', { opacity: 1 }, { opacity: 0, duration: 0.18 }, 0)
        .fromTo(stem, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.65, ease: 'none' }, 0)
        .fromTo('[data-leaf]', { scale: 0, opacity: 0, svgOrigin: '276 290' }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.25, ease: 'power2.out' }, 0.22)
        .fromTo('[data-flower]', { scale: 0.25, opacity: 0, svgOrigin: '274 151' }, { scale: 1, opacity: 1, duration: 0.2 }, 0.6)
        .fromTo('[data-petal]', { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.25, stagger: 0.035, ease: 'power2.out' }, 0.68);
    }, heroRef);
    return () => media.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-heading">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}><span /> A little knowledge. A better harvest.</div>
          <h1 id="hero-heading">
            <span className={styles.line}><span style={{ '--i': 0 } as React.CSSProperties}>Good things</span></span>
            <span className={styles.line}><span style={{ '--i': 1 } as React.CSSProperties}>start with</span></span>
            <span className={styles.line}><span style={{ '--i': 2 } as React.CSSProperties}><em>what you know.</em></span></span>
          </h1>
          <p>Your first home harvest, planned around a busy week. Furrow fits a weekly plan to the time you have, starts with containers you already own, keeps pots watered while you&rsquo;re away, and puts a circle of growers near you in your corner.</p>
          <div className="heroActions">
            <a className="btnPrimary" href="#start">Join the pilot <span aria-hidden="true">↗</span></a>
            <a className={styles.secondary} href="#how">Discover Furrow <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.note}>Works in your phone&rsquo;s browser, no app store needed. Pilot starting in Nigeria.</div>
        </div>
        <div className={styles.visual} data-journal>
          <div className={styles.visualTop}><span>THE GROWING JOURNAL</span><span>01 / A NEW SEASON</span></div>
          <svg className={styles.landscape} viewBox="0 0 560 500" fill="none" role="img" aria-label="A seedling growing above curved rows of farmland in the morning sun">
            <defs>
              <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#e9e9cf" /><stop offset="1" stopColor="#c7d1ad" /></linearGradient>
              <linearGradient id="field" x2="0" y2="1"><stop stopColor="#7e9062" /><stop offset="1" stopColor="#384f37" /></linearGradient>
            </defs>
            <path fill="url(#sky)" d="M0 0h560v500H0z" />
            <circle cx="416" cy="116" r="53" fill="#f8e6a8" />
            <circle cx="416" cy="116" r="72" stroke="#f6eac7" strokeOpacity=".5" />
            <path d="M0 285Q130 198 310 285T560 275V500H0Z" fill="#a4b08a" />
            <path d="M0 330Q240 208 560 335V500H0Z" fill="url(#field)" />
            {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${-230 + i * 115} 510Q${60 + i * 50} 330 345 298`} stroke="#b8c398" strokeWidth="2" opacity=".4" />)}
            <ellipse cx="275" cy="348" rx="53" ry="9" fill="#263f2d" opacity=".22" />
            <ellipse data-seed cx="276" cy="342" rx="7" ry="10" fill="#a17a43" opacity="0" />
            <path data-stem d="M276 347C270 300 286 258 271 206C268 182 274 168 274 151" stroke="#2e5135" strokeWidth="6" strokeLinecap="round" />
            <g data-leaf><path d="M277 291C225 293 204 267 202 235C246 236 275 256 277 291Z" fill="#3d6241" /><path d="M210 244L274 287" stroke="#94aa74" strokeWidth="1.5" /></g>
            <g data-leaf><path d="M277 258C321 258 349 226 346 194C305 196 279 221 277 258Z" fill="#547548" /><path d="M337 204L280 252" stroke="#94aa74" strokeWidth="1.5" /></g>
            <g data-leaf><path d="M273 218C236 209 228 180 235 156C264 164 280 189 273 218Z" fill="#3d6241" /></g>
            <g data-flower>
              {[0, 60, 120, 180, 240, 300].map(angle => <g key={angle} transform={`translate(274 151) rotate(${angle})`}><ellipse data-petal cx="0" cy="-18" rx="10" ry="21" fill="#fff8df" stroke="#d5cba3" strokeWidth="1" /></g>)}
              <circle cx="274" cy="151" r="11" fill="#b58b43" /><circle cx="272" cy="148" r="4" fill="#d9b75f" />
            </g>
          </svg>
          <div className={styles.journal}>
            <div className={styles.journalIcon} aria-hidden="true">✳</div>
            <div><span className={styles.journalLabel}>SMALL STEPS, STRONGER ROOTS</span><h2>Your next season starts here.</h2><p>Learn a little. Put it into practice. Keep growing.</p></div>
          </div>
          <div className={styles.caption}><span>Rooted in local knowledge</span><span className={styles.growCue}>Scroll to grow ↓</span></div>
        </div>
      </div>
      <div className={`wrap ${styles.promise}`}>
        <span className={styles.promiseLead}>A companion for every step</span>
        <span><b aria-hidden="true">01</b>Plan around your week</span>
        <span><b aria-hidden="true">02</b>Start with what you own</span>
        <span><b aria-hidden="true">03</b>Grow with your circle</span>
      </div>
    </section>
  );
}

