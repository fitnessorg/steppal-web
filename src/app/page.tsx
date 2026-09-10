import { Hero } from '@/components/sections/Hero';
import { Hook } from '@/components/sections/Hook';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Modes } from '@/components/sections/Modes';
import { Showcase } from '@/components/sections/Showcase';
import { Trust } from '@/components/sections/Trust';
import { OpenSource } from '@/components/sections/OpenSource';
import { Waitlist } from '@/components/sections/Waitlist';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Hook />
      <HowItWorks />
      <Modes />
      <Showcase />
      <Trust />
      <OpenSource />
      <Waitlist />
      <Footer />
    </main>
  );
}
