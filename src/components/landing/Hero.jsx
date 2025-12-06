import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo - C shape with 5 concentric arcs */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                {/* 5 concentric C-shaped arcs, open on the right */}
                <path
                  d="M 30 20 A 30 30 0 0 1 30 100"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 35 25 A 25 25 0 0 1 35 95"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 40 30 A 20 20 0 0 1 40 90"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d="M 45 35 A 15 15 0 0 1 45 85"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M 50 40 A 10 10 0 0 1 50 80"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover AI. Build Anything.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-soft-grey mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            All the AI tools you need — organized, categorized, and ready to use.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-2 group">
              Download on Play Store
              <span className="text-sm opacity-70">(Coming Soon)</span>
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-accent text-accent hover:bg-accent/10 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-2 group">
              Join Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

