'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
        <a className={styles.brand} href="#" aria-label="Furrow home">
          <Image src="/brand/furrow-lockup.svg" alt="" width={142} height={32} priority unoptimized />
        </a>
        <div className={styles.links}><a href="#how">How it works</a><a href="#features">Features</a></div>
        <a className={styles.navCta} href="#start">Join the pilot <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
