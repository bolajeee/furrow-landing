import PilotForm from './PilotForm';
import styles from './Cta.module.css';

export default function Cta() {
  return (
    <section className={`band grain ${styles.ctaBand}`} id="start" aria-labelledby="pilot-heading">
      <div className={`wrap ${styles.ctaGrid}`}>
        <div className={styles.copy} data-reveal>
          <div className="kicker">Be part of the first season</div>
          <h2 id="pilot-heading">Let’s grow<br />something <em>good.</em></h2>
          <p className="lede">We’re building Furrow with the people who’ll use it. Join the pilot waitlist and help shape a more useful growing companion.</p>
          <ul className={styles.benefits}>
            <li><span aria-hidden="true">01</span><div><strong>Get an early look</strong><p>Be among the first to try Furrow in your region.</p></div></li>
            <li><span aria-hidden="true">02</span><div><strong>Make it your own</strong><p>Your experience helps guide what we build next.</p></div></li>
            <li><span aria-hidden="true">03</span><div><strong>Start with community</strong><p>Help shape a space for people who love to grow.</p></div></li>
          </ul>
          <p className={styles.smallNote}>The first pilot is small: a few circles of households in Nigeria, growing for six weeks. We’ll share availability by email as it takes shape.</p>
        </div>
        <PilotForm />
      </div>
    </section>
  );
}

