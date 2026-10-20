'use client';

import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';

// "furrow." outlines from Newsreader (wght 400, 2000 upm), letter-spacing -.07em baked in.
const WORD = 'M259 692 218 716 44 685V648L233 585L277 589H664L649 692ZM373 1376 547 1423V1470H64V1423L218 1376V547Q218 412 261 315.5Q304 219 377.5 158.5Q451 98 542 69Q633 40 729 40Q786 40 826 48.5Q866 57 891 72Q916 87 927 106.5Q938 126 938 148Q938 191 909.5 217.5Q881 244 839 244Q808 244 786 229Q764 214 742.5 194Q721 174 692.5 158.5Q664 143 621 143Q554 143 498 172Q442 201 407.5 268.5Q373 336 373 450ZM882 1176Q882 1237 899.5 1273.5Q917 1310 959 1326Q1001 1342 1073 1342Q1141 1342 1205.5 1318Q1270 1294 1301 1258L1335 1297Q1278 1353 1232.5 1390.5Q1187 1428 1147 1450Q1107 1472 1065.5 1481Q1024 1490 975 1490Q848 1490 788 1413Q728 1336 728 1183V698L579 637V588L893 575L882 694ZM1313 1487 1288 1305V698L1141 637V588L1455 575L1444 694V1313Q1453 1322 1469.5 1332Q1486 1342 1505.5 1352Q1525 1362 1544.5 1369Q1564 1376 1580 1379V1411L1336 1487ZM2147 575Q2197 575 2221.5 600Q2246 625 2246 666Q2246 714 2219 742.5Q2192 771 2146 771Q2120 771 2093.5 763.5Q2067 756 2039 749Q2011 742 1979 742Q1956 742 1929 748Q1902 754 1875 765.5Q1848 777 1827 793L1803 758Q1867 709 1918 674.5Q1969 640 2011 618Q2053 596 2086.5 585.5Q2120 575 2147 575ZM1850 757V1376L2010 1423V1470H1540V1423L1695 1376V780Q1682 767 1660 755Q1638 743 1608 729.5Q1578 716 1541 702V674L1808 568H1832ZM2795 575Q2845 575 2869.5 600Q2894 625 2894 666Q2894 714 2867 742.5Q2840 771 2794 771Q2768 771 2741.5 763.5Q2715 756 2687 749Q2659 742 2627 742Q2604 742 2577 748Q2550 754 2523 765.5Q2496 777 2475 793L2451 758Q2515 709 2566 674.5Q2617 640 2659 618Q2701 596 2734.5 585.5Q2768 575 2795 575ZM2498 757V1376L2658 1423V1470H2188V1423L2343 1376V780Q2330 767 2308 755Q2286 743 2256 729.5Q2226 716 2189 702V674L2456 568H2480ZM3306 1401Q3387 1401 3449 1364Q3511 1327 3545.5 1250Q3580 1173 3580 1054Q3580 924 3546.5 836.5Q3513 749 3451.5 703.5Q3390 658 3304 658Q3223 658 3161.5 695Q3100 732 3065 809Q3030 886 3030 1006Q3030 1134 3063.5 1222.5Q3097 1311 3159 1356Q3221 1401 3306 1401ZM3301 1490Q3169 1490 3069 1433Q2969 1376 2914 1273.5Q2859 1171 2859 1038Q2859 901 2917 795Q2975 689 3076.5 629Q3178 569 3309 569Q3442 569 3541.5 626.5Q3641 684 3696.5 785.5Q3752 887 3752 1021Q3752 1158 3694 1264Q3636 1370 3534.5 1430Q3433 1490 3301 1490ZM4947 678 4813 640V589H5149V640L5039 677L4786 1490H4714L4416 752L4460 751L4161 1490H4089L3829 688L3700 640V589H4125V640L3990 683L4191 1312H4148L4445 569H4505L4804 1307H4764Z';
const DOT = 'M5267 1234Q5323 1234 5358.5 1269.5Q5394 1305 5394 1359Q5394 1412 5358.5 1448Q5323 1484 5267 1484Q5212 1484 5176 1448Q5140 1412 5140 1359Q5140 1305 5176 1269.5Q5212 1234 5267 1234Z';
const CONTOURS = WORD.split(/(?=M)/);

