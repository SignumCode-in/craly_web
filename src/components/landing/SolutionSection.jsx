import { motion } from 'framer-motion';
import { Zap, Sparkles, Target } from 'lucide-react';

const SolutionSection = () => {
  const badges = [
    { icon: Zap, text: 'Fast' },
    { icon: Sparkles, text: 'Simple' },
    { icon: Target, text: 'Action-oriented' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark to-dark/95">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Craly makes AI simple.</h2>
          <p className="text-xl text-soft-grey max-w-3xl mx-auto mb-12">
            Craly organizes the entire AI ecosystem into one clean, minimal interface.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{badge.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;

