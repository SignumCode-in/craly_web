import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Smartphone, PenTool, Briefcase } from 'lucide-react';

const AIPacksSection = () => {
  const packs = [
    { icon: Rocket, title: 'Start a Startup', description: 'From idea to launch' },
    { icon: Smartphone, title: 'Build a Mobile App', description: 'Design and develop your app' },
    { icon: PenTool, title: 'Create Content', description: 'Write, design, and publish' },
    { icon: Briefcase, title: 'Launch a Product', description: 'Complete product development' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark/95 to-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Build anything with guided AI Packs.
          </h2>
          <p className="text-xl text-soft-grey max-w-2xl mx-auto mb-4">
            Choose goal → Follow steps → Use tools → Finish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packs.map((pack, index) => {
            const Icon = pack.icon;
            return (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{pack.title}</h3>
                <p className="text-soft-grey mb-4">{pack.description}</p>
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AIPacksSection;

