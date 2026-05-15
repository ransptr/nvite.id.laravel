import {LanguageProvider} from '@/contexts/LanguageContext';
import {LandingNav} from '@/Components/landing/LandingNav';
import {HeroSection} from '@/Components/landing/HeroSection';
import {HowItWorksSection} from '@/Components/landing/HowItWorksSection';
import {TemplatesSection} from '@/Components/landing/TemplatesSection';
import {PricingSection} from '@/Components/landing/PricingSection';
import {TestimonialsSection} from '@/Components/landing/TestimonialsSection';
import {CtaBand, LandingFooter} from '@/Components/landing/LandingFooter';

export function LandingPage() {
  return (
    <LanguageProvider>
      <div className="landing-page min-h-screen bg-[#fdfaf6] font-copy text-[#1a1410]">
        <LandingNav />
        <HeroSection />
        <HowItWorksSection />
        <TemplatesSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaBand />
        <LandingFooter />
      </div>
    </LanguageProvider>
  );
}
