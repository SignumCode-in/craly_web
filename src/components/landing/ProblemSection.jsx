import { motion } from 'framer-motion';
import { Search, GitCompare, FolderOpen, HelpCircle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: Search,
      title: 'Too many tools',
      description: 'Thousands of AI tools scattered across the internet'
    },
    {
      icon: GitCompare,
      title: 'Hard to compare',
      description: 'No easy way to see which tool fits your needs'
    },
    {
      icon: FolderOpen,
      title: 'No single directory',
      description: 'Information is fragmented and hard to find'
    },
    {
      icon: HelpCircle,
      title: 'No step-by-step guidance',
      description: 'Unclear how to use tools together effectively'
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Craly?</h2>
          <p className="text-xl text-soft-grey max-w-2xl mx-auto">
            AI is exploding with thousands of tools — but finding the right one is still confusing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-soft-grey">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

