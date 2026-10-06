'use client';

import { useEffect, useState } from 'react';
import styles from './Nav.module.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <a className="skipLink" href="#main">Skip to content</a>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="#" aria-label="Furrow home"><span aria-hidden="true">✳</span> furrow<span className={styles.period}>.</span></a>
        <div className={styles.links}><a href="#how">How it works</a><a href="#features">Made for growers</a></div>
        <a className={styles.navCta} href="#start">Join the pilot <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
