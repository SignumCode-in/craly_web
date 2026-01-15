import { motion } from 'framer-motion';
import Hero from '../components/landing/Hero';
import WhyCraly from '../components/landing/WhyCraly';
import SimpleAI from '../components/landing/SimpleAI';
import WorkflowsSection from '../components/landing/WorkflowsSection';
import DownloadSection from '../components/landing/DownloadSection';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="bg-dark min-h-screen">
      <Hero />
      <WhyCraly />
      <SimpleAI />
      <WorkflowsSection />
      <DownloadSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;