const BALLS = 4;
const TRAIL = 7;        // trailing sparks per ball
const LAP_SECONDS = 120; // time for one ball to trace the whole word
const FADE = 140;       // font units to fade in/out when hopping between contours
const SVG_NS = 'http://www.w3.org/2000/svg';

export default function FooterMark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGGElement>(null);
  const ballsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current!;
    const paths = Array.from(measureRef.current!.querySelectorAll('path'));
    const lengths = paths.map((p) => p.getTotalLength());
    const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
    const total = lengths.reduce((a, b) => a + b, 0);

    // One core + halo per trail step, newest first.
    const layer = ballsRef.current!;
    const dots: { core: SVGCircleElement; halo: SVGCircleElement }[][] = [];
    for (let b = 0; b < BALLS; b++) {
      const trail = [];
      for (let k = 0; k < TRAIL; k++) {
        const halo = document.createElementNS(SVG_NS, 'circle');
        const core = document.createElementNS(SVG_NS, 'circle');
        halo.setAttribute('class', styles.halo);
        core.setAttribute('class', styles.core);
        layer.append(halo, core);
        trail.push({ core, halo });
      }
      dots.push(trail);
    }

    // Keep ball size constant in screen pixels regardless of logo scale.
    let unitsPerPx = 1;
    const sizeBalls = () => {
      const ctm = svg.getScreenCTM();
      if (ctm && ctm.a) unitsPerPx = 1 / ctm.a;
    };
    sizeBalls();
    window.addEventListener('resize', sizeBalls);

    const place = (s: number, el: { core: SVGCircleElement; halo: SVGCircleElement }, k: number) => {
      s = ((s % total) + total) % total;
      let i = 0;
      while (i < starts.length - 1 && s >= starts[i + 1]) i++;
      const local = s - starts[i];
      const edge = Math.min(local, lengths[i] - local);
      const fade = Math.min(1, edge / FADE);
      const tail = 1 - k / TRAIL;
      const pt = paths[i].getPointAtLength(local);
      const r = unitsPerPx * (2.6 * tail + 0.6);
      el.core.setAttribute('cx', `${pt.x}`);
      el.core.setAttribute('cy', `${pt.y}`);
      el.core.setAttribute('r', `${r}`);
      el.core.style.opacity = `${fade * tail}`;
      el.halo.setAttribute('cx', `${pt.x}`);
      el.halo.setAttribute('cy', `${pt.y}`);
      el.halo.setAttribute('r', `${r * 4.5}`);
      el.halo.style.opacity = `${fade * tail * (k === 0 ? 1 : 0.35)}`;
    };

    const speed = total / LAP_SECONDS;
    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      const head = (now / 1000) * speed;
      const spacing = unitsPerPx * 7; // ~7px between trail sparks
      for (let b = 0; b < BALLS; b++) {
        const s = head + (b * total) / BALLS;
        for (let k = 0; k < TRAIL; k++) place(s - k * spacing, dots[b][k], k);
      }
      raf = requestAnimationFrame(frame);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = () => { if (!running && !reduce.matches) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // Only animate while the footer is on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(svg);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', sizeBalls);
      layer.replaceChildren();
    };
  }, []);

  return (
    <svg ref={svgRef} className={styles.mark} viewBox="0 20 5420 1490" aria-hidden="true">
      <defs>
        <radialGradient id="furrow-glow">
          <stop offset="0" stopColor="#f3f8e4" stopOpacity=".9" />
          <stop offset=".35" stopColor="#c9dfa9" stopOpacity=".45" />
          <stop offset="1" stopColor="#a9c392" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className={styles.outline} d={WORD} />
      <path className={styles.dot} d={DOT} />
      <g ref={measureRef} fill="none" stroke="none">
        {CONTOURS.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g ref={ballsRef} />
    </svg>
  );
}
