import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.mark} aria-hidden="true">furrow<span>.</span></div>
        <div className={styles.row}>
          <div>Furrow — rooted in knowledge, growing together.</div>
          <div>© {new Date().getFullYear()} Furrow <span aria-hidden="true">·</span> <a href="#start">Join our first season ↗</a></div>
        </div>
      </div>
    </footer>
  );
}
