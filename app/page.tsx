import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Globe from '@/components/landing/Globe';
import Features from '@/components/landing/Features';
import Cta from '@/components/landing/Cta';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Nav />
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
