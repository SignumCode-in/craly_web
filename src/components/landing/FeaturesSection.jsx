import { motion } from 'framer-motion';
import { FolderTree, TrendingUp, Rocket, Workflow, Zap, Layout } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: FolderTree,
      title: 'AI Tools Directory',
      description: 'Comprehensive catalog of AI tools organized by category'
    },
    {
      icon: TrendingUp,
      title: 'Trending AI Tools',
      description: 'Discover what\'s hot and gaining traction in the AI space'
    },
    {
      icon: Rocket,
      title: 'New AI Launches',
      description: 'Stay updated with the latest AI tool releases'
    },
    {
      icon: Workflow,
      title: 'AI Packs (Workflows)',
      description: 'Pre-built workflows to accomplish complex tasks'
    },
    {
      icon: Zap,
      title: '1-Tap Try Now',
      description: 'Test tools instantly without leaving the platform'
    },
    {
      icon: Layout,
      title: 'Minimal Clean UI',
      description: 'Beautiful, distraction-free interface focused on productivity'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-soft-grey">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

