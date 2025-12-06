import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';

const DownloadSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark to-dark/95">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Craly on Your Phone</h2>
          <p className="text-xl text-soft-grey mb-12 max-w-2xl mx-auto">
            Take your AI toolkit wherever you go. Download now and start building.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-2 group">
              <span>Play Store</span>
              <span className="text-sm opacity-70">(Coming Soon)</span>
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-accent text-accent hover:bg-accent/10 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-2 group">
              Join Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadSection;

