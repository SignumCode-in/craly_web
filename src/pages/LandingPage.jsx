import { motion } from 'framer-motion';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AIPacksSection from '../components/landing/AIPacksSection';
import MobilePreview from '../components/landing/MobilePreview';
import DownloadSection from '../components/landing/DownloadSection';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="bg-dark min-h-screen">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <AIPacksSection />
      <MobilePreview />
      <DownloadSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

