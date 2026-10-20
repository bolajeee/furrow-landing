import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    title: 'Tell us your space and your week',
    body: 'Your city, how much space and sun you have, your water, the containers already at home — and how much time you can give it, on which days. About two minutes.',
  },
  {
    num: '02',
    title: 'Get one crop and a safe setup',
    body: 'One beginner-friendly crop and a setup built from what you own first. Every reused item is labelled use, use with care, or avoid — with the reason.',
  },
  {
    num: '03',
    title: 'Follow a plan that fits your time',
    body: 'Tasks land only on the days you said you’re free, with a reminder. Away for a few days? Away mode suggests a checked low-effort watering setup and picks up when you’re back.',
  },
  {
    num: '04',
    title: 'Ask Furrow, share with your circle',
    body: 'A farming-only assistant that shows which guide it used, and an invite-only circle of households near you — not a public feed of strangers.',
  },
];

export default function HowItWorks() {
  return (
    <section className="band" id="how">
      <div className={`wrap ${styles.split}`}>
        <div className={styles.sticky}>
          <div className="kicker">Built for a 9-to-5</div>
          <h2>Your balcony, your week.<br />Your first harvest.</h2>
          <p className="lede">
            Most growing content online is written for someone else&rsquo;s climate and someone
            else&rsquo;s schedule. Furrow starts with your space, your materials, and the time you
            actually have, then keeps every task, answer, and conversation scoped to that.
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
