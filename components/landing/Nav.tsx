import styles from './Nav.module.css';

export default function Nav() {
  return (
    <header className={styles.header}>
      <a className="skipLink" href="#main">Skip to content</a>
      <nav className={`wrap ${styles.nav}`} aria-label="Main navigation">
        <a className={styles.brand} href="#" aria-label="Furrow home"><span aria-hidden="true">✳</span> furrow<span className={styles.period}>.</span></a>
        <div className={styles.links}><a href="#how">How it works</a><a href="#features">Made for growers</a></div>
        <a className={styles.navCta} href="#start">Join the pilot <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}

