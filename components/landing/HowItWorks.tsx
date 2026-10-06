import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    title: 'Tell it what you grow',
    body: 'Crop, region, and season — three questions, not a twenty-field form. Everything after this is tailored to that answer.',
  },
  {
    num: '02',
    title: 'Ask, in plain language',
    body: 'The assistant only answers growing questions — soil, pests, irrigation timing, planting windows — and says so when something’s outside that.',
  },
  {
    num: '03',
    title: 'Compare notes with your circle',
    body: 'Share an invite code with growers near you. What works in your grower circle gets surfaced first — not a global feed of strangers.',
  },
];

export default function HowItWorks() {
  return (
    <section className="band" id="how">
      <div className={`wrap ${styles.split}`}>
        <div className={styles.sticky}>
          <div className="kicker">Built for real growing seasons</div>
          <h2>Your patch of earth.<br />A world of possibility.</h2>
          <p className="lede">
            Most farming content online is written for someone else&rsquo;s climate. Furrow starts
            with what you&rsquo;re growing and where, then keeps every lesson, answer, and grower
            conversation scoped to that.
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div className={styles.step} key={step.num} data-reveal style={{ '--reveal-delay': `${i * 120}ms` } as React.CSSProperties}>
              <div className={styles.num}>{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
