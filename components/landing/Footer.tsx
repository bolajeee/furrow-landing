import Image from 'next/image';
import styles from './Footer.module.css';
import FooterMark from './FooterMark';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <FooterMark />
        <div className={styles.row}>
          <div className={styles.sign}>
            <Image src="/brand/furrow-mark-dark.svg" alt="" width={28} height={28} unoptimized />
            Furrow — rooted in knowledge, growing together.
          </div>
          <div>© {new Date().getFullYear()} Furrow <span aria-hidden="true">·</span> <a href="#start">Join our first season ↗</a></div>
        </div>
      </div>
    </footer>
  );
}
