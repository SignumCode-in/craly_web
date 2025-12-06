import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const MobilePreview = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Phone mockup */}
            <div className="w-64 h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] p-4 border-4 border-white/10 shadow-2xl">
              <div className="w-full h-full bg-dark rounded-[2.5rem] overflow-hidden relative">
                {/* Status bar */}
                <div className="h-8 bg-white/5 flex items-center justify-between px-6 text-xs">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
                
                {/* App content placeholder */}
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-primary/20 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-accent/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MobilePreview;

