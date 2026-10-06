import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Globe from '@/components/landing/Globe';
import Features from '@/components/landing/Features';
import Cta from '@/components/landing/Cta';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/landing/Reveal';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Reveal />
      <main id="main">
      <Hero />
      <HowItWorks />
      <Globe />
      <Features />
      <Cta />
      </main>
      <Footer />
    </>
  );
}
