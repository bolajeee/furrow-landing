import styles from './Features.module.css';

export default function Features() {
  return (
    <section className="band bandLight" id="features">
      <div className="wrap">
        <div className="kicker">A look at what we’re building</div>
        <div className="sectionHead">
          <h2>A little guidance.<br />A community in your corner.</h2>
          <p className="lede">
            Both are scoped deliberately — the assistant declines anything outside agriculture, and
            rooms are invite-only, not public.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featurePanel} data-reveal>
            <h3>Ask Furrow</h3>
            <div className={styles.sub}>A growing-practices assistant — nothing else</div>
            <div className={styles.chatPreview}>
              <div className={styles.chatHead}>
                <span className={styles.chatDot} /> Ask Furrow
              </div>
              <div className={styles.chatBody}>
                <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                  My tomato leaves are curling and yellow at the edges — early blight?
                </div>
                <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                  Could be early blight, but yellowing that starts at leaf edges also points to
                  inconsistent watering. Check the lower leaves first — mottled dark spots mean
                  blight; if it&rsquo;s just edge-yellowing, ease off watering frequency.
                </div>
                <div className={`${styles.bubble} ${styles.bubbleUser}`}>What&rsquo;s the capital of France?</div>
                <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                  That&rsquo;s outside what I can help with — I only answer growing and farming
                  questions. Ask me about crops, soil, pests, or planting timing.
                </div>
              </div>
              <div className={styles.chatScopeNote}>Scoped to agricultural best practices only</div>
            </div>
          </div>

          <div className={styles.featurePanel} data-reveal style={{ '--reveal-delay': '140ms' } as React.CSSProperties}>
            <h3>Grower circles</h3>
            <div className={styles.sub}>Invite-only rooms for people growing near you</div>
            <div className={styles.roomPreview}>
              <div className={styles.roomHead}>
                <div className={styles.roomName}>Kaduna North Circle</div>
                <div className={styles.roomCode}>Code: FRW-7K2Q</div>
              </div>
              <div className={styles.roomMsgs}>
                <div className={styles.roomMsg}>
                  <span className={styles.who}>Amina</span>
                  <span className={styles.bodyText}>
                    Started staggering my maize planting by 10 days across three plots — fewer
                    losses to the last dry spell.
                  </span>
                </div>
                <div className={styles.roomMsg}>
                  <span className={styles.who}>Yusuf</span>
                  <span className={styles.bodyText}>
                    Good call. I&rsquo;m trying that next season too. What spacing did you use?
                  </span>
                </div>
                <div className={styles.roomMsg}>
                  <span className={styles.who}>Amina</span>
                  <span className={styles.bodyText}>Kept it standard, 75cm — just split the sowing dates, not the layout.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
