import { motion } from 'framer-motion';

const WhyCraly = () => {
    const stats = [
        { label: '5000+', sublabel: 'Top AI Tools' },
        { label: '100+', sublabel: 'Workflows' },
        { label: '10k+', sublabel: 'Users' }
    ];

    const floatingIcons = [
        { src: 'https://manifest.im/icon/antigravity.google', top: '10%', left: '10%', size: 'w-16 h-16', rotate: 10 },
        { src: 'https://manifest.im/icon/claude.com', top: '20%', right: '15%', size: 'w-12 h-12', rotate: -15 },
        { src: 'https://manifest.im/icon/chatgpt.com', bottom: '25%', left: '8%', size: 'w-16 h-16', rotate: -10 },
        { src: 'https://manifest.im/icon/midjourney.com', bottom: '30%', right: '5%', size: 'w-14 h-14', rotate: 15 },
        { src: 'https://manifest.im/icon/perplexity.ai', top: '40%', left: '3%', size: 'w-14 h-14', rotate: 5 },
        { src: 'https://manifest.im/icon/emergent.sh', top: '15%', right: '5%', size: 'w-16 h-16', rotate: 10 },
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-dark">
            {/* Curved lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1440 800" fill="none">
                <path d="M-100,400 C300,200 600,600 1500,300" stroke="white" strokeWidth="0.5" strokeDasharray="10 10" />
                <path d="M-100,500 C400,300 800,700 1500,400" stroke="white" strokeWidth="0.5" />
            </svg>

            {/* Floating icons */}
            {floatingIcons.map((icon, index) => (
                <motion.div
                    key={index}
                    className={`absolute ${icon.size} bg-white rounded-2xl p-2 hidden md:block shadow-xl`}
                    style={{ top: icon.top, left: icon.left, right: icon.right, bottom: icon.bottom }}
                    initial={{ rotate: icon.rotate }}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [icon.rotate, icon.rotate + 5, icon.rotate - 5, icon.rotate]
                    }}
                    transition={{
                        duration: 5 + index,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <img src={icon.src} alt="AI Logo" className="w-full h-full object-contain p-2" />
                </motion.div>
            ))}

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <motion.h2
                    className="text-6xl font-bold mb-8 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Why Craly?
                </motion.h2>

                <motion.p
                    className="text-soft-grey text-xl mb-20 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Craly is designed for students learning smarter, creators building content faster,
                    and entrepreneurs launching projects and startups with confidence.
                </motion.p>

                {/* Stats Card */}
                <motion.div
                    className="glass-dark rounded-3xl p-8 md:p-12 flex flex-wrap justify-center gap-8 md:gap-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-4xl md:text-5xl font-bold mb-2 transition-transform group-hover:scale-110">
                                {stat.label}
                            </div>
                            <div className="text-blue-500 font-medium tracking-wide text-sm uppercase">
                                {stat.sublabel}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyCraly;
