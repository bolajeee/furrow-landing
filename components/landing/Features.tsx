import styles from './Features.module.css';

export default function Features() {
  return (
    <section className="band bandLight" id="features">
      <div className="wrap">
        <div className="kicker">A look at what we’re building</div>
        <div className="sectionHead">
          <h2>A little guidance.</h2>
          <p className="lede">
            Each part is scoped on purpose: the plan fits your week, the assistant declines anything
            outside growing, and circles are invite-only, not public. Previews below are examples.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <article className={styles.featureCard} data-reveal tabIndex={0} aria-label="Made for busy weeks. Hover or focus to see an app preview.">
            <div className={styles.featureCardInner}>
              <div className={`${styles.featureFace} ${styles.featureFront}`}>
                <span className={styles.featureNumber}>01 / Planning</span>
                <div className={styles.featureTitle}>
                  <h3>Made for busy weeks</h3>
                  <p className={styles.sub}>A plan on your free days, and away mode for the rest</p>
                </div>
                <span className={styles.flipCue}>See it in Furrow <span aria-hidden="true">↗</span></span>
              </div>
              <div className={`${styles.featureFace} ${styles.featureBack}`}>
                <div className={styles.awayPreview}>
                  <div className={styles.chatHead}>
                    <span className={styles.chatDot} /> Away Thu–Sun · 4 days
                  </div>
                  <div className={styles.awayBody}>
                    <div className={styles.awayLabel}>Before you go, Wednesday evening</div>
                    <ul className={styles.checklist}>
                      <li><span aria-hidden="true">✓</span>Set up a bottle-cap drip in each pot <em>10 min</em></li>
                      <li><span aria-hidden="true">✓</span>Water deeply, then mulch the soil <em>5 min</em></li>
                      <li><span aria-hidden="true">○</span>Move pots out of full afternoon sun <em>2 min</em></li>
                    </ul>
                    <div className={styles.awayLabel}>While you’re away</div>
                    <p className={styles.awayNote}>Tasks paused. No reminders until Monday, then a short catch-up list.</p>
                    <div className={styles.chips}>
                      <span className={styles.chip}>Bottle-cap drip · about 3–5 days</span>
                      <span className={styles.chip}>Wick planter</span>
                      <span className={styles.chip}>Clay pot (olla)</span>
                    </div>
                  </div>
                  <div className={styles.chatScopeNote}>Only techniques our reviewer has sourced or tested are shown. Days covered are estimates.</div>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.featureCard} data-reveal tabIndex={0} aria-label="Ask Furrow. Hover or focus to see an app preview." style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <div className={styles.featureCardInner}>
              <div className={`${styles.featureFace} ${styles.featureFront}`}>
                <span className={styles.featureNumber}>02 / Assistant</span>
                <div className={styles.featureTitle}>
                  <h3>Ask Furrow</h3>
                  <p className={styles.sub}>A home-growing assistant — nothing else</p>
                </div>
                <span className={styles.flipCue}>See it in Furrow <span aria-hidden="true">↗</span></span>
              </div>
              <div className={`${styles.featureFace} ${styles.featureBack}`}>
                <div className={styles.chatPreview}>
                  <div className={styles.chatHead}>
                    <span className={styles.chatDot} /> Ask Furrow
                  </div>
                  <div className={styles.chatBody}>
                    <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                      I’m travelling for 4 days. Will my pepper pots be OK?
                    </div>
                    <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                      Likely, with some prep. Water deeply the evening before, mulch the soil, and set
                      a bottle-cap drip in each pot. Move them out of full afternoon sun so the water
                      lasts longer.
                      <span className={styles.source}>From: Pepper guide · Watering</span>
                    </div>
                    <div className={`${styles.bubble} ${styles.bubbleUser}`}>What’s the capital of France?</div>
                    <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                      That’s outside what I can help with — I only answer growing questions.
                    </div>
                  </div>
                  <div className={styles.chatScopeNote}>Answers come from reviewed guides and name the section used</div>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.featureCard} data-reveal tabIndex={0} aria-label="Grower circles. Hover or focus to see an app preview." style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
            <div className={styles.featureCardInner}>
              <div className={`${styles.featureFace} ${styles.featureFront}`}>
                <span className={styles.featureNumber}>03 / Community</span>
                <div className={styles.featureTitle}>
                  <h3>Grower circles</h3>
                  <p className={styles.sub}>Invite-only, up to 25 households near you</p>
                </div>
                <span className={styles.flipCue}>See it in Furrow <span aria-hidden="true">↗</span></span>
              </div>
              <div className={`${styles.featureFace} ${styles.featureBack}`}>
                <div className={styles.roomPreview}>
                  <div className={styles.roomHead}>
                    <div className={styles.roomName}>Yaba Balcony Growers · 18 of 25</div>
                    <div className={styles.roomCode}>Code: K7Q2M4XA</div>
                  </div>
                  <div className={styles.roomMsgs}>
                    <div className={`${styles.roomMsg} ${styles.prompt}`}>
                      <span className={styles.who}>This week’s prompt</span>
                      <span className={styles.bodyText}>Post a photo of your setup. What did you reuse?</span>
                    </div>
                    <div className={styles.roomMsg}>
                      <span className={styles.who}>Tolu</span>
                      <span className={styles.bodyText}>
                        Two old rice sacks on the balcony rail. Checked them in the materials list first.
                      </span>
                    </div>
                    <div className={styles.roomMsg}>
                      <span className={styles.who}>Chinedu</span>
                      <span className={styles.bodyText}>
                        The bottle drip got my pots through a weekend in Ibadan. Refilled it Monday night.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
