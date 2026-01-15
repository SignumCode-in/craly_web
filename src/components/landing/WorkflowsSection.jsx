import { motion } from 'framer-motion';
import Logo from '../Logo';

const WorkflowsSection = () => {
    const workflows = [
        { id: 1, title: 'Development', icon: '💻' },
        { id: 2, title: 'Assistance', icon: '🤝' },
        { id: 3, title: 'Debugging', icon: '🪲' },
        { id: 4, title: 'Monitoring', icon: '📊' },
    ];

    return (
        <section className="py-24 bg-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_2fr_2fr] gap-8 items-center relative z-10">
                {/* Vibe Coding */}
                <div className="hidden md:block">
                    <motion.div
                        className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 leading-none select-none -rotate-90 transform origin-center whitespace-nowrap opacity-50"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        Vibe Coding
                    </motion.div>
                </div>

                {/* Workflows List */}
                <div className="space-y-4">
                    <motion.h2
                        className="text-6xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Workflows
                    </motion.h2>

                    <motion.div
                        className="text-soft-grey text-lg mb-12 flex flex-wrap gap-2 items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Choose goal <span>→</span> Follow steps <span>→</span> Use tools <span>→</span> Finish
                    </motion.div>

                    <div className="space-y-4">
                        {workflows.map((wf, i) => (
                            <motion.div
                                key={wf.id}
                                className="flex items-center gap-6 group"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                            >
                                <div className="text-blue-500 font-bold text-xl">{wf.id}</div>
                                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 border border-white/10 group-hover:bg-white/10 group-hover:border-blue-500/50 transition-all cursor-pointer w-full max-w-sm">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                                        {wf.icon}
                                    </div>
                                    <span className="text-xl font-bold">{wf.title}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Logo Infographic */}
                <div className="relative flex justify-center md:justify-end py-12">
                    <motion.div
                        className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Decorative background circles */}
                        <div className="absolute inset-0 border border-white/5 rounded-full" />
                        <motion.div
                            className="absolute inset-10 border border-white/10 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-20 border border-blue-500/10 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Logo Container */}
                        <motion.div
                            className="relative z-10 p-16 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl shadow-blue-500/10"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Logo className="w-40 h-40 md:w-56 md:h-56" />
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            className="absolute top-1/4 right-0 w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-2xl shadow-xl shadow-blue-500/20"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            🚀
                        </motion.div>
                        <motion.div
                            className="absolute bottom-1/4 left-0 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-2xl shadow-xl shadow-purple-500/20"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            ✨
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WorkflowsSection;
