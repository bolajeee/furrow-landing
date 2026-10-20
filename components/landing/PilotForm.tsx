'use client';

import { useRef, useState, type FormEvent } from 'react';
import styles from './Cta.module.css';

export default function PilotForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const busy = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setStatus('sending');
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'), email: form.get('email'), location: form.get('location'),
          role: form.get('role'), time: form.get('time'), crops: form.get('crops'), consent: form.get('consent') === 'on',
          website: form.get('website'),
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We couldn’t send your request. Please try again.');
      setStatus('success');
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== 'TimeoutError' && failure.name !== 'TypeError'
        ? failure.message : 'We couldn’t reach the signup service. Please check your connection and try again.');
      setStatus('error');
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className={styles.formCard}>
      {status === 'success' ? (
        <div className={styles.success} role="status" aria-live="polite">
          <span className={styles.successIcon} aria-hidden="true">✓</span>
          <div className="kicker">A good place to start</div>
          <h3>You’re on the list.</h3>
          <p>Thanks for helping shape Furrow. We’ll email you when there’s a pilot update for your region.</p>
          <a href="#how" className={styles.backLink}>Get to know Furrow <span aria-hidden="true">↗</span></a>
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby="form-title" aria-busy={status === 'sending'}>
          <div className={styles.formTop}><h3 id="form-title">Let’s get growing.</h3><span>JOIN THE WAITLIST</span></div>
          <p className={styles.formIntro}>A few details to help us build around you.</p>
          <fieldset className={styles.fields} disabled={status === 'sending'}>
            <div className={styles.row}>
              <label htmlFor="pilot-name">Your name<input id="pilot-name" name="name" autoComplete="name" placeholder="e.g. Amina Yusuf" required maxLength={100} /></label>
              <label htmlFor="pilot-email">Email address<input id="pilot-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
            </div>
            <label htmlFor="pilot-location">Where would you grow?<input id="pilot-location" name="location" autoComplete="address-level2" placeholder="Area and city, e.g. Yaba, Lagos" required maxLength={160} /></label>
            <div className={styles.row}>
              <label htmlFor="pilot-role">Which best describes you?
                <select id="pilot-role" name="role" defaultValue="" required><option value="" disabled>Select one</option><option value="new">I’ve never grown food at home</option><option value="tried">I’ve tried, but no harvest yet</option><option value="growing">I already grow a few things</option><option value="host">I’d like to host a circle</option><option value="other">Something else</option></select>
              </label>
              <label htmlFor="pilot-time">Time you could give it each week
                <select id="pilot-time" name="time" defaultValue="" required><option value="" disabled>Select one</option><option value="under-30m">Under 30 minutes</option><option value="30-60m">30 to 60 minutes</option><option value="1-2h">1 to 2 hours</option><option value="over-2h">More than 2 hours</option></select>
              </label>
            </div>
            <label htmlFor="pilot-crops">What would you like to grow? <span className={styles.optional}>(optional)</span><input id="pilot-crops" name="crops" placeholder="e.g. pepper, tomatoes, leafy greens" maxLength={240} /></label>
            <div className={styles.honeypot} aria-hidden="true"><label htmlFor="pilot-website">Leave this empty<input id="pilot-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className={styles.consent} htmlFor="pilot-consent"><input id="pilot-consent" name="consent" type="checkbox" required /><span>I agree to be contacted by email about the Furrow pilot. My details will be used to coordinate pilot access and updates.</span></label>
            <button className={`btnPrimary ${styles.submit}`} type="submit">{status === 'sending' ? 'Sending your request…' : 'Join the pilot'}<span aria-hidden="true">↗</span></button>
          </fieldset>
          {status === 'error' && <p role="alert" className={styles.error}>{error}</p>}
          <p className={styles.formFootnote}>Pilot updates only. You can ask to leave the list at any time.</p>
        </form>
      )}
    </div>
  );
}
